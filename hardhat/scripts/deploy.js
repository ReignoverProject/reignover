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
  {
    name: "Barracks",
    lvlReq: [0,0,0,0,0,0],
    resReq: [0, 100, 60, 60, 60],
    maxLvl: 100 
  },
  {
    name: "Stable",
    lvlReq: [0,0,0,0,0,0,0],
    resReq: [0, 100, 60, 60, 60],
    maxLvl: 100 
  },
  {
    name: "Academy",
    lvlReq: [0,0,0,0,0,0,0,0],
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

const units = [
  {
    name: 'warrior',
    reqBuilding: 5,
    maxUnits: 100000,
    buildingLevelReq: 1,
    timeCost: 10,
    resourceReq: [0, 10, 10, 0, 10],
  },
  {
    name: 'horsey',
    reqBuilding: 6,
    maxUnits: 100000,
    buildingLevelReq: 1,
    timeCost: 20,
    resourceReq: [0, 0, 0, 30, 30],
  },
  {
    name: 'mage',
    reqBuilding: 7,
    maxUnits: 100000,
    buildingLevelReq: 1,
    timeCost: 40,
    resourceReq: [0, 10, 10, 10, 10],
  },
]

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
  
  const unitManager = await hre.ethers.getContractFactory('UnitManager');
  // Kingdoms, resourcemanager, resources for constructor
  const unitsContract = await unitManager.deploy(kingdomsContract.address, resourceManagerContract.address, resourceContract.address);
  await unitsContract.deployed();

  const ResAdd = resourceContract.address;
  const ResManAdd = resourceManagerContract.address;
  const BuiAdd = builderContract.address;
  const KinAdd = kingdomsContract.address;
  const UnitAdd = unitsContract.address;

  // Connect contracts to each other
  await resourceContract.addEditor(resourceManagerContract.address);
  await resourceContract.addEditor(deployer.address);
  // await kingdomsContract.addEditor(resourceManagerContract.address);
  await kingdomsContract.addEditor(BuiAdd);
  await kingdomsContract.addEditor(UnitAdd);
  await kingdomsContract.setBuilderContract(builderContract.address);
  await kingdomsContract.setResourceTokenContract(resourceContract.address);
  await resourceManagerContract.addEditor(builderContract.address);
  await resourceManagerContract.setKingdoms(kingdomsContract.address);
  await resourceManagerContract.setResources(resourceContract.address);
  await resourceManagerContract.setBuilder(BuiAdd);
  await resourceManagerContract.setUnitManager(UnitAdd);
  await builderContract.addEditor(resourceManagerContract.address);
  await builderContract.addEditor(deployer.address);
  await unitsContract.addEditor(resourceManagerContract.address);
  const delay = ms => new Promise(res => setTimeout(res, ms));

  // Create resources and buildings
  resourceTokens.forEach(async(token, i) => {
    await resourceManagerContract.createResourceToken(token.name, token.symbol);
    console.log('resource: ', i)
    await delay(2000);
  })

  await delay(1000);
  
  //addBuilding(name, levelRequirements[], resourceRequirements[], maxLevel) -- for each isn't working for buildings, probably trying to run them too quickly
  // buildings.forEach(async(building, i) => {
  //   await builderContract.addBuilding(building.name, building.lvlReq, building.resReq, building.maxLvl);
  //   console.log('building: ', i)
  //   await delay(4000);
  // })
  await builderContract.addBuilding(buildings[0].name, buildings[0].lvlReq, buildings[0].resReq, buildings[0].maxLvl);
  console.log('building: ', 0)
  await builderContract.addBuilding(buildings[1].name, buildings[1].lvlReq, buildings[1].resReq, buildings[1].maxLvl);
  console.log('building: ', 1)
  await builderContract.addBuilding(buildings[2].name, buildings[2].lvlReq, buildings[2].resReq, buildings[2].maxLvl);
  console.log('building: ', 2)
  await builderContract.addBuilding(buildings[3].name, buildings[3].lvlReq, buildings[3].resReq, buildings[3].maxLvl);
  console.log('building: ', 3)
  await builderContract.addBuilding(buildings[4].name, buildings[4].lvlReq, buildings[4].resReq, buildings[4].maxLvl);
  console.log('building: ', 4)
  await builderContract.addBuilding(buildings[5].name, buildings[5].lvlReq, buildings[5].resReq, buildings[5].maxLvl);
  console.log('building: ', 5)
  await builderContract.addBuilding(buildings[6].name, buildings[6].lvlReq, buildings[6].resReq, buildings[6].maxLvl);
  console.log('building: ', 6)
  await builderContract.addBuilding(buildings[7].name, buildings[7].lvlReq, buildings[7].resReq, buildings[7].maxLvl);
  console.log('building: ', 7)

  await delay(1000);
  // Setup reward pools
  rewardPools.forEach(async(pool, i) => {
    await resourceManagerContract.setRewardPool(pool.buildingId, pool.rewardToken, pool.baseReward);
    console.log('pool: ', i)
    await delay(2000);
  })

  await delay(1000);
  //setup units
  units.forEach(async(unit, i) => {
    await unitsContract.addUnit(unit.name, unit.reqBuilding, unit.maxUnits, unit.buildingLevelReq, unit.timeCost, unit.resourceReq);
    console.log('unit: ', i)
    await delay(2000);
  })
  await delay(1000);

  // mint tokens to account
  await resourceContract.mint(deployer.address, 0, 10000)
  await resourceContract.mint(deployer.address, 1, 10000)
  await resourceContract.mint(deployer.address, 2, 10000)
  await resourceContract.mint(deployer.address, 3, 10000)
  await resourceContract.mint(deployer.address, 4, 10000)

  console.log('Kingdoms:', KinAdd, 'Builder:', BuiAdd, 'ResourceManager:',ResManAdd, 'Resources:', ResAdd, 'UnitManager: ', UnitAdd);

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
