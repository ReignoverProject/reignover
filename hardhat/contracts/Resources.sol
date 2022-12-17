// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "./libs/Editor.sol";

// add some function to manage subscriptions?
// some func to get ownerOf for each ID - create specific ID for individual tokens in collection
// recieve function

contract VolumeNFTManager is ERC1155URIStorage, Editor {
    constructor()
        ERC1155("Reignover Token")
    { }

    mapping(uint256 => string) public name; // token name
    mapping(uint256 => string) public symbol; // token symbol
    uint256 counter; // used to increment token ID

    mapping(uint256 => uint256) internal maxTokenSupply; // max supply for each token
    mapping(uint256 => uint256) internal supply; // current supply of token

    // should be same indexed value as transferSingle event
    event CollectionCreated(
        uint256 indexed id,
        string name,
        string symbol,
        uint256 maxSupply,
        string uri
    );

    /**
     * @dev allows a user to purchase and mint tokens of a collection. msg.value must equal the purchase price * amount being minted
     * @param _to is where the minted tokens are being sent
     * @param _id is the id of the collection selected
     * @param _amount is how many tokens of the collected are being minted
     */
    function mint(
        address _to,
        uint256 _id,
        uint256 _amount
    ) external onlyEditor {
        require(maxTokenSupply[_id] > 0, "Collection does not exist");
        if (maxTokenSupply[_id] < 999999) {
            require(
                supply[_id] + _amount <= maxTokenSupply[_id],
                "Cannot create more than max supply"
            );
        }
        supply[_id] += _amount;
        _mint(_to, _id, _amount, bytes(""));
    }

    /**
     * @dev creates a token that can later be minted
     * @param _maxSupply sets how many can be minted, 999999 is unlimited
     * @param _uri sets the metadata for the all the tokens of the collection id, should be ipfs link
     * @return id of collection created
     */
    function createCollection(
        uint256 _maxSupply,
        string memory _uri,
        string memory _name,
        string memory _symbol
    ) external onlyEditor returns(uint256) {
        require(_maxSupply > 0, "Collection must have at least 1 token");
        maxTokenSupply[counter] = _maxSupply;
        _setURI(counter, _uri);
        emit CollectionCreated(counter, _name, _symbol, _maxSupply, _uri);
        counter++;
        return counter-1;
    }

    /**
     * @dev checks if a token can be minted. Needed for integration with Paper services
     * note: probably won't be used in this contract, but another that interfaces with this mint fn
     */
    // function checkEligibleMint(uint256 _id, uint256 _amount)
    //     external
    //     view
    //     returns (string memory)
    // {
    //     if (maxTokenSupply[_id] == 0) return "Collection does not exist";
    //     if (supply[_id] + _amount > maxTokenSupply[_id])
    //         return "Cannot create more than max supply";
    //     return "";
    // }

    // Informational Functions - 
    /**
     * @dev Returns the total quantity for a token ID
     * @param _id uint256 ID of the token to query
     * @return amount of token in existence
     */
    function totalSupply(uint256 _id) external view returns (uint256) {
        return supply[_id];
    }

    /**
     * @dev Returns true if a token has been created
     * @param _id uint256 ID of the token to query
     * @return boolean of token existence
     */
    function tokenExists(uint256 _id) external view returns (bool) {
        return maxTokenSupply[_id] > 0;
    }

    /**
     * @dev Returns the max quantity for a token ID
     * @param _id uint256 ID of the token to query
     * @return value of max token supply
     */
    function maxSupply(uint256 _id) external view returns (uint256) {
        return maxTokenSupply[_id];
    }

    /**
     * Counter is always set to the id of the next collection to be created and starts at 0
     */
    function getTotalCollections() external view returns (uint256) {
        return counter;
    }

}
