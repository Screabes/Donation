const hre = require("hardhat");

const utils = hre.ethers.utils;
const constants = hre.ethers.constants;
const { expect } = require("chai");


describe("Donation",  function () {

    let owner, user;

    before(async function () {
        this.Donation = await hre.ethers.getContractFactory("Donation");
    });

    beforeEach(async function () {
        [owner, user] = await hre.ethers.getSigners();
        this.ownerAddress = await owner.getAddress();
        this.userAddress = await user.getAddress();

        this.donation = await this.Donation.deploy();
        await this.donation.deployed();
    });

    context("function deposit()", async function () {

        it("should revert if user deposit less than 0.001 eth", async function () {
            await expect(this.donation.connect(user).deposit({ value: 0 })).to.be.revertedWith("deposit: msg.value not good");
        });

        it("should deposit successfully", async function () {
            await expect(this.donation.connect(user).deposit({ value: utils.parseEther("1") })).to.be
                .emit(this.donation, "Deposit")
                .withArgs(this.userAddress, utils.parseEther("1"));

            await expect(await this.donation.userBalance(this.userAddress)).to.be.equal(utils.parseEther("1"));
        });
    });

    context("function withdraw()", async function () {

        beforeEach(async function () {
            await this.donation.connect(user).deposit({ value: utils.parseEther("1") });
        });

        it("should revert if caller is not owner",async function () {
            await expect(this.donation.connect(user).withdraw(this.userAddress, utils.parseEther("1"))).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("should withdraw ETH to target address by owner", async function () {
            await expect(this.donation.connect(owner).withdraw(this.ownerAddress, utils.parseEther("1"))).to.be
                .emit(this.donation, "Withdraw")
                .withArgs(this.ownerAddress, utils.parseEther("1"));
        });

        it("should withdraw all ETH to target address by owner if amount more than balance", async function () {
            await expect(this.donation.connect(owner).withdraw(this.ownerAddress, utils.parseEther("2"))).to.be
                .emit(this.donation, "Withdraw")
                .withArgs(this.ownerAddress, utils.parseEther("1"));
        });


    });
});