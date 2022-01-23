import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { beneficiary, owner } = await getNamedAccounts();

  const transferProxy = await deployments.get('TransferProxy');
  const erc20TransferProxy = await deployments.get('ERC20TransferProxy');

  const stateV1 = await deploy('ExchangeStateV1', {
    from: owner,
    log: true
  });

  await deploy('ExchangeV1', {
    from: owner,
    args: [transferProxy.address, erc20TransferProxy.address, stateV1.address, beneficiary],
    log: true
  });
};

export default func;
