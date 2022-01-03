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

async function setSolds(num: number) {
  const { owner } = await getNamedAccounts();

  const blindBox = await getContract('BlindBox', await ethers.getSigner(owner));

  await blindBox.setSolds(num);

  console.log('Solds: ', await blindBox.solds());
}

async function setPrice(price: number) {
  const { owner } = await getNamedAccounts();

  const blindBox = await getContract('BlindBox', await ethers.getSigner(owner));

  await blindBox.setPrice(price);
}

async function main() {
  // await mint();
  // await setSolds(3000);
}

main().catch(console.error);
