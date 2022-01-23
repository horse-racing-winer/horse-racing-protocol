import { deploy } from '../utils/deploy';

async function main() {
  await deploy('Horse');
}

main().catch(console.error);
