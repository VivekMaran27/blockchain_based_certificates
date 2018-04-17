
/*!
 * Issue certficate
 * \fn issue_cert(event)
 */
function issue_cert(event)
{
    console.log("issue_cert++");
    
    var account = g_web3.eth.accounts.create();
    console.log(account);
    g_web3.eth.getAccounts(console.log)
    console.log("Creating hash of hello world");
    console.log(g_web3.utils.sha3('Hello World'));
    console.log("issue_cert--");
}
