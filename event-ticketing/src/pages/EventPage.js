import React from 'react';
import PropTypes from 'prop-types';

const EventPage = (props) => {
  
    return (
      <div>
        <div> <h1 className='header'>BCAMP 2023 - Event Ticketing Dapp</h1></div>
        <p>Please enter your event data by filling out the fields below:</p>
        <div className='App'>
          <input value={props.maxTickets} onChange={(e) => props.setMaxTickets(e.target.value)} placeholder="Max Tickets" />
          <input value={props.eventLocation} onChange={(e) => props.setEventLocation(e.target.value)} placeholder="Event Location" />
          <input value={props.eventName} onChange={(e) => props.setEventName(e.target.value)} placeholder="Event Name" />
          <input value={props.eventDate} onChange={(e) => props.setEventDate(e.target.value)} placeholder="Event Date (2023-07-10)" />
          <input value={props.eventTime} onChange={(e) => props.setEventTime(e.target.value)} placeholder="Event Time (12:00)" />
          <button className='deploy-button' onClick={props.deployContract}>Create Event</button>
          <label value={props.contractAddress}></label>
        </div>
      </div>
    );
  };



  EventPage.propTypes = {
    maxTickets: PropTypes.string.isRequired,
    setMaxTickets: PropTypes.func.isRequired,
    eventLocation: PropTypes.string.isRequired,
    setEventLocation: PropTypes.func.isRequired,
    eventName: PropTypes.string.isRequired,
    setEventName: PropTypes.func.isRequired,
    eventDate: PropTypes.string.isRequired,
    setEventDate: PropTypes.func.isRequired,
    eventTime: PropTypes.string.isRequired,
    setEventTime: PropTypes.func.isRequired,
    deployContract: PropTypes.func.isRequired,
    contractAddress: PropTypes.string.isRequired};

  export default EventPage;
  