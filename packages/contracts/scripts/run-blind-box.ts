/* eslint-disable @typescript-eslint/no-floating-promises */
import fs from 'fs-extra';
import { ethers, getNamedAccounts } from 'hardhat';
import path from 'path';

import { getContract } from '../utils/deploy';
import { randomTypes } from './randomTypes';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const { owner } = await getNamedAccounts();
  const blindBox = await getContract('BlindBox', await ethers.getSigner(owner));
  const horse = await getContract('Horse', await ethers.getSigner(owner));

  const types: Record<number, number[]> = fs.readJsonSync(path.resolve(__dirname, 'types.json'));

  console.log(types[1].length);
  console.log(types[2].length);
  console.log(types[3].length);
  console.log(types[4].length);

  await blindBox.setOpenStart(true);

  await blindBox.setHorse(horse.address);

  await blindBox.resetTypes(types[1], [], [], []);

  await blindBox.resetTypes([], types[2], [], []);

  await blindBox.resetTypes([], [], types[3].slice(0, 300), []);
  await blindBox.resetTypes([], [], types[3].slice(300, 600), []);
  await blindBox.resetTypes([], [], types[3].slice(600), []);
  await blindBox.resetTypes([], [], [], types[4].slice(0, 300));
  await blindBox.resetTypes([], [], [], types[4].slice(300, 600));
  await blindBox.resetTypes([], [], [], types[4].slice(600, 900));
  await blindBox.resetTypes([], [], [], types[4].slice(900, 1200));
  await blindBox.resetTypes([], [], [], types[4].slice(1200, 1500));
  await blindBox.resetTypes([], [], [], types[4].slice(1500, 1800));
  await blindBox.resetTypes([], [], [], types[4].slice(1800, 2100));
  await blindBox.resetTypes([], [], [], types[4].slice(2100, 2400));
  await blindBox.resetTypes([], [], [], types[4].slice(2400, 2700));
  await blindBox.resetTypes([], [], [], types[4].slice(2700, 3000));
  await blindBox.resetTypes([], [], [], types[4].slice(3000, 3300));
  await blindBox.resetTypes([], [], [], types[4].slice(3300, 3600));
  await blindBox.resetTypes([], [], [], types[4].slice(3600));
}

main().catch(console.error);
