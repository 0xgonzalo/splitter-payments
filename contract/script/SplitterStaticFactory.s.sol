// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {SplitterStaticFactory} from "@splitter/contracts/SplitterStaticFactory.sol";
import {SplitterStatic} from "@splitter/contracts/SplitterStatic.sol";

contract SplitterStaticFactoryScript is Script {
    SplitterStaticFactory public splitterStaticFactory;
    //SplitterStatic public splitterStatic;

    address[] public members = [
        0x5cBf2D4Bbf834912Ad0bD59980355b57695e8309,
        0x63c3774531EF83631111Fe2Cf01520Fb3F5A68F7
    ];
    uint16[] public percentages = [40_00, 60_00];

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        splitterStaticFactory = new SplitterStaticFactory();

        /*
        splitterStatic = SplitterStatic(
            splitterStaticFactory.createStaticSplitter(
                0x5cBf2D4Bbf834912Ad0bD59980355b57695e8309,
                "SplitterDynamicTest",
                "DST",
                "https://example.com/",
                0.000001 ether,
                10_00,
                false,
                members,
                percentages
            )
        );
        */

        vm.stopBroadcast();
    }
}
