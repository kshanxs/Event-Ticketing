import React from 'react';
//import { useState } from 'react';
import PropTypes from 'prop-types';

//import React, { useState, useEffect } from 'react';
//import { useParams } from 'react-router-dom';
//import axios from 'axios';
//import { ethers } from 'ethers';
//import EventTicketingABI from '../abis/EventTicketing.json'; // Import the ABI of your contract

const BuyPage = ({event}) => {
  //const [contractAddress, setContractAddress] = useState('');
  /*const [tickets, setTickets] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new ethers.providers.Web3Provider(window.ethereum));
    }
  }, []);

  useEffect(() => {
    if (provider && contractAddress) {
      const contract = new ethers.Contract(contractAddress, EventTicketingABI, provider);
      setContract(contract);
    }
  }, [provider, contractAddress]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (contract) {
        // Assuming your contract has a function to get the total number of tickets
        const totalTickets = await contract.getNumTicketsMinted();
        const tickets = [];
        for (let i = 0; i < totalTickets; i++) {
          // Assuming your contract has a function to get the details of a ticket by its ID
          const ticket = await contract.getTicket(i);
          tickets.push(ticket);
        }
        setTickets(tickets);
      }
    };
    fetchTickets();
  }, [contract]);

  const buyTicket = async (ticketId) => {
    if (contract) {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      // Assuming your contract has a function to buy a ticket by its ID
      await contractWithSigner.buyTicket(ticketId);
    }
  }; */

  return (
    <div>
      <input
        type="event smart contract address here"
        placeholder="Enter contract address"
       // onChange={(e) => setContractAddress(e.target.value)}
      />
    
     {/*  {tickets.map((ticket, index) => (
        <div key={index}>
          <h2>Ticket {index + 1}</h2>
          <p>Seat Number: {ticket.seatNumber}</p>
          <p>Cost: {ethers.utils.formatEther(ticket.cost)} ETH</p>
          <button onClick={() => buyTicket(index)}>Buy</button>
        </div>
      ))} */}
    </div>
  );
};

BuyPage.propTypes = {
    event: PropTypes.any.isRequired,
  };

export default BuyPage;
