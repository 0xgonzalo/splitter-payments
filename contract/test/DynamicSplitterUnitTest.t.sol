// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {SplitterFactory} from "@splitter/contracts/SplitterFactory.sol";
import {SplitterDynamic} from "@splitter/contracts/SplitterDynamic.sol";
import {Constants} from "./Constants.sol";

contract DynamicSplitterUnitTest is Test, Constants {
    SplitterFactory factory;
    SplitterDynamic splitter;

    function setUp() public  {
        factory = new SplitterFactory();
        address splitterAddress = factory.createDynamicSplitter(
            CREATOR.Address,
            "testSplitter",
            "TST",
            "https://example.com/",
            0.001 ether,
            1500, // 15.00%
            5000, // 50.00%
            100, // 1.00%
            100,
            false, // non-permanent
            addressesToSplit,
            percentagesToSplit
        );
        splitter = SplitterDynamic(splitterAddress);
    }
    /*
    function test_Increment() public {
        
    }
    */
    
}
