// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

interface IResearch {
    function addResource(address _resourceAddress) external;
    function getResearchCount() external view returns(uint);
}