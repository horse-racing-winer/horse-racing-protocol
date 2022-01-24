import type { TransactionReceipt } from '@ethersproject/abstract-provider';
import type {
  DeployProxyOptions,
  UpgradeProxyOptions
} from '@openzeppelin/hardhat-upgrades/dist/utils';
import type { Signer } from 'ethers';
import type { Artifact } from 'hardhat/types';

import fs from 'fs-extra';
import { artifacts, config, ethers, network, upgrades } from 'hardhat';
import path from 'path';

import { assert } from './assert';

interface Deployments extends Artifact {
  address: any;
  transactionHash: string;
  receipt: TransactionReceipt;
  args: unknown[];
}

export async function deploy(name: string, args?: unknown[], opts?: DeployProxyOptions) {
  console.log(`Start deploy ${name} ...`);

  const Contract = await ethers.getContractFactory(name);

  const contract = await upgrades.deployProxy(Contract, args, opts);

  await contract.deployed();

  console.log(
    `Deploy ${name} success on transaction ${contract.deployTransaction.hash} with address ${contract.address} !`
  );

  const artifact = await artifacts.readArtifact(name);

  assert(artifact, `Can't found artifact named ${name}`);
  const deployments: Deployments = {
    address: contract.address,
    transactionHash: contract.deployTransaction.hash,
    receipt: await contract.deployTransaction.wait(),
    args: args || [],
    ...artifact
  };

  saveDeployments(deployments);
}

export async function upgrade(name: string, opts?: UpgradeProxyOptions) {
  const { name: chainName } = network;

  const artifact = await artifacts.readArtifact(name);
  const deploymentsPath = path.resolve(config.paths.root, 'deployments');

  let deployments: Deployments = fs.readJsonSync(
    path.resolve(deploymentsPath, chainName, `${artifact.contractName}.json`)
  );

  console.log(`Upgrade contract ${name} ...`);

  const Contract = await ethers.getContractFactory(name);
  const contract = await upgrades.upgradeProxy(deployments.address, Contract, opts);

  await contract.deployed();

  deployments = {
    ...deployments,
    address: contract.address,
    transactionHash: contract.deployTransaction.hash,
    receipt: await contract.deployTransaction.wait(),
    ...artifact
  };

  saveDeployments(deployments);
  console.log(
    `Upgrade ${name} success on transaction ${contract.deployTransaction.hash} with address ${contract.address} !`
  );
}

export async function getContract(name: string, signer?: Signer | string) {
  const { name: chainName } = network;

  const artifact = await artifacts.readArtifact(name);
  const deploymentsPath = path.resolve(config.paths.root, 'deployments');

  const deployments: Deployments = fs.readJsonSync(
    path.resolve(deploymentsPath, chainName, `${artifact.contractName}.json`)
  );

  return new ethers.Contract(
    deployments.address,
    deployments.abi,
    typeof signer === 'string' ? await ethers.getSigner(signer) : signer
  );
}

export function saveDeployments(deployments: Deployments) {
  const {
    config: { chainId },
    name: chainName
  } = network;

  const deploymentsPath = path.resolve(config.paths.root, 'deployments');

  fs.ensureDirSync(deploymentsPath);

  fs.ensureDirSync(path.resolve(deploymentsPath, chainName));

  fs.writeFileSync(
    path.resolve(deploymentsPath, chainName, '.chainId'),
    chainId?.toString() ?? 'unknown'
  );

  fs.writeJsonSync(
    path.resolve(deploymentsPath, chainName, `${deployments.contractName}.json`),
    deployments,
    { spaces: 2 }
  );
}
