# cert_web_app
'cert_web_app' is a web application for digital document validation (based on 
block chain). As of now it has two components:

* cert_issue.js: Responsible for certifying  a party. The certification 
process involves: 
	* Creating a certificate
	* Sigining the cerificate with the issuers private key.
	* Adding a transaction block (with the certificate and the signature)
	to the block chain network.
	* Mailing the digital copy of the certicate (containing transaction
	address and public key of the issuer) to the certificate receiver.
	* Questions: Do we really need to generate a public key for the certificate 
	receiver. Because, if you think about it, it is nowhere used. If web3 
	allows adding transactions to self, then probably it isn't needed.

* cert_verify.js: Responsible for verifying the integrity and validity of the
certificate. The certificate verification process involves: 
	* Computing the hash of the certificate (Received from the cerficate owner)
	* Computing  hash of actual certifcate (given by issuer). Using blockchain.
	* Comparing the computed hashes to verify the integrity and authenticity of the
	certificate.

# Problems solved by this method of certifcate validation
* No additional public key distribution  schemes required. Public key required
for signature can be sent along the cerficate itself, and yet be ensured for its
integrity (through blockchain saved information).
 
* By using distributed database,the issues common to centralized system, such as
maintainence costs, single point of failure etc.., are eliminated. 

# Application areas
* Verification of certicate issued by educational institutions
* Implementing HTTPS without CA.

# Software architecture

-----------------------
HTML/JS
------------------------
WEB3
------------------------
ETHEREUM NODE
-------------------------
BLOCKCHAIN NETWORK
-------------------------

# Tools required
* web3 archive is present in this repository under 'third_party_archives'
* web3 source is present under 'cert_web_app/thrid_party'
* In addition, you will have to install 'ganache-cli' (Etherum node that simulates)
test blockchain network. Follow installation instructions at 
https://medium.com/@mvmurthy/full-stack-hello-world-voting-ethereum-dapp-tutorial-part-1-40d2d0d807c2 

