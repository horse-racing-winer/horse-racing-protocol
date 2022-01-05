import type { Provider } from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';
import type { TransactionResponse } from '@ethersproject/providers';

import { Interface } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { Signature, splitSignature } from '@ethersproject/bytes';
import { callMethod } from 'packages/core/src/utils';

import { BaseContract } from '@horse-racing/core';

import * as abis from './abis';
import Order from './Order';
import { AssetType } from './types';

class ExchangeV1 extends BaseContract {
  #isReadyPromise: Promise<ExchangeV1>;

  constructor(address: string, provider: Signer | Provider) {
    super(address, provider, abis.ExchangeV1 as Interface);

    this.#isReadyPromise = Promise.resolve(this);
  }

  get isReady(): Promise<ExchangeV1> {
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
    const paying: BigNumber = order.buying
      .mul(amount)
      .div(order.selling)
      .mul(BigNumber.from(10000).add(buyFee))
      .div(BigNumber.from(10000));

    const options: Record<string, any> = {};

    if (order.key.buyAsset.assetType === AssetType.ETH) {
      options.value = paying;
    }

    return callMethod(
      this.contract,
      'exchange',
      order,
      typeof signature === 'string' ? splitSignature(signature) : signature,
      buyFee,
      typeof buyFeeSignature === 'string' ? splitSignature(buyFeeSignature) : buyFeeSignature,
      amount,
      account,
      options
    );
  }
}

export { ExchangeV1 };
