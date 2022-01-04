import type { BigNumber } from '@ethersproject/bignumber';

import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { Contract, ContractFunction, ContractInterface } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';

export abstract class BaseContract {
  public contract: Contract;
  public abi: ContractInterface;
  public provider: Signer | Provider;

  public address: string;

  constructor(address: string, provider: Signer | Provider, abi: ContractInterface) {
    this.address = address;
    this.abi = abi;
    this.provider = provider;
    this.contract = new Contract(address, abi, provider);
  }

  connect(signerOrProvider: Signer | Provider): void {
    this.provider = signerOrProvider;
    this.contract = new Contract(this.address, this.abi, signerOrProvider);
  }

  get estimateGas(): { [name: string]: ContractFunction<BigNumber> } {
    return this.contract.estimateGas;
  }

  async sign(message: string): Promise<string> {
    if (this.provider instanceof Signer) {
      return this.provider.signMessage(message);
    } else if (this.provider instanceof Web3Provider) {
      return this.provider.getSigner().signMessage(message);
    }

    throw new Error(`Not support ${this.provider} to sign`);
  }
}
