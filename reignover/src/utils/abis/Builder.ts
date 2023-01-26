export const builderABI = [
  {
    "inputs": [
      {
        "internalType": "contract IKingdoms",
        "name": "_kingdom",
        "type": "address"
      },
      {
        "internalType": "contract IResourceManager",
        "name": "_resourceManager",
        "type": "address"
      },
      {
        "internalType": "contract IResourceToken",
        "name": "_resources",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "buildingId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "buildingName",
        "type": "string"
      }
    ],
    "name": "BuildingCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "cityId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "buildingId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newLevel",
        "type": "uint256"
      }
    ],
    "name": "CompleteBuildingUpgrade",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "buildingId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "levelRequirements",
        "type": "uint256[]"
      }
    ],
    "name": "NewBuildingLevelRequirements",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "buildingId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "maxLevel",
        "type": "uint256"
      }
    ],
    "name": "NewBuildingMaxLevel",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "buildingId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "newBuildingName",
        "type": "string"
      }
    ],
    "name": "NewBuildingName",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "buildingId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "resourceRequirements",
        "type": "uint256[]"
      }
    ],
    "name": "NewBuildingResourceRequirements",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "editor",
        "type": "address"
      }
    ],
    "name": "NewEditor",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "newContract",
        "type": "address"
      }
    ],
    "name": "NewKingdomsContract",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "editor",
        "type": "address"
      }
    ],
    "name": "RemovedEditor",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "cityId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "buildingId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "completionTime",
        "type": "uint256"
      }
    ],
    "name": "StartBuildingUpgrade",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "Kingdoms",
    "outputs": [
      {
        "internalType": "contract IKingdoms",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ResourceManager",
    "outputs": [
      {
        "internalType": "contract IResourceManager",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ResourceTokens",
    "outputs": [
      {
        "internalType": "contract IResourceToken",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint256[]",
        "name": "_levelRequirements",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_resourceRequirements",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "_maxLevel",
        "type": "uint256"
      }
    ],
    "name": "addBuilding",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_editor",
        "type": "address"
      }
    ],
    "name": "addEditor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "addResource",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "buildingIdToName",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "buildingQueue",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "_cityBuildingLevels",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "_buildingId",
        "type": "uint256"
      }
    ],
    "name": "checkBuildingRequirementsMet",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      },
      {
        "internalType": "bool[]",
        "name": "",
        "type": "bool[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_cityId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_buildingId",
        "type": "uint256"
      }
    ],
    "name": "completeLevelUpBuilding",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_editor",
        "type": "address"
      }
    ],
    "name": "deactivateEditor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_newid",
        "type": "uint256"
      }
    ],
    "name": "editResource",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "editor",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBuildingCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBuildings",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "_cityBuildingLevels",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "_buildingId",
        "type": "uint256"
      }
    ],
    "name": "getCostOfNextLevel",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "_cityBuildingLevels",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "_buildingId",
        "type": "uint256"
      }
    ],
    "name": "getNextLevelTimeRequirement",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getResourceCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_cityId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_buildingId",
        "type": "uint256"
      }
    ],
    "name": "prepLevelUpBuilding",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "resources",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_buildingId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxLevel",
        "type": "uint256"
      }
    ],
    "name": "setBuildingMaxLevel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_buildingId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_newName",
        "type": "string"
      }
    ],
    "name": "setBuildingName",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newContract",
        "type": "address"
      }
    ],
    "name": "setKingdomContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newContract",
        "type": "address"
      }
    ],
    "name": "setResourceManagerContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newContract",
        "type": "address"
      }
    ],
    "name": "setResourceTokenContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_buildingId",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "_requirements",
        "type": "uint256[]"
      }
    ],
    "name": "setbuildingLevelRequirements",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_buildingId",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "_requirements",
        "type": "uint256[]"
      }
    ],
    "name": "setbuildingResourceRequirements",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]