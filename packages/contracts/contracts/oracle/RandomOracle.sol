// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract RandomOracle is Initializable, OwnableUpgradeable {
    mapping(uint256 => uint8) public types;

    ///@notice initialize
    function initialize() external initializer {
        __Ownable_init();
    }

    function addTypes(uint256[] calldata keys, uint8[] calldata values) external onlyOwner {
        require(keys.length == values.length, "RandomOracle: keys.length != values.length");

        for (uint256 i = 0; i < keys.length; i++) {
            types[keys[i]] = values[i];
        }
    }

    function randomTypes(uint256 seeds) external view returns(uint8) {
        return types[seeds];
    }
}
