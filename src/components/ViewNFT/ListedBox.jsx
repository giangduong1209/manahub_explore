/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Modal, Alert, Row, Col } from "antd";
import React, { useState } from "react";
import styless from "./ViewNFT.module.css";
// import { Link } from "react-router-dom";
import btnstyles from "./ViewNFT2.module.css";
import {
  useMoralisQuery,
  useMoralis,
  useWeb3ExecuteFunction
} from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "helpers/networks";
import { useHistory } from "react-router";
import axios from "axios";

const ImageBox = ({ information }) => {
  // console.log(information)
  const history = useHistory()
  const { Moralis, authenticate, chainId } = useMoralis();
  const queryMarketItems = useMoralisQuery("MarketItemCreated");
  const [loading, setLoading] = useState(false);
  const { marketAddress, contractABI, walletAddress } = useMoralisDapp();
  const purchaseItemFunction = "createMarketSale";
  const contractABIJson = JSON.parse(contractABI);
  const contractProcessor = useWeb3ExecuteFunction();
  // const domain = "http://localhost:8181";
  const domain = "http://45.77.39.122:8181";

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
      "confirmed",
    ])
  );

  const getMarketItem = () => {
    // console.log(fetchMarketItems);
    const result = fetchMarketItems?.find(
      (e) =>
        e.nftContract === information?.token_address &&
        e.tokenId === information?.token_id &&
        e.sold === false &&
        e.confirmed === true
    );
    // console.log(result);
    return result;
  };

  async function purchase() {
    // Moralis.enableWeb3();
    authenticate().then(async () => {
      setLoading(true);
      const tokenDetails = getMarketItem();
      const itemID = tokenDetails.itemId;
      const tokenPrice = tokenDetails.price;
      const ops = {
        contractAddress: marketAddress,
        functionName: purchaseItemFunction,
        abi: contractABIJson,
        params: {
          nftContract: information?.token_address,
          itemId: itemID
        },
        msgValue: tokenPrice
      };

      await contractProcessor.fetch({
        params: ops,
        onSuccess: () => {
          updateRewardRefs({
            nftContract: information?.token_address,
            itemId: itemID
          });
          setLoading(false);
          // setVisibility(false);
          updateSoldMarketItem();
          succPurchase();

        },
        onError: (error) => {
          setLoading(false);
          failPurchase();
        }
      });
    });
  }

  async function removeFromDB() {

    const query = new Moralis.Query('ListedItem');
    query.equalTo("token_address", information.token_address);
    query.equalTo("token_id", information.token_id);
    // query.equalTo("itemId", information.itemId);
    const object = await query.first();
    if (object) {
      object.destroy().then(
        () => {
          // console.log("The object was deleted");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  function succPurchase() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `You have purchased this NFT`
    });
    removeFromDB();
    history.push(`/my-collection`);
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
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

  async function updateSoldMarketItem() {
    const id = getMarketItem().objectId;
    const marketList = Moralis.Object.extend("MarketItemCreated");
    const query = new Moralis.Query(marketList);
    await query.get(id).then((obj) => {
      obj.set("sold", true);
      obj.set("owner", walletAddress);
      obj.save();
    });
  }

  async function updateRewardRefs(params) {
    const fetchAPI = await axios.post(domain + "/w3/updateClaim", {
      params: params,
    });
  }

  return (
    <div className={styless.cardListedbox}>
      <div
        className={styless.description}
      >
        Listed by:
        <br />
        <a className={styless.viewAddress} style={{ color: "#f27252", fontWeight: "bold" }}>
          {information?.owner_of}
        </a>
        {/* <Link to="/view-nft" style={{color :'blue'}}> 8byMAt9gMbPXuHC8vLprU6ZpQ1XJjiFTrJaF5XMXYnFL</Link> */}
      </div>

      <div
        className={styless.prices}
        style={{
          borderTop: "solid 1px gray",
          borderBottom: "solid 1px gray",

        }}
      >
        {parseInt(getMarketItem()?.price) / ("1e" + 18)}{" "}
        <span style={{ fontSize: "50%" }}> BNB </span>
      </div>

      <div className={styless.content}>
        {/* <div
          className={styless.description}
          style={{ fontFamily: "GILROY", fontWeight: "300", textAlign: "left" }}
        >
          Creator royalties on secondary sales: <span style={{fontWeight:'bold'}}>15 %</span>
        </div> */}
        {getMarketItem() ? (
          <Row justify="space-between" gutter={16}>
            <Col span={12}>
              <Button
                className={btnstyles.exploreBtn}
                loading={loading}
                onClick={() =>
                  window.open(
                    `${getExplorer(chainId)}address/${information?.token_address
                    }`,
                    "_blank"
                  )
                }
                style={{ marginTop: "10px", }}
              >
                <span >Trx Info</span>
              </Button>
            </Col>
            <Col span={12}>
              <Button
                className={btnstyles.btnInfo}
                loading={loading}
                onClick={() => purchase()}
                style={{ fontFamily: 'GILROY', fontWeight: 700, marginTop: "10px" }}
              >
                <span >Buy</span>
              </Button>
            </Col>
          </Row>
        ) : (
          <div
            className={styless.description}
            style={{

              fontWeight: "300",
              textAlign: "left"
            }}
          >
            <Alert
              message="This NFT is currently not for sale"
              type="warning"
            />
          </div>
        )}

        {/* <div
          className={styless.description}
          style={{ fontFamily: "GILROY", fontWeight: "300"}}
        >
          Doublecheck everything before you buy! <a href="#" style={{color :'blue'}}> How to spot fakes?</a> 
           Read our Terms and Conditions before you buy!
        </div> */}
      </div>
    </div>
  );
};

export default ImageBox;
