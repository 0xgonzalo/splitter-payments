// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {VotingMechanism} from "./VotingMechanism.sol";
import {NFT} from "./NFT.sol";

contract DynamicSplitter is VotingMechanism {

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Structures ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄
    struct SubSplitMetadata {
        address account;
        uint16 percentage;
        uint256 amountToBeRetired;
    }

    struct PercentageSplitMetadata {
        uint16 actual;
        uint16 max;
        uint16 toIncrease;
    }

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Variables ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

    uint16 constant BPS_DENOMINATOR = 10000; // 100% in Basis Points

    PercentageSplitMetadata percentageSplit;

    uint256 pricePerMint;
    uint256 amountToBeRetiredForCreator;
    uint256 payCounter;
    uint256 goalForIncreasePercentage;

    address creator;
    address tokenAddress;

    SubSplitMetadata[] subSplits;

    constructor(
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
    ) VotingMechanism(setToPermanent, _addressToSplit) {
        uint256 sumSubSplitPercentages = 0;

        for (uint256 i = 0; i < _percentageToSplit.length; i++) {
            subSplits.push(
                SubSplitMetadata({
                    account: _addressToSplit[i],
                    percentage: _percentageToSplit[i],
                    amountToBeRetired: 0
                })
            );
            sumSubSplitPercentages += _percentageToSplit[i];
        }

        if (sumSubSplitPercentages != BPS_DENOMINATOR) {
            revert("Sub-split percentages must sum to 100%");
        }

        percentageSplit = PercentageSplitMetadata({
            actual: _percentageToBeginSplit,
            max: _maxPercentageSplit,
            toIncrease: _toIncreasePercentageSplit
        });

        goalForIncreasePercentage = _goalForIncreasePercentage;
        creator = _creator;
        pricePerMint = _pricePerMint;

        tokenAddress = address(
            new NFT(address(this), _name, _symbol, _baseURI)
        );
    }

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Payment Functions ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

    /**
     *  @notice Allows a user to make a payment to mint an NFT.
     *  @param _to The address to which the NFT will be minted.
     *  @dev The function checks if the sender is the creator, validates the payment amount,
     *  and updates the split percentages based on the number of payments made.
     */
    function makePayment(address _to) public payable {
        if (msg.sender == creator) {
            revert();
        }
        if (msg.value != pricePerMint) {
            revert();
        }

        // si todavía no se ha alcanzado el límite
        /// @notice Check if the current percentage is less than the maximum allowed percentage.
        if (percentageSplit.actual < percentageSplit.max) {
            /// @notice Increment the payment counter.
            payCounter++;
            ///@notice Check if the payment counter has reached the goal for increasing the percentage.
            if (payCounter % goalForIncreasePercentage == 0) {
                /// @notice Increase the actual percentage by the defined increment and reset the counter.
                percentageSplit.actual += percentageSplit.toIncrease;
                payCounter = 0;
            }
        }

        /**
         * @notice Calculate the share for the creator and the remaining amount
         * to be divided among the sub-splits for every contributor defined
         * in the `subSplits` array.
         */
        amountToBeRetiredForCreator += getCreatorShare(msg.value);
        uint256[] memory calculatedShares = getAllSubSplitShares(msg.value);
        for (uint256 i = 0; i < subSplits.length; i++) {
            subSplits[i].amountToBeRetired += calculatedShares[i];
        }
        NFT(tokenAddress).safeMint(_to);
    }

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Calculation Functions ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

    /**
     *  @notice Calculate the share for the creator based on the total amount.
     *  @param _totalAmount The total amount (in atomic units of the token) to be divided.
     *  @return amountForCreator The amount (in atomic units) for the creator.
     */
    function getCreatorShare(
        uint256 _totalAmount
    ) public view returns (uint256 amountForCreator) {
        /**
         * @notice Calculate the amount for the creator based on the actual percentage split.
         * The calculation is done by multiplying the total amount by the actual percentage split
         * and dividing it by the denominator (10000).
         */
        amountForCreator =
            (_totalAmount * percentageSplit.actual) /
            BPS_DENOMINATOR;
        return amountForCreator;
    }

    /**
     * @notice Calculates the shares for all sub-split members listed in `subSplits`.
     * These shares are calculated based on the remaining amount AFTER the creator's share.
     * @param _totalAmount The total amount (in atomic units of the token) to be divided.
     * @return calculatedShares An array containing the addresses and calculated amounts
     * for each member in the `subSplits` array.
     */
    function getAllSubSplitShares(
        uint256 _totalAmount
    ) public view returns (uint256[] memory calculatedShares) {
        
        /**
         * @notice Calculate the amount for the creator first.
         * This amount is subtracted from the total amount to determine the remaining
         * amount that will be divided among the sub-splits.
         * @dev The creator's share is calculated based on the actual percentage split.
         */
        uint256 amountForCreator = getCreatorShare(_totalAmount);
        uint256 remainingAmountForSubSplits = _totalAmount - amountForCreator;
        calculatedShares = new uint256[](subSplits.length);

        /**
         * @notice Iterate through each sub-split member and calculate their individual share.
         * The share is calculated based on the remaining amount after the creator's share has been deducted.
         */
        for (uint256 i = 0; i < subSplits.length; i++) {
            SubSplitMetadata storage currentSubSplit = subSplits[i];

            uint256 individualShareAmount = (remainingAmountForSubSplits *
                currentSubSplit.percentage) / BPS_DENOMINATOR;

            calculatedShares[i] = individualShareAmount;
        }

        return calculatedShares;
    }

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Withdrawal Functions ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

    function creatorWithdraw() public {
        if (msg.sender != creator) {
            revert("Only the creator can withdraw.");
        }
        (bool success, ) = creator.call{value: amountToBeRetiredForCreator}("");
        require(success, "Transfer failed.");
        amountToBeRetiredForCreator = 0;
    }

    function withdraw() public {
        for (uint256 i = 0; i < subSplits.length; i++) {
            (bool success, ) = subSplits[i].account.call{
                value: subSplits[i].amountToBeRetired
            }("");

            subSplits[i].amountToBeRetired = 0;
            if (!success) {
                revert("Transfer failed.");
            }
        }
    }

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Vote Functions ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

    /**
     *  @notice Allows a user to vote on a proposal (only if there is an ongoing vote).
     *  @param answer The user's vote, true for 'yes' and false for 'no'.
     */
    function voteProposal(bool answer) external {
        _vote(answer);
    }

    /**
     * @notice This function proposes a vote to explode the fuse,
     * meaning that all decisions regarding
     * - changing the maximum split percentage
     * - increasing the split percentage
     * - changing the goal for increasing the percentage
     * - changing the percentageSplit.toIncrease
     * will no longer be possible and this decision is permanent.
     */
    function proposeExplodeFuse() external {
        _proposeVote(0x01, 0);
    }

    /**
     * @notice Executes the proposal to explode the fuse.
     * @dev This function checks if the vote was successful and updates the fuse accordingly.
     */
    function executeExplodeFuse() external {
        _execute(0x01);
    }

    /**
     * @notice Proposes a new maximum percentage split.
     * @dev This proposal has an ID of 0x02 and allows the community to vote on changing the maximum percentage split.
     * @param newMaxPercentageSplit The new maximum percentage split to be proposed.
     */
    function proposeNewMaxPercentageSplit(
        uint16 newMaxPercentageSplit
    ) external {
        _proposeVote(0x02, uint256(newMaxPercentageSplit));
    }

    /**
     * @notice Executes the proposal to change the maximum percentage split.
     * @dev This function checks if the vote was successful and updates the maximum percentage split accordingly.
     */
    function executeNewMaxPercentageSplit() external {
        // verificar si la votación fue exitosa si es asi se aumenta el porcentaje
        (bool answer, uint256 dataToChange) = _execute(0x02);
        if (answer) {
            percentageSplit.max = uint16(dataToChange);
        }
    }

    /**
     * @notice Proposes a new goal for increasing the percentage split.
     * @dev This proposal has an ID of 0x03 and allows the community to vote on changing the goal for increasing the percentage split.
     * @param newGoalForIncreasePercentage The new goal for increasing the percentage split to be proposed.
     */
    function proposeNewGoalForIncreasePercentage(
        uint256 newGoalForIncreasePercentage
    ) external {
        _proposeVote(0x03, newGoalForIncreasePercentage);
    }

    /**
     * @notice Executes the proposal to change the goal for increasing the percentage split.
     * @dev This function checks if the vote was successful and updates the goal for increasing the percentage split accordingly.
     */
    function executeNewGoalForIncreasePercentage() external {
        (bool answer, uint256 dataToChange) = _execute(0x03);
        if (answer) {
            goalForIncreasePercentage = dataToChange;
        }
    }

    /**
     * @notice Proposes a new percentage split to increase.
     * @dev This proposal has an ID of 0x04 and allows the community to vote on changing the percentage split to increase.
     * @param newPercentageSplitToIncrease The new percentage split to increase to be proposed.
     */
    function proposeNewPercentageSplitToIncrease(
        uint16 newPercentageSplitToIncrease
    ) external {
        _proposeVote(0x04, uint256(newPercentageSplitToIncrease));
    }

    /**
     * @notice Executes the proposal to change the percentage split to increase.
     * @dev This function checks if the vote was successful and updates the percentage split to increase accordingly.
     */
    function executeNewPercentageSplitToIncrease() external {
        // verificar si la votación fue exitosa si es asi se aumenta el porcentaje
        (bool answer, uint256 dataToChange) = _execute(0x02);
        if (answer) {
            percentageSplit.toIncrease = uint16(dataToChange);
        }
    }

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Getters Functions ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄
    function getSubSplits()
        external
        view
        returns (SubSplitMetadata[] memory)
    {
        return subSplits;
    }
    function getMembersOfSubSplit(
    ) external view returns (address[] memory membersOfSubSplit) {
        for (uint256 i = 0; i < subSplits.length; i++) {
            membersOfSubSplit[i] = subSplits[i].account;
        }
    }
    function getPercentageSplit()
        external
        view
        returns (PercentageSplitMetadata memory)
    {
        return percentageSplit;
    }
    function getCreator() external view returns (address) {
        return creator;
    }
    function getTokenAddress() external view returns (address) {
        return tokenAddress;
    }
    function getPricePerMint() external view returns (uint256) {
        return pricePerMint;
    }
    function getAmountToBeRetiredForCreator()
        external
        view
        returns (uint256)
    {
        return amountToBeRetiredForCreator;
    }
    function getPayCounter() external view returns (uint256) {
        return payCounter;
    }
    function getGoalForIncreasePercentage()
        external
        view
        returns (uint256)
    {
        return goalForIncreasePercentage;
    }

}
