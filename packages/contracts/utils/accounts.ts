import { ethers } from 'hardhat';

import { assert } from './assert';

export async function getAccounts() {
  const accounts = (await ethers.getSigners()).map((signer) => signer.address);

  return accounts;
}

export async function getNamedAccounts() {
  const accounts = await getAccounts();

  assert(accounts.length >= 4, 'accounts.length must greater 4');

  return {
    owner: accounts[0], // 0x2797b82EA7256817A4739dbe2dB96db6c59d230d
    beneficiary: accounts[1], // 0x0Fc0c315F3b38ca5a3bb7118fa689B9682eeA1E9
    mint720Addr: accounts[2], // 0x86Db87B010F52DF54dad937e6b1f4766C173C305
    mint1780Addr: accounts[3] // 0x53a8BB5e3cC5bD9B3e698B296AC5b13A9b5678d8
  };
}
