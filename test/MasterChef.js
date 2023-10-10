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
   
  await cakeToken.transferOwnership(masterChef.target);
  await syrupBar.transferOwnership(masterChef.target);
})
it('  *** Print Contract Address of MasterChef ***  ', async () => {
  console.log(`Contract Address of MasterChef : ${masterChef.target}`);
  console.log(`Contract Address of CakeToken : ${cakeToken.target}`)
  console.log(`Contract Address of SyrupBar : ${syrupBar.target}`)
  console.log(`Contract Address of LPToken1 : ${LPToken1.target}`)
  console.log(`Contract Address of LPToken2 : ${LPToken2.target}`)
});
it('  *** Test Add Function ***  ', async () => {
  // function add(uint256 _allocPoint, IBEP20 _lpToken, bool _withUpdate)

  // pid=0 for check error
  await masterChef.add(100,LPToken1.target,true);
  console.log(`Pool Length: ${await masterChef.poolLength()}`);

  await masterChef.add(100,LPToken2.target,true);
  console.log(`Pool Length: ${await masterChef.poolLength()}`);

  expect(await masterChef.poolLength()).to.be.equal(3);
});
it('  *** Set Function ***  ', async () => {
  // function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate) public onlyOwner {

  // pid=0 for check error
  await masterChef.add(100,LPToken1.target,true);
  console.log(`Pool Length: ${await masterChef.poolLength()}`);
  await masterChef.add(100,LPToken2.target,true);
  console.log(`Pool Length: ${await masterChef.poolLength()}`);
  console.log(`PoolInfo : ${ await masterChef.poolInfo(1)}`)
  await masterChef.set(1,200,true);
  console.log(`Pool Length: ${await masterChef.poolLength()}`);
  await masterChef.poolInfo(1);
  console.log(`PoolInfo : ${ await masterChef.poolInfo(1)}`)
  console.log(`Pool Length: ${await masterChef.poolLength()}`);
  // expect(await masterChef.poolLength()).to.be.equal(3);

  await LPToken1.connect(signer[0]).balanceOf(signer[0].address);
  console.log(`Balance of LPToken1 at Signer ${ await LPToken1.connect(signer[0]).balanceOf(signer[0].address)}`)
  console.log(`Balance of LPToken2 at Signer ${ await LPToken2.connect(signer[0]).balanceOf(signer[0].address)}`)
});

it.only( " *** Deposit Function ***  ",async ()=>{
  // function deposit(uint256 _pid, uint256 _amount)
  await masterChef.add(1000,LPToken1.target,true);

  console.log(`Balance of LPToken1 at Signer ${ await LPToken1.connect(signer[0]).balanceOf(signer[0].address)}`)
  console.log(`Balance of LPToken1 at MasterChef ${ await LPToken1.connect(signer[0]).balanceOf(masterChef.target)}`)
  console.log(`Balance of LPToken2 at Signer ${ await LPToken2.connect(signer[0]).balanceOf(signer[0].address)}`)
  console.log(`Balance of LPToken2 at MasterChef ${ await LPToken2.connect(signer[0]).balanceOf(masterChef.target)}`)
  await LPToken1.connect(signer[0]).approve(masterChef.target,1000);
  await masterChef.connect(signer[0]).deposit(1,150);
  
  initialSigner= await LPToken1.connect(signer[0]).balanceOf(signer[0].address)
  initialMasterchef= await LPToken1.connect(signer[0]).balanceOf(masterChef.target)
  console.log(`Balance of LPToken1 at Signer ${ await LPToken1.connect(signer[0]).balanceOf(signer[0].address)}`)
  console.log(`Balance of LPToken1 at MasterChef ${ await LPToken1.connect(signer[0]).balanceOf(masterChef.target)}`)
  console.log(`Balance of LPToken2 at Signer ${ await LPToken2.connect(signer[0]).balanceOf(signer[0].address)}`)
  console.log(`Balance of LPToken2 at MasterChef ${ await LPToken2.connect(signer[0]).balanceOf(masterChef.target)}`)
  await masterChef.connect(signer[0]).deposit(1,150);
    
  console.log(`Balance of LPToken1 at Signer ${ await LPToken1.connect(signer[0]).balanceOf(signer[0].address)}`)
  console.log(`Balance of LPToken1 at MasterChef ${ await LPToken1.connect(signer[0]).balanceOf(masterChef.target)}`)
  console.log(`Balance of LPToken2 at Signer ${ await LPToken2.connect(signer[0]).balanceOf(signer[0].address)}`)
  console.log(`Balance of LPToken2 at MasterChef ${ await LPToken2.connect(signer[0]).balanceOf(masterChef.target)}`)

  expect(initialSigner).to.be.greaterThan(finalSigner);
  expect(finalMasterchef).to.be.greaterThan(initialMasterchef);
  expect(finalMasterchef).to.be.equal(400);
 });
});