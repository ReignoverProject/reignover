const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const rewardPools = [
  {
    buildingId: 1,
    rewardToken: 1,
    baseReward: 1
  },
  {
    buildingId: 2,
    rewardToken: 2,
    baseReward: 1
  },
  {
    buildingId: 3,
    rewardToken: 3,
    baseReward: 1
  },
  {
    buildingId: 4,
    rewardToken: 4,
    baseReward: 1
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
]

describe("Reignover", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractsFixture() {
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

    return { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd };
  }

  describe("Setup", function () {
    it("Should set the right editors", async function () {
      const { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd } = await loadFixture(deployContractsFixture);
     
      expect(await resourceContract.editor(ResManAdd)).to.equal(true);
      expect(await resourceContract.editor(deployer.address)).to.equal(true);
      expect(await resourceManagerContract.editor(BuiAdd)).to.equal(true);
      expect(await kingdomsContract.editor(BuiAdd)).to.equal(true);
      expect(await builderContract.editor(ResManAdd)).to.equal(true);
      expect(await builderContract.editor(deployer.address)).to.equal(true);

    });

    it("Should connect to each other correctly", async function () {
      const { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd } = await loadFixture(deployContractsFixture);
     
      expect(await kingdomsContract.Builder()).to.equal(BuiAdd);
      expect(await kingdomsContract.resourceToken()).to.equal(ResAdd);
      expect(await resourceManagerContract.Kingdoms()).to.equal(KinAdd);
      expect(await resourceManagerContract.Resources()).to.equal(ResAdd);

    });

    it("Resource Manager should have created the right number of resource tokens", async function () {
      const { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd } = await loadFixture(deployContractsFixture);
     
      expect(await resourceContract.getTotalCollections()).to.equal("5")
    });

    it("Builder should have right number of resources", async function () {
      const { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd } = await loadFixture(deployContractsFixture);
     
      expect(await builderContract.getResourceCount()).to.equal("5")
    });

    it("Builder should have right number of buildings", async function () {
      const { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd } = await loadFixture(deployContractsFixture);
     
      expect(await builderContract.getBuildingCount()).to.equal("5")
    });


  });

  describe("Early User Actions", function () {
    
    it("Should let you create a new city", async function () {
      const { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd } = await loadFixture(deployContractsFixture);
      const cityName = 'First';
      await kingdomsContract.buildCity(cityName);
      const newCityId = await kingdomsContract.getOwnerCities(deployer.address);
      //console.log('city ids:', newCityId);
      const city = await kingdomsContract.cities(Number(newCityId[0]));
      //console.log("city:", city);
      expect(city.name).to.equal(cityName);
    });

    it("Should let you start building the capitol", async function () {
      const { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd } = await loadFixture(deployContractsFixture);
      const cityName = 'First';
      await kingdomsContract.buildCity(cityName);
      await resourceContract.setApprovalForAll(BuiAdd, true);
      const cityId = 0;
      const buildingId = 0;
      await builderContract.prepLevelUpBuilding(cityId, buildingId);
      const cityBuildingLevelsResult = await kingdomsContract.getCityBuildingsWithLevel(cityId);
      const cityBuildingLevels = cityBuildingLevelsResult.map(Number);
      //console.log('levels:', cityBuildingLevels);
      const timestamp = await time.latest();
      const timeCost = await builderContract.getNextLevelTimeRequirement(cityBuildingLevels, buildingId);
      // console.log('timestamp:', timestamp, 'timeCost:', timeCost)
      const queueTime = Number(timestamp) + Number(timeCost);
      const buildingQueue = await builderContract.buildingQueue(deployer.address, cityId, buildingId)
           
      expect(Number(buildingQueue)).to.equal(queueTime);
    });

    it("Should not let you complete building the capitol before build time completes", async function () {
      const { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd } = await loadFixture(deployContractsFixture);
      const cityName = 'First';
      await kingdomsContract.buildCity(cityName);
      await resourceContract.setApprovalForAll(BuiAdd, true);
      const cityId = 0;
      const buildingId = 0;
      await builderContract.prepLevelUpBuilding(cityId, buildingId);
      const cityBuildingLevelsResult = await kingdomsContract.getCityBuildingsWithLevel(cityId);
      const cityBuildingLevels = cityBuildingLevelsResult.map(Number);
      //console.log('levels:', cityBuildingLevels);
      const timestamp = await time.latest();
      const timeCost = await builderContract.getNextLevelTimeRequirement(cityBuildingLevels, buildingId);
      // console.log('timestamp:', timestamp, 'timeCost:', timeCost)
      const queueTime = Number(timestamp) + Number(timeCost);
      const buildingQueue = await builderContract.buildingQueue(deployer.address, cityId, buildingId)
           
      await expect(builderContract.completeLevelUpBuilding(cityId, buildingId)).to.be.revertedWith("Level up not ready");
    });

    it("Should let you complete building the capitol", async function () {
      const { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd } = await loadFixture(deployContractsFixture);
      const cityName = 'First';
      await kingdomsContract.buildCity(cityName);
      await resourceContract.setApprovalForAll(BuiAdd, true);
      const cityId = 0;
      const buildingId = 0;
      await builderContract.prepLevelUpBuilding(cityId, buildingId);
      const buildingQueue = await builderContract.buildingQueue(deployer.address, cityId, buildingId)
      
      await time.increaseTo(Number(buildingQueue));

      // const cityBuildingLevels = await kingdomsContract.getCityBuildingsWithLevel(cityId);
      // console.log('city length and levels: ', cityBuildingLevels.length, cityBuildingLevels.map(Number))

      await builderContract.completeLevelUpBuilding(cityId, buildingId);
      const newLevelsResult = await kingdomsContract.getCityBuildingsWithLevel(cityId);
      const newLevels = newLevelsResult.map(Number);

      expect(newLevels[0]).to.equal(1);
    });



  });

  
});
