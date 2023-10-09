const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('PanCakeSwap Contract', async () => {
  let masterChef;
  let cakeToken;
  let syrupBar;
beforeEach(async () => {
  signer = await ethers.getSigners();

  // CakeToken _cake,
  //       SyrupBar _syrup,
  //       address _devaddr,
  //       uint256 _cakePerBlock,
  //       uint256 _startBlock
  const CakeToken = await ethers.getContractFactory('CakeToken');
  cakeToken = await CakeToken.connect(signer[0]).deploy();
  const SyrupBar = await ethers.getContractFactory('SyrupBar');
  syrupBar = await SyrupBar.connect(signer[0]).deploy(cakeToken.target);

  // CakeToken _cake,
  // SyrupBar _syrup,
  // address _devaddr,
  // uint256 _cakePerBlock,
  // uint256 _startBlock
  const MasterChef = await ethers.getContractFactory('MasterChef');
  masterChef = await MasterChef.connect(signer[0]).deploy(cakeToken.target,syrupBar.target,signer[0].address,10000,1);
   
})
it('  *** Check Contract Address of MasterChef ***  ', async () => {
  
  console.log(`Contract Address of MasterChef : ${masterChef.target}`);
  console.log(`Contract Address of CakeToken : ${cakeToken.target}`)
  console.log(`Contract Address of SyrupBar : ${syrupBar.target}`)
});
});