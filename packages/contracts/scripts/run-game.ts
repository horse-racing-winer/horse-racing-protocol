import { Wallet } from 'ethers';
import { keccak256, parseEther, verifyMessage } from 'ethers/lib/utils';
import { ethers, getNamedAccounts } from 'hardhat';

import { getContract } from '../utils/deploy';

async function main() {
  const { owner } = await getNamedAccounts();
  const game = await getContract('Game', owner);
}

main().catch(console.error);
