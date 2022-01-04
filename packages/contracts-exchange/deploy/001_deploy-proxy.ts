import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { owner } = await getNamedAccounts();

  await deploy('TransferProxy', {
    from: owner,
    log: true
  });
  await deploy('ERC20TransferProxy', {
    from: owner,
    log: true
  });
};

export default func;
