import { ethers, getNamedAccounts } from 'hardhat';

import { deploy, getContract } from '../utils/deploy';

async function main() {
  const { owner, signer } = await getNamedAccounts();
  const ownerSigner = await ethers.getSigner(owner);
  const hrw = await getContract('HRW', ownerSigner);
  const horse = await getContract('Horse', ownerSigner);

  await deploy('Game', [signer, hrw.address, horse.address]);

  const game = await getContract('Game', ownerSigner);

  await horse.addMinters([game.address]);
}

main().catch(console.error);
