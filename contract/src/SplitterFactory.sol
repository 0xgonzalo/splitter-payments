// SPDX-License-Identifier: MIT

/**
 ____        _ _ _      __     ___            
/ ___| _ __ | (_) |_   / /    / / |_ ___ _ __ 
\___ \| '_ \| | | __| / /    / /| __/ _ \ '__|
 ___) | |_) | | | |_ / /    / / | ||  __/ |   
|____/| .__/|_|_|\__/_/    /_/   \__\___|_|   
      |_|                                     

░█▀▀░█▀█░█▀▀░▀█▀░█▀█░█▀▄░█░█
░█▀▀░█▀█░█░░░░█░░█░█░█▀▄░░█░
░▀░░░▀░▀░▀▀▀░░▀░░▀▀▀░▀░▀░░▀░

 * @title SplitterFactory
 * @author jistro.eth
 * @notice This contract is a factory for creating Splitter contract with 
 *         aditional non-fungible token (NFT) functionality.
 */
pragma solidity ^0.8.13;

import {SplitterDynamic} from "@splitter/contracts/SplitterDynamic.sol";

contract SplitterFactory {
    function createDynamicSplitter(
        address _creator,
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        uint256 _pricePerMint,
        // este tiene 2 decimales, por ejemplo 1500 para 15.00%
        uint16 _percentageToBeginSplit,
        uint16 _maxPercentageSplit,
        uint16 _toIncreasePercentageSplit,
        uint256 _goalForIncreasePercentage,
        bool setToPermanent,
        address[] memory _addressToSplit,
        uint16[] memory _percentageToSplit
    ) public returns (address splitter) {
        splitter = address(
            new SplitterDynamic(
                _creator,
                _name,
                _symbol,
                _baseURI,
                _pricePerMint,
                _percentageToBeginSplit,
                _maxPercentageSplit,
                _toIncreasePercentageSplit,
                _goalForIncreasePercentage,
                setToPermanent,
                _addressToSplit,
                _percentageToSplit
            )
        );
    }
}
