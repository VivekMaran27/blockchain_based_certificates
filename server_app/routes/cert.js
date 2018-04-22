var Jimp = require('jimp');
var fs = require('fs');
var Web3 = require('web3');

var certTemplateName = "Certificate_SJSU.jpg";
var imageCaption = 'Image caption';
var loadedImage;
var tempCertFile = "Certificate_SJSU_2.jpg";

/* Initialize web3 */
// if (typeof web3 !== 'undefined') {
//     web3 = new Web3(web3.currentProvider);
// } else {
//     // set the provider you want from Web3.providers
//     web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
// }

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

function geFiletData(fileName) {
    return new Promise(function(resolve, reject){
      fs.readFile(fileName, (err, data) => {
          err ? reject(err) : resolve(data);
      });
    });
}

var generate = function(fName, lName, course, stream, date) {
    return new Promise(function(resolve, reject) {
        Jimp.read("Certificate_SJSU.jpg").then(function (image) {
            console.log("Template: "+certTemplateName+ " opened");
            /* File opened, load font */
            loadedImage = image;
            return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK); 
        })
        .then(function (font) {
            /* Write text to the image, and then write that to a file */
            loadedImage.print(font, 10, 10, imageCaption)
                        .write(tempCertFile);
            return geFiletData(tempCertFile);
        })
        .then(function(data){
            CertBase64String = Buffer.from(data).toString('base64');
            //console.log(CertBase64String);
            addCertToBlockChain(CertBase64String);
            resolve(CertBase64String);
        })
        .catch(function (err) {
            console.log(err);
            reject(err);
            // handle an exception 
        });    
    });
}

var addCertToBlockChain = function(certhash) {
    web3.eth.defaultAccount = web3.eth.accounts[0];
    var contract = new web3.eth.Contract([
        {
            "constant": true,
            "inputs": [],
            "name": "countStudents",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "studentCertificate",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_address",
                    "type": "address"
                }
            ],
            "name": "getStudent",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getStudents",
            "outputs": [
                {
                    "name": "",
                    "type": "address[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_address",
                    "type": "address"
                },
                {
                    "name": "_hash",
                    "type": "string"
                }
            ],
            "name": "setStudent",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "hashAddress",
                    "type": "string"
                }
            ],
            "name": "studentInfo",
            "type": "event"
        }
    ],'0x1174a56f598e06237858ea115a22b61a96de1951');
//    var cert_contract = contract.at('0x692a70d2e424a56d2c6c27aa97d1a86395877b3a');
    console.log(contract);


    // contract.methods.setStudent(web3.eth.accounts[2],"Hello").call({from: web3.eth.accounts[0]},(err, res) => {
    //     console.log("setStudent" + res);
    //     }); 
    
    contract.methods.getStudent(web3.eth.accounts[1]).call({from: web3.eth.accounts[0]},(err, res) => {
        console.log("getStudent" + res);
        });
    }
module.exports.generate = generate;