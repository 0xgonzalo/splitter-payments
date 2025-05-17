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

import {DynamicSplitter} from "./DynamicSplitter.sol";

contract SplitterFactory {
    function createDynamicSplitter(
        address[] memory _addressToSplit,
        uint16[] memory _percentageToSplit,
        address _creator,
        string memory _name,
        string memory _symbol,
        uint256 _pricePerMint,
        string memory _baseURI
    ) public returns (address splitter) {
        splitter = address(
            new DynamicSplitter(
                _addressToSplit,
                _percentageToSplit,
                _creator,
                _name,
                _symbol,
                _pricePerMint,
                _baseURI
            )
        );
    }
}
