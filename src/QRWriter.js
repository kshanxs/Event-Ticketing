// Require the package
const QRCode = require('qrcode')
 
// // Creating the data
// let data = {
//     name:"Employee Name",
//     age:27,
//     department:"Police",
//     id:"aisuoiqu3234738jdhf100223"
// }
 
// // Converting the data into String format
// let stringdata = JSON.stringify(data)
 
// // Print the QR code to terminal
// QRCode.toString(stringdata,{type:'terminal'},
//                     function (err, QRcode) {
 
//     if(err) return console.log("error occurred")
 
//     // Printing the generated code
//     console.log(QRcode)
// })
   
// // Converting the data into base64
// QRCode.toDataURL(stringdata, function (err, code) {
//     if(err) return console.log("error occurred")
 
//     // Printing the code
//     console.log(code)
// });

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
    createQRCode(i, "Lil Benny is Cool", "Big Benny is cool", "We have fun", "Ha ha ha good times", "How cool is this?"); 
}

