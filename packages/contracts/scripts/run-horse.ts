/* eslint-disable @typescript-eslint/no-floating-promises */
import fs from 'fs-extra';
import { ethers, getNamedAccounts } from 'hardhat';
import path from 'path';

import { getContract } from '../utils/deploy';
import { randomTypes } from './randomTypes';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const { owner } = await getNamedAccounts();
  const horse = await getContract('Horse', await ethers.getSigner(owner));
  const blindBox = await getContract('BlindBox', await ethers.getSigner(owner));

  await horse.addMinters([blindBox.address]);
}

main().catch(console.error);
