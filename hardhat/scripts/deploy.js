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

  const ResAdd = resourceContract.address;
  const ResManAdd = resourceManagerContract.address;
  const BuiAdd = builderContract.address;
  const KinAdd = kingdomsContract.address;

  // Connect contracts to each other
  await resourceContract.addEditor(resourceManagerContract.address);
  await resourceContract.addEditor(deployer.address);
  await kingdomsContract.addEditor(resourceManagerContract.address);
  await kingdomsContract.setBuilderContract(builderContract.address);
  await kingdomsContract.setResourceTokenContract(resourceContract.address);
  await resourceManagerContract.addEditor(builderContract.address);
  await resourceManagerContract.setKingdoms(kingdomsContract.address);
  await resourceManagerContract.setResources(resourceContract.address);
  await builderContract.addEditor(resourceManagerContract.address);
  await builderContract.addEditor(deployer.address);

  // Create resources and buildings
  await resourceManagerContract.createResourceToken("Reignover Gold", "rGold");
  await resourceManagerContract.createResourceToken("Reignover Wood", "rWood");
  await resourceManagerContract.createResourceToken("Reignover Stone", "rStone");
  await resourceManagerContract.createResourceToken("Reignover Iron", "rIron");
  await resourceManagerContract.createResourceToken("Reignover Food", "rFood");
  // build this v in to the resource manager function ^
  await builderContract.addResource(0);
  await builderContract.addResource(1);
  await builderContract.addResource(2);
  await builderContract.addResource(3);
  await builderContract.addResource(4);
  //addBuilding(name, levelRequirements[], resourceRequirements[], maxLevel)
  await builderContract.addBuilding("Capitol", [0], [0, 100, 100, 0, 0], 100);
  await builderContract.addBuilding("Forester Hut", [1, 0], [0, 100, 0, 0, 0], 100);
  await builderContract.addBuilding("Stone Quarry", [1,1,0], [0, 100, 60, 0, 0], 100);
  await builderContract.addBuilding("Iron Mine", [1,1,1,0], [0, 100, 60, 60, 0], 100);
  await builderContract.addBuilding("Farm", [1,1,1,1,0], [0, 100, 60, 60, 60], 100);
  // mint tokens to account
  await resourceContract.mint(deployer.address, 0, 10000)
  await resourceContract.mint(deployer.address, 1, 10000)
  await resourceContract.mint(deployer.address, 2, 10000)
  await resourceContract.mint(deployer.address, 3, 10000)
  await resourceContract.mint(deployer.address, 4, 10000)

  // Testing
  await kingdomsContract.buildCity("First City");
  await resourceContract.setApprovalForAll(BuiAdd, true);
  await builderContract.prepLevelUpBuilding(0,0);


  console.log('Kingdoms:', kingdomsContract.address, 'Builder:', builderContract.address, 'ResourceManager:', resourceManagerContract.address, 'Resources:', resourceContract.address);

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
