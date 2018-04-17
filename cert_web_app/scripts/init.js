

/** Web3 initialization*/
var g_web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
function init()
{
    console.log(g_web3.version);
    g_web3.eth.getAccounts(console.log)
}


