import React, { ethers } from 'ethers';
import { useState } from 'react';
import eventTicketingArtifact from './EventTicketing.json';  
import './App.css'; // Import the app.css file



// ...existing component code...

const App = () => {
  const [maxTickets, setMaxTickets] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const provider = new ethers.BrowserProvider(window.ethereum);

  let eventDateTimeInUint256 = 0;

  const convertDateTime = async () => {
    const eventDateTime = `${eventDate} ${eventTime}`;
    const dateObject = new Date(eventDateTime);
    const unixTimestamp = dateObject.getTime();
    const unixTimestampInSeconds = Math.floor(unixTimestamp / 1000);
    const timeInUint256 = dateObject.getHours() * 3600 + dateObject.getMinutes() * 60;
    eventDateTimeInUint256 = unixTimestampInSeconds * Math.pow(2, 128) + (timeInUint256);
  }

  const deployContract = async () => {
    const signer = await provider.getSigner();
    const EventTicketingABI = eventTicketingArtifact.abi;
    const EventTicketingBytecode = eventTicketingArtifact.bytecode;
    
    const EventTicketingFactory = new ethers.ContractFactory(EventTicketingABI, EventTicketingBytecode, signer);
    
    convertDateTime();

    const eventTicketing = await EventTicketingFactory.deploy(
      maxTickets, 
      eventLocation, 
      eventName, 
      BigInt(eventDateTimeInUint256)
    );

    setContractAddress(eventTicketing.target);
    console.log("EventTicketing deployed to:", eventTicketing.target);
  };

  

  return (
    
    <div>
      <div> <h1 className='header'>BCAMP 2023 - Event Ticketing Dapp</h1></div>
      <p>Please enter your event data by filling out the fields below:</p>
      <div className='App'>

        <input value={maxTickets} onChange={(e) => setMaxTickets(e.target.value)} placeholder="Max Tickets" />
        <input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Event Location" />
        <input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Event Name" />
        <input value={eventDate} onChange={(e) => setEventDate(e.target.value)} placeholder="Event Date (2023-07-10)" />
        <input value={eventTime} onChange={(e) => setEventTime(e.target.value)} placeholder="Event Time (12:00)" />
        <button className='deploy-button' onClick={deployContract}>Create Event</button>
        <label value={contractAddress}></label>
      </div>
    </div>
  );
  
}

export default App;
