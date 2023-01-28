export const kingdomAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const builderAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
export const resourceManagerAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
export const resourcesAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const resourceTokens = [
    {
      name: "Reignover Gold",
      symbol: "rGold",
      icon: '/images/resources/treasure.png',
    },
    {
      name: "Reignover Wood",
      symbol: "rWood",
      icon: '/images/resources/treeSmall.png',
    },
    {
      name: "Reignover Stone",
      symbol: "rStone",
      icon: '/images/resources/stoneSmall.png',
    },
    {
      name: "Reignover Iron",
      symbol: "rIron",
      icon: '/images/resources/ironBar.png',
    },
    {
      name: "Reignover Food",
      symbol: "rFood",
      icon: '/images/resources/grain.png',
    },
  ];
  
export const buildings = [
  {
    name: "Capitol",
    lvlReq: [0],
    resReq: [0, 100, 100, 0, 0],
    maxLvl: 100,
    description: "The Capitol is your seat of power and is required to expand the city.",
    icon: '/images/buildings/capitol.png',
  },
  {
    name: "Forester Hut",
    lvlReq: [1, 0],
    resReq: [0, 100, 0, 0, 0],
    maxLvl: 100,
    description: "Generate wood for the city.",
    icon: '/images/buildings/forester.png',
  },
  {
    name: "Stone Quarry",
    lvlReq: [1,1,0],
    resReq: [0, 100, 60, 0, 0],
    maxLvl: 100,
    description: "Generates stone for the city.",
    icon: '/images/buildings/quarry.png',
  },
  {
    name: "Iron Mine",
    lvlReq: [1,1,1,0],
    resReq: [0, 100, 60, 60, 0],
    maxLvl: 100,
    description: "Generates iron for the city.",
    icon: '/images/buildings/ironMine.png',
  },
  {
    name: "Farm",
    lvlReq: [1,1,1,1,0],
    resReq: [0, 100, 60, 60, 60],
    maxLvl: 100,
    description: "Generates food for the city.",
    icon: '/images/buildings/farm.png',  
  },
];

