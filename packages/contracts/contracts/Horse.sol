// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

interface Randomable {
    function randomTypes(uint256 seeds) external returns(uint8);
}

contract Horse is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    mapping(address => bool) minters;
    mapping(uint256 => string) tokenURIs;
    address public randomOracle;

    mapping(uint256 => uint8) internal _types;

    ///@notice initialize
    function initialize(address[] calldata minters_) external initializer {
        __ERC721_init("Horse", "Horse");
        __Ownable_init();

        for (uint256 i = 0; i < minters_.length; i++) {
            minters[minters_[i]] = true;
        }
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


    function setRandomOracle(address addr) external onlyOwner {
        randomOracle = addr;
    }

    function mint(address to, uint256 tokenId) external {
        require(minters[msg.sender], "Horse: Only minter call");
        _safeMint(to, tokenId);

        _types[tokenId] = Randomable(randomOracle).randomTypes(tokenId);
    }
}
