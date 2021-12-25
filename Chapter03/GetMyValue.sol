// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract GetMyValue {
    uint public myUint = 20;

    function setMyUint(uint newUint) public {
        myUint = newUint;
    }
}