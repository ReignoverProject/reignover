export const unitManagerABI = [
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
          "indexed": true,
          "internalType": "uint256",
          "name": "cityId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "unitId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "CompleteRecruitment",
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
          "indexed": false,
          "internalType": "uint256",
          "name": "unitId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "completionTime",
          "type": "uint256"
        }
      ],
      "name": "StartRecruitment",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "unitId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "unitName",
          "type": "string"
        }
      ],
      "name": "UnitCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "unitId",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "Name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "RequiredBuilding",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "MaxUnits",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "BuildingLevelRequirement",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "TimeCost",
              "type": "uint256"
            },
            {
              "internalType": "uint256[]",
              "name": "ResourceRequirements",
              "type": "uint256[]"
            }
          ],
          "indexed": false,
          "internalType": "struct UnitManager.Unit",
          "name": "oldUnit",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "Name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "RequiredBuilding",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "MaxUnits",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "BuildingLevelRequirement",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "TimeCost",
              "type": "uint256"
            },
            {
              "internalType": "uint256[]",
              "name": "ResourceRequirements",
              "type": "uint256[]"
            }
          ],
          "indexed": false,
          "internalType": "struct UnitManager.Unit",
          "name": "updatedUnit",
          "type": "tuple"
        }
      ],
      "name": "UnitUpdated",
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
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_requiredBuilding",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxUnits",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_levelRequirement",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_timeCost",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "_resourceRequirements",
          "type": "uint256[]"
        }
      ],
      "name": "addUnit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_cityUnitLevels",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "_unitId",
          "type": "uint256"
        }
      ],
      "name": "checkUnitBuildingRequirementsMet",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_cityId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_unitId",
          "type": "uint256"
        }
      ],
      "name": "completeRecruitment",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_unitId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "getCostOfRecruitment",
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
          "internalType": "uint256",
          "name": "_unitId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
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
      "name": "getUnitCount",
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
      "name": "getUnits",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "Name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "RequiredBuilding",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "MaxUnits",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "BuildingLevelRequirement",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "TimeCost",
              "type": "uint256"
            },
            {
              "internalType": "uint256[]",
              "name": "ResourceRequirements",
              "type": "uint256[]"
            }
          ],
          "internalType": "struct UnitManager.Unit[]",
          "name": "",
          "type": "tuple[]"
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
          "internalType": "uint256",
          "name": "_cityId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_unitId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "startRecruitment",
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
    },
    {
      "inputs": [
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
      "name": "unitQueueAmount",
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
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "unitQueueTime",
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
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "units",
      "outputs": [
        {
          "internalType": "string",
          "name": "Name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "RequiredBuilding",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "MaxUnits",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "BuildingLevelRequirement",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "TimeCost",
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
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_requiredBuilding",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxUnits",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_levelRequirement",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_timeCost",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "_resourceRequirements",
          "type": "uint256[]"
        }
      ],
      "name": "updateUnit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]