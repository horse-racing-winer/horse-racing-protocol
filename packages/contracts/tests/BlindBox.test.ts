import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';
import { ethers, getNamedAccounts } from 'hardhat';

import { deploy, getContract } from '../utils/deploy';

describe('BlindBox', function () {
  let owner: string;
  let beneficiary: string;
  let blindBox: Contract;
  let horse: Contract;
  let randomOracle: Contract;

  before('setup accounts', async () => {
    const accounts = await getNamedAccounts();

    owner = accounts.owner;
    beneficiary = accounts.beneficiary;
  });

  before('deploy contract', async function () {
    await deploy('BlindBox', [beneficiary]);
    blindBox = await getContract('BlindBox');
    await deploy('Horse', [[blindBox.address]]);
    horse = await getContract('Horse');
    await deploy('RandomOracle');
    randomOracle = await getContract('RandomOracle');
  });

  describe('buy', () => {
    before('set params', async () => {
      blindBox = blindBox.connect(await ethers.getSigner(owner));
      await blindBox.addPool({
        price: ethers.utils.parseEther('5'),
        solds: 3000,
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000) + 24 * 60 * 60 * 10
      });
    });

    it('buy blind box', async function () {
      blindBox = blindBox.connect(await ethers.getSigner(beneficiary));

      await blindBox.buy(0, 3, {
        value: ethers.utils.parseEther('5').mul(3)
      });

      expect(((await blindBox.balanceOf(beneficiary)) as BigNumber).eq(3), 'Not eq');
    });
  });

  describe('open', () => {
    before('set params', async () => {
      blindBox = blindBox.connect(await ethers.getSigner(owner));
      await blindBox.setOpenStart(true);
      await blindBox.setHorse(horse.address);
      horse = horse.connect(await ethers.getSigner(owner));
      await horse.setRandomOracle(randomOracle.address);
    });

    it('open blind box', async function () {
      blindBox = blindBox.connect(await ethers.getSigner(beneficiary));

      await blindBox.open(1);

      console.log(await horse.types(1));

      expect(((await horse.balanceOf(beneficiary)) as BigNumber).eq(1), 'Not eq');
    });

    it('batch open blind box', async function () {
      blindBox = blindBox.connect(await ethers.getSigner(beneficiary));

      await blindBox.batchOpen([2, 3]);

      console.log(await horse.types(2));
      console.log(await horse.types(3));
      expect(((await horse.balanceOf(beneficiary)) as BigNumber).eq(3), 'Not eq');
    });
  });
});
