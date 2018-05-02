/* Ropsten seed:
cement what cream obvious canyon cabin retire hip gain follow maze onion
*/

/******************************************************************************
                    NODE MODULE DEPENDENCIES			                      
/******************************************************************************/
const Jimp = require('jimp');
const fs = require('fs');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/U9yDj40b2Vl0wwJgnC9V"));
//web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/U9yDj40b2Vl0wwJgnC9V"));
//web3 = new Web3(new Web3.providers.HttpProvider("http://10.250.21.252:8545"));

/******************************************************************************
                    ETHERUM CONTRACT CONSTANTS			                      
/******************************************************************************/
/* Pre-created account and contract through MetaMask on Ropsten */
const account = '0x561da499e78486727bFEeC2992C121C16724575f';
const privateKey = Buffer.from('0bf9eccb7ae80c6e1067a995e12006ecdc06b0ef0879af314d583ee3813b89a7','hex');
const contractAddress = '0xf50614e98dAeEBaF0b522d0b8e4a85Fe3F8033A7';
const currentChainId = 3;
const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			},
			{
				"name": "_certHash",
				"type": "string"
			}
		],
		"name": "issueCertificate",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "student",
				"type": "address"
			}
		],
		"name": "getCerificate",
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
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			},
			{
				"name": "_certHash",
				"type": "string"
			}
		],
		"name": "verifyCertificate",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

/******************************************************************************
                    CERFITICATE IMAGE FILES			                      
/******************************************************************************/
var certTemplateName = "Certificate_SJSU.jpg";
var imageCaption = 'Image caption';
var loadedImage;
var tempCertFile = "Certificate_SJSU_2.jpg";
var CertBase64String;

const contract = new web3.eth.Contract(abi, contractAddress, {
    from: account,
    gasLimit: 3000000,
  });

function geFiletData(fileName) {
    return new Promise(function(resolve, reject){
        fs.readFile(fileName, (err, data) => {
            err ? reject(err) : resolve(data);
        });
      });
}

function sleep(seconds){
    var waitUntil = new Date().getTime() + seconds*1000;
    while(new Date().getTime() < waitUntil) true;
}

var generate = function(fName, lName, course, stream, date, stud_pub_key) {
    return new Promise(function(resolve, reject) {
        Jimp.read("Certificate_SJSU.jpg").then(function (image) {
            console.log("Template: "+certTemplateName+ " opened");
            image.resize(794,617)
            .quality(100)                 // set JPEG quality 
            loadedImage = image;
            return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK); 
        })
        .then(function (font) {
            loadedImage.print(font, 350, 220, fName + ' ' + lName)
                        .print(font, 280, 320, course + ' in ' + stream)
                        .write(tempCertFile);
            return geFiletData(tempCertFile);
        })
        .then(function(data){
            CertBase64String = Buffer.from(data).toString('base64');
            console.log("Computing certificate hash for "+ stud_pub_key);
            var certHash = web3.utils.sha3(CertBase64String);
            console.log("Adding cert hash " +certHash+  " to blockchain");
            return addCertToBlockChain(stud_pub_key,certHash);
        })
        .then(function(receipt){
            //console.log("Cert image: "+ CertBase64String);
            var cert = CertBase64String
            resolve({cert_hash:CertBase64String, 
                     stud_pub_key:stud_pub_key,
                     contract_address:contractAddress});
        })
        .catch(function (err) {
            console.log(err);
            reject(err);
        });    
    });
}

function addCertToBlockChain(student_address, certhash) 
{
    return new Promise(function(resolve, reject)
    {
        console.log("addCertHashToBlockChain++")
        var gas_limit_value;
        var gas_price_value;
                 
        /** Gas limit */
//        console.log("Computing ethereum gas limit");
//        contract.methods.issueCertificate(student_address,certhash)
//                        .estimateGas({from: account})
//            .then(function(gas_amount){
                /** Gas limit computed, next compute gas price*/                                                                                                                                
//                gas_limit_value = gas_amount;
//                console.log("Estimated ethereum gas amount for transaction: "+ 
//               gas_limit_value);
//                console.log("Computing ethereum gas price");
//                return web3.eth.getGasPrice();
//           })
            gas_limit_value = 144040;
            console.log("Estimated ethereum gas limit (from metamask)"+
                         " for transaction: "+ gas_limit_value);
            console.log("Computing ethereum gas price");
            web3.eth.getGasPrice()
            .then(function(gas_price)
            {
                /** Gas price computed, next compute transaction nonce*/
                gas_price_value = gas_price;
                console.log("Estimated ethereum gas price per unit: "+ 
                gas_price_value);
                console.log("Computing nonce for ethereum transaction");
                return web3.eth.getTransactionCount(account)
            })
            .then(function(nonce){
                /** Nonce computed, send signed transaction */
                console.log("Nonce: " + nonce);    

                const contractFunction = contract.methods.
                                         issueCertificate(student_address,certhash);
                const functionAbi = contractFunction.encodeABI();
                const txParams = {
                    gasLimit: web3.utils.toHex(150000),
                    gasPrice: web3.utils.toHex(1000000000),
                    to: contractAddress,
                    data: functionAbi,
                    from: account,
                    nonce: web3.utils.toHex(nonce),
                    value:0    
                    };
                const tx = new Tx(txParams);
                tx.sign(privateKey);
                const serializedTx = tx.serialize();
                    
                console.log("Signing ethereum transaction");
                console.log("Adding signed transaction to blockchain");
                return web3.eth.sendSignedTransaction(
                    '0x' + serializedTx.toString('hex'))
            })
            .then(function(receipt){
                /** Transaction sent All done */
                console.log("All Done!!");
                console.log("Receipt: "+receipt);
                resolve(receipt);
            })
            .catch(function(error){
                reject(error);
            });  
        console.log("addCertHashToBlockChain--");
    });
}
module.exports.generate = generate;
