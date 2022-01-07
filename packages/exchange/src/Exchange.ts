import type { Signer } from '@ethersproject/abstract-signer';
import type { TransactionResponse } from '@ethersproject/providers';

import { Interface } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { Signature, splitSignature } from '@ethersproject/bytes';
import { callMethod } from 'packages/core/src/utils';

import { BaseContract, ERC721, ERC1155 } from '@horse-racing/core';

import * as abis from './abis';
import Order from './Order';
import { Asset, AssetType } from './types';

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

class Exchange extends BaseContract {
  #isReadyPromise: Promise<Exchange>;
  #transferProxy: string;

  constructor(address: string, transferProxy: string, signer: Signer) {
    super(address, signer, abis.ExchangeV1 as Interface);

    this.#isReadyPromise = Promise.resolve(this);
    this.#transferProxy = transferProxy;
  }

  get isReady(): Promise<Exchange> {
    return this.#isReadyPromise;
  }

  async exchange(
    order: Order,
    signature: Signature | string,
    buyFee: BigNumber,
    buyFeeSignature: Signature | string,
    amount: BigNumber,
    account: string
  ): Promise<TransactionResponse> {
    const options: Record<string, any> = {};

    if (order.key.buyAsset.assetType === AssetType.ETH) {
      const paying: BigNumber = order.buying
        .mul(amount)
        .div(order.selling)
        .mul(BigNumber.from(10000).add(buyFee))
        .div(BigNumber.from(10000));

      options.value = paying;
    }

    return callMethod(
      this.contract,
      'exchange',
      order.toJson(),
      typeof signature === 'string' ? splitSignature(signature) : signature,
      buyFee,
      typeof buyFeeSignature === 'string' ? splitSignature(buyFeeSignature) : buyFeeSignature,
      amount,
      account,
      options
    );
  }

  async sellWithEth(
    sellAsset: Asset,
    sellAmount: number | string | BigNumber,
    pricePer: number | string | BigNumber
  ): Promise<{ order: Order; signature: string }> {
    const owner = await this.signer.getAddress();

    if (sellAsset.assetType === AssetType.ERC721) {
      const erc721 = new ERC721(sellAsset.token, this.signer, '');

      if (!(await erc721.isApprovedForAll(owner, this.#transferProxy))) {
        await erc721.setApprovalForAll(this.#transferProxy, true);
      }
    } else if (sellAsset.assetType === AssetType.ERC1155) {
      const erc1155 = new ERC1155(sellAsset.token, this.signer);

      if (!(await erc1155.isApprovedForAll(owner, this.#transferProxy))) {
        await erc1155.setApprovalForAll(this.#transferProxy, true);
      }
    } else {
      throw new Error(`Not support assetType ${sellAsset.assetType}`);
    }

    const buyAsset: Asset = {
      token: EMPTY_ADDRESS,
      tokenId: BigNumber.from('0'),
      assetType: AssetType.ETH
    };

    const order = new Order(
      owner,
      sellAsset,
      buyAsset,
      BigNumber.from(sellAmount),
      BigNumber.from(sellAmount).mul(pricePer)
    );

    const signature = await order.sign(this.signer);

    return { order, signature };
  }
}

export { Exchange };
