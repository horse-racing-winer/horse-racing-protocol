import { upgrade } from '../utils/deploy';

async function main() {
  await upgrade('Game');
}

main().catch(console.error);
