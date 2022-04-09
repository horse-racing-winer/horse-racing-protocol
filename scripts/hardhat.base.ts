import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-abi-exporter';
import 'hardhat-gas-reporter';
import 'hardhat-spdx-license-identifier';
import 'hardhat-watcher';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

import type { HardhatUserConfig } from 'hardhat/types';

import dotenv from 'dotenv';
import { removeConsoleLog } from 'hardhat-preprocessor';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const accounts = {
  mnemonic: process.env.MNEMONIC || 'test test test test test test test test test test test junk',
  count: 200
};

const base: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  abiExporter: {
    path: './abi',
    clear: true,
    flat: true
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    currency: 'USD',
    enabled: process.env.REPORT_GAS === 'true',
    excludeContracts: ['contracts/mocks/', 'contracts/libraries/']
  },
  mocha: {
    timeout: 20000
  },
  namedAccounts: {
    owner: {
      default: 0
    },
    beneficiary: {
      default: 1
    },
    mint720Addr: {
      default: 2
    },
    mint1780Addr: {
      default: 3
    },
    beneficiaryGame: {
      default: 4
    },
    signer: {
      default: 100,
      hardhat: 10
    }
  },
  networks: {
    dev: {
      url: 'http://127.0.0.1:8545/',
      live: true,
      saveDeployments: true,
      tags: ['dev']
    },
    'avax-mainnet': {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      accounts,
      chainId: 43114,
      live: true,
      saveDeployments: true,
      tags: ['avax-mainnet']
    },
    'avax-testnet': {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts,
      chainId: 43113,
      live: true,
      saveDeployments: true,
      tags: ['avax-testnet']
    }
  },
  paths: {
    artifacts: 'artifacts',
    cache: 'cache',
    deploy: 'deploy',
    deployments: 'deployments',
    imports: 'imports',
    sources: 'contracts',
    tests: 'tests'
  },
  preprocess: {
    eachLine: removeConsoleLog(
      (bre) => bre.network.name !== 'hardhat' && bre.network.name !== 'localhost'
    )
  },
  solidity: {
    compilers: [
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          metadata: {
            bytecodeHash: 'none'
          }
        }
      }
    ]
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true
  }
};

export default base;
