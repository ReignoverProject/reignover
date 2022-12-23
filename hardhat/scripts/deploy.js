// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");


async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const resources = await hre.ethers.getContractFactory('Resources');
  const resourceContract = await resources.deploy();
  await resourceContract.deployed();

  const kingdoms = await hre.ethers.getContractFactory('Kingdoms');
  const kingdomsContract = await kingdoms.deploy();
  await kingdomsContract.deployed();
  
  const resourceManager = await hre.ethers.getContractFactory('ResourceManager');
  const resourceManagerContract = await resourceManager.deploy();
  await resourceManagerContract.deployed();
  
  const builder = await hre.ethers.getContractFactory('Builder');
  // Kingdoms, resourcemanager, resources for constructor
  const builderContract = await builder.deploy(kingdomsContract.address, resourceManagerContract.address, resourceContract.address);
  await builderContract.deployed();

  // await hre.run('verify:verify', {
  //   address: nftContract.address,
  //   constructorArguments: [_name, _symbol],
  // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
