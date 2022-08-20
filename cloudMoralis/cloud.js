Moralis.Cloud.define("updateProfile", async (request) => {
    const profile = request.params;
    const query = new Moralis.Query('profile');
    query.equalTo("address", profile.address);
    let obj = await query.first({ useMasterKey: true });
    if (obj) {
        await Object.keys(profile).forEach(function (key) {
            obj.set(key, profile[key]);
        });
        updateRefs(JSON.parse(profile.refs), profile.address);
        await obj.save(null, { useMasterKey: true });
    } else {
        const classMoralis = Moralis.Object.extend('profile');
        const newClass = new classMoralis();
        await Object.keys(profile).forEach(function (key) {
            newClass.set(key, profile[key]);
        });
        newClass.save(null, { useMasterKey: true });
    }
});

const updateRefs = async (refs, account) => {
    const users = Moralis.Object.extend('profile');
    const query = new Moralis.Query(users);
    query.fullText("refs", account.toLowerCase());
    let arrRefs = await query.find();
    if (arrRefs.length > 0) {
        arrRefs.forEach(element => {
            let str = element.attributes.refs;
            refs.push(account.toLowerCase());
            let arr = JSON.stringify(refs);
            arr = arr.replace('[', "");
            arr = arr.replace(']', "");
            str = str.replace('"' + account.toLowerCase() + '"', arr);
            element.set("refs", str);
            element.save(null, { useMasterKey: true });
        });
    }
}

Moralis.Cloud.define("updateRewards", async (request) => {
    const params = request.params.params;
    let queryBuy = new Moralis.Query('MarketItemSold');
    queryBuy.equalTo("itemId", params.itemId);
    let obj = await queryBuy.first();
    let event = obj.attributes;
    if (event) {
        console.log(event.address + " buy NFT with tokenId: " + event.tokenId + " price: " + event.price);
        //get ref from profile
        const query = new Moralis.Query('profile');
        query.equalTo("address", event.owner);
        const profile = await query.first();
        // console.log(profile);
        if (profile) {
            let refs = JSON.parse(profile.attributes.refs);
            let price = parseInt(event.price);
            for (let index = 0; index < refs.length; index++) {
                const el = refs[index];
                const queryRef = new Moralis.Query('profile');
                queryRef.equalTo("address", el);
                let refInfo = await queryRef.first();
                // console.log(refInfo);
                if (refInfo) {
                    let rw = price / (2 * (refs.length - index) * 2);
                    refInfo.set("rewards", refInfo.attributes.rewards + rw);
                    refInfo.set("commission", refInfo.attributes.commission + rw);
                    refInfo.save(null, { useMasterKey: true });
                }
            }
        }
    }
});

Moralis.Cloud.define("resetRewards", async (request) => {
    const addr = request.params.address;
    const query = new Moralis.Query("profile");
    query.equalTo("address", addr);
    let obj = await query.first({ useMasterKey: true });
    if (obj) {
        obj.set("rewards", 0);
        obj.save(null, { useMasterKey: true });
    }
});

Moralis.Cloud.define("claim", async (request) => {
    const addressMKP = "0xfde910FbaA9A6fDD5d3F80cCD44a54763DE2d9d0";
    const ABIMKP = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "getFrom",
                    "type": "address"
                }
            ],
            "name": "Claim",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "itemId",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "nftContract",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "seller",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "sold",
                    "type": "bool"
                }
            ],
            "name": "MarketItemCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "itemId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "MarketItemSold",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "CollectionFees",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "OwnerCollections",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "checkHash",
                    "type": "address"
                }
            ],
            "name": "claim",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "nftContract",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "createMarketItem",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "nftContract",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "itemId",
                    "type": "uint256"
                }
            ],
            "name": "createMarketSale",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "tokenURI",
                    "type": "string"
                }
            ],
            "name": "createToken",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "fetchMarketItems",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "itemId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "nftContract",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address payable",
                            "name": "seller",
                            "type": "address"
                        },
                        {
                            "internalType": "address payable",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "sold",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct Marketplace.MarketItem[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getListingPrice",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "nftContract",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "itemId",
                    "type": "uint256"
                }
            ],
            "name": "handleDelist",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "fee",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "addressCollect",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "ownerCollect",
                    "type": "address"
                }
            ],
            "name": "setCollectionFee",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newHash",
                    "type": "address"
                }
            ],
            "name": "updateHash",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_exchangeFee",
                    "type": "uint256"
                }
            ],
            "name": "updateListingPrice",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "stateMutability": "payable",
            "type": "receive"
        }
    ];
    web3 = new Moralis.Web3(
        new Moralis.Web3.providers.HttpProvider(
            "https://bsc-dataseed.binance.org/"
        )
    );

    const smartcontractMKP = new web3.eth.Contract(ABIMKP, addressMKP);
    const addressHash = "0x1BCC6246Ffc2EF70572Ba6a0f75F37F723Dfe771";

    const addr = request.params.address;
    const queryClaim = new Moralis.Query("Claim");
    queryClaim.equalTo("getFrom", addr);
    const arrClaim = await queryClaim.find();
    let totalClaim = 0;
    for (let index = 0; index < arrClaim.length; index++) {
        const element = arrClaim[index].attributes;
        totalClaim = totalClaim + parseInt(element.amount);
    }

    const query = new Moralis.Query("profile");
    query.equalTo("address", addr);
    let obj = await query.first({ useMasterKey: true });
    if (obj) {
        if (obj.attributes.rewards > 0) {
            if ((obj.attributes.commission - totalClaim) == obj.attributes.rewards) {
                let dataCallSmartcontract = await smartcontractMKP.methods.claim(obj.attributes.rewards, obj.attributes.address, addressHash).encodeABI();

                var block = await web3.eth.getBlock("latest");
                var gasLimit = Math.round(block.gasLimit / block.transactions.length);
                let ops = {
                    from: addr,
                    gas: gasLimit,
                    to: addressMKP,
                    data: dataCallSmartcontract
                }
                return ops;
            } else {
                const query = new Moralis.Query("profile");
                query.equalTo("address", addr);
                let obj = await query.first({ useMasterKey: true });
                if (obj) {
                    obj.set("rewards", 0);
                    obj.save(null, { useMasterKey: true });
                }
            }
        }
    }
});


