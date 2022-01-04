import type { Interface } from '@ethersproject/abi';
import type { Provider } from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';
import type { TransactionResponse } from '@ethersproject/providers';

import { BigNumber } from '@ethersproject/bignumber';

import * as abis from './abis';
import { BaseContract } from './base';
import { callMethod } from './utils';

class ERC721 extends BaseContract {
  #isReadyPromise: Promise<ERC721>;

  public symbol: string;
  public name?: string;
  public baseURI = '';

  constructor(
    address: string,
    provider: Signer | Provider,
    symbol: string,
    abi = abis.ERC721 as Interface
  ) {
    super(address, provider, abi);
    this.symbol = symbol;

    this.#isReadyPromise = this.contract
      .baseURI()
      .then((baseURI: string) => {
        this.baseURI = baseURI;

        return this;
      })
      .catch((error: Error) => {
        console.error(error);

        return this;
      });
  }

  get isReady(): Promise<ERC721> {
    return this.#isReadyPromise;
  }

  tokenURI(tokenId: BigNumber): Promise<string> {
    return this.contract.tokenURI(tokenId);
  }

  balanceOf(owner: string): Promise<BigNumber> {
    return this.contract.balanceOf(owner);
  }

  ownerOf(tokenId: BigNumber): Promise<string> {
    return this.contract.ownerOf(tokenId);
  }

  getApproved(tokenId: BigNumber): Promise<boolean> {
    return this.contract.getApproved(tokenId);
  }

  approve(to: string, tokenId: BigNumber): Promise<TransactionResponse> {
    return callMethod(this.contract, 'approve', to, tokenId);
  }

  isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    return this.contract.isApprovedForAll(owner, operator);
  }

  setApprovalForAll(operator: string, approved: boolean): Promise<TransactionResponse> {
    return callMethod(this.contract, 'setApprovalForAll', operator, approved);
  }

  transferFrom(from: string, to: string, tokenId: BigNumber): Promise<TransactionResponse> {
    return callMethod(this.contract, 'transferFrom', from, to, tokenId);
  }

  safeTransferFrom(from: string, to: string, tokenId: BigNumber): Promise<TransactionResponse> {
    return callMethod(this.contract, 'safeTransferFrom', from, to, tokenId);
  }
}

export { ERC721 };
