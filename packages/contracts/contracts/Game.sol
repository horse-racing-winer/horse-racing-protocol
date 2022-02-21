// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";

import "./Horse.sol";
import "./utils/String.sol";
import "./utils/Bytes.sol";

contract Game is Initializable, OwnableUpgradeable, IERC721ReceiverUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using StringLibrary for string;
    using BytesLibrary for bytes32;

    struct BreedData {
        address owner;
        uint256 salt;
        uint256 horse1;
        uint256 horse2;
        uint8 newType;
    }

    address signer;
    IERC20Upgradeable hrw;
    Horse horse;

    mapping(address => uint256) public userNative;
    mapping(address => uint256) public userWithdrawNative;

    mapping(address => uint256) public userHrw;
    mapping(address => uint256) public userWithdrawHrw;

    mapping(address => uint256[]) public userHorse;
    mapping(address => mapping(uint256 => bool)) public userHorseMapping;

    event DepositNative(address indexed account, uint256 value);
    event WithdrawNative(address indexed account, uint256 total, uint256 amount);
    event DepositHrw(address indexed account, uint256 value);
    event WithdrawHrw(address indexed account, uint256 total, uint256 amount);
    event DepositHorse(address indexed account, uint256[] tokenIds);
    event WithdrawHorse(address indexed account, uint256[] tokenIds);
    event Breed(address indexed account, BreedData breedData, uint256 newHorse);

    ///@notice initialize
    function initialize(address _signer, IERC20Upgradeable _hrw, Horse _horse) external initializer {
        __Ownable_init();
        signer = _signer;
        hrw = _hrw;
        horse = _horse;
    }

    function setSigner(address _signer) external onlyOwner {
        signer = _signer;
    }

    function userHorses(address account) external view returns(uint256[] memory) {
        return userHorse[account];
    }

    function depositNative() external payable {
        userNative[msg.sender] += msg.value;

        emit DepositNative(msg.sender, msg.value);
    }

    function withdrawNative(uint256 value, uint8 v, bytes32 r, bytes32 s) external {
        require(value > userWithdrawNative[msg.sender], "Game: No balance to withdraw");
        require(keccak256(abi.encode(msg.sender, value)).toString().recover(v, r, s) == signer, "Game: signature verify error");

        payable(msg.sender).transfer(value - userWithdrawNative[msg.sender]);
        userWithdrawNative[msg.sender] = value;

        emit WithdrawNative(msg.sender, value, value - userWithdrawNative[msg.sender]);
    }

    function depositHrw(uint256 amount) external payable {
        userHrw[msg.sender] += amount;
        hrw.safeTransferFrom(msg.sender, address(this), amount);

        emit DepositHrw(msg.sender, amount);
    }

    function withdrawHrw(uint256 value, uint8 v, bytes32 r, bytes32 s) external {
        require(value > userWithdrawHrw[msg.sender], "Game: No balance to withdraw");
        require(keccak256(abi.encode(msg.sender, hrw, value)).toString().recover(v, r, s) == signer, "Game: signature verify error");

        hrw.transfer(msg.sender, value - userWithdrawHrw[msg.sender]);
        userWithdrawHrw[msg.sender] = value;

        emit WithdrawHrw(msg.sender, value, value - userWithdrawHrw[msg.sender]);
    }

    function depositHorse(uint256[] calldata tokenIds) external payable {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            horse.safeTransferFrom(msg.sender, address(this), tokenIds[i]);
            userHorse[msg.sender].push(tokenIds[i]);
            userHorseMapping[msg.sender][tokenIds[i]] = true;
        }

        emit DepositHorse(msg.sender, tokenIds);
    }

    function withdrawHorse(uint256[] calldata tokenIds, uint8 v, bytes32 r, bytes32 s) external payable {
        require(keccak256(abi.encode(msg.sender, horse, tokenIds)).toString().recover(v, r, s) == signer, "Game: signature verify error");
        require(tokenIds.length <= userHorse[msg.sender].length, "Game: length too long");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(userHorseMapping[msg.sender][tokenIds[i]], "Game: Not deposit tokenId");
            horse.safeTransferFrom(address(this), msg.sender, tokenIds[i]);
            userHorseMapping[msg.sender][tokenIds[i]] = false;
        }

        uint256[] memory oldHorse = userHorse[msg.sender];
        delete userHorse[msg.sender];
        for (uint256 i = 0; i < oldHorse.length; i++) {
            if (userHorseMapping[msg.sender][oldHorse[i]]) {
                userHorse[msg.sender].push(oldHorse[i]);
            }
        }

        emit WithdrawHorse(msg.sender, tokenIds);
    }

    function breed(BreedData calldata breedData, uint8 v, bytes32 r, bytes32 s) external {
        require(userHorseMapping[msg.sender][breedData.horse1], "Game: user has not horse1");
        require(userHorseMapping[msg.sender][breedData.horse2], "Game: user has not horse2");
        require(keccak256(abi.encode(breedData)).toString().recover(v, r, s) == signer, "Game: signature verify error");

        uint256 newHorse = horse.mint(address(this), breedData.newType);
        userHorse[breedData.owner].push(newHorse);
        userHorseMapping[breedData.owner][newHorse] = true;

        emit Breed(msg.sender, breedData, newHorse);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return IERC721ReceiverUpgradeable.onERC721Received.selector;
    }
}
