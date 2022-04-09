import { ethers, getNamedAccounts } from 'hardhat';

import { getContract } from '../utils/deploy';

async function main() {
  const { beneficiaryGame, owner } = await getNamedAccounts();
  const game = await getContract('Game', owner);
  const signer = await ethers.getSigner(owner);

  await game.setBeneficiary(beneficiaryGame);
  await game.setWithdrawFees(1000);
}

main().catch(console.error);
