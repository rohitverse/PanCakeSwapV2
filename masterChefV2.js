// const ether = require("@openzeppelin/test-helpers/src/ether");
const {expect} = require("chai")
const {ethers} = require("hardhat")

describe("Masterchef : ", function(){
    let signer;
    let masterchef;
    let cake;
    let syrup;
    let lpToken1;
    let lpToken2;
    let initialSigner;
    let initialMasterchef;
    let finalSigner;
    let finalMasterchef;
    let initialCake;
    let finalCake;
    let initialSyrup;
    let finalSyrup;


    async function _deposit(){
        await masterchef.add(100,lpToken1.target,true);
        await lpToken1.connect(signer[0]).approve(masterchef.target,1000);
        await masterchef.connect(signer[0]).deposit(1,500);
    }
    async function _beforeStaking(){
        await _deposit();
        await masterchef.connect(signer[0]).withdraw(1,500);
    }

    beforeEach(async() =>{

        signer = await ethers.getSigners();
        // console.log("Signer address : ",signer[0].address);

        let Cake = await ethers.getContractFactory("CakeToken");
        cake = await Cake.connect(signer[0]).deploy();
        // console.log("Cake address : ",cake.target);

        let Syrup = await ethers.getContractFactory("SyrupBar");
        syrup = await Syrup.connect(signer[0]).deploy(cake.target);
        // console.log("SyrupBar address : ",syrup.target);

        let MasterChef = await ethers.getContractFactory("MasterChef");
        masterchef = await MasterChef.connect(signer[0]).deploy(cake.target,syrup.target,signer[1].address,1000,10);
        // console.log("Masterchef address : ",masterchef.target);

        let LpToken1 = await ethers.getContractFactory("MockBEP20");
        lpToken1 = await LpToken1.connect(signer[0]).deploy("lpToken1","LP2",ethers.parseEther("100000"));
        // console.log("LpToken1 address : ",lpToken1.target);

        lpToken2 = await LpToken1.connect(signer[0]).deploy("lpToken2","LP2",ethers.parseEther("100000"));
        // console.log("lpToken2 address : ",lpToken2.target);

        await cake.transferOwnership(masterchef.target);
        await syrup.transferOwnership(masterchef.target);
        //deposit again works only after transfer of ownership to masterchef contract

    })

    it("Important Addresses : ",async()=>{
        console.log("Signer address : ",signer[0].address);
        console.log("Cake address : ",cake.target);
        console.log("SyrupBar address : ",syrup.target);
        console.log("Masterchef address : ",masterchef.target);
        console.log("LpToken1 address : ",lpToken1.target);
        console.log("lpToken2 address : ",lpToken2.target);
    })

    it("add function : ",async()=>{
        console.log("inside add function")

        await masterchef.add(100,lpToken1.target,true);
        console.log("pool length ", await masterchef.poolLength())

        await masterchef.add(200,lpToken2.target,true);
        console.log("pool length ", await masterchef.poolLength())

        expect(await masterchef.poolLength()).to.be.equal(3n)       
    })

    it("Deposit Function : ",async()=>{

        await masterchef.add(1000,lpToken1.target,true);

        console.log("BEFORE DEPOSIT")
        initialSigner = await lpToken1.balanceOf(signer[0].address);
        initialMasterchef = await lpToken1.balanceOf(masterchef.target);
        console.log("lpToken1 balance of signer : ",initialSigner)
        console.log("lpToken1 balance of masterchef : ",initialMasterchef)

        await lpToken1.connect(signer[0]).approve(masterchef.target,900);
        await masterchef.connect(signer[0]).deposit(1,200);

        await masterchef.connect(signer[0]).deposit(1,200);

        console.log("AFTER DEPOSIT")
        finalSigner = await lpToken1.balanceOf(signer[0].address);
        finalMasterchef = await lpToken1.balanceOf(masterchef.target);
        console.log("lpToken1 balance of signer : ",finalSigner)
        console.log("lpToken1 balance of masterchef : ",finalMasterchef)

        expect(initialSigner).to.be.greaterThan(finalSigner);
        expect(finalMasterchef).to.be.greaterThan(initialMasterchef);
        expect(finalMasterchef).to.be.equal(400);
    })
    it("Deposit Function for error check : ",async()=>{

        await masterchef.add(1000,lpToken1.target,true);

        await lpToken1.connect(signer[0]).approve(masterchef.target,900);
        await expect(masterchef.connect(signer[0]).deposit(0,200)).to.be.revertedWith('deposit CAKE by staking');
        //using  _pid = 0  to give and check error

    })
    it.only("Withdraw Function : ",async()=>{

       await _deposit();

        console.log("AFTER DEPOSIT")
        initialCake = await cake.balanceOf(signer[0].address);
        initialSigner = await lpToken1.balanceOf(signer[0].address);
        initialMasterchef = await lpToken1.balanceOf(masterchef.target);
        console.log("Cake balance of signer : ",initialCake);
        console.log("lpToken1 balance of signer : ",initialSigner)
        console.log("lpToken1 balance of masterchef : ",initialMasterchef)

        await masterchef.connect(signer[0]).withdraw(1,200);

        console.log("AFTER WITHDRAW")
        finalCake = await cake.balanceOf(signer[0].address);
        finalSigner = await lpToken1.balanceOf(signer[0].address);
        finalMasterchef = await lpToken1.balanceOf(masterchef.target);
        console.log("Cake balance of signer : ",finalCake)
        console.log("lpToken1 balance of signer : ",finalSigner)
        console.log("lpToken1 balance of masterchef : ",finalMasterchef)

        expect(finalCake).to.be.greaterThan(initialCake);
        // expect(finalCake).to.be.equal(initialCake);
        expect(finalSigner).to.be.greaterThan(initialSigner);
        expect(initialMasterchef).to.be.greaterThan(finalMasterchef);
        
    })
    it("Witdraw Function for error 1 check : ",async()=>{

        await _deposit();

        await expect(masterchef.connect(signer[0]).withdraw(0,100)).to.be.revertedWith('withdraw CAKE by unstaking');
        //using  _pid = 0  to give and check error

    })
    it("Witdraw Function for error 2 check : ",async()=>{

        await _deposit();

        await expect(masterchef.connect(signer[0]).withdraw(1,1000)).to.be.revertedWith('withdraw: not good');
        //using  _pid = 0  to give and check error

    })
    it("EnterStaking Function : ",async()=>{
        await _beforeStaking();

        console.log("BEFORE ENTERSTAKING")
        initialCake = await cake.balanceOf(signer[0].address);
        initialSyrup = await syrup.balanceOf(signer[0].address);
        console.log("Cake balance of signer : ",initialCake);
        console.log("Syrup balance of signer : ",initialSyrup);

        await cake.connect(signer[0]).approve(masterchef.target,1000);
        await masterchef.connect(signer[0]).enterStaking(500);

        console.log("AFTER ENTERSTAKING")
        finalCake = await cake.balanceOf(signer[0].address);
        finalSyrup = await syrup.balanceOf(signer[0].address);
        console.log("Cake balance of signer : ",finalCake)
        console.log("Syrup balance of signer : ",finalSyrup)

        expect(initialCake).to.be.greaterThan(finalCake);
        expect(finalSyrup).to.be.greaterThan(initialSyrup);
    })
    it("LeaveStaking Function : ",async()=>{
        await _beforeStaking();

        await cake.connect(signer[0]).approve(masterchef.target,1000);
        await masterchef.connect(signer[0]).enterStaking(500);

        console.log("BEFORE LEAVESTAKING")
        initialCake = await cake.balanceOf(signer[0].address);
        initialSyrup = await syrup.balanceOf(signer[0].address);
        console.log("Cake balance of signer : ",initialCake);
        console.log("Syrup balance of signer : ",initialSyrup);

        await masterchef.connect(signer[0]).leaveStaking(500);

        console.log("AFTER LEAVESTAKING")
        finalCake = await cake.balanceOf(signer[0].address);
        finalSyrup = await syrup.balanceOf(signer[0].address);
        console.log("Cake balance of signer : ",finalCake)
        console.log("Syrup balance of signer : ",finalSyrup)

        expect(finalCake).to.be.greaterThan(initialCake);
        expect(initialSyrup).to.be.greaterThan(finalSyrup);
    })
    it("EMERGENCY Withdraw Function : ",async()=>{

        await _deposit();

        console.log("AFTER DEPOSIT")
        initialCake = await cake.balanceOf(signer[0].address);
        initialSigner = await lpToken1.balanceOf(signer[0].address);
        initialMasterchef = await lpToken1.balanceOf(masterchef.target);
        console.log("Cake balance of signer : ",initialCake);
        console.log("lpToken1 balance of signer : ",initialSigner)
        console.log("lpToken1 balance of masterchef : ",initialMasterchef)

        await masterchef.connect(signer[0]).emergencyWithdraw(1);

        console.log("AFTER WITHDRAW")
        finalCake = await cake.balanceOf(signer[0].address);
        finalSigner = await lpToken1.balanceOf(signer[0].address);
        finalMasterchef = await lpToken1.balanceOf(masterchef.target);
        console.log("Cake balance of signer : ",finalCake)
        console.log("lpToken1 balance of signer : ",finalSigner)
        console.log("lpToken1 balance of masterchef : ",finalMasterchef)

        expect(finalCake).to.be.equal(0);
        //Emergency withdrawal is done without caring for REWARDS
        expect(finalSigner).to.be.greaterThan(initialSigner);
        expect(initialMasterchef).to.be.greaterThan(finalMasterchef);
    })
    it("Dev Function : ",async()=>{
        console.log( "Dev Address Before Dev Function Called",await masterchef.devaddr())
        await masterchef.connect(signer[1]).dev(signer[2].address)
        console.log("Dev Address After Dev Function Called", await masterchef.devaddr())
    })
    it("Dev Function for error check : ",async()=>{
        await expect(masterchef.connect(signer[0]).dev(signer[2].address)).to.be.revertedWith('dev: wut?')
       console.log( await masterchef.devaddr())
    })
})