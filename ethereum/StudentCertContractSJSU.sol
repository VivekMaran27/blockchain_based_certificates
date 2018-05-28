pragma solidity ^0.4.18;

contract StudentCertContractSJSU {
    
   address owner;

    struct StudentCert {
        string certHash;
    }
    
    mapping (address => StudentCert) StudentCerts;
    address[]  StudentAddresses;

    function StudentCertContractSJSU() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    function issueCertificate(address _address, string _certHash) 
                             onlyOwner public 
    {
        var student_cert = StudentCerts[_address];
        student_cert.certHash = _certHash;
        StudentAddresses.push(_address) -1;
    }

    function getCerificate(address student) view public 
                                            returns (string) 
    {
        return (StudentCerts[student].certHash);
    }
    
    function verifyCertificate(address _address, string _certHash) constant returns (bool)
    {
        var student_cert = StudentCerts[_address];
        return keccak256(student_cert.certHash) == keccak256(_certHash);
    }
}
