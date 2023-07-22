# Event-Ticketing_June2023

Installation & Configuration Instructions <b><i>(For Local Host Only)</b></i><br>
Step 1 ```git clone https://github.com/0xBcamp/Event-Ticketing_June2023.git```<br>
Step 2:```npm install```<br>
Step 3:```npm run compile```<br>
Step 4:```npm run test```<br>
Step 5: ```npm run node```<br>
Step 6: ```npm run deploy```<br>
Step 7: ```cd event-ticketing```<br>
Step 8: ```npm install```<br>
Step 9: ```npm run start```<br>
Step 10: ```Navigate to http://localhost:3000/```<br>
Step 11: ```Navigate to http://localhost:3000/buy```<br>




***Event Creators can:***
1. Create an Event.
2. Mint Tickets.
3. Create Tickets with specific pricing.
4. Generate QR Codes for each seat.

***Event Participants can:***

1. View the available Tickets for an Event (and which have sold and to whom)
2. Buy and NFT Ticket which includes a QR Code for scanning


***Future Growth***
1. Transfer/Sell NFT Ticket on 3rd party marketplace
2. Find events
3. Share an event
4. Receive Email with Receipt including NFT, QR Code, Event Details.
5. Have the possibility of a refund
6. Buy more than one ticket up to a maximum
7. Buy a ticket for someone else
8. Acquire loyalty rewards
9. Acquire VIP status
10. Claim various roles (ticket validators, admin, etc.)
11. Receive a discount for buying multiple tickets
12. Receive a discount for buying early
13. Have their ticket verified (scan QR code)
14. Be given access to an event (after ticket verified)


***List of Security Concerns To Address:***
1. Could implement Attestations (Verify the Ticket truly belongs to the person who claims it)<br>
https://github.com/orgs/ethereum-optimism/projects/31/views/3?pane=issue&itemId=26603748 <br>
https://docs.attest.sh/docs/learn/attestations <br>
https://community.optimism.io/docs/identity/atst-v1/ <br>
https://www.optimism.io/attestation-terms <br>
   https://docs.attest.sh/docs/Use%20Cases/ticketing-systems <br>
3. Need to prevent scalping
3. Need to prevent bots
4. Need to prevent fraud
5. Need to prevent double spending
6. Neet to prevent front-running


 