// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

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

    struct ERC721Data {
        address receipt;
        uint256 tokenId;
    }

    function sendEther(Balance[] calldata balances) external payable onlyOwner {
        for (uint256 i = 0; i < balances.length; i++) {
            Balance memory balance = balances[i];
            payable(balance.receipt).transfer(balance.value);
        }
    }

    function transferErc721(address addr, address owner, ERC721Data[] calldata data) external onlyOwner {
        for (uint256 i = 0; i < data.length; i++) {
            ERC721Data memory d = data[i];
            ERC721Upgradeable(addr).safeTransferFrom(owner, d.receipt, d.tokenId);
        }
    }

    function transferErc721Mine(address addr, ERC721Data[] calldata data) external {
        for (uint256 i = 0; i < data.length; i++) {
            ERC721Data memory d = data[i];
            ERC721Upgradeable(addr).safeTransferFrom(msg.sender, d.receipt, d.tokenId);
        }
    }
}
