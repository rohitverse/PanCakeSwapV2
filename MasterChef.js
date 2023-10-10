const { expect } = require('chai');
const { ethers } = require('hardhat');
// d/w ->lp token -> withdraw lp token ->     
describe('PanCakeSwap Contract', async () => {
  let masterChef;
  let cakeToken;
  let syrupBar;
  let LPToken1;
  let LPToken2;
  
async function _deposit(){
  await masterChef.add(100,LPToken1.target,true);
  await LPToken1.connect(signer[0]).approve(masterChef.target,1000);
  await masterChef.connect(signer[0]).deposit(1,500);
}
async function _beforeStaking(){
  await _deposit();
  await masterChef.connect(signer[0]).withdraw(1,500);
}
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

describe(' Deposit Function', async () => {
it( " *** Deposit Function ***  ",async ()=>{
  await masterChef.add(1000,LPToken1.target,true);
  iniBalSigner= await LPToken1.connect(signer[0]).balanceOf(signer[0].address)
  // iniCake=await cakeToken.connect(signer[0]).balanceOf(signer[0].address)
  // console.log(`Balance of iniCake at Signer ${ await iniCake}`)

  iniBalMasterChef= await LPToken1.connect(signer[0]).balanceOf(masterChef.target)
  console.log(`Balance of LPToken1 at Signer ${ await iniBalSigner}`)
  console.log(`Balance of LPToken1 at MasterChef ${ await iniBalMasterChef}`)

  await LPToken1.connect(signer[0]).approve(masterChef.target,1000);
  await masterChef.connect(signer[0]).deposit(1,250);
  finalBalSigner= await LPToken1.connect(signer[0]).balanceOf(signer[0].address)
  finalBalMasterChef= await LPToken1.connect(signer[0]).balanceOf(masterChef.target)
  // fnlCake=await cakeToken.connect(signer[0]).balanceOf(signer[0].address)
  // console.log(`Balance of fnlCake at Signer ${ await fnlCake}`)

  console.log(`Balance of LPToken1 at Signer ${ await finalBalSigner}`)
  console.log(`Balance of LPToken1 at MasterChef ${ await finalBalMasterChef}`)

  expect(iniBalSigner).to.be.greaterThan(finalBalSigner);
  expect(finalBalMasterChef).to.be.greaterThan(iniBalMasterChef);
  expect(finalBalMasterChef).to.be.equal(250);
 });
 it(" *** Deposit Function For Error Check *** ",async()=>{

  await masterChef.add(1000,LPToken1.target,true);
  await LPToken1.connect(signer[0]).approve(masterChef.target,900);
  await expect(masterChef.connect(signer[0]).deposit(0,200)).to.be.revertedWith('deposit CAKE by staking');
  //using  _pid = 0  to give and check error
  })
});
describe(' Withdraw Function', async () => {
  it( " *** Withdraw Function ***  ",async ()=>{
    await _deposit();
    iniBalSigner= await LPToken1.connect(signer[0]).balanceOf(signer[0].address)
    iniBalMasterChef= await LPToken1.connect(signer[0]).balanceOf(masterChef.target)
    iniCake=await cakeToken.connect(signer[0]).balanceOf(signer[0].address)
    console.log(`Balance of iniCake at Signer ${ await iniCake}`)
    console.log(`Balance of LPToken1 at Signer ${ await iniBalSigner}`)
    console.log(`Balance of LPToken1 at MasterChef ${ await iniBalMasterChef}`)

    await masterChef.connect(signer[0]).withdraw(1,200);

    finalBalSigner= await LPToken1.connect(signer[0]).balanceOf(signer[0].address)
    finalBalMasterChef= await LPToken1.connect(signer[0]).balanceOf(masterChef.target)
    fnlCake=await cakeToken.connect(signer[0]).balanceOf(signer[0].address)
    console.log(`Balance of fnlCake at Signer ${ await fnlCake}`)
    console.log(`Balance of LPToken1 at Signer ${ await finalBalSigner}`)
    console.log(`Balance of LPToken1 at MasterChef ${ await finalBalMasterChef}`)

    expect(fnlCake).to.be.greaterThan(iniCake);
    expect(finalBalSigner).to.be.greaterThan(iniBalSigner);
    expect(iniBalMasterChef).to.be.greaterThan(finalBalMasterChef);
    });
    it(" *** Withdraw Function For Error Check *** ",async()=>{
      await _deposit();
      await expect(masterChef.connect(signer[0]).withdraw(0,200)).to.be.revertedWith('withdraw CAKE by unstaking');
      //using  _pid = 0  to give and check error
    })
    it(" *** Withdraw Function For Error Check *** ",async()=>{
      await _deposit();
      await expect(masterChef.connect(signer[0]).withdraw(1,2000)).to.be.revertedWith("withdraw: not good");// pid=1
      //using  _pid = 0  to give and check error
    })
  });
describe(' EnterStaking  Function', async () => {
    it( " *** EnterStaking Function *** ",async ()=>{
      await _beforeStaking();
      console.log(`***  BEFORE ENTERSTAKING  ***`)
      initialCake = await cakeToken.balanceOf(signer[0].address);
      initialSyrup = await syrupBar.balanceOf(signer[0].address);

      console.log(`Cake balance of signer : ${initialCake}`)
      console.log(`Syrup balance of signer : ${initialSyrup}`)
      await cakeToken.connect(signer[0]).approve(masterChef.target,1000);
      await masterChef.connect(signer[0]).enterStaking(500);

      console.log(`*** AFTER ENTERSTAKING ***`)
      finalCake = await cakeToken.balanceOf(signer[0].address);
      finalSyrup = await syrupBar.balanceOf(signer[0].address);
      console.log(`Cake balance of signer : ${finalCake}`)
      console.log(`Syrup balance of signer : ${finalSyrup}`)

      expect(initialCake).to.be.greaterThan(finalCake);
      expect(finalSyrup).to.be.greaterThan(initialSyrup);
    });
  describe(' LeavingStaking  Function', async () => {
    it(" *** LeavingStaking Function ***  ",async()=>{
      await _beforeStaking();

      await cakeToken.connect(signer[0]).approve(masterChef.target,1000);
      await masterChef.connect(signer[0]).enterStaking(500);

      console.log(` *** BEFORE LEAVESTAKING *** `)
      initialCake = await cakeToken.balanceOf(signer[0].address);
      initialSyrup = await syrupBar.balanceOf(signer[0].address);

      console.log(`Cake balance of signer : ${initialCake}`)
      console.log(`Syrup balance of signer : ${initialSyrup}`) 
      
      await masterChef.connect(signer[0]).leaveStaking(500);

      console.log(` *** AFTER LEAVESTAKING *** `)
      finalCake = await cakeToken.balanceOf(signer[0].address);
      finalSyrup = await syrupBar.balanceOf(signer[0].address);
      console.log(`Cake balance of signer : ${finalCake}`)
      console.log(`Syrup balance of signer : ${finalSyrup}`)

      expect(finalCake).to.be.greaterThan(initialCake);
      expect(initialSyrup).to.be.greaterThan(finalSyrup);
    })
   });
describe('Emergency Withdraw Function', async () => {
   it(" *** Emergency Withdraw Function *** " ,async()=>{
    await _deposit();
    console.log(` *** AFTER DEPOSIT *** `)
    initialCake = await cakeToken.balanceOf(signer[0].address);
    initialSigner = await LPToken1.balanceOf(signer[0].address);
    initialMasterchef = await LPToken1.balanceOf(masterChef.target);
    console.log(`Cake balance of signer : ${initialCake}`);
    console.log(`LPToken1 balance of signer : ${initialSigner}`)
    console.log(`LPToken1 balance of masterChef : ${initialMasterchef}`)

    await masterChef.connect(signer[0]).emergencyWithdraw(1);

    console.log(` *** AFTER WITHDRAW *** `)
    finalCake = await cakeToken.balanceOf(signer[0].address);
    finalSigner = await LPToken1.balanceOf(signer[0].address);
    finalMasterchef = await LPToken1.balanceOf(masterChef.target);
    console.log(`Cake balance of signer : ${finalCake}`);
    console.log(`LPToken1 balance of signer : ${finalSigner}`)
    console.log(`LPToken1 balance of masterchef : ${finalMasterchef}`)

    expect(finalCake).to.be.equal(0);
    //Emergency withdrawal is done without caring for REWARDS
    expect(finalSigner).to.be.greaterThan(initialSigner);
    expect(initialMasterchef).to.be.greaterThan(finalMasterchef);
  })
});
describe(' Dev Function', async () => {
  it(" *** Dev Function *** ",async()=>{
    console.log(`Dev Address Before Dev Function Called : ${ await masterChef.devaddr()}`)
    await masterChef.connect(signer[0]).dev(signer[2].address)
    console.log(`Dev Address After Dev Function Called : ${ await masterChef.devaddr()}`)
  }); 
  it(" *** Dev Function For Check Error *** ",async()=>{
    console.log(`Dev Address Before Dev Function Called : ${ await masterChef.devaddr()}`)
    expect(masterChef.connect(signer[1]).dev(signer[2].address)).to.be.revertedWith("dev: wut?")
    console.log(`Dev Address After Dev Function Called : ${ await masterChef.devaddr()}`) 
      });
    });
  });
});