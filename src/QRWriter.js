// Require the package
const QRCode = require('qrcode')
 
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

    QRCode.toFile(`./QRCodes/qrcode${seatNumber}.png`, stringData, {
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
for(var i = 0; i < 3; i++){
    createQRCode(i, "BCAMP is the Best", "I love BCAMP", "We have fun", "Ha ha ha good times", "How cool is this?"); 
}

