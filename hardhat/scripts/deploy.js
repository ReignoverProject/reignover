// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

const rewardPools = [
  {
    buildingId: 1,
    rewardToken: 1,
    baseReward: 100000
  },
  {
    buildingId: 2,
    rewardToken: 2,
    baseReward: 100000
  },
  {
    buildingId: 3,
    rewardToken: 3,
    baseReward: 100000
  },
  {
    buildingId: 4,
    rewardToken: 4,
    baseReward: 100000
  },
];

const buildings = [
  {
    name: "Capitol",
    lvlReq: [0],
    resReq: [0, 100, 100, 0, 0],
    maxLvl: 100
  },
  {
    name: "Forester Hut",
    lvlReq: [1, 0],
    resReq: [0, 100, 0, 0, 0],
    maxLvl: 100 
  },
  {
    name: "Stone Quarry",
    lvlReq: [1,1,0],
    resReq: [0, 100, 60, 0, 0],
    maxLvl: 100 
  },
  {
    name: "Iron Mine",
    lvlReq: [1,1,1,0],
    resReq: [0, 100, 60, 60, 0],
    maxLvl: 100
  },
  {
    name: "Farm",
    lvlReq: [1,1,1,1,0],
    resReq: [0, 100, 60, 60, 60],
    maxLvl: 100 
  },
];

const resourceTokens = [
  {
    name: "Reignover Gold",
    symbol: "rGold",
  },
  {
    name: "Reignover Wood",
    symbol: "rWood",
  },
  {
    name: "Reignover Stone",
    symbol: "rStone",
  },
  {
    name: "Reignover Iron",
    symbol: "rIron",
  },
  {
    name: "Reignover Food",
    symbol: "rFood",
  },
];

async function main() {
  const [deployer, user1, user2] = await ethers.getSigners();

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
  // await kingdomsContract.addEditor(resourceManagerContract.address);
  await kingdomsContract.addEditor(BuiAdd);
  await kingdomsContract.setBuilderContract(builderContract.address);
  await kingdomsContract.setResourceTokenContract(resourceContract.address);
  await resourceManagerContract.addEditor(builderContract.address);
  await resourceManagerContract.setKingdoms(kingdomsContract.address);
  await resourceManagerContract.setResources(resourceContract.address);
  await resourceManagerContract.setBuilder(BuiAdd);
  await builderContract.addEditor(resourceManagerContract.address);
  await builderContract.addEditor(deployer.address);

  // Create resources and buildings
  await resourceManagerContract.createResourceToken(resourceTokens[0].name, resourceTokens[0].symbol);
  await resourceManagerContract.createResourceToken(resourceTokens[1].name, resourceTokens[1].symbol);
  await resourceManagerContract.createResourceToken(resourceTokens[2].name, resourceTokens[2].symbol);
  await resourceManagerContract.createResourceToken(resourceTokens[3].name, resourceTokens[3].symbol);
  await resourceManagerContract.createResourceToken(resourceTokens[4].name, resourceTokens[4].symbol);

  //addBuilding(name, levelRequirements[], resourceRequirements[], maxLevel) create objects for these
  await builderContract.addBuilding(buildings[0].name, buildings[0].lvlReq, buildings[0].resReq, buildings[0].maxLvl);
  await builderContract.addBuilding(buildings[1].name, buildings[1].lvlReq, buildings[1].resReq, buildings[2].maxLvl);
  await builderContract.addBuilding(buildings[2].name, buildings[2].lvlReq, buildings[2].resReq, buildings[2].maxLvl);
  await builderContract.addBuilding(buildings[3].name, buildings[3].lvlReq, buildings[3].resReq, buildings[3].maxLvl);
  await builderContract.addBuilding(buildings[4].name, buildings[4].lvlReq, buildings[4].resReq, buildings[4].maxLvl);
  // Setup reward pools
  await resourceManagerContract.setRewardPool(rewardPools[0].buildingId, rewardPools[0].rewardToken, rewardPools[0].baseReward);
  await resourceManagerContract.setRewardPool(rewardPools[1].buildingId, rewardPools[1].rewardToken, rewardPools[1].baseReward);
  await resourceManagerContract.setRewardPool(rewardPools[2].buildingId, rewardPools[2].rewardToken, rewardPools[2].baseReward);
  await resourceManagerContract.setRewardPool(rewardPools[3].buildingId, rewardPools[3].rewardToken, rewardPools[3].baseReward);

  // mint tokens to account
  await resourceContract.mint(deployer.address, 0, 10000)
  await resourceContract.mint(deployer.address, 1, 10000)
  await resourceContract.mint(deployer.address, 2, 10000)
  await resourceContract.mint(deployer.address, 3, 10000)
  await resourceContract.mint(deployer.address, 4, 10000)

  console.log('Kingdoms:', KinAdd, 'Builder:', BuiAdd, 'ResourceManager:',ResManAdd, 'Resources:', ResAdd);

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
