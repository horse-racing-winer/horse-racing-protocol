import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

import { verifyMessage } from '@ethersproject/wallet';
import { expect, util } from 'chai';
import { BigNumber, Contract, ContractFactory, utils } from 'ethers';
import {
  arrayify,
  defaultAbiCoder,
  hashMessage,
  keccak256,
  recoverAddress,
  solidityKeccak256,
  splitSignature
} from 'ethers/lib/utils';
import { deployments, ethers, getNamedAccounts } from 'hardhat';

import { deploy, getContract } from '../utils/deploy';
import { AssetType } from './types';
import { EMPTY_ADDRESS, ETHER, getRsv, UINT256_MAX } from './util';

describe('Game', function () {
  let game: Contract;

  before('deploy contract', async function () {
    const { owner, signer } = await getNamedAccounts();

    await deploy('Game', [signer]);

    game = await getContract('Game', await ethers.getSigner(owner));
  });

  describe('validate', () => {
    it('validate signature', async function () {
      const { owner, signer: signerAddr } = await getNamedAccounts();
      const signer = await ethers.getSigner(signerAddr);

      const message = keccak256(
        defaultAbiCoder.encode(['address', 'uint256'], [owner, '1234'])
      ).slice(2);
      const signature = splitSignature(await signer.signMessage(message));

      await game.withdrawNative('1234', signature.v, signature.r, signature.s);
    });
  });
});
