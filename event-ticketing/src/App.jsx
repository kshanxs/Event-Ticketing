import { ethers } from 'ethers';
import { useState } from 'react';
import eventTicketingArtifact from './EventTicketing.json';  
import './App.css'; // Import the app.css file



// ...existing component code...

const App = () => {
  const [maxTickets, setMaxTickets] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const provider = new ethers.BrowserProvider(window.ethereum);

  const deployContract = async () => {
    const signer = await provider.getSigner();
    const EventTicketingABI = eventTicketingArtifact.abi;
    const EventTicketingBytecode = eventTicketingArtifact.bytecode;
    

    const EventTicketingFactory = new ethers.ContractFactory(EventTicketingABI, EventTicketingBytecode, signer);
    

    const eventTicketing = await EventTicketingFactory.deploy(
      maxTickets, 
      eventLocation, 
      eventName, 
      eventTime
    );

    setContractAddress(eventTicketing.target);
    console.log("EventTicketing deployed to:", eventTicketing.target);
  };

  

  return (
    <div>
      <div className='header'>BCAMP 2023 - Event Ticketing Dapp</div>
      <p>Please enter your event data by filling out the fields below:</p>
      <div className='App'>
        <input value={maxTickets} onChange={(e) => setMaxTickets(e.target.value)} placeholder="Max Tickets" />
        <input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Event Location" />
        <input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Event Name" />
        <input value={eventTime} onChange={(e) => setEventTime(e.target.value)} placeholder="Event Time (eg. 1703484000)" />
        <button className='deploy-button' onClick={deployContract}>Create Event</button>
        <label value={contractAddress}></label>
      </div>
    </div>
  );
  
}

export default App;
