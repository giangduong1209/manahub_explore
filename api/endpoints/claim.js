var Moralis = require("moralis/node");
var Web3 = require("web3");
var abi = require('ethereumjs-abi');
const constant = require("../constant");
var web3Js = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
// recipient is the address that should be paid.
// amount, in wei, specifies how much ether should be sent.
// nonce can be any unique number, used to prevent replay attacks.
// contractAddress is used to prevent cross-contract replay attacks.
async function signPayment(address, amount, nonce, contractAddress) {
    const recipient = await web3Js.utils.toChecksumAddress(address)
    console.log("recipent: " + recipient);
    var hash = "0x" + abi.soliditySHA3(
        ["address", "uint256", "uint256", "address"],
        [recipient, amount, nonce, contractAddress]
    ).toString("hex");
    console.log("hash: " + hash);
    const privateKey = process.env.PRIVATE_KEY_OWNER;
    console.log("privateKey: " + privateKey);
    const signature = await web3Js.eth.accounts.sign(hash, privateKey);
    return signature;
}
exports.handler = async function(event, context) {
    const marketplaceAddr = constant.contracts.MARKETPLACE_ADDRESS;
    const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;
    const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
    await Moralis.start({serverUrl, appId});
    const body = JSON.parse(event.body);
    const address = body.address.toLowerCase();
    const profile = Moralis.Object.extend("profile");
    const query = new Moralis.Query(profile);
    query.equalTo("address", address);
    const result = await query.first();
    if (result) {
        const rewards = result.attributes?.rewards
        if(rewards){
            const nonce = await web3Js.eth.getTransactionCount(marketplaceAddr);
            const signatureObj = await signPayment(address, rewards, nonce,  marketplaceAddr);
            return {
                statusCode: 200,
                body: JSON.stringify({signPayment: signatureObj})
            }
        }
        else{
            return {
                statusCode: 200,
                body: JSON.stringify({error: "No rewards"})
            }
        }

    }
    return {
        statusCode: 200,
        body: JSON.stringify({error: "Address not found"})
    }
}