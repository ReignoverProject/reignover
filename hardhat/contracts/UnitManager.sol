// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./libs/Editor.sol";
import "./interfaces/IKingdoms.sol";
import "./interfaces/IResourceToken.sol";
import "./interfaces/IResourceManager.sol";

// Unit manager builds troops for the city. Similar structure to builder contract.

contract UnitManager is Editor {
    
    constructor (
        IKingdoms _kingdom,
        IResourceManager _resourceManager,
        IResourceToken _resources
    ) {
        Kingdoms = _kingdom;
        ResourceManager = _resourceManager;
        ResourceTokens = _resources;
    }

    IKingdoms public Kingdoms; // Kingdoms Contract
    IResourceManager public ResourceManager; // ResourceManager contract
    IResourceToken public ResourceTokens; // Resources Contract
    uint[] public resources; // list of resource tokens
    uint256 unitCount; // count of active units

    struct Unit {
        string Name;
        uint RequiredBuilding;
        uint MaxUnits;
        uint BuildingLevelRequirement;
        uint TimeCost;
        uint[] ResourceRequirements;

    }

    Unit[] public units;

    // cityId > buildingId > time until ready
    mapping(uint256 => mapping(uint256 => uint256)) public unitQueueTime;
    // cityId > buildingId > amount
    mapping(uint256 => mapping(uint256 => uint256)) public unitQueueAmount;

    event NewUnitBuildingLevelRequirements(
        uint256 indexed unitId,
        uint256 levelRequirement
    );
    event NewUnitResourceRequirements(
        uint256 indexed unitId,
        uint256[] resourceRequirements
    );
    event NewUnitMax(uint256 indexed unitId, uint256 maxUnits);
    event UnitCreated(uint256 unitId, string unitName);
    event NewUnitName(uint256 indexed unitId, string newUnitName);
    event NewKingdomsContract(address newContract);
    event StartRecruitment(uint256 indexed cityId, uint256 unitId, uint256 completionTime);
    event CompleteRecruitment(uint256 indexed cityId, uint256 unitId, uint256 amount);

    /** 
        @notice creates a new unit for cities
        @param _name is the name of the new unit
        @param _levelRequirement is array of unit's required unit levels, length should include unit we are adding
        @param _resourceRequirements is array of unit required resources, length should include unit we are adding, 18 decimals
        @param _maxUnits is max number of units that can be built
        @dev params can be edited later on if needed
    */
    function addUnit(
        string memory _name,
        uint requiredBuilding, 
        uint256 _maxUnits,
        uint256 _levelRequirement,
        uint _timeCost,
        uint256[] memory _resourceRequirements
    ) external onlyOwner {
        units.push(Unit(_name, requiredBuilding, _maxUnits, _levelRequirement, _timeCost, _resourceRequirements));
        emit UnitCreated(unitCount, _name);
        unitCount++;
    }

    /** @notice returns array of units */
    function getUnits() external view returns (Unit[] memory) {
        return units;
    }

    function getUnitCount() external view returns (uint256) {
        return unitCount;
    }

    /** @notice owner can modify the level requirements of other units to be able to build a unit
        @dev can only use for units that already exist
    */
    function setUnitBuildingLevelRequirements(
        uint256 _unitId,
        uint256 _requirement
    ) public onlyOwner {
        require(_unitId < unitCount, "unit not active");
        _setUnitBuildingLevelRequirements(_unitId, _requirement);
    }

    /** @notice internal function to set unit level requirements during creation
        @param _unitId unit to update
        @param _requirement array index is the unitID, index value is level required 
    */
    function _setUnitBuildingLevelRequirements(
        uint256 _unitId,
        uint256 _requirement
    ) internal {
        units[_unitId].BuildingLevelRequirement = _requirement;
        emit NewUnitBuildingLevelRequirements(_unitId, _requirement);
    }

    /** @notice owner can modify the resource requirements of units
        @param _requirements remember 9 decimals for token amount
        @dev can only use for units that already exist
    */
    function setUnitResourceRequirements(
        uint256 _unitId,
        uint256[] memory _requirements
    ) public onlyOwner {
        require(_unitId < unitCount, "unit not active");
        _setUnitResourceRequirements(_unitId, _requirements);
    }

    /** @notice internal function to set unit resource requirements during creation
        @param _unitId unit to update
        @param _requirements array index is the resource, index value is amount required 
    */
    function _setUnitResourceRequirements(
        uint256 _unitId,
        uint256[] memory _requirements
    ) internal {
        require(
            _requirements.length == resources.length,
            "array length mismatch"
        );
        require(_requirements[0] == 0, "cannot require base token");
        for (uint256 i = 0; i < resources.length; i++) {
            units[_unitId].ResourceRequirements[i] = _requirements[i];
        }
        emit NewUnitResourceRequirements(_unitId, _requirements);
    }

    function setMaxUnits(uint256 _unitId, uint256 _maxUnits)
        external
        onlyOwner
    {
        _setUnitMax(_unitId, _maxUnits);
    }

    /** @notice sets max level for a unit */
    function _setUnitMax(uint256 _unitId, uint256 _maxUnits) internal {
        units[_unitId].MaxUnits = _maxUnits;
        emit NewUnitMax(_unitId, _maxUnits);
    }

    function setUnitName(uint256 _unitId, string memory _newName)
        external
        onlyOwner
    {
        units[_unitId].Name = _newName;
        emit NewUnitName(_unitId, _newName);
    }

    /** @notice used by resource manager when creating a new resource token
        @dev preservation of order of resources is critically important  
    */
    function addResource(uint _id) external onlyEditor {
        resources.push(_id);
    }

    /** @notice only to be used if a token needs to be replaced */
    function editResource(uint _index, uint _newid) external onlyOwner {
        resources[_index] = _newid;
    }

    /** @notice starts unit the next level of a unit if all requirements met
        @dev pulls building data from Kingdoms contract
    */
    function startRecruitment(uint256 _cityId, uint256 _unitId, uint256 _amount) external {
        require(Kingdoms.getCityOwner(_cityId) == msg.sender, "Not owner of city");
        require(unitQueueTime[_cityId][units[_unitId].RequiredBuilding] == 0, "Recruiting in progress");
        uint[] memory cityBuildingLevels = Kingdoms.getCityBuildingsWithLevel(_cityId);
        require(checkUnitBuildingRequirementsMet(cityBuildingLevels, _unitId), "Building level requirements not met");
        uint[] memory resourceCost = getCostOfRecruitment(_unitId, _amount);
        for (uint i = 0; i < resources.length; i++) {
            if (resourceCost[i] > 0) {
                // batch transfer this
                ResourceTokens.safeTransferFrom(msg.sender, address(0xdead), resources[i], resourceCost[i], bytes(""));
            }
        }
        unitQueueTime[_cityId][units[_unitId].RequiredBuilding] = block.timestamp + (units[_unitId].TimeCost * _amount);
        unitQueueAmount[_cityId][units[_unitId].RequiredBuilding] = _amount;
        emit StartRecruitment(_cityId, _unitId, unitQueueTime[_cityId][_unitId]);
    }

    /** @notice updates amount of unit in kingdoms contract */
    function completeRecruitment(uint256 _cityId, uint256 _unitId) external {
        require(
            Kingdoms.getCityOwner(_cityId) == msg.sender,
            "Not owner of city"
        );
        require(
            unitQueueTime[_cityId][_unitId] > 0 &&
                unitQueueTime[_cityId][_unitId] < block.timestamp,
            "Level up not ready"
        );
        uint quantity = unitQueueAmount[_cityId][units[_unitId].RequiredBuilding];
        unitQueueTime[_cityId][units[_unitId].RequiredBuilding] = 0;
        unitQueueAmount[_cityId][units[_unitId].RequiredBuilding] = 0;
        Kingdoms.updateUnit(_cityId, _unitId, quantity, true);
        emit CompleteRecruitment(_cityId, _unitId, quantity);
    }

    // Next three functions help calculate for unit the next level unit. They all have the same issue where a user could put in any info externally and get the wrong result
    // This isn't an issue for the levelup function. Can be fixed by created separate internal and external functions, where external pulls unit levels
    /** @notice checks to see if buliding can be built 
        @param _cityUnitLevels array of unit levels to compare to requirements
        @return if building level is met
        @dev The check can be manipulated by a user, but that shouldn't have negative effects
    */
    function checkUnitBuildingRequirementsMet(uint256[] memory _cityUnitLevels, uint256 _unitId) public view returns (bool) {
        return _cityUnitLevels[units[_unitId].RequiredBuilding] >= units[_unitId].BuildingLevelRequirement;
    }

    /** @notice returns resource cost of recruiting units */
    function getCostOfRecruitment(
        uint256 _unitId,
        uint256 _amount
    ) public view returns (uint256[] memory) {
        uint256[] memory resourceCost = new uint256[](resources.length);
        for (uint256 i = 0; i < resources.length; i++) {
            resourceCost[i] = units[_unitId].ResourceRequirements[i] * _amount;
        }
        return resourceCost;
    }

    /** @notice calculates the time (in seconds) to build the next level */
    function getNextLevelTimeRequirement(uint256 _unitId, uint256 _amount) public view returns (uint256) {
        return units[_unitId].TimeCost * _amount;
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
