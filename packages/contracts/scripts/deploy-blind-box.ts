import { getNamedAccounts } from 'hardhat';

import { deploy } from '../../utils/deploy';

async function main() {
  const { beneficiary } = await getNamedAccounts();

  await deploy('BlindBox', [beneficiary]);
}

main().catch(console.error);
