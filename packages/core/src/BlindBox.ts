import type { Interface } from '@ethersproject/abi';
import type { Provider } from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';
import type { TransactionResponse } from '@ethersproject/providers';

import { BigNumber } from '@ethersproject/bignumber';

import * as abis from './abis';
import { ERC721 } from './ERC721';
import { callMethod } from './utils';

class BlindBox extends ERC721 {
  constructor(address: string, provider: Signer | Provider, abi = abis.BlindBox as Interface) {
    super(address, provider, 'HRBB', abi);
  }

  buy(amount: BigNumber | number | string): Promise<TransactionResponse> {
    return callMethod(this.contract, 'buy', BigNumber.from(amount));
  }
}

export { BlindBox };
