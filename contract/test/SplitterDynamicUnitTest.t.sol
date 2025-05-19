// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {SplitterFactory} from "@splitter/contracts/SplitterFactory.sol";
import {SplitterDynamic} from "@splitter/contracts/SplitterDynamic.sol";
import {NFT} from "@splitter/contracts/NFT.sol";
import {Constants} from "./Constants.sol";

contract SplitterDynamicUnitTest is Test, Constants {
    SplitterFactory factory;
    SplitterDynamic splitter;
    NFT nft;

    uint256 constant AMOUNT_TO_PAY = 0.001 ether;
    uint256 goalToIncreasePercentage = 10;

    function setUp() public {
        factory = new SplitterFactory();
        address splitterAddress = factory.createDynamicSplitter(
            CREATOR.Address,
            "testSplitter",
            "TST",
            "https://example.com/",
            AMOUNT_TO_PAY,
            1500, // 15.00%
            1700, // 17.00%
            100, // 1.00%
            goalToIncreasePercentage,
            false, // non-permanent
            addressesToSplit,
            percentagesToSplit
        );
        splitter = SplitterDynamic(splitterAddress);
        nft = NFT(splitter.getTokenAddress());
    }

    function test_makePayment() public {
        vm.deal(COMMON_USER1.Address, 1 ether);

        uint256 initialBalance = COMMON_USER1.Address.balance;

        vm.startPrank(COMMON_USER1.Address);
        splitter.makePayment{value: AMOUNT_TO_PAY}(COMMON_USER1.Address);
        vm.stopPrank();

        uint256 finalBalance = COMMON_USER1.Address.balance;

        console.log("Initial Balance: %s", initialBalance);

        assertEq(
            finalBalance,
            initialBalance - AMOUNT_TO_PAY,
            "User balance should decrease by the payment amount"
        );

        uint256 splitterBalance = address(splitter).balance;
        assertEq(
            splitterBalance,
            AMOUNT_TO_PAY,
            "Splitter balance should equal the payment amount"
        );

        uint256 amountCreator = splitter.getAmountToBeRetiredForCreator();

        SplitterDynamic.SubSplitMetadata[] memory subSplits = splitter
            .getSubSplits();

        uint256 totalAllSplits = amountCreator;

        for (uint256 i = 0; i < subSplits.length; i++) {
            totalAllSplits += subSplits[i].amountToBeRetired;
        }

        assertEq(
            totalAllSplits,
            AMOUNT_TO_PAY,
            "Total amount to be retired should equal the payment amount"
        );

        assertEq(
            nft.ownerOf(0),
            COMMON_USER1.Address,
            "User should receive one NFT after payment"
        );
    }

    function test_getCreatorShare() public {
        uint256 creatorShare = splitter.getCreatorShare(AMOUNT_TO_PAY);
        uint256 expectedShare = (AMOUNT_TO_PAY * 1500) / 10000; // 15.00%

        assertEq(
            creatorShare,
            expectedShare,
            "Creator share should be 15.00% of the payment amount"
        );
    }

    function test_getAllSubSplitShares() public {
        uint256[] memory shares = splitter.getAllSubSplitShares(AMOUNT_TO_PAY);
        uint256 totalShare = 0;

        for (uint256 i = 0; i < shares.length; i++) {
            totalShare += shares[i];
        }

        uint256 expectedTotalShare = (AMOUNT_TO_PAY * 8500) / 10000; // 85.00%

        assertEq(
            totalShare,
            expectedTotalShare,
            "Total sub-split shares should equal 85.00% of the payment amount"
        );
    }

    function test_creatorWithdraw() public {
        vm.deal(COMMON_USER1.Address, AMOUNT_TO_PAY);

        vm.startPrank(COMMON_USER1.Address);
        splitter.makePayment{value: AMOUNT_TO_PAY}(COMMON_USER1.Address);
        vm.stopPrank();

        uint256 initialBalance = CREATOR.Address.balance;
        vm.startPrank(CREATOR.Address);
        splitter.creatorWithdraw();
        vm.stopPrank();
        uint256 finalBalance = CREATOR.Address.balance;
        uint256 expectedShare = splitter.getCreatorShare(AMOUNT_TO_PAY);

        assertEq(
            finalBalance,
            initialBalance + expectedShare,
            "Creator balance should increase by the creator share"
        );
    }

    function test_withdraw() public {
        vm.deal(COMMON_USER1.Address, AMOUNT_TO_PAY);

        vm.startPrank(COMMON_USER1.Address);
        splitter.makePayment{value: AMOUNT_TO_PAY}(COMMON_USER1.Address);
        vm.stopPrank();

        uint256[] memory initialBalances = new uint256[](
            addressesToSplit.length
        );
        for (uint256 i = 0; i < addressesToSplit.length; i++) {
            initialBalances[i] = addressesToSplit[i].balance;
        }
        vm.startPrank(CONTRIBUTOR1.Address);
        splitter.withdraw();
        vm.stopPrank();

        uint256[] memory shares = splitter.getAllSubSplitShares(AMOUNT_TO_PAY);

        for (uint256 i = 0; i < addressesToSplit.length; i++) {
            uint256 finalBalance = addressesToSplit[i].balance;
            uint256 expectedShare = shares[i];
            assertEq(
                finalBalance,
                initialBalances[i] + expectedShare,
                "Contributor balance should increase by their share"
            );
        }
    }

    function test_paymentToIncreasePercentage() public {
        vm.deal(COMMON_USER1.Address, AMOUNT_TO_PAY * goalToIncreasePercentage);
        uint16 initialPercentage = splitter.getPercentageSplit().actual;

        for (uint256 i = 0; i < goalToIncreasePercentage; i++) {
            vm.startPrank(COMMON_USER1.Address);
            splitter.makePayment{value: AMOUNT_TO_PAY}(COMMON_USER1.Address);
            vm.stopPrank();
        }

        uint16 finalPercentage = splitter.getPercentageSplit().actual;

        assertEq(
            finalPercentage,
            initialPercentage + splitter.getPercentageSplit().toIncrease,
            "Final percentage should increase by the defined amount"
        );
    }

    function test_paymentToIncreasePercentageToMax() public {
        uint256 numberOfPaymentsToMax = (goalToIncreasePercentage *
            (splitter.getPercentageSplit().max -
                splitter.getPercentageSplit().actual));

        vm.deal(
            COMMON_USER1.Address,
            AMOUNT_TO_PAY * (numberOfPaymentsToMax + goalToIncreasePercentage)
        );

        for (
            uint256 i = 0;
            i < numberOfPaymentsToMax + goalToIncreasePercentage;
            i++
        ) {
            vm.startPrank(COMMON_USER1.Address);
            splitter.makePayment{value: AMOUNT_TO_PAY}(COMMON_USER1.Address);
            vm.stopPrank();
        }

        uint16 finalPercentage = splitter.getPercentageSplit().actual;

        assertEq(
            finalPercentage,
            splitter.getPercentageSplit().max,
            "Final percentage should reach the maximum defined percentage"
        );
    }

    function test_vote_exploteFuse_cancelAction() public {
        vm.startPrank(CONTRIBUTOR3.Address);
        splitter.proposeExplodeFuse();
        vm.stopPrank();

        assertEq(
            uint8(splitter.getBallotBoxMetadata().decicionID),
            uint8(0x01),
            "Decision ID should be 0x01 for explode fuse"
        );

        for (uint256 i = 0; i < addressesToSplit.length; i++) {
            vm.startPrank(addressesToSplit[i]);
            splitter.voteProposal((i % 2) == 1);
            vm.stopPrank();
        }

        vm.startPrank(CONTRIBUTOR3.Address);
        splitter.executeExplodeFuse();
        vm.stopPrank();

        assertEq(
            uint8(splitter.getBallotBoxMetadata().decicionID),
            uint8(0x00),
            "Decision ID should be reset to 0x00 after cancel action"
        );

        assertEq(
            uint8(splitter.getFuse()),
            uint8(0x01),
            "Fuse should be still 0x01 after cancel action"
        );
    }
}
