// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable {
    string baseURILink; 
    uint256 private _nextTokenId;

    function _baseURI() internal view override returns (string memory) {
        return baseURILink;
    }
    


    constructor(address initialOwner, string memory name, string memory symbol, string memory _baseURI_)
        ERC721(name, symbol)
        Ownable(initialOwner)
    {
        baseURILink = _baseURI_;
    }

    function safeMint(address to) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }
}