import { upgrade } from '../utils/deploy';

async function main() {
  await upgrade('Multisend');
}

main().catch(console.error);
