import { ethers, upgrades } from "hardhat";

const oldProxyAddress = "0x380c369De2e2B4dC8888ba6140D189Cfa7c13199";

async function main() {
  const BlindBox = await ethers.getContractFactory("BlindBox");
  const blindBox = await upgrades.upgradeProxy(oldProxyAddress, BlindBox);

  await blindBox.deployed();

  console.log("BlindBox upgrade to:", blindBox.address);
}

main();
