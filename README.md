# Event-Ticketing_June2023

Installation & Configuration Instructions Below:
Step 0:```git clone https://github.com/0xBcamp/Event-Ticketing_June2023.git```
Step 1:```npm install``````
Step 2:```npm run compile```
Step 3:```npm run test```
Step 4: ```npm run node```
Step 5: ```npm run deploy```
Step 6: ```cd event-ticketing```
Step 7: ```npm install```
Step 8: ```npm run start```
Step 9: ```Navigate to http://localhost:3000/```
Step 10: ```Navigate to http://localhost:3000/buy```




NFT Ticket/Event Attributes: <br>  
                    Event Name <br>
                    Event Address<br>
                    Event Start Date<br>
                    Event End Date<br>
                    Event Start Time<br>
                    Event End Time<br>
                    Event Timezone<br><br>

***Users can:***
(Some of these won't be implemented in the first version.)

1. Buy/Claim NFT Ticket
2. Transfer/Sell NFT Ticket on 3rd party marketplace
3. Find events
4. Share an event
5. Receive Email with Receipt including NFT, QR Code, Event Details.
6. Have the possibility of a refund
7. Buy more than one ticket up to a maximum
8. Buy a ticket for someone else
9. Acquire loyalty rewards
10. Acquire VIP status
11. Claim various roles (ticket validators, admin, etc.)
12. Receive a discount for buying multiple tickets
13. Receive a discount for buying early
14. Have their ticket verified (scan QR code)
15. Be given access to an event (after ticket verified)


***Security Concerns:***
1. Need to implement Attestations - TBD (Verify the Ticket truly belongs to the person who claims it)<br>
https://github.com/orgs/ethereum-optimism/projects/31/views/3?pane=issue&itemId=26603748 <br>
https://docs.attest.sh/docs/learn/attestations <br>
https://community.optimism.io/docs/identity/atst-v1/ <br>
https://www.optimism.io/attestation-terms <br>
   https://docs.attest.sh/docs/Use%20Cases/ticketing-systems <br>
3. Need to prevent scalping
3. Need to prevent bots
4. Need to prevent fraud
5. Need to prevent double spending


 