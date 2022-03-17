import { ethers, getNamedAccounts } from 'hardhat';

import { getContract } from '../utils/deploy';

async function main() {
  const { owner } = await getNamedAccounts();
  const blindBox = await getContract('BlindBox', await ethers.getSigner(owner));

  await blindBox.addPool({
    price: '8000000000000000000',
    solds: 4000,
    startTime: 1647604800,
    endTime: 1647604800 + 259200
  });
}

main().catch(console.error);
