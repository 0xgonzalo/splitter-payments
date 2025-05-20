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
import {SplitterStatic} from "@splitter/contracts/SplitterStatic.sol";

contract SplitterFactory {
    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ errors ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄
    error InvalidPercentage();
    error InvalidSubSplitPercentages();

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ events ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

    event SplitterCreated(
        address indexed creator,
        address indexed splitterAddress,
        string name,
        string symbol
    );

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ functions ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄
    /**
     *  @notice Creates a new instance of the Splitter contract with dynamic percentage splitting.
     *  @notice The percentage split ONLY use two decimal places, so 100% is 10000, 25.78% is 2578, etc.
     *  @dev This function deploys a new SplitterDynamic contract with the provided parameters.
     *  @param _creator The address of the creator of the Splitter contract.
     *  @param _name The name of the Splitter contract.
     *  @param _symbol The symbol of the Splitter contract.
     *  @param _baseURI The base URI for the Splitter contract.
     *  @param _pricePerMint The price per mint for the Splitter contract.
     *  @param _percentageToBeginSplit The percentage to begin splitting.
     *  @param _maxPercentageSplit The maximum percentage split.
     *  @param _toIncreasePercentageSplit The percentage to increase the split.
     *  @param _goalForIncreasePercentage The goal for increasing the percentage.
     *  @param setToPermanent Whether the split is permanent.
     *  @param _membersAddressesForSubSplit The addresses of the members for sub-splitting.
     *  @param _membersPercentagesForSubSplit The percentages for sub-splitting.
     *  @return splitter The address of the newly created SplitterDynamic contract.
     */
    function createDynamicSplitter(
        address _creator,
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        uint256 _pricePerMint,
        uint16 _percentageToBeginSplit,
        uint16 _maxPercentageSplit,
        uint16 _toIncreasePercentageSplit,
        uint256 _goalForIncreasePercentage,
        bool setToPermanent,
        address[] memory _membersAddressesForSubSplit,
        uint16[] memory _membersPercentagesForSubSplit
    ) public returns (address splitter) {
        percentageCheck(
            _percentageToBeginSplit,
            _membersPercentagesForSubSplit
        );

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
                _membersAddressesForSubSplit,
                _membersPercentagesForSubSplit
            )
        );

        emit SplitterCreated(
            _creator,
            splitter,
            _name,
            _symbol
        );
    }

    /**
     *  @notice Creates a new instance of the Splitter contract with static percentage splitting.
     *  @notice The percentage split ONLY use two decimal places, so 100% is 10000, 25.78% is 2578, etc.
     *  @dev This function deploys a new SplitterStatic contract with the provided parameters.
     *  @param _creator The address of the creator of the Splitter contract.
     *  @param _name The name of the Splitter contract.
     *  @param _symbol The symbol of the Splitter contract.
     *  @param _baseURI The base URI for the Splitter contract.
     *  @param _pricePerMint The price per mint for the Splitter contract.
     *  @param _percentageToSplit The percentage to split.
     *  @param setToPermanent Whether the split is permanent.
     *  @param _membersAddressesForSubSplit The addresses of the members for sub-splitting.
     *  @param _membersPercentagesForSubSplit The percentages for sub-splitting.
     *  @return splitter The address of the newly created SplitterStatic contract.
     */
    function createStaticSplitter(
        address _creator,
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        uint256 _pricePerMint,
        uint16 _percentageToSplit,
        bool setToPermanent,
        address[] memory _membersAddressesForSubSplit,
        uint16[] memory _membersPercentagesForSubSplit
    ) public returns (address splitter) {
        percentageCheck(_percentageToSplit, _membersPercentagesForSubSplit);

        splitter = address(
            new SplitterStatic(
                _creator,
                _name,
                _symbol,
                _baseURI,
                _pricePerMint,
                _percentageToSplit,
                setToPermanent,
                _membersAddressesForSubSplit,
                _membersPercentagesForSubSplit
            )
        );

        emit SplitterCreated(
            _creator,
            splitter,
            _name,
            _symbol
        );
    }

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ internal functions ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

    /**
     *  @notice Checks if the percentage to split and the sub-split percentages are valid.
     *  @param _percentageToSplit The percentage to split.
     *  @param _membersPercentagesForSubSplit The percentages for sub-splitting.
     */
    function percentageCheck(
        uint16 _percentageToSplit,
        uint16[] memory _membersPercentagesForSubSplit
    ) private pure {
        if (_percentageToSplit > 10000) {
            revert InvalidPercentage();
        }
        uint256 sumSubSplitPercentages = 0;
        for (uint256 i = 0; i < _membersPercentagesForSubSplit.length; i++) {
            sumSubSplitPercentages += _membersPercentagesForSubSplit[i];
        }

        if (sumSubSplitPercentages != 10000) {
            revert InvalidSubSplitPercentages();
        }
    }
}
