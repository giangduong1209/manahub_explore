import { Row, Modal, Spin, Badge, Alert } from "antd";
import React, { useState } from "react";
import styless from "./Collections.module.css";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getNativeByChain } from "helpers/networks";
import {
  useMoralis,
  useMoralisQuery,
  useWeb3ExecuteFunction
} from "react-moralis";

const CollectionCardOther = ({ item }) => {
  const [nftToBuy, setNftToBuy] = useState(null);
  const { Moralis, chainId, authenticate } = useMoralis();
  const [visible, setVisibility] = useState(false);
  const nativeName = getNativeByChain(chainId);
  const [loading, setLoading] = useState(false);
  const queryMarketItems = useMoralisQuery("MarketItemCreateds");
  const purchaseItemFunction = "createMarketSale";
  const contractProcessor = useWeb3ExecuteFunction();
  const { marketAddress, contractABI, walletAddress } = useMoralisDapp();
  const contractABIJson = JSON.parse(contractABI);
  const fetchMarketItems = JSON.parse(
    JSON.stringify(queryMarketItems.data, [
      "objectId",
      "createdAt",
      "price",
      "nftContract",
      "itemId",
      "sold",
      "tokenId",
      "seller",
      "owner",
      "confirmed"
    ])
  );

  const getMarketItem = (item) => {
    const result = fetchMarketItems?.find(
      (e) =>
        e.nftContract === item?.token_address &&
        e.tokenId === item?.token_id &&
        e.sold === false &&
        e.confirmed === true
    );
    return result;
  };

  async function purchase() {
    // Moralis.enableWeb3();
    authenticate({
      onSuccess: async () => {
        setLoading(true);
        const tokenDetails = getMarketItem(nftToBuy);
        // console.log(tokenDetails);
        const itemID = tokenDetails.itemId;
        const tokenPrice = tokenDetails.price;
        const ops = {
          contractAddress: marketAddress,
          functionName: purchaseItemFunction,
          abi: contractABIJson,
          params: {
            nftContract: nftToBuy.token_address,
            itemId: itemID
          },
          msgValue: tokenPrice
        };

        await contractProcessor.fetch({
          params: ops,
          onSuccess: () => {
            console.log("success");
            setLoading(false);
            setVisibility(false);
            updateSoldMarketItem();
            succPurchase();
          },
          onError: (error) => {
            console.log(error);
            setLoading(false);
            failPurchase();
          }
        });
      },
      onError: () => {
        failPurchase();
      }
    });

    // Moralis.authenticate().then(async () => {

    // });
  }

  function failPurchase() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem when purchasing this NFT`
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function succPurchase() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `You have purchased this NFT`
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  async function updateSoldMarketItem() {
    const id = getMarketItem(nftToBuy).objectId;
    const marketList = Moralis.Object.extend("MarketItemCreateds");
    const query = new Moralis.Query(marketList);
    await query.get(id).then((obj) => {
      obj.set("sold", true);
      obj.set("owner", walletAddress);
      obj.save();
    });
  }

  // eslint-disable-next-line no-unused-vars
  const handleBuyClick = (item) => {
    setNftToBuy(item);
    setVisibility(true);
  };

  return (
    <div className="col-lg-3 col-md-6">
      <div className="item-card md-mb50">
        <div className="img">
          <a href="#0">
            <img src={item.image} alt="" />
          </a>
          <div className="fav">
            <span className="icon pe-7s-like"></span>
          </div>
        </div>          
        <div className="cont">
          <div className="info">
            <div className="item-title mt-15">
              <h6 className="fw-700"><a href="#0">{ item.metadata?.name }</a></h6>
            </div>
            <div className="eth mt-10">
              <span className="fz-14">
                <span className="fz-12 opacity-7 mr-5">Highest bid :</span>
                {/* <span className="icon">
                  <img src="nft/img/eth1.svg" alt="" />
                </span> */}
                <span>{ item.token_id } ETH</span>
              </span>
            </div>
          </div>
          <div className="botm flex">
            {/* <div className="left valign">
              <div className="reles">
                <span className="fz-12">Relesed :<span className="opacity-7 ml-5">{ styless.date }</span></span>
              </div>
            </div> */}
            <div className="right ml-auto">
              <div className="bid">
                <a href="#0">Bid</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionCardOther;
