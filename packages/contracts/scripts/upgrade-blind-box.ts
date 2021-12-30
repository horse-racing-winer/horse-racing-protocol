import { upgrade } from '../utils/deploy';

async function main() {
  await upgrade('BlindBox');
}

main().catch(console.error);
