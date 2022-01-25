import { deploy } from '../utils/deploy';

async function main() {
  await deploy('Multisend');
}

main().catch(console.error);
