// SPDX-License-Identifier: None
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @custom:security-contact @Bigbadbeard
contract EventTicketing is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, AccessControl {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    //setting up max ticket numbers
    uint256 public maxTickets;
    //Setting up event location
    string public eventLocation;
    //Setting up event time
    uint256 public eventTime;
    //Setting up event Name
    string public eventName;

    //Adding role setup for ticket scanner and mapping for 
    bytes32 public constant TICKET_SCANNER_ROLE = keccak256("TICKET_SCANNER_ROLE");
    mapping(address => uint256) public ticketScannerAddresses;

    //Setting up ticket struct and related info
    struct Ticket {
        uint256 seatNumber; // Seat number
        uint256 cost; // Cost to buy
        uint256 date; // Date for ticket, this will be stored as a timestamp
        bool hasBeenScanned; // Boolean variable indicating if the ticket has been used
        bool isValid; // Boolean varible for if ticket has passed event date
    }

    // Create a mapping from ticket IDs to Ticket structs
    mapping(uint256 => Ticket) public tickets;

    //ticket scanning event 
    event TicketScanned(uint256 ticketId, address scanner);
    //ticket revoking event
    event TicketRevoked(uint256 ticketId);


    constructor(uint256 _maxTickets, string memory _eventLocation, string memory _eventName, uint256 _eventTime) ERC721("EventTicketing", "EVTK") {
        maxTickets = _maxTickets;
        eventLocation = _eventLocation;
        eventTime = _eventTime;
        eventName = _eventName;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "http://www.tobedetermined.com";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        //setting up revert if someone tries to mint more tokens 
        require(tokenId <= maxTickets, "Max number of tickets already minted");
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function setupTicketScannerRoles(address ticketScanner) public onlyOwner {
        grantRole(TICKET_SCANNER_ROLE, ticketScanner);
    }

    function createTicket(uint256 _ticketId, uint256 _seatNumber, uint256 _cost, uint256 _date) public {
        // Create a new Ticket struct in memory
        Ticket memory newTicket = Ticket({
            seatNumber: _seatNumber,
            cost: _cost,
            date: _date,
            hasBeenScanned: false,
            isValid: true
        });

        // Store the new ticket in the tickets mapping
        tickets[_ticketId] = newTicket;
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

    function scanTicket(uint256 ticketId) public onlyRole(TICKET_SCANNER_ROLE) {
        require(tickets[ticketId].date != 0, "Ticket doesn't exist!");
        require(tickets[ticketId].isValid != false, "Ticket must be valid!");
        tickets[ticketId].hasBeenScanned = true;
        emit TicketScanned(ticketId, msg.sender);
    }

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
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    //function to revoke ticket
    function revokeTicket(uint256 ticketId) public onlyOwner {
        require(tickets[ticketId].date != 0, "Ticket doesn't exist!");
        tickets[ticketId].isValid = false;
        emit TicketRevoked(ticketId);
    }

/*
//////////////////////////////Saving for later if needed\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//#####################################################################################//
    //// function listEvent ()
    //// List an Event
    //// This can be done by_______?smart contract owner? or anyone?

    //// function removeEvent ()
    //// Removes an Event.
    //// This can be done by the the event creator only
    //// If the event has tickets sold, then the event cannot be removed

    // function getEvents()
    // Get a list of events
    // This can be done by anyone

    //function buy()
    // Buy the NFT and get the ticket
    // Calls the mint function plus some other stuff:
        // Options might be:
            // Implement premium ticket options, tiers or packages that include perks like backstage passes, meet-and-greets, or exclusive merchandise
            // Incorporate a loyalty program that rewards users for their ticket purchases and engagement.
            // Issue loyalty points that can be redeemed for discounts, exclusive offers, or priority access to future events.
            // Include dynamic pricing, auctions.
        // This function should be called by the user


    //getLoyaltyPoints()
    // Get the loyalty points for a user (not sure if we want or need to do this on chain)
//########################################################################################//
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\Saving the above for later if needed/////////////////////*/

    //function withdraw()
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    //isValid()
    function isValid(uint256 ticketId) public view returns(bool) {
        require(tickets[ticketId].isValid != false, "Ticket doesn't exist!");
        bool _isValid = tickets[ticketId].isValid;
        return _isValid;
    }  
}
