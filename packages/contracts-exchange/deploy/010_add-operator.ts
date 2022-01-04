import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers } = hre;

  // const transferProxy = await deployments.get('TransferProxy');
  // const erc20TransferProxy = await deployments.get('ERC20TransferProxy');
  // const exchangeStateV1 = await deployments.get('ExchangeStateV1');
  // const exchangeV1 = await deployments.get('ExchangeV1');

  const transferProxy = await ethers.getContractAt(
    'TransferProxy',
    (
      await deployments.get('TransferProxy')
    ).address
  );
  const erc20TransferProxy = await ethers.getContractAt(
    'ERC20TransferProxy',
    (
      await deployments.get('ERC20TransferProxy')
    ).address
  );
  const exchangeStateV1 = await ethers.getContractAt(
    'ExchangeStateV1',
    (
      await deployments.get('ExchangeStateV1')
    ).address
  );
  const exchangeV1 = await ethers.getContractAt(
    'ExchangeV1',
    (
      await deployments.get('ExchangeV1')
    ).address
  );

  console.log('add operator: ', exchangeV1.address);

  if (!(await transferProxy.isOperator(exchangeV1.address))) {
    await transferProxy.addOperator(exchangeV1.address);
  }

  if (!(await erc20TransferProxy.isOperator(exchangeV1.address))) {
    await erc20TransferProxy.addOperator(exchangeV1.address);
  }

  if (!(await exchangeStateV1.isOperator(exchangeV1.address))) {
    await exchangeStateV1.addOperator(exchangeV1.address);
  }
};

export default func;
