import { ethers, upgrades } from 'hardhat';

async function main() {
  const BlindBox = await ethers.getContractFactory('BlindBox');
  const box = await upgrades.deployProxy(BlindBox, ['0x8D5BE0CF7a4FA0680AFF798516c259AC0eE57334']);

  await box.deployed();

  console.log('BlindBox deployed to:', box.address);
}

main().catch(console.error);
