import { ethers, getNamedAccounts } from 'hardhat';

import { getContract } from '../utils/deploy';

async function main() {
  const { owner } = await getNamedAccounts();
  const game = await getContract('Game', owner);
  const signer = await ethers.getSigner(owner);

  await game.setSigner('0xd5ef30c0195a7B627DCB5a322e3fF83B76Ba47f9', {
    nonce: 599,
    gasPrice: '125897435931'
  });
}

main().catch(console.error);
