import type { Interface } from '@ethersproject/abi';
import type { Provider } from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';

import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';

import * as abis from './abis';
import { BaseContract } from './base';
import { callMethod } from './utils';

class ERC20 extends BaseContract {
  #isReadyPromise: Promise<ERC20>;

  public symbol: string;
  public decimals = 18;

  constructor(
    address: string,
    provider: Signer | Provider,
    symbol = '',
    abi = abis.ERC20 as Interface
  ) {
    super(address, provider, abi);
    this.symbol = symbol;

    this.#isReadyPromise = Promise.all([
      this.contract.symbol() as Promise<string>,
      this.contract.decimals() as Promise<number>
    ])
      .then(([symbol, decimals]: [string, number]) => {
        this.symbol = symbol;
        this.decimals = decimals;

        return this;
      })
      .catch((error) => {
        console.error(error);

        return this;
      });
  }

  get isReady(): Promise<ERC20> {
    return this.#isReadyPromise;
  }

  totalSupply(): Promise<BigNumber> {
    return this.contract.totalSupply() as Promise<BigNumber>;
  }

  balanceOf(account: string): Promise<BigNumber> {
    return this.contract.balanceOf(account) as Promise<BigNumber>;
  }

  transfer(recipient: string, amount: BigNumber): Promise<TransactionResponse> {
    return callMethod(this.contract, 'transfer', recipient, amount);
  }

  allowance(owner: string, spender: string): Promise<BigNumber> {
    return this.contract.allowance(owner, spender) as Promise<BigNumber>;
  }

  approve(spender: string, amount: BigNumber): Promise<TransactionResponse> {
    return callMethod(this.contract, 'approve', spender, amount);
  }

  transferFrom(sender: string, recipient: string, amount: BigNumber): Promise<TransactionResponse> {
    return callMethod(this.contract, 'transferFro', sender, recipient, amount);
  }

  async displayedBalanceOf(account: string): Promise<string> {
    const balance = await this.balanceOf(account);

    return formatUnits(balance, this.decimals);
  }

  async displayedTotalSupply(): Promise<string> {
    const supply = await this.totalSupply();

    return Number(formatUnits(supply, this.decimals)).toFixed(0);
  }
}

export { ERC20 };
