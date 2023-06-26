// SPDX-License-Identifier: None
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @custom:security-contact @Bigbadbeard
contract MyToken is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    //struct for managing ticket info
    //Seat #
    //Cost to buy
    //Date for ticket
    //hasBeenUsed Variable bool

    //struct for ticket scanner addresses

    //Add permission role for ticket scanner 


    constructor() ERC721("MyToken", "MTK") {}

    function _baseURI() internal pure override returns (string memory) {
        return "http://www.tobedetermined.com";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        //require that total mint is less than or equal total ticket numbers
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    //function addTicketScannerRole
    //Adds to struct of ticket scanner

    //function scanTicket
    //Will toggle hasBeenUsed variable

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    //function to revoke ticket
    //function would alter URI so that QR code is no longer visible

    //function listEventLocation()
    //Lists the location of the event

    //function listEventTime()
    //Lists the Time and Date of the Event

    //function listEvent ()
    //List an Event
    //This can be done by_______?smart contract owner? or anyone?

    //function removeEvent ()
    //Removes an Event.
    //This can be done by the the event creator only
    //If the event has tickets sold, then the event cannot be removed

    //function getEvents()
    //Get a list of events
    //This can be done by anyone

    //function buy()
    // Buy the NFT and get the ticket
    // Calls the mint function plus some other stuff:
        // Options might be:
            // Implement premium ticket options, tiers or packages that include perks like backstage passes, meet-and-greets, or exclusive merchandise
            // Incorporate a loyalty program that rewards users for their ticket purchases and engagement.
            // Issue loyalty points that can be redeemed for discounts, exclusive offers, or priority access to future events.
            // Include dynamic pricing, auctions.
        // This function should be called by the user


    //function withdraw()
    // Withdraw the money from the sale of the ticket
    //(best practice is to hold the money in escrow, and require user to withdraw)

    //isExpired()
    // Checks if the ticket or event is expired (not sure if we want or need to do this on chain?)
    //Checks if ticket has already been scanned 

    //seatAvailable()
    // Checks if a seat is available (not sure if we want or need to do this on chain?)

    //getLoyaltyPoints()
    // Get the loyalty points for a user (not sure if we want or need to do this on chain?)
    // Not sure how this would work just yet.

}
