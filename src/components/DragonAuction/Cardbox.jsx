import { Button, Modal, Statistic } from "antd";
import moment from "moment";
import React from "react";
import styless from "./Explores.module.css";
// import imgFake from 'assets/images/img-explore.png';
import ManahubsBoxGif from "assets/images/manahubs-box.gif";
import btnstyles from "./MysteryBox.module.css";
import { useState } from "react";
import {
    useMoralis,
    useMoralisWeb3Api,
    useWeb3ExecuteFunction,
} from "react-moralis";

let clickBuy = false;
let checkInstallMetamask = true;
let system = {};
const Cardbox = () => {
    const { Countdown } = Statistic;
    const deadline = new Date("2022-09-19T23:30:00+07:00") // Hong Kong timezone
    const [amount, setAmount] = useState("");
	let flag = false
	if(Date.now() >= deadline) {
		flag = true
	}
    const [isNFTSale, setIsNFTSale] = useState(flag);
    const [format, setFormat] = useState(
        "D [days] H [hours] m [minutes] s [seconds]"
    );


    const handleChange = (event) => {
        const result = event.target.value.replace(/\D/g, "");
        let maxAmount = system.dragonMax - system.curTokenId;
        if (parseInt(result) > maxAmount) {
            setAmount(maxAmount);
        } else if (parseInt(result) < 1 || result === "") {
            setAmount(1);
        } else {
            setAmount(result);
        }
    };

    const contractProcessor = useWeb3ExecuteFunction();
    const [loading, setLoading] = useState(false);
    let { Moralis, authenticate, account } = useMoralis();
    const serverUrl = "https://bzyt487madhw.usemoralis.com:2053/server";
    const appId = "ODKsAGfZTKjTaG2Xv2Kph0ui303CX3bRtIwxQ6pj";
    Moralis.start({ serverUrl, appId });

    const Web3Api = useMoralisWeb3Api();
    const manahubsABI = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string",
                },
                {
                    "internalType": "string",
                    "name": "_symbol",
                    "type": "string",
                },
                {
                    "internalType": "string",
                    "name": "_initBaseURI",
                    "type": "string",
                },
            ],
            "stateMutability": "nonpayable",
            "type": "constructor",
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address",
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address",
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256",
                },
            ],
            "name": "Approval",
            "type": "event",
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address",
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address",
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool",
                },
            ],
            "name": "ApprovalForAll",
            "type": "event",
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address",
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address",
                },
            ],
            "name": "OwnershipTransferred",
            "type": "event",
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address",
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address",
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256",
                },
            ],
            "name": "Transfer",
            "type": "event",
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address",
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256",
                },
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address",
                },
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [],
            "name": "baseExtension",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [],
            "name": "baseURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [],
            "name": "cost",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256",
                },
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address",
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address",
                },
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [],
            "name": "maxMintAmount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [],
            "name": "maxSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_to",
                    "type": "address",
                },
                {
                    "internalType": "uint256",
                    "name": "_mintAmount",
                    "type": "uint256",
                },
            ],
            "name": "mint",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function",
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256",
                },
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "bool",
                    "name": "_state",
                    "type": "bool",
                },
            ],
            "name": "pause",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [],
            "name": "paused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address",
                },
            ],
            "name": "removeWhitelistUser",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address",
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address",
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256",
                },
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address",
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address",
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256",
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes",
                },
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address",
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool",
                },
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_newBaseExtension",
                    "type": "string",
                },
            ],
            "name": "setBaseExtension",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_newBaseURI",
                    "type": "string",
                },
            ],
            "name": "setBaseURI",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_newCost",
                    "type": "uint256",
                },
            ],
            "name": "setCost",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_newmaxMintAmount",
                    "type": "uint256",
                },
            ],
            "name": "setmaxMintAmount",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4",
                },
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "index",
                    "type": "uint256",
                },
            ],
            "name": "tokenByIndex",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address",
                },
                {
                    "internalType": "uint256",
                    "name": "index",
                    "type": "uint256",
                },
            ],
            "name": "tokenOfOwnerByIndex",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256",
                },
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address",
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address",
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256",
                },
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address",
                },
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address",
                },
            ],
            "name": "walletOfOwner",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address",
                },
            ],
            "name": "whitelistUser",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address",
                },
            ],
            "name": "whitelisted",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool",
                },
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function",
        },
    ];
    const manahubAddr = "0x70cbc0e9eb87035ad2fbb5eba433b9496195e991";
    if (checkInstallMetamask && document.getElementById("walletConnectAlert")) {
        setTimeout(async () => {
            checkInstallMetamask = false;
            if (typeof window.ethereum !== "undefined") {
                // console.log('MetaMask is installed!');
                checkAuth();
            } else {
                failPurchase("You need to install wallet to use this page!");
                window.open("https://metamask.io/");
            }
        }, 200);
    }
    async function checkAuth() {
        if (!account && document.getElementById("walletConnectAlert")) {
            document.getElementById("walletConnectAlert").click();
            // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            // account = accounts[0];

            // account = req[0];
        }
    }

    async function updateRewardRefs(event) {
        console.group("updateRewardRefs");
        console.log("Event", event);
        const Profile = Moralis.Object.extend("profile");
        const query = new Moralis.Query(Profile);
        query.equalTo("address", event.owner);
        const profile = await query.first();
        console.log("Profile", profile);
        if (profile?.attributes?.refs) {
            let refs = JSON.parse(profile.attributes.refs);
            let price = parseInt(event.price);
            console.log("Refs", refs);
            for (let index = 0; index < refs.length; index++) {
                const el = refs[index];
                console.log("Elements", el, index);
                const queryRef = new Moralis.Query("profile");
                queryRef.equalTo("address", el);
                let refInfo = await queryRef.first();
                console.log("RefInFo", refInfo);
                const rewardForFirstRef = price * 0.1;
                if (refInfo) {
                    let rw =
                        index === 0
                            ? rewardForFirstRef
                            : rewardForFirstRef / 2 ** index;
                    console.log("rewards", rw);
                    refInfo.set("rewards", refInfo.attributes.rewards + rw);
                    refInfo.set(
                        "commission",
                        refInfo.attributes.commission + rw
                    );
                    refInfo.save(null, { useMasterKey: true });
                }
            }
        }
        console.groupEnd();
        await Moralis.Cloud.run("updateRewards", { event: event });
    }
    async function setCost() {
        let enable = true;
        if (enable) {
            if (!account) {
                failPurchase("You need connection to wallet");
            } else {
                if (!clickBuy) {
                    clickBuy = true;
                    if (!amount || amount === 0) {
                        setAmount(1);
                    }
                    authenticate().then(async () => {
                        setLoading(true);
                        const tokenPrice = amount * 15 * 10 ** 16;
                        const ops = {
                            contractAddress: manahubAddr,
                            functionName: "mint",
                            abi: manahubsABI,
                            params: {
                                _to: account,
                                _mintAmount: amount,
                            },
                            msgValue: tokenPrice,
                        };

                        await contractProcessor.fetch({
                            params: ops,
                            onSuccess: () => {
                                updateRewardRefs({
                                    owner: account,
                                    price: tokenPrice,
                                });
                                setLoading(false);
                                succPurchase();
                                clickBuy = false;
                            },
                            onError: (error) => {
                                console.log(error);
                                setLoading(false);
                                failPurchase(
                                    `There was a problem when buy this NFT`
                                );
                            },
                        });
                    });
                }
            }
        }
    }
    function pre() {
        // getMaxTokenId();
        let newAmount = amount - 1;
        if (newAmount < 1) {
            setAmount(1);
        } else {
            setAmount(newAmount);
        }
    }
    function next() {
        // getMaxTokenId();
        let newAmount = amount + 1;
        let maxAmount = system.dragonMax - system.curTokenId;

        if (newAmount > maxAmount) {
            setAmount(maxAmount);
        } else {
            setAmount(newAmount);
        }
    }
    function succPurchase() {
        let secondsToGo = 5;
        const modal = Modal.success({
            title: "Success!",
            content: `You have buy this NFT`,
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    }

    function failPurchase(error) {
        let secondsToGo = 5;
        const modal = Modal.error({
            title: "Error!",
            // content: `There was a problem when buy this NFT`
            content: error + "",
        });
        clickBuy = false;
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    }
    function handleChangeTimeCountDown(time) {
        if (time <= 60 * 60 * 24 * 1000) {
            setFormat("H [hours] m [minutes] s [seconds]");
        }
    }
    function handleFinishCountDown() {
        setIsNFTSale(true);
    }

    return (
        <div className={styless.cardbox}>
            <div
                className={styless.image}
                style={{ backgroundImage: `url(${ManahubsBoxGif})` }}
            >
                {/* <Avatar src={item.image} className={styless.avatar} size={80} /> */}
            </div>
            <div className={styless.content}>
                <div
                    className={styless.title}
                    style={{ fontFamily: "GILROY " }}
                >
                    Magic Box
                </div>
                <div
                    className={styless.byAuthor}
                    style={{ fontFamily: "GILROY " }}
                >
                    by <span style={{ fontFamily: "GILROY " }}>Manahubs</span>
                </div>
                {isNFTSale ? (
                    <>
                        <form>
                            <Button
                                className={btnstyles.exploreBtn}
                                loading={loading}
                                onClick={() => pre()}
                                style={{
                                    fontFamily: "GILROY ",
                                    width: "15%",
                                    textAlign: "center",
                                    margin: " 10px",
                                    color: " #ff9900",
                                    border: "solid 1px #0e0a35",
                                    borderRadius: "10px",
                                    fontSize: "medium",
                                }}
                            >
                                -
                            </Button>
                            <input
                                type="text"
                                id="inputAmount"
                                placeholder="Amount"
                                pattern="[0-9]*"
                                style={{
                                    width: "20%",
                                    height: "25px",
                                    textAlign: "center",
                                    margin: " 10px",
                                    color: " #ff9900",
                                    border: "solid 1px #0e0a35",
                                    borderRadius: "10px",
                                    fontSize: "medium",
                                }}
                                value={amount}
                                onChange={handleChange}
                            />
                            <Button
                                className={btnstyles.exploreBtn}
                                loading={loading}
                                onClick={() => next()}
                                style={{
                                    fontFamily: "GILROY ",
                                    width: "15%",
                                    textAlign: "center",
                                    margin: " 10px",
                                    color: " #ff9900",
                                    border: "solid 1px #0e0a35",
                                    borderRadius: "10px",
                                    fontSize: "medium",
                                }}
                            >
                                +
                            </Button>
                        </form>
                        <Button
                            className={btnstyles.exploreBtn}
                            loading={loading}
                            onClick={() => setCost()}
                            style={{ fontFamily: "GILROY " }}
                            visible={isNFTSale}
                        >
                            BUY
                        </Button>
                    </>
                ) : (
                    <>
                        <div
                            className={styless.description}
                            style={{ fontFamily: "GILROY " }}
                        >
                            NFT Sale is Live after:
                        </div>
                        <Countdown
                            onChange={handleChangeTimeCountDown}
                            onFinish={handleFinishCountDown}
                            value={deadline}
                            format={format}
                            valueStyle={{
                                fontSize: "16px",
                                fontWeight: "regular",
                                textAlign: "center",
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Cardbox;
