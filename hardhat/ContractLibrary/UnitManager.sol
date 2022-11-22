// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./libs/Editor.sol";
import "./interfaces/IKingdoms.sol";
import "./interfaces/IResourceToken.sol";
import "./interfaces/IResourceManager.sol";

// Unit manager builds troops for the city. Similar structure to builder contract.

contract UnitManager is Editor {
    IKingdoms public Kingdoms; // Kingdoms Contract
    IResourceManager public ResourceManager; // ResourceManager contract
    address[] public resources; // list of resource tokens
    uint256 unitCount; // count of active units
    mapping(uint256 => string) public unitIdToName; // may need to determine the best way to handle the units list
    mapping(uint256 => mapping(uint256 => uint256)) unitLevelRequirements; // maps units with required units + level
    mapping(uint256 => mapping(uint256 => uint256)) unitResourceRequirements; // base resources required to build
    mapping(uint256 => uint256) unitMaxLevel; // default to 100?
    // wallet > cityId > unitId > time until ready
    mapping(address => mapping(uint256 => mapping(uint256 => uint256)))
        public unitQueue;

    event NewUnitLevelRequirements(
        uint256 indexed unitId,
        uint256[] levelRequirements
    );
    event NewUnitResourceRequirements(
        uint256 indexed unitId,
        uint256[] resourceRequirements
    );
    event NewUnitMaxLevel(uint256 indexed unitId, uint256 maxLevel);
    event UnitCreated(uint256 unitId, string unitName);
    event NewUnitName(uint256 indexed unitId, string newUnitName);
    event NewKingdomsContract(address newContract);

    /** 
        @notice creates a new unit for cities
        @param _name is the name of the new unit
        @param _levelRequirements is array of unit's required unit levels, length should include unit we are adding
        @param _resourceRequirements is array of unit required resources, length should include unit we are adding, 18 decimals
        @param _maxLevel is max level unit can be built
        @dev params can be edited later on if needed
    */
    function addUnit(
        string memory _name,
        uint256[] memory _levelRequirements,
        uint256[] memory _resourceRequirements,
        uint256 _maxLevel
    ) external onlyOwner {
        unitIdToName[unitCount] = _name;
        emit UnitCreated(unitCount, _name);
        unitCount++;
        uint256 _unitId = unitCount - 1;
        _setunitLevelRequirements(_unitId, _levelRequirements);
        _setunitResourceRequirements(_unitId, _resourceRequirements);
        _setUnitMaxLevel(_unitId, _maxLevel);
    }

    /** @notice returns array of units */
    function getUnits() external view returns (string[] memory) {
        string[] memory unitList = new string[](unitCount);
        for (uint256 i = 0; i < unitCount; i++) {
            unitList[i] = unitIdToName[i];
        }
        return unitList;
    }

    function getUnitCount() external view returns (uint256) {
        return unitCount;
    }

    /** @notice owner can modify the level requirements of other units to be able to build a unit
        @dev can only use for units that already exist
    */
    function setunitLevelRequirements(
        uint256 _unitId,
        uint256[] memory _requirements
    ) public onlyOwner {
        require(_unitId < unitCount, "unit not active");
        _setunitLevelRequirements(_unitId, _requirements);
    }

    /** @notice internal function to set unit level requirements during creation
        @param _unitId unit to update
        @param _requirements array index is the unitID, index value is level required 
    */
    function _setunitLevelRequirements(
        uint256 _unitId,
        uint256[] memory _requirements
    ) internal {
        require(_requirements.length == unitCount, "array length mismatch");
        require(_requirements[_unitId] == 0, "cannot require self");
        for (uint256 i = 0; i < unitCount; i++) {
            unitLevelRequirements[_unitId][i] = _requirements[i];
        }
        emit NewUnitLevelRequirements(_unitId, _requirements);
    }

    /** @notice owner can modify the resource requirements of units
        @param _requirements remember 18 decimals for token amount
        @dev can only use for units that already exist
    */
    function setunitResourceRequirements(
        uint256 _unitId,
        uint256[] memory _requirements
    ) public onlyOwner {
        require(_unitId < unitCount, "unit not active");
        _setunitResourceRequirements(_unitId, _requirements);
    }

    /** @notice internal function to set unit resource requirements during creation
        @param _unitId unit to update
        @param _requirements array index is the resource, index value is amount required 
    */
    function _setunitResourceRequirements(
        uint256 _unitId,
        uint256[] memory _requirements
    ) internal {
        require(
            _requirements.length == resources.length,
            "array length mismatch"
        );
        require(_requirements[0] == 0, "cannot require base token");
        for (uint256 i = 0; i < resources.length; i++) {
            unitResourceRequirements[_unitId][i] = _requirements[i];
        }
        emit NewUnitResourceRequirements(_unitId, _requirements);
    }

    function setUnitMaxLevel(uint256 _unitId, uint256 _maxLevel)
        external
        onlyOwner
    {
        _setUnitMaxLevel(_unitId, _maxLevel);
    }

    /** @notice sets max level for a unit */
    function _setUnitMaxLevel(uint256 _unitId, uint256 _maxLevel) internal {
        unitMaxLevel[_unitId] = _maxLevel;
        emit NewUnitMaxLevel(_unitId, _maxLevel);
    }

    function setUnitName(uint256 _unitId, string memory _newName)
        external
        onlyOwner
    {
        unitIdToName[_unitId] = _newName;
        emit NewUnitName(_unitId, _newName);
    }

    /** @notice used by resource manager when creating a new resource token
        @dev preservation of order of resources is critically important  
    */
    function addResource(address _resourceAddress) external onlyEditor {
        resources.push(_resourceAddress);
    }

    /** @notice only to be used if a token needs to be replaced */
    function editResource(uint256 _id, address _newAddress) external onlyOwner {
        resources[_id] = _newAddress;
    }

    function getResourceCount() external view returns (uint256) {
        return resources.length;
    }

    /** @notice starts unit the next level of a unit if all requirements met
        @dev pulls unit data from Kingdoms contract
    */
    function prepLevelUpUnit(uint256 _cityId, uint256 _unitId) external {
        require(
            Kingdoms.getCityOwner(_cityId) == msg.sender,
            "Not owner of city"
        );
        require(
            unitQueue[msg.sender][_cityId][_unitId] == 0,
            "Unit in progress"
        );
        uint256[] memory cityUnitLevels = Kingdoms.getCityUnitsWithLevel(
            _cityId
        );
        (bool canBuild, ) = checkUnitRequirementsMet(cityUnitLevels, _unitId);
        require(canBuild, "Unit level requirements not met");
        uint256[] memory resourceCost = getCostOfNextLevel(
            cityUnitLevels,
            _unitId
        );
        for (uint256 i = 0; i < resources.length; i++) {
            if (resourceCost[i] > 0) {
                IResourceToken(resources[i]).burnFrom(
                    msg.sender,
                    resourceCost[i]
                );
            }
        }
        uint256 timeCost = getNextLevelTimeRequirement(cityUnitLevels, _unitId);
        unitQueue[msg.sender][_cityId][_unitId] = block.timestamp + timeCost;
    }

    /** @notice levels up the unit, collects resources for that city and updates the level in the resource manager */
    function completeLevelUpUnit(uint256 _cityId, uint256 _unitId) external {
        require(
            Kingdoms.getCityOwner(_cityId) == msg.sender,
            "Not owner of city"
        );
        require(
            unitQueue[msg.sender][_cityId][_unitId] > 0 &&
                unitQueue[msg.sender][_cityId][_unitId] < block.timestamp,
            "Level up not ready"
        );
        ResourceManager.claimCityResources(_cityId);
        uint256[] memory cityUnitLevels = Kingdoms.getCityUnitsWithLevel(
            _cityId
        );
        uint256 newLevel = cityUnitLevels[_unitId] + 1;
        Kingdoms.updateUnit(_cityId, _unitId, newLevel);
        unitQueue[msg.sender][_cityId][_unitId] = 0;
        ResourceManager.setUnitLevel(_cityId, _unitId);
    }

    // Next three functions help calculate for unit the next level unit. They all have the same issue where a user could put in any info externally and get the wrong result
    // This isn't an issue for the levelup function. Can be fixed by created separate internal and external functions, where external pulls unit levels
    /** @notice checks to see if buliding can be built 
        @param _cityUnitLevels array of unit levels to compare to requirements
        @return first bool is overall check, second array shows individual requirement check
        @dev The check can be manipulated by a user, but this is of no consequence
    */
    function checkUnitRequirementsMet(
        uint256[] memory _cityUnitLevels,
        uint256 _unitId
    ) public view returns (bool, bool[] memory) {
        bool canBuild = true;
        bool[] memory levelRequirementMet = new bool[](unitCount);
        for (uint256 i = 0; i < unitCount; i++) {
            if (_cityUnitLevels[i] >= unitLevelRequirements[_unitId][i]) {
                levelRequirementMet[i] = true;
            }
        }
        for (uint256 j = 0; j < unitCount; j++) {
            if (levelRequirementMet[j] == false) {
                canBuild = false;
            }
        }
        return (canBuild, levelRequirementMet);
    }

    /** @notice returns resource cost of a unit's next level
        @dev just like buliding requirements check, can be manipulated, but doesn't affect level up function */
    function getCostOfNextLevel(
        uint256[] memory _cityUnitLevels,
        uint256 _unitId
    ) public view returns (uint256[] memory) {
        uint256[] memory resourceCost = new uint256[](resources.length);
        for (uint256 i = 0; i < resources.length; i++) {
            resourceCost[i] =
                unitResourceRequirements[_unitId][i] *
                ((_cityUnitLevels[_unitId] + 1)**2);
        }
        return resourceCost;
    }

    /** @notice calculates the time (in seconds) to build the next level 
        @dev same miscalculation possible from external use*/
    function getNextLevelTimeRequirement(
        uint256[] memory _cityUnitLevels,
        uint256 _unitId
    ) public view returns (uint256) {
        uint256[] memory resourceCost = getCostOfNextLevel(
            _cityUnitLevels,
            _unitId
        );
        uint256 timeCost;
        for (uint256 i = 0; i < resources.length; i++) {
            timeCost += resourceCost[i] * i;
        }
        return timeCost;
    }

    function setKingdomContract(address _newContract) external onlyOwner {
        Kingdoms = IKingdoms(_newContract);
        emit NewKingdomsContract(_newContract);
    }

    function setResourceManagerContract(address _newContract)
        external
        onlyOwner
    {
        ResourceManager = IResourceManager(_newContract);
    }
}
