// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract BlindBox is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    using StringsUpgradeable for uint256;

    uint256 public currentTokenId;
    mapping(address => uint256) public userBuys;
    uint256 public constant MAX_TOKEN_ID = 5000;
    uint256 public constant AMOUNT_PER_USER = 5;
    address payable public beneficiary;
    uint256 public solds;
    uint256 public price;

    event Buy(address indexed user, uint256 amount);

    ///@notice initialize
    function initialize(address payable beneficiary_) external initializer {
        __ERC721_init("Horse Racing Blind Box", "HRBB");
        __Ownable_init();
        beneficiary = beneficiary_;
        currentTokenId = 1;
        solds = 0;
        price = 5 ether;
    }

    function baseURI() public view virtual returns (string memory) {
        return "ipfs://ipfs/";
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory base = baseURI();
        return bytes(base).length > 0 ? string(abi.encodePacked(base, tokenId.toString())) : "";
    }

    function buy(uint256 amount) external payable {
        require(amount * price == msg.value, "BlindBox: msg.value is not correct");
        require(currentTokenId + amount - 1 <= solds, "BlindBox: Sold Out");
        require(userBuys[msg.sender] + amount <= AMOUNT_PER_USER, "BlindBox: user only buy fives");

        for (uint256 i = currentTokenId; i < currentTokenId + amount; i++) {
            _safeMint(msg.sender, i);
        }

        currentTokenId += amount;
        userBuys[msg.sender] += amount;
        beneficiary.transfer(address(this).balance);

        emit Buy(msg.sender, amount);
    }

    function setPrice(uint256 newPrice) external onlyOwner {
        price = newPrice;
    }

    function setSolds(uint256 newSolds) external onlyOwner {
        require(newSolds <= MAX_TOKEN_ID, "BlindBox: tokenId max is 5000");
        solds = newSolds;
    }

    function setBeneficiary(address payable newBeneficiary) external onlyOwner {
        beneficiary = newBeneficiary;
    }

    function batchMint(uint256 amount, address addr) external onlyOwner {
        require(currentTokenId + amount <= MAX_TOKEN_ID, "BlindBox: tokenId max is 5000");
        for (uint256 i = currentTokenId; i < currentTokenId + amount; i++) {
            _safeMint(addr, i);
        }
        currentTokenId += amount;
    }
}
