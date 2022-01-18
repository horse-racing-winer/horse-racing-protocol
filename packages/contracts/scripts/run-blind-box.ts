import { BigNumber } from 'ethers';
import { ethers, getNamedAccounts } from 'hardhat';

import { getContract } from '../utils/deploy';

async function mint() {
  const { mint720Addr, mint1780Addr, owner } = await getNamedAccounts();
  const blindBox = await getContract('BlindBox', await ethers.getSigner(owner));

  // await blindBox.batchMint(120, mint720Addr);
  // await blindBox.batchMint(120, mint720Addr);
  // await blindBox.batchMint(120, mint720Addr);
  // await blindBox.batchMint(120, mint720Addr);
  // await blindBox.batchMint(120, mint720Addr);
  // await blindBox.batchMint(120, mint720Addr);

  // await blindBox.batchMint(160, mint1780Addr);
  // await blindBox.batchMint(160, mint1780Addr);
  // await blindBox.batchMint(160, mint1780Addr);
  // await blindBox.batchMint(160, mint1780Addr);
  // await blindBox.batchMint(160, mint1780Addr);
  // await blindBox.batchMint(160, mint1780Addr);
  // await blindBox.batchMint(160, mint1780Addr);
  // await blindBox.batchMint(160, mint1780Addr);
  // await blindBox.batchMint(160, mint1780Addr);
  // await blindBox.batchMint(160, mint1780Addr);
  // await blindBox.batchMint(160, mint1780Addr);
  await blindBox.batchMint(20, mint1780Addr);

  console.log('720 address: ', await blindBox.balanceOf(mint720Addr));
  console.log('1780 address: ', await blindBox.balanceOf(mint1780Addr));
}

async function addPool(pool: {
  price: BigNumber;
  solds: BigNumber | number;
  startTime: BigNumber | number;
  endTime: BigNumber | number;
}) {
  const { owner } = await getNamedAccounts();

  const blindBox = await getContract('BlindBox', await ethers.getSigner(owner));

  await blindBox.addPool(pool);

  console.log('pool 0: ', await blindBox.pools(0));
}

async function main() {
  // await mint();
  // await setSolds(3000);
  await addPool({
    price: ethers.utils.parseEther('5'),
    solds: 3000,
    startTime: Math.floor(Date.now() / 1000),
    endTime: Math.floor(Date.now() / 1000) + 24 * 60 * 60 * 10
  });
}

main().catch(console.error);
