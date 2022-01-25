// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Multisend is Initializable, OwnableUpgradeable {
    using StringsUpgradeable for uint256;

    ///@notice initialize
    function initialize() external initializer {
        __Ownable_init();
    }

    struct Balance {
        address receipt;
        uint256 value;
    }

    function sendEther(Balance[] calldata balances) external payable onlyOwner {
        for (uint256 i = 0; i < balances.length; i++) {
            Balance memory balance = balances[i];
            payable(balance.receipt).transfer(balance.value);
        }
    }
}
