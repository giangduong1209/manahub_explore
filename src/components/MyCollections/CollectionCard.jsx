import {
  Button,
  Col,
  Divider,
  Row,
  Modal,
  Input,
  Spin,
  Select,
  Tabs,
} from "antd";
import React, { useState, useEffect } from "react";
import styless from "./MyCollections.module.css";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import AddressInput from "../AddressInput";
import { useWeb3ExecuteFunction } from "react-moralis";
import { getExplorer } from "helpers/networks";
import { useMoralis } from "react-moralis";
import { useHistory } from "react-router-dom";
import { auctionABI, auctionByteCode } from "helpers/auction";
import moment from "moment";
import Constants from "constant";

const Web3 = require("web3");
// eslint-disable-next-line no-unused-vars
const EthereumTx = require("ethereumjs-tx").Transaction;

const rpcURL = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const web3 = new Web3(rpcURL);

const { Option } = Select;
const categoryLs = [
  "Art",
  "Collectibles",
  "DomainNames",
  "Music",
  "Photography",
  "Sport",
  "TradingCards",
  "Utility",
  "VirtualWorlds",
];
// let arrNFTMarketAddress = {};

const CollectionCard = ({ item }) => {
  const [visibleListModal, setVisibilityListModal] = useState(false);
  const [visibleTransferModal, setVisibilityTransferModal] = useState(false);
  const [price, setPrice] = useState();
  const [time, setTime] = useState();
  const [priceAuc, setPriceAuc] = useState();
  const [category, setCategory] = useState([]);
  const [nftToSend, setNftToSend] = useState(null);
  const [nftToSell, setNftToSell] = useState({});
  const { chainId, marketAddress, contractABI } = useMoralisDapp();
  const { Moralis, authenticate, account } = useMoralis();

  const contractABIJson = JSON.parse(contractABI);
  const ItemImage = Moralis.Object.extend("ItemImages");
  const listItemFunction = "createMarketItem";
  const [loading, setLoading] = useState(false);
  const [receiverToSend, setReceiver] = useState(null);
  const [amountToSend, setAmount] = useState(null);
  const contractProcessor = useWeb3ExecuteFunction();
  const [mediaSrc, setMediaSrc] = useState("");
  const [mediaType, setMediaType] = useState("");
  const history = useHistory();
  const [isPending, setIsPending] = useState(false);
  const [auc, setAuc] = useState("1");
  const [exchangeFee, setExchangeFee] = useState();

  const [formValid, setFormValid] = useState({
    priceErr: false,
    priceFormatErr: false,
    categoryErr: false,
  });
  const [formAuctionValid, setFormAuctionValid] = useState({
    priceAucErr: false,
    priceAucFormatErr: false,
    categoryErr: false,
    timeErr: false,
  });

  const contractWeb3ABIJson = JSON.parse(auctionABI);

  useEffect(() => {
    // const findExistNftMarket = async (item) => {
    //   // const ListedItem = Moralis.Object.extend("ItemImages");
    //   const query = new Moralis.Query(ItemImage);
    //   query.equalTo('nftContract', item.token_address);
    //   query.equalTo('tokenId', item.token_id);
    //   const result = await query.first();
    //   return result
    // }

    async function getItemType() {
      try {
        // console.log(item?.image);
        let url = item?.image;
        if (
          item?.image.substring(8, 12) === "ipfs" &&
          !url.includes("https://gateway.ipfs.io")
        ) {
          url = item?.image.replace(/^.{28}/g, "https://gateway.ipfs.io");
        }
        let req = await fetch(url);
        // console.log(await req.headers.get("content-type"));
        item.type = await req.headers.get("content-type");
        setMediaType(item.type);
      } catch (error) {
        console.log(error);
      }
    }
    if (item) {
      if (item.image) {
        getItemType();
        setMediaSrc(item.image);
      }
    }
  }, [Moralis, ItemImage, contractABIJson, marketAddress, item]);

  const handleSellClick = (item) => {
    // console.log(item)
    setNftToSell(item);
    setVisibilityListModal(true);
  };

  const handleTransferClick = (nft) => {
    setNftToSend(nft);
    setVisibilityTransferModal(true);
  };
  async function transfer(nft, amount, receiver) {
    console.log(nft, amount, receiver);
    const options = {
      type: nft?.contract_type?.toLowerCase(),
      tokenId: nft?.token_id,
      receiver,
      contractAddress: nft?.token_address,
    };

    if (options.type === "erc1155") {
      options.amount = amount ?? nft.amount;
    }

    setIsPending(true);

    try {
      const tx = await Moralis.transfer(options);
      console.log(tx);
      setIsPending(false);
    } catch (e) {
      alert(e.message);
      setIsPending(false);
    }
  }

  // const handleChange = (e) => {
  //   setAmount(e.target.value);
  // };

  useEffect(() => {
    getExchangeFee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function approveAll(item) {
    if (!isFormValid()) return;
    setLoading(true);
    authenticate({
      chainId: 56,
      onSuccess: async () => {
        const ops = {
          contractAddress: item.token_address,
          functionName: "setApprovalForAll",
          abi: [
            {
              inputs: [
                { internalType: "address", name: "operator", type: "address" },
                { internalType: "bool", name: "approved", type: "bool" },
              ],
              name: "setApprovalForAll",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          params: {
            operator: marketAddress,
            approved: true,
          },
        };
        // console.log("approve all >>>>>>>>>", ops)
        await contractProcessor.fetch({
          params: ops,
          onSuccess: () => {
            // console.log("Approval Received");
            // setLoading(false);
            // setVisibility(false);
            // succApprove();
            list(nftToSell, price);
          },
          onError: (error) => {
            console.log(error);
            setLoading(false);
            failApprove();
          },
        });
      },
      onError: () => {
        setLoading(false);
        setVisibilityListModal(false);
        failApprove();
      },
    });
  }
  async function auction(item) {
    let minBid = priceAuc * ("1e" + 18);
    if (!isFormValidAuction()) return;
    try {
      setLoading(true);
      web3.eth.setProvider(Web3.givenProvider);
      let deploy_contract = new web3.eth.Contract(JSON.parse(auctionABI));
      let userAddress = account;
      let payload = {
        data: auctionByteCode,
        arguments: [
          item.token_address,
          web3.utils.toHex(item.token_id),
          web3.utils.toHex(minBid),
        ],
      };

      let parameter = {
        from: userAddress,
        gas: web3.utils.toHex(6000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei("5", "gwei")),
      };

      // console.log(parameter)
      deploy_contract
        .deploy(payload)
        .send(parameter, (err, transactionHash) => {
          // console.log("Transaction Hash :", transactionHash);
        })
        .on("confirmation", () => {})
        .then((newContractInstance) => {
          console.log(
            "Deployed Contract Address : ",
            newContractInstance.options
          );
          // approveAuction(newContractInstance.options.address)
          approveAuction(newContractInstance.options.address);
        })
        .catch((err) => {
          setLoading(false);
        });
      // if (!isFormValid()) return;
      // history.push("/explorer");
    } catch (error) {
      setLoading(false);
    }
  }

  async function approveAuction(address) {
    // console.log("Data nft", item);
    authenticate({ chainId: 56 }).then(async () => {
      const ops = {
        contractAddress: item.token_address,
        functionName: "setApprovalForAll",
        abi: contractABIJson,
        params: {
          operator: address,
          approved: true,
        },
      };
      // console.log("approve all >>>>>>>>>", ops);
      await contractProcessor.fetch({
        params: ops,
        onSuccess: () => {
          // console.log("Approval Received");
          // setLoading(false);
          // list(information, price);
          // setVisibility(false);
          // succApprove(information);
          startAuction(address);
        },
        onError: (error) => {
          console.log(error);
          setLoading(false);
          failApprove();
        },
      });
    });
  }

  const startAuction = async (addrs) => {
    const ops = {
      contractAddress: addrs,
      functionName: "start",
      abi: contractWeb3ABIJson,
      gas: web3.utils.toHex(6000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("5", "gwei")),
      params: {
        _time: time,
      },
    };
    // console.log("begin start", ops);
    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        saveListedAuction(item, price * ("1e" + 18), addrs);
        setLoading(false);
        history.push("/");
        // console.log("success start");
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        failList();
      },
    });
  };

  async function getExchangeFee() {
    const ops = {
      contractAddress: marketAddress,
      functionName: "getListingPrice",
      abi: contractABIJson,
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: (value) => {
        // console.log(value);
        setExchangeFee(value);
      },
    });
  }

  // function succApprove() {
  //   let secondsToGo = 5;
  //   const modal = Modal.success({
  //     title: "Success!",
  //     content: `Approval is now set, you may list your NFT`,
  //   });
  //   setTimeout(() => {
  //     modal.destroy();
  //   }, secondsToGo * 1000);
  // }

  function failApprove() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem with setting approval`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  const list = async (item, currentPrice) => {
    // setLoading(true);
    const p = currentPrice * ("1e" + 18);
    const ops = {
      contractAddress: marketAddress,
      functionName: listItemFunction,
      abi: contractABIJson,
      params: {
        nftContract: item.token_address,
        tokenId: item.token_id,
        price: String(p),
      },
      msgValue: exchangeFee,
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        // console.log("success");
        setLoading(false);
        saveListedNFT(item, p);
        setVisibilityListModal(false);
        addItemImage();
        succList();
      },
      onError: (error) => {
        setLoading(false);
        failList();
      },
    });
  };

  async function saveListedNFT(item, price) {
    const ListedItem = Moralis.Object.extend("ListedItem");
    const itemListed = new ListedItem();
    itemListed.set("image", item.image);
    itemListed.set("metadata", item.metadata);
    itemListed.set("category", category);
    itemListed.set("owner_of", marketAddress); // smart contract address
    itemListed.set("token_address", item.token_address); // smart contract address
    itemListed.set("token_id", item.token_id);
    itemListed.set("token_uri", item.token_uri);
    itemListed.set("type", item.type);
    itemListed.set("price", price);
    itemListed.set("name", item.name);
    itemListed.save();
  }

  async function saveListedAuction(item, price, auctionContract) {
    let now = new Date();
    const ListedItem = Moralis.Object.extend("ListedItem");
    const itemListed = new ListedItem();
    itemListed.set("image", item.image);
    itemListed.set("metadata", item.metadata);
    itemListed.set("category", category);
    itemListed.set("owner_of", account); //owner
    itemListed.set("token_address", item.token_address); // smart contract address
    itemListed.set("token_id", item.token_id);
    itemListed.set("token_uri", item.token_uri);
    itemListed.set("type", item.type);
    itemListed.set("price", price); // min bid
    itemListed.set("name", item.name);
    itemListed.set("auction", true);
    itemListed.set(
      "duration",
      // moment().subtract(-Number(time), "days").utc().toISOString()
      moment(now).subtract(-Number(time), "days").utc().toISOString()
    ); // duration of auction
    itemListed.set("auctionContract", auctionContract);
    itemListed.save();
  }

  function succList() {
    let secondsToGo = 2;
    const modal = Modal.success({
      title: "Success!",
      content: `Your NFT was listed on the marketplace`,
    });
    history.push("/");
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failList() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem listing your NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function addItemImage() {
    const itemImage = new ItemImage();

    itemImage.set("image", nftToSell.image);
    itemImage.set("nftContract", nftToSell.token_address);
    itemImage.set("tokenId", nftToSell.token_id);
    itemImage.set("name", nftToSell.name);
    itemImage.set("type", nftToSell.type);
    itemImage.save();
  }
  function handleChange(value) {
    setCategory(value);
  }
  function onChangePrice(e) {
    setPrice(e);
    setFormValid({ ...formValid, priceFormatErr: false });
  }
  function isFormValid() {
    if (category.length === 0 && price === undefined) {
      setFormValid({ ...formValid, priceErr: true, categoryErr: true });
      return false;
    }

    if (price === undefined) {
      setFormValid({ ...formValid, priceErr: true });
      return false;
    }

    if (parseFloat(price) <= 0) {
      setFormValid({ ...formValid, priceFormatErr: true });
      return false;
    }

    if (category.length === 0) {
      setFormValid({ ...formValid, categoryErr: true });
      return false;
    }

    if (category.length > 0 && price !== undefined) {
      setFormValid({ ...formValid, priceErr: false, categoryErr: false });
      return true;
    }
  }

  // form auction

  function handleChangeAuction(value) {
    setCategory(value);
  }
  function onChangePriceAuction(e) {
    setPriceAuc(e);
    setFormAuctionValid({ ...formValid, priceFormatErr: false });
  }

  function onChangeTimeAuction(value) {
    // console.log(value);
    setTime(value);
    setFormAuctionValid({ ...formValid, timeErr: false });
  }

  function isFormValidAuction() {
    if (category.length === 0 && priceAuc === undefined && time === undefined) {
      setFormAuctionValid({
        ...formAuctionValid,
        priceAucErr: true,
        categoryErr: true,
        timeErr: true,
      });
      return false;
    }

    if (priceAuc === undefined) {
      setFormAuctionValid({ ...formAuctionValid, priceAucErr: true });
      return false;
    }

    if (parseFloat(priceAuc) <= 0) {
      setFormAuctionValid({ ...formAuctionValid, priceAucFormatErr: true });
      return false;
    }

    if (category.length === 0) {
      setFormAuctionValid({ ...formAuctionValid, categoryErr: true });
      return false;
    }
    if (time === undefined) {
      setFormAuctionValid({ ...formAuctionValid, timeErr: true });
      return false;
    }

    if (parseFloat(time) <= 0) {
      setFormAuctionValid({ ...formAuctionValid, timeFormatErr: true });
      return false;
    }
    if (category.length > 0 && priceAuc !== undefined && time !== undefined) {
      setFormAuctionValid({
        ...formAuctionValid,
        priceErr: false,
        categoryErr: false,
        time: false,
      });
      return true;
    }
  }

  // console.log("NFTBalances", NFTBalances);

  return (
    <div className={styless.cardbox}>
      <div
        className={styless.image}
        // style={{ backgroundImage: `url(${item.image})` }}
      >
        {mediaType.includes("video") ? (
          <video className={styless.image} width="350" controls>
            {" "}
            <source src={mediaSrc} type={mediaType}></source>
          </video>
        ) : mediaType.includes("audio") ? (
          <audio className={styless.image} width="350" controls>
            {" "}
            <source src={mediaSrc} type={mediaType}></source>
          </audio>
        ) : (
          <img
            alt=""
            src={mediaSrc}
            type={mediaType}
            className={styless.image}
            width="350"
          />
        )}
      </div>
      <div className={styless.content}>
        <div className={styless.title}>{item.name}</div>
        <Row justify="space-between">
          <span className={styless.id}>ID No.</span>
          {/* <span className={styless.price}>0.125 ETH</span> */}
        </Row>
        <Divider style={{ margin: "10px 0" }} />
        <Row justify="space-between" gutter={16}>
          <Col span={8}>
            <Button
              className={`${styless.button} ${styless.btnInfo} btn-hover`}
              onClick={() =>
                window.open(
                  `${getExplorer(chainId)}address/${item.token_address}`,
                  "_blank"
                )
              }
            >
              Trx Info
            </Button>
          </Col>
          <Col span={8}>
            <Button
              className={`${styless.button} ${styless.btnInfo} btn-hover`}
              onClick={() => handleTransferClick(item)}
            >
              Transfer
            </Button>
          </Col>
          <Col span={8}>
            <Button
              className={`${styless.button} ${styless.btnBuy}`}
              onClick={() => handleSellClick(item)}
            >
              List
            </Button>
          </Col>
        </Row>
      </div>
      <Modal
        title={
          auc === "1" ? (
            <>{`Sell ${nftToSell?.name || "NFT"}`}</>
          ) : (
            <>{`Auction ${nftToSell?.name || "NFT"}`}</>
          )
        }
        visible={visibleListModal}
        onCancel={() => setVisibilityListModal(false)}
        // onOk={() => list(nftToSell, price)}
        // okText="Sell"
        footer={[
          <Button
            key="1"
            onClick={() => setVisibilityListModal(false)}
            className={styless.btnCancel}
            loading={loading ? true : false}
            // disabled={loading ? true : false}
          >
            Cancel
          </Button>,
          // <Button key="2" type="primary" onClick={() => approveAll(nftToSell)} style={{fontFamily :"GILROY "}}>
          //   Approve
          // </Button>,

          <Button
            key="3"
            type="primary"
            onClick={() => {
              auc === "1" ? approveAll(item) : auction(item);
            }}
            loading={loading ? true : false}
            className={styless.btnAution}
          >
            {auc === "1" ? <>Sell</> : <>Complete</>}
          </Button>,
        ]}
      >
        <Tabs
          onChange={(key) => setAuc(key)}
          defaultActiveKey="1"
          style={{ alignItems: "center", marginTop: "-5%" }}
        >
          <Tabs.TabPane tab={<span>Sell</span>} key="1">
            <Spin spinning={loading}>
              <div
                style={{
                  width: "250px",
                  margin: "auto",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              >
                {mediaType.includes("video") ? (
                  <video className={styless.image} width="350" controls>
                    {" "}
                    <source src={mediaSrc} type={mediaType}></source>
                  </video>
                ) : mediaType.includes("audio") ? (
                  <audio className={styless.image} width="350" controls>
                    {" "}
                    <source src={mediaSrc} type={mediaType}></source>
                  </audio>
                ) : (
                  <img
                    alt=""
                    src={mediaSrc}
                    type={mediaType}
                    className={styless.image}
                    width="350"
                  />
                )}
              </div>
              <Input
                autoFocus
                placeholder="Set Price in BNB"
                onChange={(e) => onChangePrice(e.target.value)}
                min={0}
                type="number"
              />
              <div style={{ color: "red" }}>
                {!price && formValid.priceErr ? "Please input your price" : ""}
              </div>
              <div style={{ color: "red" }}>
                {price && formValid.priceFormatErr
                  ? "Price must greater than 0"
                  : ""}
              </div>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%", marginTop: "10px" }}
                placeholder="Please select"
                // options={category}
                onChange={handleChange}
              >
                {categoryLs.map((e, index) => (
                  <Option key={index} value={e}>
                    {e}
                  </Option>
                ))}
              </Select>
              <div style={{ color: "red" }}>
                {category.length === 0 && formValid.categoryErr
                  ? "Please select at least one category"
                  : ""}
              </div>
            </Spin>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span>Auction</span>} key="2">
            <Spin spinning={loading}>
              <div
                style={{
                  width: "250px",
                  margin: "auto",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              >
                {mediaType.includes("video") ? (
                  <video className={styless.image} width="350" controls>
                    {" "}
                    <source src={mediaSrc} type={mediaType}></source>
                  </video>
                ) : mediaType.includes("audio") ? (
                  <audio className={styless.image} width="350" controls>
                    {" "}
                    <source src={mediaSrc} type={mediaType}></source>
                  </audio>
                ) : (
                  <img
                    alt=""
                    src={mediaSrc}
                    type={mediaType}
                    className={styless.image}
                    width="350"
                  />
                )}
              </div>
              <Input
                autoFocus
                placeholder="Set Price in BNB"
                onChange={(e) => onChangePriceAuction(e.target.value)}
                min={0}
                type="number"
              />
              <div style={{ color: "red" }}>
                {!price && formAuctionValid.priceAucErr
                  ? "Please input your price"
                  : ""}
              </div>
              <div style={{ color: "red" }}>
                {price && formAuctionValid.priceAucFormatErr
                  ? "Price must greater than 0"
                  : ""}
              </div>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%", marginTop: "10px" }}
                placeholder="Please select"
                // options={category}
                onChange={handleChangeAuction}
              >
                {categoryLs.map((e, index) => (
                  <Option key={index} value={e}>
                    {e}
                  </Option>
                ))}
              </Select>
              <div style={{ color: "red", marginTop: "10px" }}>
                {category.length === 0 && formAuctionValid.categoryErr
                  ? "Please select at least one category"
                  : ""}
              </div>
              <Select
                placeholder="Duration"
                style={{ width: "100%" }}
                onChange={onChangeTimeAuction}
              >
                <Option value="15">15 minutes</Option>
                <Option value="1440">1 day</Option>
                <Option value="4320">3 days</Option>
                <Option value="10080">7 days</Option>
              </Select>
              <div style={{ color: "red", marginTop: "10px" }}>
                {formAuctionValid.timeErr ? "Please select time" : ""}
              </div>
            </Spin>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
      <Modal
        title={`Transfer ${nftToSend?.name || "NFT"}`}
        visible={visibleTransferModal}
        onCancel={() => setVisibilityTransferModal(false)}
        onOk={() => transfer(nftToSend, amountToSend, receiverToSend)}
        confirmLoading={isPending}
        okText="Send"
      >
        <AddressInput autoFocus placeholder="Receiver" onChange={setReceiver} />
        {nftToSend && nftToSend.contract_type === "erc1155" && (
          <Input
            placeholder="amount to send"
            onChange={(e) => handleChange(e)}
          />
        )}
      </Modal>
    </div>
  );
};

export default CollectionCard;
