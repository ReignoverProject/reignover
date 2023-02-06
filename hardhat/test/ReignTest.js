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
  
    // Create resources and buildings
    resourceTokens.forEach(async(token, i) => {
      await resourceManagerContract.createResourceToken(token.name, token.symbol);
    })
  
    //addBuilding(name, levelRequirements[], resourceRequirements[], maxLevel) create objects for these
    buildings.forEach(async(building) => {
      await builderContract.addBuilding(building.name, building.lvlReq, building.resReq, building.maxLvl);
    })
  
    // Setup reward pools
    rewardPools.forEach(async(pool) => {
      await resourceManagerContract.setRewardPool(pool.buildingId, pool.rewardToken, pool.baseReward);
    })

    //setup units
    // units.forEach(async(unit) => {
    //   await unitsContract.addUnit(unit.name, unit.reqBuilding, unit.maxUnits, unit.lvlReq, unit.timeCost, unit.resReq);
    // })
  
    // mint tokens to account
    await resourceContract.mint(deployer.address, 0, 10000)
    await resourceContract.mint(deployer.address, 1, 10000)
    await resourceContract.mint(deployer.address, 2, 10000)
    await resourceContract.mint(deployer.address, 3, 10000)
    await resourceContract.mint(deployer.address, 4, 10000)

    return { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, unitsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd };
  }

  describe("Setup", function () {
    it("Should set the right editors", async function () {
      const { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, unitsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd } = await loadFixture(deployContractsFixture);
     
      expect(await resourceContract.editor(ResManAdd)).to.equal(true);
      expect(await resourceContract.editor(deployer.address)).to.equal(true);
      expect(await resourceManagerContract.editor(BuiAdd)).to.equal(true);
      expect(await kingdomsContract.editor(BuiAdd)).to.equal(true);
      expect(await builderContract.editor(ResManAdd)).to.equal(true);
      expect(await builderContract.editor(deployer.address)).to.equal(true);
      expect(await unitsContract.editor(ResManAdd)).to.equal(true);

    });

    it("Should connect to each other correctly", async function () {
      const { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd } = await loadFixture(deployContractsFixture);
     
      expect(await kingdomsContract.Builder()).to.equal(BuiAdd);
      expect(await kingdomsContract.resourceToken()).to.equal(ResAdd);
      expect(await resourceManagerContract.Kingdoms()).to.equal(KinAdd);
      expect(await resourceManagerContract.Resources()).to.equal(ResAdd);
      expect(await resourceManagerContract.Builder()).to.equal(BuiAdd);

    });

    it("Resource Manager should have created the right number of resource tokens", async function () {
      const { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd } = await loadFixture(deployContractsFixture);
     
      expect(await resourceContract.getTotalCollections()).to.equal(resourceTokens.length)
    });

    it("Builder should have right number of resources", async function () {
      const { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd } = await loadFixture(deployContractsFixture);
     
      expect(await builderContract.getResourceCount()).to.equal(resourceTokens.length)
    });

    it("Builder should have right number of buildings", async function () {
      const { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, ResAdd, ResManAdd, BuiAdd, KinAdd } = await loadFixture(deployContractsFixture);
     
      expect(await builderContract.getBuildingCount()).to.equal(buildings.length)
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

  describe("Unit Manager Contract", () => {
    // fixture for unit manager testing
    async function setupUnitManagerFixture() {
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
    
      // Create resources and buildings
      resourceTokens.forEach(async(token, i) => {
        await resourceManagerContract.createResourceToken(token.name, token.symbol);
      })
    
      //addBuilding(name, levelRequirements[], resourceRequirements[], maxLevel) create objects for these
      buildings.forEach(async(building) => {
        await builderContract.addBuilding(building.name, building.lvlReq, building.resReq, building.maxLvl);
      })
    
      // Setup reward pools
      rewardPools.forEach(async(pool) => {
        await resourceManagerContract.setRewardPool(pool.buildingId, pool.rewardToken, pool.baseReward);
      })
  
      //setup units
      units.forEach(async(unit) => {
        await unitsContract.addUnit(unit.name, unit.reqBuilding, unit.maxUnits, unit.buildingLevelReq, unit.timeCost, unit.resourceReq);
        // console.log('added ', unit)
      })
    
      // mint tokens to account
      await resourceContract.mint(deployer.address, 0, 10000)
      await resourceContract.mint(deployer.address, 1, 10000)
      await resourceContract.mint(deployer.address, 2, 10000)
      await resourceContract.mint(deployer.address, 3, 10000)
      await resourceContract.mint(deployer.address, 4, 10000)

      // New city setup
      const cityName = 'First';
      await kingdomsContract.buildCity(cityName);
      await resourceContract.setApprovalForAll(BuiAdd, true);
      await resourceContract.setApprovalForAll(UnitAdd, true);
      const cityId = 0;
      const buildingId = 0;
      await builderContract.prepLevelUpBuilding(cityId, buildingId);
      const buildingQueue = await builderContract.buildingQueue(deployer.address, cityId, buildingId)
      await time.increaseTo(Number(buildingQueue));
      await builderContract.completeLevelUpBuilding(cityId, buildingId);
  
      return { deployer, user1, user2, resourceContract, resourceManagerContract, kingdomsContract, builderContract, unitsContract, UnitAdd, ResAdd, ResManAdd, BuiAdd, KinAdd };
    };

    it('Should have a list of units', async function() {
      const fixture = await loadFixture(setupUnitManagerFixture);

      const unitsCreated = await fixture.unitsContract.getUnits();
      const unitCount = await fixture.unitsContract.getUnitCount();

      expect(Number(unitCount)).to.equal(3);
      expect(unitsCreated[0].Name).to.equal(units[0].name);
    })

    it('Should let owner update a unit', async function() {
      const fixture = await loadFixture(setupUnitManagerFixture);
      await fixture.unitsContract.updateUnit(0, 'better warrior', units[0].reqBuilding, units[0].maxUnits, units[0].buildingLevelReq, units[0].timeCost, units[0].resourceReq);

      const warrior =  await fixture.unitsContract.units(0);
      expect(warrior.Name).to.equal('better warrior');

      // fails from non-owner
      await expect(fixture.unitsContract.connect(fixture.user1).updateUnit(0, 'better warrior', units[0].reqBuilding, units[0].maxUnits, units[0].buildingLevelReq, units[0].timeCost, units[0].resourceReq)).to.be.revertedWith("Ownable: caller is not the owner");

    })

    it('Should not let you build units without required buildings', async function() {
      const fixture = await loadFixture(setupUnitManagerFixture);

      await expect(fixture.unitsContract.startRecruitment(0, 0, 10)).to.be.revertedWith("Building level requirements not met");

    })

    it('Should let you build (start and complete recruitment) units', async function() {
      const fixture = await loadFixture(setupUnitManagerFixture);
      const cityId = 0;
      const buildingId = 5;
      await fixture.builderContract.prepLevelUpBuilding(cityId, buildingId);
      const buildingQueue = await fixture.builderContract.buildingQueue(fixture.deployer.address, cityId, buildingId)
      await time.increaseTo(Number(buildingQueue));
      await fixture.builderContract.completeLevelUpBuilding(cityId, buildingId);

      const unitId = 0;
      const unitQuantity = 10;
      // checks if another user can build units in your city
      await expect(fixture.unitsContract.connect(fixture.user1).startRecruitment(cityId, unitId, unitQuantity)).to.be.revertedWith('Not owner of city');
      await fixture.unitsContract.startRecruitment(cityId, unitId, unitQuantity);
      const unitTime = await fixture.unitsContract.unitQueueTime(cityId, buildingId);
      await time.increaseTo(Number(unitTime));
      await fixture.unitsContract.completeRecruitment(cityId, unitId);

      const myCityUnits = await fixture.kingdomsContract.getCityUnits(cityId);
      const myUnits = myCityUnits.map(Number);
      expect(myUnits[unitId]).to.equal(unitQuantity);

    });
    
  });

  
});
