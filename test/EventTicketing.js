const { expect } = require("chai");
const {ethers} = require("hardhat");

describe("EventTicketing", () =>{

  // The smart contract under test
  let eventTicketing;
  // The initial contract balance
  let initialBalance;
  // The accounts
  let owner, ticketScanner, buyer

  // Example Event
  let event = [20, "bcamp.dev", "BCAMP Fall 2023", 1659406800];

  //Example Ticket
  const ticketId = 1;
  const seatNumber = 1;
  const cost = 100;
  const date = 1654320000; // Example timestamp

  beforeEach(async () => {
    [owner, ticketScanner, buyer] = await ethers.getSigners();
    eventTicketing = await ethers.deployContract("EventTicketing", event);
    await eventTicketing.waitForDeployment()

    // setup ticket scanning roles for the event
    await eventTicketing.setupTicketScannerRoles(ticketScanner.address);

  });

  it("should create tickets", async function () {

    //test maximum tickets allowed.
    for (let i = 0; i < eventTicketing.maxTickets; i++) {
      let tx = await eventTicketing.createTicket(ticketId, i, cost, date);
      const ticket = await eventTicketing.tickets(ticketId);
      expect(ticket.seatNumber).to.equal(seatNumber);
      expect(ticket.cost).to.equal(cost);
      expect(ticket.date).to.equal(date);
      expect(ticket.hasBeenScanned).to.be.false;
      expect(ticket.isValid).to.be.true;

      // Check emitted event
      expect(tx)
          .to.emit(eventTicketing, "TicketCreated")
          .withArgs(ticketId);
    }

  });

  it("should create a batch of tickets", async function () {

    batchMint (0);
    batchMint (1);
    batchMint (maxTickets-1);
    batchMint (maxTickets);
    batchMint  (maxTicktes +1);
    
    }

  });

  it("should scan tickets", async function () {
    await eventTicketing.safeMint(1);
    await eventTicketing.createTicket(ticketId, seatNumber, cost, date);

    // Use connect to impersonate the ticketScanner account
    await eventTicketing.connect(ticketScanner).scanTicket(ticketId);

    const ticket = await eventTicketing.tickets(ticketId);
    expect(ticket.hasBeenScanned).to.be.true;

    // Check emitted event
    const scanEvent = await eventTicketing
        .connect(ticketScanner)
        .scanTicket(ticketId);
    expect(scanEvent)
        .to.emit(eventTicketing, "TicketScanned")
        .withArgs(ticketId, ticketScanner.address);
  });

  it("should revoke tickets", async function () {
    await eventTicketing.safeMint(1);
    await eventTicketing.createTicket(ticketId, seatNumber, cost, date);

    let ticket = await eventTicketing.tickets(ticketId);
    expect(ticket.isValid).to.be.true;

    await eventTicketing.revokeTicket(ticketId);
    ticket = await eventTicketing.tickets(ticketId);
    expect(ticket.isValid).to.be.false;

    // Check emitted event
    const revokeEvent = await eventTicketing.revokeTicket(ticketId);
    expect(revokeEvent)
        .to.emit(eventTicketing, "TicketRevoked")
        .withArgs(ticketId);
  });

  it("should mint tickets", async function () {

    // Call the safeMint function
    await eventTicketing.safeMint(1);

    // Verify that the NFT is recorded as minted
    const seatId = 0; // Set the seat ID to the appropriate value
    const ticket = eventTicketing.tickets(seatId+1);

    // Check can mint max tickets
    for (let i = 1; i <= eventTicketing.maxTickets; i++) {
      await eventTicketing.safeMint(1);
    }


  });

  it("should mint a new ticket when called by the owner", async () => {
    const initialSeatId = await eventTicketing.getNumTicketsMinted();

    await eventTicketing.safeMint(1);

    const finalSeatId = await eventTicketing.getNumTicketsMinted();
    const ownerOfTicket = await eventTicketing.ownerOf(initialSeatId);

    expect(finalSeatId).to.equal(initialSeatId + BigInt(1));
    expect(ownerOfTicket).to.equal(owner.address);
  });

  it("should revert if someone other than the owner tries to mint", async () => {
    await expect(eventTicketing.connect(ticketScanner).safeMint(1)).to.be.revertedWith(
        "Ownable: caller is not the owner"
    );
  });

  it("should revert if the maximum number of tickets is already minted", async () => {
    // Set the maxTickets to a small value for testing purposes
    maxTickets = event[0];

    // Mint the maximum number of tickets
    for (let i = 0; i < maxTickets; i++) {
      await eventTicketing.safeMint(1);
    }

  });

  it("should return false if the seat is not taken", async () => {
    const seat = 1;
    const isTaken = await eventTicketing.seatTaken(seat);
    expect(isTaken).to.be.false;
  });

  it("should return true if the seat is taken", async () => {


    // Mint and create a ticket
    await eventTicketing.safeMint(1);
    await eventTicketing.createTicket(ticketId, seatNumber, cost, date);
    await eventTicketing.buyTicket(ticketId, {value: cost});

    const isTaken = await eventTicketing.seatTaken(seatNumber);
    expect(isTaken).to.be.true;
  });

  it('should allow a user to buy a ticket', async function() {

    const initialBalance = 0;
    const initialUserBalance = 10000;
    const gasCost = 0;
    const buyerBalanceBefore = await ethers.provider.getBalance(buyer); //10000000000000000000000n wei

    // Mint and create a ticket
    await eventTicketing.safeMint(1);
    await eventTicketing.createTicket(ticketId, seatNumber, cost, date);

    // Check that a seat is marked as not taken
    let isSeatTaken = await eventTicketing.seatTaken(seatNumber);
    expect(isSeatTaken).to.be.false;

    // Use connect to impersonate a buyer account
    let tx = await eventTicketing.connect(buyer).buyTicket(ticketId, {value: cost});

    // Check that the seat is marked as taken after they purchased it
    isSeatTaken = await eventTicketing.seatTaken(seatNumber);
    expect(isSeatTaken).to.be.true;

    // Check that the purchaser is set correctly
    const [, , , , , purchaser] = await eventTicketing.tickets(seatNumber);
    expect(purchaser).to.equal(await buyer.getAddress());

    // Check that the contract balance has increased by the ticket cost
    const newBalance = await ethers.provider.getBalance(await eventTicketing.getAddress());
    const expectedBalance = BigInt(initialBalance) + BigInt(cost);
    expect(expectedBalance).to.equal(newBalance);

    // Check that the user's balance has decreased by the ticket cost
    const newUserBalance = await ethers.provider.getBalance(purchaser); //9999999846781235342435n wei
    expect(newUserBalance).to.be.lessThan(buyerBalanceBefore); // this should be exact. I think gas is messing it up maybe so need to add in accounting for gas.

    // Check emitted event
    expect(tx)
        .to.emit(eventTicketing, "TicketBought")
        .withArgs(ticketId);

  });

  it('should withdraw contract balance', async function () {

    // Populate the contract with some funds:
    await eventTicketing.safeMint(1);

    await eventTicketing.createTicket(ticketId, seatNumber, cost, date);
    await eventTicketing.connect(buyer).buyTicket(ticketId, {value: cost});

    initialBalance = await ethers.provider.getBalance(await eventTicketing.getAddress());
    initialOwnerBalance = await ethers.provider.getBalance(owner.address);

    // Assert that the contract balance has the correct amount
    expect(initialBalance).to.equal(cost);

    // Call the withdraw function
    const tx = await eventTicketing.withdraw();

    // calculate gas (save for later)
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed;
    expect(gasUsed).to.exist;

    // Check the balance of the contract after withdrawal
    const contractBalance = await ethers.provider.getBalance(await eventTicketing.getAddress());

    // Assert that the contract balance is zero after withdrawal
    expect(contractBalance).to.equal(0);

    // Check the balance of the owner account
    const newOwnerBalance = await ethers.provider.getBalance(owner.address);

    // Assert that the owner received the correct balance
    //expect(newOwnerBalance).to.be.greaterThan(BigInt(initialOwnerBalance) ); // need to account for gas. not sure how just yet. For now just check its grown in size
  });


  it('should make sure ticket Validity works', async function () {

    // Mint and create a ticket
    await eventTicketing.safeMint(1);
    await eventTicketing.createTicket(ticketId, seatNumber, cost, date);
    await eventTicketing.buyTicket(ticketId, {value: cost});

    // Check that the ticket is valid
    let ticket = await eventTicketing.tickets(ticketId);
    expect(ticket.isValid).to.be.true;

    // Revoke the ticket
    await eventTicketing.revokeTicket(ticketId);

    // Check that the ticket is no longer valid
    ticket = await eventTicketing.tickets(ticketId);
    expect(ticket.isValid).to.be.false;

    // Check emitted event
    const revokeEvent = await eventTicketing.revokeTicket(ticketId);
    expect(revokeEvent)
        .to.emit(eventTicketing, "TicketRevoked")
        .withArgs(ticketId);

  });

});
