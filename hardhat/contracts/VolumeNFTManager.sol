// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// add some function to manage subscriptions?
// some func to get ownerOf for each ID - create specific ID for individual tokens in collection
// recieve function

contract VolumeNFTManager is ERC1155URIStorage, Ownable {
    constructor(string memory _name, string memory _symbol)
        ERC1155("Check out live streams and music collectibles on Volume.com!")
    {
        name = _name;
        symbol = _symbol;
        serviceFee = 1000;
        // testnet 0xe9A7cb72ce0Cab7B53601C75037dEEAF270F2aa4, remix 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
        serviceManager = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2; // set this to correct address before deployment
    }

    string public name; // general standard
    string public symbol; // general standard
    uint256 counter; // used to increment token ID
    address serviceManager; // address of manager's wallet
    uint256 serviceFee; // % with divisor of 10,000

    mapping(uint256 => uint256) internal maxTokenSupply; // max supply for each token
    mapping(uint256 => uint256) internal supply; // current supply of token
    mapping(uint256 => address) internal creator; // creator address for collection
    mapping(uint256 => uint256) internal tokenPrice; // price to mint a token
    mapping(uint256 => mapping(uint256 => address)) internal tokenOwner; // collectionID > subTokenID > owner address

    // should be same indexed value as transferSingle event
    event CollectionCreated(
        uint256 indexed id,
        uint256 maxSupply,
        string uri,
        uint256 price,
        address indexed creator
    );
    event NewServiceManager(address newManager);
    event NewServiceFee(uint256 newFee);

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
    ) external payable {
        require(maxTokenSupply[_id] > 0, "Collection does not exist");
        require(
            supply[_id] + _amount <= maxTokenSupply[_id],
            "Cannot create more than max supply"
        );
        require(msg.value == tokenPrice[_id] * _amount, "Price mismatch");
        _mint(_to, _id, _amount, bytes(""));
        for (uint256 i = supply[_id]; i < _amount; i++) {
            tokenOwner[_id][i] = _to;
        }
        supply[_id] += _amount;
        _handleFees(_id, msg.value);
    }

    /**
     * @dev creates a token that can later be minted
     * @param _maxSupply sets how many can be minted
     * @param _uri sets the metadata for the all the tokens of the collection id, should be ipfs link
     * @param _price sets the cost to mint one token
     */
    function createCollection(
        uint256 _maxSupply,
        string memory _uri,
        uint256 _price,
        address _creator
    ) external {
        require(_maxSupply > 0, "Collection must have at least 1 token");
        maxTokenSupply[counter] = _maxSupply;
        _setURI(counter, _uri);
        tokenPrice[counter] = _price;
        creator[counter] = _creator;
        emit CollectionCreated(counter, _maxSupply, _uri, _price, _creator);
        counter++;
    }

    /**
     * @dev Tranfer function to include sub IDs of tokens in collections.
     * Follows the same patterns as safeTransferFrom, just adds mapping of tokenOwner.
     * Balance/Approval checks are based on the quantity of the collection, not individual tokens.
     */
    function transferFrom(
        address from,
        address to,
        uint256 collectionId,
        uint256 tokenId,
        bytes memory data
    ) public {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not token owner nor approved"
        );
        _safeTransferFrom(from, to, collectionId, 1, data);
        tokenOwner[collectionId][tokenId] = to;
    }

    /**
     * @dev this function is replaced with above 'transferFrom'
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 collectionId,
        uint256 amount,
        bytes memory data
    ) public override {
        bool notAllowed = true;
        require(!notAllowed, "this transfer not allowed");
    }

    // @dev disables batch transfer - not wanted for use case
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override {
        bool notAllowed = true;
        require(!notAllowed, "batch transfer not allowed");
    }

    /**
     * @dev checks if a token can be minted. Needed for integration with Paper services
     */
    function checkEligibleMint(uint256 _id, uint256 _amount)
        external
        view
        returns (string memory)
    {
        if (maxTokenSupply[_id] == 0) return "Collection does not exist";
        if (supply[_id] + _amount > maxTokenSupply[_id])
            return "Cannot create more than max supply";
        return "";
    }

    /**
     * @dev checks if a collection can be created. Needed for integration with Paper services
     */
    function checkEligibleCreation() external pure returns (string memory) {
        return "";
    }

    /**
     * @dev internal function to split and send minting fees to appropriate addresses
     * @param _id is the id of the collection, used to get creator address
     * @param _fee is the msg.value sent with mint()
     */
    function _handleFees(uint256 _id, uint256 _fee) internal {
        address owner = creator[_id];
        uint256 feeAmount = (_fee * serviceFee) / 10000;
        uint256 ownerFee = _fee - feeAmount;
        payable(serviceManager).transfer(feeAmount);
        payable(owner).transfer(ownerFee);
    }

    // Owner Settings
    /// @dev allows contract owner to change recipient of service fees
    function setServiceManager(address _newManager) external onlyOwner {
        serviceManager = _newManager;
        emit NewServiceManager(_newManager);
    }

    /** @dev allows contract owner to change the service fee
     * @param _newFee can be set to 0 for no fee, up to 1000 for a 10% fee. (ex. 150 is 1.5%, 666 is 6.66%)
     */
    function setServiceFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot be greater than 10%");
        serviceFee = _newFee;
        emit NewServiceFee(_newFee);
    }

    // Informational Functions - should
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
        return creator[_id] != address(0);
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
     * @dev Returns the creator of a token
     * @param _id uint256 ID of the token to query
     * @return address of token creator
     */
    function collectionCreator(uint256 _id) external view returns (address) {
        return creator[_id];
    }

    /**
     * @dev Returns the cost of minting a token
     * @param _id uint256 ID of the token to query
     * @return value of token price
     */
    function collectionPrice(uint256 _id) external view returns (uint256) {
        return tokenPrice[_id];
    }

    function getTotalCollections() external view returns (uint256) {
        return counter;
    }

    function getTokenOwner(uint256 _collectionId, uint256 _tokenId)
        external
        view
        returns (address)
    {
        return tokenOwner[_collectionId][_tokenId];
    }
}
