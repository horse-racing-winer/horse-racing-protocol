import { Contract } from '@ethersproject/contracts';
import { TransactionResponse } from '@ethersproject/providers';

import { CallError, ContractError, OutOfGasError, UserRejectError } from './errors';

export function randomHex(length: number): string {
  const result: string[] = [];
  const characters = 'ABCDEFabcdef0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }

  return '0x' + result.join('');
}

export async function callMethod<T>(
  contract: Contract,
  methodName: string,
  ...args: any[]
): Promise<T> {
  const gasEstimate = await contract.estimateGas[methodName](...args)
    .then((gasEstimate) => {
      return gasEstimate;
    })
    .catch((gasError) => {
      console.debug('Gas estimate failed, trying eth_call to extract error');

      return contract.callStatic[methodName](...args)
        .then((result) => {
          console.debug('Unexpected successful call after failed estimate gas', gasError, result);

          return new OutOfGasError(methodName);
        })
        .catch((callError: { data: { message: string } }) => {
          console.debug('Call threw error', callError);
          console.log(callError?.data?.message);

          return new CallError(methodName, 'Call threw error', callError?.data?.message);
        });
    });

  if (gasEstimate instanceof Error) {
    throw gasEstimate;
  }

  return contract[methodName](...args)
    .then((response: TransactionResponse) => {
      return response;
    })
    .catch((error: any) => {
      // if the user rejected the tx, pass this along
      if (error?.code === 4001) {
        throw new UserRejectError();
      } else {
        // otherwise, the error was unexpected and we need to convey that
        console.error(`${methodName} failed: ${error.message}`, error, methodName, args);
        throw new ContractError(methodName, `${methodName} failed: ${error.message}`);
      }
    });
}
