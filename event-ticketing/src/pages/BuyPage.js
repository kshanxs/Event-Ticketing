//contract address: 0x5FbDB2315678afecb367f032d93F642f64180aa3 goerli is 0x9f125B256910F074cCe8c2854eAc4Be4686Fd3f2
//import PropTypes from 'prop-types';
import qrCode from '../assets/qrcode.png'

import React, { useState, useEffect } from 'react';

import { ethers } from 'ethers';

import EventTicketing from '../abis/EventTicketing.json'; // Import the ABI of your contract

// Config
//import config from './config.json'

const BuyPage = () => {
 
    const [tickets, setTickets] = useState([]);
    const [provider, setProvider] = useState(null);
    const [eventName, setEventName] = useState(null);
    const [eventDate, setEventDate] = useState(null);
    const [eventTime, setEventTime] = useState(null);
    const [eventLocation, setEventLocation] = useState(null);
   // const [maxTickets, setMaxTickets] = useState(null);
    const [contract, setContract] = useState(null);
    const [contractAddress, setContractAddress] = useState('');
    //const [ticketPurchase, setTicketPurchase] = useState(false);

    const AddressZero = '0x0000000000000000000000000000000000000000';

    const convertDateTimeToString = async (time) => {
      const pow2_128 = BigInt(2) ** BigInt(128);
      const unixTimestampInSeconds = time / pow2_128;
      const timeInUint256 = time % pow2_128;
    
      const dateObject = new Date(Number(unixTimestampInSeconds) * 1000);
      const hours = Number(timeInUint256 / 3600n);
      const minutes = Number((timeInUint256 % 3600n) / 60n);
    
      const year = dateObject.getUTCFullYear();
      const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0');
      const day = String(dateObject.getUTCDate()).padStart(2, '0');
      const hoursString = String(hours).padStart(2, '0');
      const minutesString = String(minutes).padStart(2, '0');
    
      const formattedDateTime = `${year}-${month}-${day} ${hoursString}:${minutesString}`;
      return formattedDateTime;
    };
    
      

  
  useEffect(() => {
    const fetchTickets = async () => {
      if (contract) {
        const totalTickets = await contract.getNumTicketsMinted();// later this needs to be
        console.log ("total minted tickets so far:", totalTickets.toString());


 setEventName(await contract.eventName());
 const time = await contract.eventTime();
 console.log(time.toString())
 const formattedDateTime = await convertDateTimeToString(time);
 const [datePart, timePart] = formattedDateTime.split(" ");
 setEventTime(timePart); // Output: "2023-07-21
 setEventDate(datePart); // Output: "2023-07-21

 setEventLocation(await contract.eventLocation());

       
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
      
        console.log("ticket is", contract.tickets[signer]);
        console.log("signer is:", signer);
        const transaction = await contract.connect(signer).buyTicket(_seat, 0, { value: cost } )
        await transaction.wait()
        //setTicketPurchase(true);
    }
  }; 

  return (
    <div>
       
    {contractAddress != '' && (
        <div>
          <h1 className="header">{eventName}</h1>
          <div className="event-details">
          <p><b>Event Time:</b> {eventTime}</p>
          <p><b>Event Date:</b> {eventDate}</p>    
          <p><b>Event Location:</b> {eventLocation}</p>
        </div>
        </div>
      )}
    

        <div className='buy-page-address'>Please enter the smart contract address of your event in the field below:</div>
        <br></br>
      <input
        placeholder="Enter contract address"
        onChange={(e) => setContractAddress(e.target.value)}
      />
      <br></br>
      <br></br>
      {contractAddress != '' && (
        <div>
    <p><b>Please purchase a ticket from the available tickets:</b></p>
    <div className="ticket-container">
   
   

{tickets.map((ticket, index) => (
  <div key={index} className={`ticket-tile ${ticket.purchaser === 0 ? 'grayed-out' : ''}`}>
  <div className='container'>
   <div>
    <h2>Ticket {index + 1}</h2><br></br>
    <p><b>Seat Number:</b> {ticket.seatNumber.toString()}</p>
    <p><b>Cost:</b> {ethers.formatEther(ticket.cost)} ETH</p>
    {ticket.purchaser === AddressZero ? (
      <p>This ticket is available for purchase.</p>
    ) : (
      <p>This ticket has been purchased by address: {ticket.purchaser}</p>
      
    )}
   
    <button onClick={() => buyTicket(index)} disabled={ticket.purchaser !== AddressZero}>
      {ticket.purchaser === AddressZero ? 'Buy' : 'Sold'}
    </button>
    </div>
    <div>
    <img src={qrCode} alt="QR Code" />
      </div>
      </div>
  </div>
  
))}


</div>

<button className="showTickets" onClick={async () => loadBlockchainData()}>
      Refresh Tickets!</button>
   
     </div> )}
    </div>
    
  );
};

export default BuyPage;
