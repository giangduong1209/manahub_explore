import { Row, Modal, Spin, Badge, Alert } from "antd";
import React, { useState, useEffect } from "react";
import styless from "./Collections.module.css";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getNativeByChain } from "helpers/networks";
import {
  useMoralis,
  useMoralisQuery,
  useWeb3ExecuteFunction,
} from "react-moralis";
import { useHistory } from "react-router";

const CollectionCard = ({ item }) => {
  const history = useHistory();
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
      "confirmed",
    ])
  );
  const [mediaSrc, setMediaSrc] = useState("");
  const [mediaType, setMediaType] = useState("");

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
            itemId: itemID,
          },
          msgValue: tokenPrice,
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
          },
        });
      },
      onError: () => {
        failPurchase();
      },
    });

    // Moralis.authenticate().then(async () => {

    // });
  }

  function failPurchase() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem when purchasing this NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function succPurchase() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `You have purchased this NFT`,
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

  useEffect(() => {
    if (item) {
      fetch(item?.image)
        .then((rs) => {
          item.type = rs.headers.get("content-type");
          setMediaSrc(item.image);
          setMediaType(item.type);
        })
        .catch((err) => console.log("fetch type media error:", err));
    }
  }, [item]);

  const nftInfo = (item) => {
    if (item.auction) {
      history.push(
        `/view-auction/${item.token_address}/${item.token_id}/${item.auctionContract}`
      );
    } else {
      history.push(`/view-nft/${item.token_address}/${item.token_id}`);
    }
  };

  return (
    <div className={styless.cardbox}>
      <Badge.Ribbon
        color={item?.auction ? "blue" : "green"}
        text={
          item?.auction
            ? `Auction`
            : getMarketItem(item)?.price > 0
            ? `${getMarketItem(item)?.price / ("1e" + 18)} ${nativeName}`
            : "Mint"
        }
        style={item?.price < 0 && { display: "none" }}
      >
        <div
          className={styless.image}
          // style={{ backgroundImage: `url(${item.image})` }}
        >
          {mediaType.includes("video") ? (
            <video
              className={styless.image}
              width="350"
              controls
              muted
              onClick={() => nftInfo(item)}
            >
              {" "}
              <source src={mediaSrc} type={mediaType}></source>
            </video>
          ) : mediaType.includes("audio") ? (
            <audio
              className={styless.image}
              width="350"
              controls
              muted
              onClick={() => nftInfo(item)}
            >
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
              onClick={() => nftInfo(item)}
              loading="lazy"
            />
          )}
        </div>
      </Badge.Ribbon>
      <div className={styless.content}>
        <div className={styless.title}>{item.name}</div>
        <Row justify="space-between">
          <span className={styless.id}>{item.token_id}</span>
          {/* <span className={styless.price}>{item.token_id}</span> */}
        </Row>
        {/* <Divider style={{ margin: "10px 0" }} />
        <Row justify="space-between" gutter={16}>
          <Col span={12}>
            <Button
              className={`${styless.button} ${styless.btnInfo}`}
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
          <Col span={12}>
            <Button
              className={`${styless.button} ${styless.btnBuy}`}
              onClick={() => handleBuyClick(item)}
            >
              Buy
            </Button>
          </Col>
        </Row> */}
      </div>
      {getMarketItem(nftToBuy) ? (
        <Modal
          title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
          visible={visible}
          onCancel={() => setVisibility(false)}
          onOk={() => purchase()}
          okText="Buy"
        >
          <Spin spinning={loading}>
            <div
              style={{
                width: "250px",
                margin: "auto",
              }}
            >
              <Badge.Ribbon
                color="green"
                text={`${
                  getMarketItem(nftToBuy).price / ("1e" + 18)
                } ${nativeName}`}
              >
                <img
                  src={nftToBuy?.image}
                  alt="Buy"
                  style={{
                    width: "250px",
                    borderRadius: "10px",
                    marginBottom: "15px",
                  }}
                />
              </Badge.Ribbon>
            </div>
          </Spin>
        </Modal>
      ) : (
        <Modal
          title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
          visible={visible}
          onCancel={() => setVisibility(false)}
          onOk={() => setVisibility(false)}
        >
          <img
            src={nftToBuy?.image}
            alt="Buy"
            style={{
              width: "250px",
              margin: "auto",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          />
          <Alert message="This NFT is currently not for sale" type="warning" />
        </Modal>
      )}
    </div>
  );
};

export default CollectionCard;
