import { upgrade } from '../utils/deploy';

async function main() {
  await upgrade('Horse');
}

main().catch(console.error);
