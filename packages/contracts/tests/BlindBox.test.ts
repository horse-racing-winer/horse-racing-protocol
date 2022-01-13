import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';
import { ethers, getNamedAccounts } from 'hardhat';

import { deploy, getContract } from '../utils/deploy';

describe('Exchange', function () {
  let owner: string;
  let beneficiary: string;
  let blindBox: Contract;

  before('setup accounts', async () => {
    const accounts = await getNamedAccounts();

    owner = accounts.owner;
    beneficiary = accounts.beneficiary;
  });

  before('deploy contract', async function () {
    await deploy('BlindBox', [beneficiary]);
    blindBox = await getContract('BlindBox');
  });

  describe('buy', () => {
    before('deploy exchange', async () => {
      blindBox = blindBox.connect(await ethers.getSigner(owner));
      await blindBox.setSolds(3000);
      await blindBox.setPrice(ethers.utils.parseEther('5'));
    });

    it('buy blind box', async function () {
      blindBox = blindBox.connect(await ethers.getSigner(beneficiary));

      await blindBox.buy(3, {
        value: ethers.utils.parseEther('5').mul(3)
      });

      expect(((await blindBox.balanceOf(beneficiary)) as BigNumber).eq(3), 'Not eq');
    });
  });
});
