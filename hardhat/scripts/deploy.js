// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

const _name = 'TestVolumeNFTManager';
const _symbol = 'TVN';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const NFTContract = await hre.ethers.getContractFactory('VolumeNFTManager');
  const nftContract = await NFTContract.deploy(_name, _symbol);

  await nftContract.deployed();
  
  console.log("Contract address:", nftContract.address);
  console.log("Post-deploy balance:", (await deployer.getBalance()).toString());

  await hre.run('verify:verify', {
    address: nftContract.address,
    constructorArguments: [_name, _symbol],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
