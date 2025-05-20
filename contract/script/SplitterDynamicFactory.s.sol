// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {SplitterDynamicFactory} from "@splitter/contracts/SplitterDynamicFactory.sol";
import {SplitterDynamic} from "@splitter/contracts/SplitterDynamic.sol";

contract SplitterDynamicFactoryScript is Script {
    SplitterDynamicFactory public splitterDynamicFactory;
    //SplitterDynamic public splitterDynamic;

    address[] members = [
        0x5cBf2D4Bbf834912Ad0bD59980355b57695e8309,
        0x63c3774531EF83631111Fe2Cf01520Fb3F5A68F7
    ];
    uint16[] percentages = [40_00, 60_00];

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        splitterDynamicFactory = new SplitterDynamicFactory();

        /*
        splitterDynamic = SplitterDynamic(
            splitterDynamicFactory.createDynamicSplitter(
                0x5cBf2D4Bbf834912Ad0bD59980355b57695e8309,
                "SplitterDynamicTest",
                "DST",
                "https://example.com/",
                0.000001 ether,
                10_00,
                50_00,
                1_00,
                100,
                false,
                members,
                percentages
            )
        );
        */

        vm.stopBroadcast();

    }
}
