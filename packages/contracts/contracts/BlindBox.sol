// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

interface Mintable {
    function mint(address to, uint8 types) external;
}

contract BlindBox is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    using StringsUpgradeable for uint256;

    struct Pool {
        uint256 price;
        uint256 solds;
        uint256 startTime;
        uint256 endTime;
    }

    uint256 public currentTokenId;
    mapping(address => uint256) public userBuys;
    uint256 public constant MAX_TOKEN_ID = 5000;
    uint256 public constant AMOUNT_PER_USER = 5;
    address payable public beneficiary;
    uint256 public solds;
    uint256 public price;
    bool public openStart;
    address public horse;
    uint256 public poolLength;
    mapping(uint256 => Pool) public pools;
    mapping(uint256 => mapping(address => uint256)) userBuysPer;
    mapping(uint256 => uint8) types;
    uint256 public constant OPEN_FEES = 0.54 ether;

    event Buy(address indexed user, uint256 amount);

    ///@notice initialize
    function initialize(address payable beneficiary_) external initializer {
        __ERC721_init("Horse Racing Blind Box", "HRBB");
        __Ownable_init();
        beneficiary = beneficiary_;
        currentTokenId = 1;
    }

    function baseURI() public view virtual returns (string memory) {
        return "ipfs://ipfs/";
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory base = baseURI();
        return bytes(base).length > 0 ? string(abi.encodePacked(base, tokenId.toString())) : "";
    }

    function getUserBuyed(uint256 pid, address account) external view returns(uint256) {
        require(pid < poolLength, "BlindBox: empty pool");

        return userBuysPer[pid][account];
    }

    function buy(uint256 pid, uint256 amount) external payable {
        require(pid < poolLength, "BlindBox: empty pool");
        Pool memory pool = pools[pid];
        require(block.timestamp >= pool.startTime, "BlindBox: not start");
        require(block.timestamp <= pool.endTime, "BlindBox: ended");
        require(amount * pool.price == msg.value, "BlindBox: msg.value is not correct");
        require(currentTokenId + amount - 1 <= pool.solds, "BlindBox: Sold Out");
        require(userBuysPer[pid][msg.sender] + amount <= AMOUNT_PER_USER, "BlindBox: user only buy fives");

        for (uint256 i = currentTokenId; i < currentTokenId + amount; i++) {
            _safeMint(msg.sender, i);
        }

        currentTokenId += amount;
        userBuysPer[pid][msg.sender] += amount;
        beneficiary.transfer(address(this).balance);

        emit Buy(msg.sender, amount);
    }

    function addPool(Pool calldata pool) external onlyOwner {
        pools[poolLength] = pool;
        poolLength += 1;
    }

    function setPool(uint256 pid, Pool calldata pool) external onlyOwner {
        pools[pid] = pool;
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

    function batchTransferFrom(address[] calldata froms, address[] calldata tos, uint256[] calldata tokenIds) external {
        require(tos.length == tokenIds.length && tokenIds.length == froms.length, "BlindBox: tos.length neq tokenIds.length neq froms.length");
        for (uint256 i = 0; i < tos.length; i++) {
            transferFrom(froms[i], tos[i], tokenIds[i]);
        }
    }

    function _open(uint256 tokenId) internal {
        require(ownerOf(tokenId) == msg.sender, "BlindBox: not a owner");
        require(types[tokenId] > 0 && types[tokenId] < 5, "BlindBox: type error");

        _burn(tokenId);
        Mintable(horse).mint(msg.sender, types[tokenId]);
    }

    function open(uint256 tokenId) payable external {
        require(openStart, "BlindBox: Not start");
        require(msg.value == OPEN_FEES, "BlindBox: fee not correct");
        _open(tokenId);
        beneficiary.transfer(address(this).balance);
    }

    function batchOpen(uint256[] calldata tokenIds) payable external {
        require(openStart, "BlindBox: Not start");
        require(msg.value == OPEN_FEES * tokenIds.length, "BlindBox: fee not correct");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            _open(tokenIds[i]);
        }
        beneficiary.transfer(address(this).balance);
    }

    function setOpenStart(bool started) external onlyOwner {
        openStart = started;
    }

    function setHorse(address addr) external onlyOwner {
        horse = addr;
    }

    function resetTypes(uint256[] calldata type_1, uint256[] calldata type_2, uint256[] calldata type_3, uint256[] calldata type_4) external onlyOwner {
        for (uint256 i = 0; i < type_1.length; i++) {
            types[type_1[i]] = 1;
        }
        for (uint256 i = 0; i < type_2.length; i++) {
            types[type_2[i]] = 2;
        }
        for (uint256 i = 0; i < type_3.length; i++) {
            types[type_3[i]] = 3;
        }
        for (uint256 i = 0; i < type_4.length; i++) {
            types[type_4[i]] = 4;
        }
    }
}
