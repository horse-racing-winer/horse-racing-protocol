// hardhat.config.js
import { Contracts } from '@openzeppelin/upgrades';

import base from '../../scripts/hardhat.base';

Contracts.setLocalContractsDir('aaa');
export default base;
