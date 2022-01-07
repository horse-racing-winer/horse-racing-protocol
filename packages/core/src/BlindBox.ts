import type { Interface } from '@ethersproject/abi';
import type { Signer } from '@ethersproject/abstract-signer';
import type { TransactionResponse } from '@ethersproject/providers';

import { BigNumber } from '@ethersproject/bignumber';

import * as abis from './abis';
import { ERC721 } from './ERC721';
import { assert, callMethod } from './utils';

class BlindBox extends ERC721 {
  constructor(address: string, signer: Signer, abi = abis.BlindBox as Interface) {
    super(address, signer, 'HRBB', abi);
  }

  price(): Promise<BigNumber> {
    return this.contract.price();
  }

  solds(): Promise<BigNumber> {
    return this.contract.solds();
  }

  currentTokenId(): Promise<BigNumber> {
    return this.contract.currentTokenId();
  }

  useBuys(account: string): Promise<BigNumber> {
    return this.contract.userBuys(account);
  }

  async buy(amount: BigNumber | number | string): Promise<TransactionResponse> {
    const [price, solds, currentTokenId] = await Promise.all([
      this.price(),
      this.solds(),
      this.currentTokenId()
    ]);

    assert(currentTokenId.add(amount).sub(1).lte(solds), 'Sold Out');

    return callMethod(this.contract, 'buy', BigNumber.from(amount), { value: price.mul(amount) });
  }
}

export { BlindBox };
