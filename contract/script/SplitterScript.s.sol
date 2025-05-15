// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {SplitterFactory} from "../src/SplitterFactory.sol";

contract SplitterScript is Script {
    SplitterFactory public splitterFactory;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        splitterFactory = new SplitterFactory();

        vm.stopBroadcast();
    }
}
