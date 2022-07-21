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
    <div className={styless.cardbox}>
      <div
        className={styless.image}
        style={{ backgroundImage: `url(${item.image})` }}
      ></div>
      <div className={styless.content}>
        <div className={styless.title}>{item.name}</div>
        <Row justify="space-between">
          <span className={styless.id}>{item.token_id}</span>
          {/* <span className={styless.price}>{item.token_id}</span> */}
        </Row>
        {/*<Divider style={{ margin: "10px 0" }} />
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
                margin: "auto"
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
                    marginBottom: "15px"
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
              marginBottom: "15px"
            }}
          />
          <Alert message="This NFT is currently not for sale" type="warning" />
        </Modal>
      )}
    </div>
  );
};

export default CollectionCardOther;
