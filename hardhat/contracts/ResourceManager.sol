// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Resources.sol";
import "./libs/Editor.sol";
import "./interfaces/IKingdoms.sol";
import "./interfaces/IResourceToken.sol"; 


// Setup: set Builder as editor of this contract, this contract also needs to be an editor of Builder
// - set Resources, Kingdoms contracts

interface IBuilder {
    function addResource(uint _id) external;
}

contract ResourceManager is Editor {

    uint[] public resourceTokens;
    IKingdoms public Kingdoms;
    IResourceToken public Resources;
    IBuilder public Builder;
    
    struct RewardPool {
        uint buildingId;
        uint rewardToken;
        uint baseReward; // set to .001 (10**15)
    }

    mapping(uint => RewardPool) public buildingToRewardPool; // get reward token of building
    mapping(uint => mapping(uint => uint)) cityBuildingLastClaim; // timestamp for the last time rewards were claimed for a building
    mapping(uint => mapping(uint => uint)) cityBuildingLevel; // records the building level for current reward cycle

    event UpdatedBuildingPool(uint buildingId, uint rewardToken, uint baseReward);
    event NewResource(uint id, string name);

    /** @notice creates a new ERC1155 resource token */
    function createResourceToken(string memory _name, string memory _symbol) external onlyOwner {
        uint id = Resources.createCollection(999999, "Reignover Project", _name, _symbol);
        resourceTokens.push(id);
        Builder.addResource(id);
        emit NewResource(id, _name);
    }

    /** @notice sets the Kingdoms contract */
    function setKingdoms(address _kingdoms) external onlyOwner {
        Kingdoms = IKingdoms(_kingdoms);
    }

    /** @notice sets the Resources contract */
    function setResources(address _newContract) external onlyOwner {
        Resources = IResourceToken(_newContract);
    }

    /** @notice sets the Builder contract */
    function setBuilder(address _newContract) external onlyOwner {
        Builder = IBuilder(_newContract);
    }

    // The next section manages the minting of tokens over time to cities depending on their building levels
    // This is similar to a standard farm contract, but instead of getting more rewards based on tokens staked, it's based on level of the building
    // When an appropriate building is created, it sets the reward start timestamp
    // Cities can change ownership, so rewards are city-owner agnostic in the way that they do not reset when ownership is changed

    /** @notice create a reward pool for a building, buildings only have one pool
        @param _baseReward base amount of tokens (no decimals), set to 0 to turn off 
        @param _rewardtoken is id of resource token in the ERC1155 contract
    */
    function setRewardPool(uint _buildingId, uint _rewardtoken, uint _baseReward) external onlyOwner {
        buildingToRewardPool[_buildingId].buildingId = _buildingId;
        buildingToRewardPool[_buildingId].rewardToken = _rewardtoken;
        buildingToRewardPool[_buildingId].baseReward = _baseReward;
        emit UpdatedBuildingPool(_buildingId, _rewardtoken, _baseReward);
    }

    /** @notice function for starting the rewards timer of a building
        @dev comes from Builder contract upon completing a building level up */
    function updateLastClaimTime(uint _cityId, uint _buildingId) external onlyEditor {
        cityBuildingLastClaim[_cityId][_buildingId] = block.timestamp;
    }

    /**
     * Function that updates building levels. Usually used by Builder contract when leveling up a building
     */
    function setBuildingLevel(uint _cityId, uint _buildingId) external onlyEditor {
        uint[] memory cityBuildingLevels = Kingdoms.getCityBuildingsWithLevel(_cityId);
        cityBuildingLevel[_cityId][_buildingId] = cityBuildingLevels[_buildingId];
    }

    /** @notice mints built-up resources to city owner 
     * note think about turning this into batch mint of some sort
    */
    function _claimCityResources(uint _cityId) internal {
        address cityOwner = Kingdoms.getCityOwner(_cityId);
        // do we care if non-city-owner calls this function?
        // require(msg.sender == cityOwner, "Must own city to claim"); 
        uint[] memory pendingRewards = getPendingCityRewards(_cityId);
        for(uint i = 0; i < pendingRewards.length; i++) {
            cityBuildingLastClaim[_cityId][i] = block.timestamp;
            if(pendingRewards[i] > 0) {
                Resources.mint(cityOwner, buildingToRewardPool[i].rewardToken, pendingRewards[i]);
            }
        }
    }

    /** @notice user function to claim one city's pending resources */
    function claimCityResources(uint _cityId) external {
        _claimCityResources(_cityId);
    }

    /** @notice returns an array of pending resources for each building of a city */
    function getPendingCityRewards(uint _cityId) public view returns(uint[] memory) {
        uint[] memory cityBuildingLevels = Kingdoms.getCityBuildingsWithLevel(_cityId);
        uint[] memory pendingResources = new uint[](cityBuildingLevels.length);
        for(uint i = 0; i < cityBuildingLevels.length; i++) {
            pendingResources[i] = 
                ((cityBuildingLevels[i]**2) * buildingToRewardPool[i].baseReward * (block.timestamp - cityBuildingLastClaim[_cityId][i]) / 60);
        }
        return pendingResources;
    }
}