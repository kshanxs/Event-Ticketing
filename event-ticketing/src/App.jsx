import React from 'react';
import { ethers } from 'ethers';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BuyPage from './pages/BuyPage';
import EventPage from './pages/EventPage';

// ABIs
import eventTicketingArtifact from './abis/EventTicketing.json';  

// Styling
import './App.css';

const App = () => {
  const [maxTickets, setMaxTickets] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [contract, setContract] = useState(null);
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
    console.log("calling deployContract")
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

    setContract(eventTicketing);
    setContractAddress(eventTicketing.target);
    console.log("EventTicketing deployed to:", eventTicketing.target);
  };

  

  return (
    
    <Router>
   
      <Routes>
      <Route path="/" element={ <EventPage 
                                  maxTickets={maxTickets}
                                  setMaxTickets={setMaxTickets}
                                  eventLocation={eventLocation}
                                  setEventLocation={setEventLocation}
                                  eventName={eventName}
                                  setEventName={setEventName}
                                  eventDate={eventDate}
                                  setEventDate={setEventDate}
                                  eventTime={eventTime}
                                  setEventTime={setEventTime}
                                  contract={contract}
                                  setContract={setContract}
                                  contractAddress={contractAddress}
                                  setContractAddress={setContractAddress}
                                  deployContract={deployContract}
                                /> } />
          <Route path="/buy" element={ <BuyPage 
                                     

                                              />} />
        </Routes>
    </Router>
  );
  
}

export default App;
