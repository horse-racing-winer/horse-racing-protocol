/* eslint-disable @typescript-eslint/no-floating-promises */
import { ethers, getNamedAccounts } from 'hardhat';

import { getContract } from '../utils/deploy';

async function main() {
  const { owner } = await getNamedAccounts();
  const hrw = await getContract('HRW', await ethers.getSigner(owner));

  await hrw.transfer('0x2Eb30DE133Ec63CfE7a0892C0a45F13Fa0419505', '16666000000000000000000000');
}

main().catch(console.error);
