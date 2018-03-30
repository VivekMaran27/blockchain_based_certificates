
/*!
 * Issue certficate
 * \fn issue_cert(event)
 */
function issue_cert(event)
{
    console.log("issue_cert++");
    
    var account = g_web3.eth.accounts.create();
    console.log(account);

    console.log("issue_cert--");
}
