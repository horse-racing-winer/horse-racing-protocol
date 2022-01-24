import { Contract } from 'ethers';
import { defaultAbiCoder, keccak256, splitSignature } from 'ethers/lib/utils';
import { ethers, getNamedAccounts } from 'hardhat';

import { deploy, getContract } from '../utils/deploy';

describe('Game', function () {
  let game: Contract;

  before('deploy contract', async function () {
    const { owner, signer } = await getNamedAccounts();

    await deploy('Game', [signer, signer, signer]);

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
