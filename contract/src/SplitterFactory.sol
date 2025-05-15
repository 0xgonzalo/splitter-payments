// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Splitter} from "./Splitter.sol";

contract SplitterFactory {
    function createSplitter(
        address[] memory _addressToSplit,
        uint256[] memory _percentageToSplit,
        address _creator,
        string memory _name,
        string memory _symbol,
        uint256 _pricePerMint
    ) public returns (address splitter) {
        splitter = address(
            new Splitter(
                _addressToSplit,
                _percentageToSplit,
                _creator,
                _name,
                _symbol,
                _pricePerMint
            )
        );
    }
}
