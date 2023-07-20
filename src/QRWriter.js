// Require the package
const QRCode = require('qrcode')
const ethers = require('ethers');
const contract = require('../artifacts/contracts/EventTicketing.sol/EventTicketing.json')
const contractABI = contract.abi;
 
const createQRCode = (seatNumber, cost, date, hasBeenScanned, isValid, purchaser) => {
    let data = {
        SeatNumber: seatNumber,
        Cost: cost,
        Date: date,
        ScanStatus: hasBeenScanned,
        Valid: isValid,
        Owner: purchaser
    }
    let stringData = JSON.stringify(data);

    QRCode.toFile(`./QRCodes/${seatNumber}.png`, stringData, {
        color: {
          dark: '#000',  // Black dots
          light: '#FFF' // Transparent background
        }
    }, function (err) {
        if (err) throw err
        console.log(`QR code image saved at: ../QRCodes/qrcode${seatNumber}.png`);
    })
}

//createQRCode(111, 222, "07/25/23", false, true, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
//for(var i = 0; i < 3; i++){
//    createQRCode(i, "BCAMP is the Best", "I love BCAMP", "We have fun", "Ha ha ha good times", "How cool is this?"); 
//}
async function main() {
    // Connect to an Ethereum node
    console.log("is this running?")
    console.log("ethers", ethers)
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    //const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");


    // Address of the deployed contract (replace with your contract's)
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const loop = contract.maxTickets();
    // Now you can call your contract's methods
    
    
    const result = await contract.maxTickets();
    console.log(result);
}
 main();

