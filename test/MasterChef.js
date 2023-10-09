const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('PanCakeSwap Contract', async () => {
  let masterChef;
  let cakeToken;
  let syrupBar;
  let LPToken1;
  let LPToken2;
beforeEach(async () => {
  signer = await ethers.getSigners();

  const CakeToken = await ethers.getContractFactory('CakeToken');
  cakeToken = await CakeToken.connect(signer[0]).deploy();

  const SyrupBar = await ethers.getContractFactory('SyrupBar');
  syrupBar = await SyrupBar.connect(signer[0]).deploy(cakeToken.target);

  const MasterChef = await ethers.getContractFactory('MasterChef');
  masterChef = await MasterChef.connect(signer[0]).deploy(cakeToken.target,syrupBar.target,signer[0].address,10000,1);

  const MockBEP20 = await ethers.getContractFactory('MockBEP20');
  LPToken1 = await MockBEP20.connect(signer[0]).deploy("LP Token 1","LP1",1000);

  LPToken2 = await MockBEP20.connect(signer[0]).deploy("LP Token 2","LP2",1000);
   

})
it('  *** Print Contract Address of MasterChef ***  ', async () => {
  console.log(`Contract Address of MasterChef : ${masterChef.target}`);
  console.log(`Contract Address of CakeToken : ${cakeToken.target}`)
  console.log(`Contract Address of SyrupBar : ${syrupBar.target}`)
  console.log(`Contract Address of LPToken1 : ${LPToken1.target}`)
  console.log(`Contract Address of LPToken2 : ${LPToken2.target}`)
});
});