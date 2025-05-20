// SPDX-License-Identifier: MIT

/**
 ____        _ _ _      __     ___            
/ ___| _ __ | (_) |_   / /    / / |_ ___ _ __ 
\___ \| '_ \| | | __| / /    / /| __/ _ \ '__|
 ___) | |_) | | | |_ / /    / / | ||  __/ |   
|____/| .__/|_|_|\__/_/    /_/   \__\___|_|   
      |_|                                     

 * @title Splitter (Static Type)
 * @author jistro.eth
 * @notice This contract manages a static splitter that allows for
 *         flexible percentage splits among multiple addresses.
 */
pragma solidity 0.8.20;

import {VotingMechanism} from "@splitter/contracts/VotingMechanism.sol";
import {NFT} from "@splitter/contracts/NFT.sol";

contract SplitterStatic is VotingMechanism {
    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ errors ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

    error InvalidPaymentAmount();
    error CreatorCannotMakePayment();
    error OnlyCreatorCanExecute();
    error OnlyMemberCanExecute();
    error TransferFailed();
    error InvalidPercentage();

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ events ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

    event PaymentMade(address indexed user, uint256 tokenId);
    event WithdrawalMade(address indexed account, uint256 amount);

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Structures ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄
    struct SubSplitMetadata {
        address account;
        uint16 percentage;
        uint256 amountToBeRetired;
    }

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Variables ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

    uint16 constant BPS_DENOMINATOR = 10000; // 100.00% in Basis Points

    uint16 percentageSplit;

    uint256 pricePerMint;
    uint256 amountToBeRetiredForCreator;

    address creator;
    address tokenAddress;

    SubSplitMetadata[] subSplits;

    constructor(
        address _creator,
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        uint256 _pricePerMint,
        uint16 _percentageToSplit,
        bool setToPermanent,
        address[] memory _membersAddressesForSubSplit,
        uint16[] memory _membersPercentagesForSubSplit
    ) VotingMechanism(setToPermanent, _membersAddressesForSubSplit) {
        for (uint256 i = 0; i < _membersPercentagesForSubSplit.length; i++) {
            subSplits.push(
                SubSplitMetadata({
                    account: _membersAddressesForSubSplit[i],
                    percentage: _membersPercentagesForSubSplit[i],
                    amountToBeRetired: 0
                })
            );
        }

        percentageSplit = _percentageToSplit;

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
    function makePayment(address _to) public payable returns (uint256 tokenId) {
        if (msg.value != pricePerMint) revert InvalidPaymentAmount();

        if (msg.sender == creator) revert CreatorCannotMakePayment();

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

        tokenId = NFT(tokenAddress).safeMint(_to);

        emit PaymentMade(msg.sender, tokenId);
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
        amountForCreator = (_totalAmount * percentageSplit) / BPS_DENOMINATOR;
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
            revert OnlyCreatorCanExecute();
        }
        (bool success, ) = creator.call{value: amountToBeRetiredForCreator}("");

        if (!success) {
            revert TransferFailed();
        }

        amountToBeRetiredForCreator = 0;

        emit WithdrawalMade(creator, amountToBeRetiredForCreator);
    }

    function withdraw() public {
        if (!_isMember(msg.sender)) {
            revert OnlyMemberCanExecute();
        }

        for (uint256 i = 0; i < subSplits.length; i++) {
            (bool success, ) = subSplits[i].account.call{
                value: subSplits[i].amountToBeRetired
            }("");

            subSplits[i].amountToBeRetired = 0;

            if (!success) {
                revert TransferFailed();
            }

            emit WithdrawalMade(
                subSplits[i].account,
                subSplits[i].amountToBeRetired
            );
        }
    }

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Vote Functions ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

    /// @dev all voting functions are inherited from VotingMechanism

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
     * @notice Proposes a new percentage split.
     * @dev This proposal has an ID of 0x02 and allows the community to vote on changing the percentage split.
     * @param newPercentageSplit The new percentage split to be proposed.
     */
    function proposeNewPercentageSplit(uint16 newPercentageSplit) external {
        if (newPercentageSplit > BPS_DENOMINATOR) {
            revert InvalidPercentage();
        }
        _proposeVote(0x02, uint256(newPercentageSplit));
    }

    /**
     * @notice Executes the proposal to change the percentage split.
     * @dev This function checks if the vote was successful and updates the percentage split accordingly.
     */
    function executeNewPercentageSplit() external {
        (bool answer, uint256 dataToChange) = _execute(0x02);
        if (answer) {
            percentageSplit = uint16(dataToChange);
        }
    }

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Getters Functions ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄
    function getSubSplits() external view returns (SubSplitMetadata[] memory) {
        return subSplits;
    }

    function getMembersOfSubSplit() external view returns (address[] memory) {
        address[] memory membersOfSubSplit = new address[](subSplits.length);
        for (uint256 i = 0; i < subSplits.length; i++) {
            membersOfSubSplit[i] = subSplits[i].account;
        }
        return membersOfSubSplit;
    }

    function getPercentageSplit() external view returns (uint16) {
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

    function getAmountToBeRetiredForCreator() external view returns (uint256) {
        return amountToBeRetiredForCreator;
    }

    function getSubSplitByIndex(
        uint256 index
    ) external view returns (SubSplitMetadata memory) {
        require(index < subSplits.length, "Index out of bounds");
        return subSplits[index];
    }

    function getSubSplitByAddress(
        address account
    ) external view returns (SubSplitMetadata memory, bool) {
        for (uint256 i = 0; i < subSplits.length; i++) {
            if (subSplits[i].account == account) {
                return (subSplits[i], true);
            }
        }
        return (SubSplitMetadata(address(0), 0, 0), false);
    }

    function getPendingAmountsForSubSplits()
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory pendingAmounts = new uint256[](subSplits.length);
        for (uint256 i = 0; i < subSplits.length; i++) {
            pendingAmounts[i] = subSplits[i].amountToBeRetired;
        }
        return pendingAmounts;
    }

    function isSubSplitMember(address account) external view returns (bool) {
        for (uint256 i = 0; i < subSplits.length; i++) {
            if (subSplits[i].account == account) {
                return true;
            }
        }
        return false;
    }

    function getTotalSubSplitPercentage() external view returns (uint16) {
        uint16 totalPercentage = 0;
        for (uint256 i = 0; i < subSplits.length; i++) {
            totalPercentage += subSplits[i].percentage;
        }
        return totalPercentage;
    }
}
