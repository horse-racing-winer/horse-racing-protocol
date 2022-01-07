import type { BigNumber } from '@ethersproject/bignumber';

import { Signer } from '@ethersproject/abstract-signer';
import { Contract, ContractFunction, ContractInterface } from '@ethersproject/contracts';

export abstract class BaseContract {
  public contract: Contract;
  public abi: ContractInterface;
  public signer: Signer;

  public address: string;

  constructor(address: string, signer: Signer, abi: ContractInterface) {
    this.address = address;
    this.abi = abi;
    this.signer = signer;
    this.contract = new Contract(address, abi, signer);
  }

  connect(signer: Signer): void {
    this.signer = signer;
    this.contract = new Contract(this.address, this.abi, signer);
  }

  get estimateGas(): { [name: string]: ContractFunction<BigNumber> } {
    return this.contract.estimateGas;
  }
}
