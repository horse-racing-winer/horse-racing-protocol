import { Wallet } from 'ethers';
import { keccak256, parseEther, verifyMessage } from 'ethers/lib/utils';
import { ethers, getNamedAccounts } from 'hardhat';

import { getContract } from '../utils/deploy';

async function main() {
  const { owner } = await getNamedAccounts();
  const game = await getContract('Game', owner);
  const wallet = new Wallet('0xa74d076d53232d4a7743502f47d667a330a807c54689af2cc55511339aec2de0');

  const signature = await wallet.signMessage(
    keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['address', 'uint256'],
        ['0x8D5BE0CF7a4FA0680AFF798516c259AC0eE57334', parseEther('200')]
      )
    ).slice(2)
  );

  console.log(signature);

  console.log(
    verifyMessage(
      keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256'],
          ['0x8D5BE0CF7a4FA0680AFF798516c259AC0eE57334', parseEther('200')]
        )
      ).slice(2),
      signature
    )
  );
}

main().catch(console.error);
