// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Horse is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    mapping(address => bool) minters;
    mapping(uint256 => string) tokenURIs;

    mapping(uint256 => uint8) internal _types;

    ///@notice initialize
    function initialize() external initializer {
        __ERC721_init("Horse", "Horse");
        __Ownable_init();
    }

    function baseURI() public view virtual returns (string memory) {
        return "ipfs://ipfs/";
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return tokenURIs[tokenId];
    }

    function setTokenURIs(uint256[] calldata ids, string[] calldata uris) external onlyOwner {
        require(ids.length == uris.length, "Horse: ids.length neq uris.length");
        for (uint256 i = 0; i < ids.length; i++) {
            tokenURIs[ids[i]] = uris[i];
        }
    }

    function types(uint256 tokenId) public view returns (uint8) {
        require(_exists(tokenId), "Horse: types query for nonexistent token");

        return _types[tokenId];
    }

    function addMinters(address[] calldata _minters) external onlyOwner {
        for (uint256 i = 0; i < _minters.length; i++) {
            minters[_minters[i]] = true;
        }
    }

    function removeMinters(address[] calldata _minters) external onlyOwner {
        for (uint256 i = 0; i < _minters.length; i++) {
            minters[_minters[i]] = false;
        }
    }

    function mint(address to, uint256 tokenId, uint8 _type) external {
        require(minters[msg.sender], "Horse: Only minter call");
        _safeMint(to, tokenId);

        _types[tokenId] = _type;
    }
}
