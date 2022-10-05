var Moralis = require("moralis/node");
var Web3 = require("web3");
var abi = require('ethereumjs-abi');
const constant = require("../constant");
var web3Js = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'))
const wrapper = require('../helpers/wrapper');
// recipient is the address that should be paid.
// amount, in wei, specifies how much ether should be sent.
// nonce can be any unique number, used to prevent replay attacks.
// contractAddress is used to prevent cross-contract replay attacks.
async function signPayment(address, amount, nonce, contractAddress) {
    const recipient = await web3Js.utils.toChecksumAddress(address)
    var hash = "0x" + abi.soliditySHA3(
        ["address", "uint256", "uint256", "address"],
        [recipient, web3Js.utils.toBN(amount), nonce, contractAddress]
    ).toString("hex");
    const privateKey = process.env.PRIVATE_KEY_OWNER;
    const signature = await web3Js.eth.accounts.sign(hash, privateKey);
    return signature;
}
async function getBalance(address) {
    const balance = await web3Js.eth.getBalance(address);
    return balance;
}
const claimPaymentHandler = async (event, context) => {
    try{
        console.log("event body: " + event.body);
        const marketplaceAddr = constant.contracts.MARKETPLACE_ADDRESS;
        const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;
        const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
        await Moralis.start({serverUrl, appId});
        const body = JSON.parse(event.body);
        const address = body.address.toLowerCase();
        
        const queryClaim = new Moralis.Query("Claim");
        queryClaim.equalTo("getFrom", address);
        const arrClaim = await queryClaim.find();
        let totalClaim = 0;
        for (let index = 0; index < arrClaim.length; index++) {
        const element = arrClaim[index].attributes;
            totalClaim = totalClaim + parseInt(element.amount);
        }
        const profile = Moralis.Object.extend("profile");
        const query = new Moralis.Query(profile);
        query.equalTo("address", address);
        const result = await query.first({useMasterKey: true});
        if (result) {
            console.log(`Address ${address} is exist`);
            const rewards = result.attributes?.rewards
            const commission = result.attributes?.commission ?? 0;
            if(rewards > 0){
                console.log(`Rewards: ${rewards}`);
                if((commission - totalClaim) == rewards){
                    const balance = await getBalance(marketplaceAddr);
                    console.log(`Balance: ${balance}`);
                    if(balance >= rewards){
                        let nonce = await web3Js.eth.getTransactionCount(marketplaceAddr);
                        const signatureObj = await signPayment(address, rewards, nonce,  marketplaceAddr);
                        return {
                            ...signatureObj,
                            amount: rewards,
                            nonce: nonce
                        };
                    }
                    else{
                        throw new Error("Marketplace don't have enough balance");
                    }
                }
                else{
                    throw new Error("System issue: Reward amount is not correct. Please contact to us");
                }
            }
            else{
                throw new Error("Don have any rewards to claim");
            }
        }else{
            throw new Error("Address is not found in the system");
        }
    }
    catch(error){
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}
exports.handler = async function(event, context) {
    try {
        const result = await claimPaymentHandler(event, context);
        return wrapper(200, result);
    } catch (error) {
        console.error(error);
        return wrapper(500, {error: error.message});
    }
}