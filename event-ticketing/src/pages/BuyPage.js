//contract address: 0x5FbDB2315678afecb367f032d93F642f64180aa3 goerli is 0x9f125B256910F074cCe8c2854eAc4Be4686Fd3f2
//import PropTypes from 'prop-types';

import React, { useState, useEffect } from 'react';

import { ethers } from 'ethers';

import EventTicketing from '../abis/EventTicketing.json'; // Import the ABI of your contract

// Config
//import config from './config.json'

const BuyPage = () => {
 
  const [tickets, setTickets] = useState([]);

  //const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null);

  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState("");
  
  
 /*  useEffect(() => {
    if (window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

    useEffect(() => {
    if (provider && props.contractAddress) {
      const contract = new ethers.Contract(props.contractAddress, EventTicketingABI, provider);
      console.log(EventTicketingABI);
      props.setContract(contract); 
    }
  }, [provider, props.contractAddress]); 
  */

 /*  useEffect(() => {
    if (provider ) {
       //console.log(contract.target);
       props.setContract(props.contract); // use the same event that was last deployed until above code i can get to work
       // console.log (contract);
    }
  }, [provider]);

 */
  useEffect(() => {
    const fetchTickets = async () => {
      if (contract) {
        const totalTickets = await contract.getNumTicketsMinted();
        console.log ("total minted tickets so far:", totalTickets.toString());
       
        const tickets = [];
        for (let i = 0; i < totalTickets; i++) {
          // Assuming your contract has a function to get the details of a ticket by its ID
          const ticket = await contract.tickets(i);
          tickets.push(ticket);
        }
        setTickets(tickets);
      }
    };
    fetchTickets();
  }, [contract]);



  const loadBlockchainData = async () => {
   
    const provider = new ethers.BrowserProvider(window.ethereum)
    console.log(provider);

    setProvider(provider);
    
    console.log(contractAddress, provider, EventTicketing.abi);
    const eventTicketing = new ethers.Contract(contractAddress, EventTicketing.abi, provider)
    console.log(eventTicketing)
   
    setContract(eventTicketing)

   /*  window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.getAddress(accounts[0])
      setAccount(account)
    }) */
  }

  useEffect(() => {
    {
      loadBlockchainData();
    }
  }, [contractAddress]);
  

  const buyTicket = async (_seat) => {
    const cost = ethers.parseUnits('1', 'ether')
    if (contract) {
        const numMinted = await contract.getNumTicketsMinted();
        console.log("minted",numMinted.toString());
        console.log("seat requested:", _seat);
        const signer = await provider.getSigner()
        console.log("signer is:", signer);
        const transaction = await contract.connect(signer).buyTicket(_seat, 0, { value: cost } )
        await transaction.wait()
    }
  }; 

  return (
    <div>
          <div> <h1 className='header'>BCAMP 2023 - BUY YOUR TICKET NOW!</h1></div>
        <p>Please enter the smart contract address of your event in the field below:</p>
      <input
        type="event smart contract address here"
        placeholder="Enter contract address"
        onChange={(e) => setContractAddress(e.target.value)}
      />
    
    {tickets.map((ticket, index) => (
        <div key={index}>
          <h2>Ticket {index + 1}</h2>
          <p>Seat Number: {ticket.seatNumber}</p>
          <p>Cost: {ethers.formatEther(ticket.cost)} ETH</p>
          <button onClick={() => buyTicket(index)}>Buy</button>
        </div>
      ))}

    <button className='showTickets' onClick={async() => 
        {
         console.log("contract is: ", contract);
        }
        }>Show Event Tickets!</button>
    <label>Your Wallet Address: {}</label>
    <label>Number of Tickets Left: {}</label>
    </div>
  );
};

export default BuyPage;
