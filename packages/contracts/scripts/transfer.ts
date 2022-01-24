import { parseEther } from 'ethers/lib/utils';
import { getNamedAccounts } from 'hardhat';

import { getContract } from '../utils/deploy';

async function main() {
  const { owner } = await getNamedAccounts();
  const hrw = await getContract('HRW', owner);
  const horse = await getContract('Horse', owner);

  await horse.addMinters([owner]);

  const to = '0xDB193F3a78AaC74A77f2fEE96Db210C88a9c2438';

  await hrw.transfer(to, parseEther('10000000'));

  for (let i = 1000000; i < 1000000 + 50; i++) {
    await horse.mint(to, i, (i % 4) + 1);
  }
}

main().catch(console.error);
