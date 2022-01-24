import { getNamedAccounts } from 'hardhat';

import { getContract, upgrade } from '../utils/deploy';

async function main() {
  const { owner } = await getNamedAccounts();

  await upgrade('Horse');

  const horse = await getContract('Horse', owner);

  console.log(await horse.currentTokenId());
}

main().catch(console.error);
