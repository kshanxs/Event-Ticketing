import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
//import QRWriter from '../../../src/qrwriter.js' doesn't like the location.

import { ethers } from 'ethers';

const EventPage = props => {

    const [eventCreated, setEventCreated] = useState(false)

  // For Minting Tickets
  const [numTicketsToMint, setNumTicketsToMint] = useState(props.maxTickets)
  const [ticketsMinted, setTicketsMinted] = useState(0)
  const [ticketsCreated, setTicketsCreated] = useState(0)
  const [qrCodesCreated, setQRCodesCreated] = useState(0)

  // For Creating Tickets
  const [showModal, setShowModal] = useState(false)
  const [ticketId, setTicketId] = useState('')
  const [seatNumber, setSeatNumber] = useState('')
  const [cost, setCost] = useState(ethers.parseUnits('0', 'ether'))
  const [errorMsg, setErrorMsg] = useState('')

  const mintTickets = async (_numTickets) => {
    for (let i = 0; i < _numTickets; i++) {
      const tx = await props.contract.safeMint()
      await tx.wait()
      setTicketsMinted(ticketsMinted+1)
    }
  }

  const createTickets = async e => {
    e.preventDefault() // prevent the default form submission

    try {
      const dateAndTime = BigInt(props.eventDateTime);
      console.log(dateAndTime);

      await props.contract.createTicket(ticketId, seatNumber, cost, dateAndTime )
      setTicketsCreated(ticketsCreated+1)

      console.log("created a ticket");

      // clear the inputs and close the modal after successful creation
      setTicketId('')
      setSeatNumber('')
      setCost(ethers.parseUnits('0', 'ether'))
      setShowModal(false)
      setErrorMsg('')
      
    } catch (error) {
      // handle error and display a message
      setErrorMsg(error.message)
    }
  }

  const showCreateModal = async () => {
    console.log('showing modal')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const simulateQRCodes = async () => {
    const num = await props.contract.getNumTicketsMinted()
    setQRCodesCreated (num)
  }

  useEffect(() => {
    const fetchTicketsMinted = async () => {
        if (eventCreated){
      const num = await props.contract.getNumTicketsMinted()
      setTicketsMinted(num.toString())
        }
    }

    fetchTicketsMinted()
  }, [props.contract])

  return (
    <div>
      <div>
        {' '}
        <h1 className='header'>Event Creation Dashboard</h1>
      </div>
      
        <h2>Step 1: Please enter your event data by filling out the fields below:</h2>
      
      <div className='App'>
        <input value={props.maxTickets} onChange={e => props.setMaxTickets(e.target.value)} placeholder='Max Tickets' />
        <input
          value={props.eventLocation}
          onChange={e => props.setEventLocation(e.target.value)}
          placeholder='Event Location'
        />
        <input value={props.eventName} onChange={e => props.setEventName(e.target.value)} placeholder='Event Name' />
        <input value={props.eventDate} onChange={(e) => props.setEventDate(e.target.value)} placeholder="Event Date (2023-07-10)" />
        <input
          value={props.eventTime}
          onChange={e => props.setEventTime(e.target.value)}
          placeholder='Event Time (12:00)'
        />
        <button onClick={() => { props.deployContract(); setEventCreated(); }}>Create Event</button>
        {props.contractAddress !== '' && (
          <>
            <label>
              <b>Contract deployed to: </b>
              {props.contractAddress}
            </label>
            <hr></hr>
            <h2>Step 2: Mint Your Tickets!</h2>
            
            <div className='container'>
              <div className='button-container'>
                <button disabled={ticketsMinted >= props.maxTickets} onClick={() => mintTickets(numTicketsToMint)}>
                  Mint Tickets
                </button>
                <input
                  disabled={ticketsMinted >= props.maxTickets}
                  className='mint-input'
                  value={numTicketsToMint}
                  onChange={e => setNumTicketsToMint(e.target.value)}
                  placeholder={props.maxTickets}
                />
                {ticketsMinted < props.maxTickets && <label className='note'> Default is preset to Max Tickets...</label>}
                {ticketsMinted >= props.maxTickets && <label className='note'> Max Tickets Minted</label>}
              </div>
              <p>
                <b>Number of tickets minted:</b> {ticketsMinted} <b>of</b> {props.maxTickets} available.
              </p>
              <p>
                <b>Tickets left to mint:</b> {props.maxTickets - ticketsMinted}
              </p>
            </div>
            <hr></hr>
              <h2>Step 3: Create Your Tickets!</h2>
            
            <div className='container'>
              <div className='button-container'>
            
                <button disabled={ticketsCreated >= ticketsMinted} onClick={() => showCreateModal()}>Create Ticket(s)</button>
                 
                {ticketsCreated < ticketsMinted && <label className='note'> You can create tickets up to the Max Minted So Far...</label>}
                {ticketsCreated >= ticketsMinted && <label className='note'> Please Mint More Tickets</label>}
              </div>
              <p>
                <b>Number of tickets created:</b> {ticketsCreated} <b>of</b> {ticketsMinted} minted.
              </p>
              <p>
                <b>Tickets left to create:</b> {ticketsMinted - ticketsCreated}
              </p>
            </div>

            <hr></hr>
              <h2>Step 4: Generate QR Codes!</h2>
              <div className='container'>
              <div className='button-container'>
            
                <button disabled={ticketsCreated == 0 || qrCodesCreated==ticketsCreated} onClick={() => simulateQRCodes()}>Generate QR(s)</button>
                 
                {ticketsCreated > 0 && qrCodesCreated !== ticketsCreated && <label className='note'> Generates 1 QR per Ticket</label>}
                {ticketsCreated === 0 || qrCodesCreated === ticketsCreated && <label className='note'> Please Create more Tickets</label>}

              </div>
              <p>
                <b>Number of QR Codes created:</b> {qrCodesCreated.toString()}
              </p>
              
            </div>
            

            {showModal && (
              <div className='modal'>
                <form onSubmit={createTickets}>
                  <input
                    value={ticketId}
                    onChange={e => setTicketId(e.target.value)}
                    placeholder='Ticket ID'
                    required
                  />
                  <input
                    value={seatNumber}
                    onChange={e => setSeatNumber(e.target.value)}
                    placeholder='Seat Number'
                    required
                  />
                  <input value={cost} onChange={e => setCost(e.target.value)} placeholder='Cost' required />
                  
                  <input type='submit' value='Submit' />
                </form>
                <div className='close-icon' onClick={closeModal}>
                  ⓧ
                </div>
                {errorMsg && <div className='error-message'>{errorMsg}</div>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

EventPage.propTypes = {
  maxTickets: PropTypes.string.isRequired,
  setMaxTickets: PropTypes.func.isRequired,
  eventLocation: PropTypes.string.isRequired,
  setEventLocation: PropTypes.func.isRequired,
  eventName: PropTypes.string.isRequired,
  setEventName: PropTypes.func.isRequired,
  eventDate: PropTypes.string.isRequired,
  setEventDate: PropTypes.func.isRequired,
  eventDateTime: PropTypes.number.isRequired,
  setEventDateTime: PropTypes.func.isRequired,
  eventTime: PropTypes.string.isRequired,
  setEventTime: PropTypes.func.isRequired,
  contract: PropTypes.object.isRequired,
  deployContract: PropTypes.func.isRequired,
  contractAddress: PropTypes.string.isRequired,
  setContractAddress: PropTypes.func.isRequired,
}

export default EventPage
