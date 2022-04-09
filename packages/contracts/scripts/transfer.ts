import { parseEther } from 'ethers/lib/utils';
import { getNamedAccounts } from 'hardhat';

import { getContract } from '../utils/deploy';

async function main() {
  const { owner } = await getNamedAccounts();
  const horse = await getContract('Horse', owner);
  const hrw = await getContract('HRW', owner);

  await hrw.transfer('0x48142776f561F95C9624b3aCf53bed1EeA7991A6', parseEther('1000'));

  // await horse.addMinters([owner]);

  // for (let i = 1000000; i < 1000000 + 50; i++) {
  //   await horse.mint(owner, (i % 4) + 1);
  // }
}

main().catch(console.error);
