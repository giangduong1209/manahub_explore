/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Modal, Input, Row, Col } from "antd";
import React, { useState, useEffect } from "react";
import styless from "./ViewNFT.module.css";
// import { Link } from "react-router-dom";
import btnstyles from "./ViewNFT2.module.css";
import {
  useMoralisQuery,
  useMoralis,
  useWeb3ExecuteFunction,
} from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "helpers/networks";
import Countdown from "react-countdown";
import { auctionABI } from "helpers/auction";
import moment from "moment";

const ImageBox = ({ information }) => {
  console.log(information);
  const { Moralis, authenticate, chainId, account } = useMoralis();
  const queryMarketItems = useMoralisQuery("MarketItemCreateds");
  const [loading, setLoading] = useState(false);
  const { marketAddress, contractABI, walletAddress } = useMoralisDapp();
  const purchaseItemFunction = "createMarketSale";
  const contractABIJson = JSON.parse(contractABI);
  const contractProcessor = useWeb3ExecuteFunction();
  const contractAuctionABIJson = JSON.parse(auctionABI);
  const [highestBid, setHighestBid] = useState(0);
  const [ended, setEnded] = useState(false);
  const [timeEnded, setTimeEnded] = useState(Date.now() + 5000);

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
    const result = fetchMarketItems?.find(
      (e) =>
        e.nftContract === information?.token_address &&
        e.tokenId === information?.token_id &&
        e.sold === false &&
        e.confirmed === true
    );
    // console.log(result)
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
          itemId: itemID,
        },
        msgValue: tokenPrice,
      };

      await contractProcessor.fetch({
        params: ops,
        onSuccess: () => {
          setLoading(false);
          // setVisibility(false);
          updateSoldMarketItem();
          succPurchase();
        },
        onError: (error) => {
          setLoading(false);
          failPurchase();
        },
      });
    });
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [price, setPrice] = useState();
  const [formValid, setFormValid] = useState({
    priceErr: false,
    priceFormatErr: false,
  });

  function onChangePrice(e) {
    setPrice(e);
    setFormValid({ ...formValid, priceFormatErr: false });
  }
  function isFormValid() {
    if (price === undefined) {
      setFormValid({ ...formValid, priceErr: true });
      return false;
    }

    if (parseFloat(price) <= 0) {
      setFormValid({ ...formValid, priceFormatErr: true });
      return false;
    }
  }

  async function openModal() {
    setIsModalVisible(true);
  }

  const handleOk = () => {
    // console.log(isFormValid());
    if (isFormValid() || (isFormValid() === undefined && price !== 0)) {
      // setIsModalVisible(false);
      if (price <= highestBid / ("1e" + 18)) {
        let secondsToGo = 5;
        const modal = Modal.warning({
          title: "Warning!",
          content: `Min price now is ${highestBid / ("1e" + 18)} BNB`,
        });
        setTimeout(() => {
          modal.destroy();
        }, secondsToGo * 1000);
      } else {
        bid();
      }
    } else {
      return;
    }
  };

  const bid = async () => {
    let bid = price * ("1e" + 18);
    let ops = {
      contractAddress: information?.auctionContract,
      functionName: "bid",
      abi: contractAuctionABIJson,
      msgValue: bid,
    };
    setLoading(true);
    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        setIsModalVisible(false);
        getHighestBid();
        saveAuctionBid(bid);
        setLoading(false);
        let secondsToGo = 5;
        const modal = Modal.success({
          title: "Success!",
          content: `Bid Success!!`,
        });
        setTimeout(() => {
          modal.destroy();
        }, secondsToGo * 1000);
      },
      onError: (e) => {
        setLoading(false);
        console.log(e);
        let secondsToGo = 5;
        const modal = Modal.error({
          title: "Failed!",
          content: `Something was wrong, please try again later.`,
        });
        setTimeout(() => {
          modal.destroy();
        }, secondsToGo * 1000);
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  async function removeFromDB() {
    const query = new Moralis.Query("ListedItem");
    query.equalTo("token_address", information.token_address);
    query.equalTo("token_id", information.token_id);
    // query.equalTo("itemId", information.itemId);
    const object = await query.first();
    if (object) {
      object.destroy().then(
        () => {
          console.log("The object was deleted");
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
      content: `You have purchased this NFT`,
    });
    removeFromDB();
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
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

  async function updateSoldMarketItem() {
    const id = getMarketItem().objectId;
    const marketList = Moralis.Object.extend("MarketItemCreateds");
    const query = new Moralis.Query(marketList);
    await query.get(id).then((obj) => {
      obj.set("sold", true);
      obj.set("owner", walletAddress);
      obj.save();
    });
  }

  // countdown

  useEffect(() => {
    console.log(information?.auctionContract);
    if (information?.auctionContract) {
      getHighestBid();
      // getTransaction();
      getEnded();
      getEndedAt();
      setTimeEnded(information?.duration);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [information]);
  const getHighestBid = async () => {
    let ops = {
      contractAddress: information?.auctionContract,
      functionName: "highestBid",
      abi: contractAuctionABIJson,
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: (res) => {
        setHighestBid(res);
      },
      onError: (e) => {
        console.log(e);
      },
    });
  };

  const getEndedAt = async () => {
    let ops = {
      contractAddress: information?.auctionContract,
      functionName: "endAt",
      abi: contractAuctionABIJson,
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: (res) => {
        setTimeEnded(res);
        console.log(res);
      },
      onError: (e) => {
        console.log(e);
      },
    });
  };

  const getEnded = async () => {
    let ops = {
      contractAddress: information?.auctionContract,
      functionName: "ended",
      abi: contractAuctionABIJson,
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: (res) => {
        setEnded(res);
        console.log(res);
      },
      onError: (e) => {
        console.log(e);
      },
    });
  };

  const endAuction = async () => {
    const equal = moment.unix(timeEnded).utc().isSameOrBefore(moment.utc());
    console.log(moment.unix(timeEnded).utc(), moment.utc());
    if (equal) {
      let ops = {
        contractAddress: information?.auctionContract,
        functionName: "end",
        abi: contractAuctionABIJson,
      };

      await contractProcessor.fetch({
        params: ops,
        onSuccess: () => {
          setEnded(true);
          let secondsToGo = 5;
          const modal = Modal.success({
            title: "Success!",
            content: `The auction have ended!`,
          });
          setTimeout(() => {
            modal.destroy();
          }, secondsToGo * 1000);
        },
        onError: (e) => {
          console.log(e);
        },
      });
    } else {
      let secondsToGo = 5;
      const modal = Modal.warning({
        title: "Warning!",
        content: `The auction can not and yet!!`,
      });
      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    }
  };

  const withdrawAuction = async () => {
    // updateWithDrawStatus(true)
    const check = await checkWithDraw();
    // console.log(checkWithDraw(), check)
    if (check === 1) {
      let ops = {
        contractAddress: information?.auctionContract,
        functionName: "withdraw",
        abi: contractAuctionABIJson,
      };
      await contractProcessor.fetch({
        params: ops,
        onSuccess: (res) => {
          // updateWithDrawStatus(true)
          let secondsToGo = 5;
          const modal = Modal.success({
            title: "Success!",
            content: `Withdraw Success!`,
          });
          setTimeout(() => {
            modal.destroy();
          }, secondsToGo * 1000);
        },
        onError: (e) => {
          console.log(e);
          let secondsToGo = 5;
          const modal = Modal.error({
            title: "Error!",
            content: `Something wrong, please try again later!`,
          });
          setTimeout(() => {
            modal.destroy();
          }, secondsToGo * 1000);
        },
      });
    } else if (check === 2) {
      let secondsToGo = 5;
      const modal = Modal.warning({
        title: "Warning!",
        content: `Can not claim because you are the highest bidder!`,
      });
      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    } else {
      let secondsToGo = 5;
      const modal = Modal.warning({
        title: "Warning!",
        content: `You don't bid in this auction!`,
      });
      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    }
  };

  async function saveAuctionBid(price) {
    const ListedItem = Moralis.Object.extend("AuctionBid");
    const itemListed = new ListedItem();
    itemListed.set("fromAddress", account);
    itemListed.set("toAddress", information.auctionContract);
    itemListed.set("price", price);
    itemListed.set("withdraw", false);
    itemListed.save();
  }

  const checkWithDraw = async () => {
    const query = new Moralis.Query("AuctionBid");
    query.equalTo("toAddress", information?.auctionContract);
    query.equalTo("fromAddress", account);
    query.equalTo("withdraw", false);
    const object = await query.descending("createdAt").find();
    console.log(object);
    getHighestBid();
    if (object || object !== undefined) {
      return 1;
    } else {
      return 3; // not bid yet
    }
    //1: not highest bidder, 2: is highest bidder, 3: not bid yet
  };

  // const updateWithDrawStatus = async () => {
  //   const query = new Moralis.Query("AuctionBid");
  //   query.equalTo("toAddress", information?.auctionContract);
  //   query.equalTo("fromAddress", account);
  //   query.equalTo("withdraw", false);
  //   const object = await query.ascending('createdAt').find();
  //   object.save();
  // }

  // const getHighestBidder = async () => {
  //   let ops = {
  //     contractAddress: information?.auctionContract,
  //     functionName: "highestBidder",
  //     abi: contractAuctionABIJson
  //   };
  //   let addrs = "";
  //   await contractProcessor.fetch({
  //     params: ops,
  //     onSuccess: (res) => {
  //       console.log("res", res);
  //       addrs = res;
  //     },
  //     onError: (e) => {
  //       console.log(e);
  //       let secondsToGo = 5;
  //       const modal = Modal.error({
  //         title: "Error!",
  //         content: `Something wrong, please try again later!`
  //       });
  //       setTimeout(() => {
  //         modal.destroy();
  //       }, secondsToGo * 1000);
  //     }
  //   });
  //   return addrs;
  // };

  // const countDown = ({ days, hours, minutes, seconds, completed }) => {
  //   // console.log(moment(information?.duration).utc().format())
  //   if (!completed) {
  //     console.log("not ended");
  //     return (
  //       <span>
  //         Ended At: {days}:{hours}:{minutes}:{seconds}
  //       </span>
  //     );
  //   } else {
  //     console.log("ended");
  //     return (
  //       <Countdown date={new Date(1650692462)} renderer={countDownDelete} />
  //     );
  //   }
  // };

  // const countDownDelete = ({ days, hours, minutes, seconds, completed }) => {
  //   if (completed) {
  //     deleteAuction();
  //     // history.push('/explore')
  //     return <span></span>;
  //   } else {
  //     return (
  //       <span>
  //         {days}:{hours}:{minutes}:{seconds}
  //       </span>
  //     );
  //   }
  // };

  // const deleteAuction = async () => {
  //   const query = new Moralis.Query("ListedItem");
  //   query.equalTo("auctionContract", information?.auctionContract);
  //   // query.equalTo("itemId", information.itemId);
  //   const object = await query.first();
  //   // if (object) {
  //   //   object.destroy().then(
  //   //     () => {
  //   //       console.log("The object was deleted");
  //   //     },
  //   //     (error) => {
  //   //       console.log(error);
  //   //     }
  //   //   );
  //   // }
  // };

  return (
    <div className={styless.cardListedbox}>
      <div
        className={styless.description}
        style={{fontWeight: "bold"}}
      >
        <span style={{fontWeight: "normal"}} >Listed by:</span> &ensp;
        <a className={styless.viewAddress} style={{ color: "#FEA013" }}>
          {information?.owner_of}
        </a>
        &ensp;&ensp;<span style={{fontWeight: "normal"}}>End at:</span>  &ensp;
        <Countdown date={moment.unix(timeEnded) || Date.now() + 5000} />
        <span>
          {/* Ended At:{" "}
          {moment.unix(timeEnded).format("MM/DD/YYYY hh:mm")} */}
        </span>
        {/* <Link to="/view-nft" style={{color :'blue'}}> 8byMAt9gMbPXuHC8vLprU6ZpQ1XJjiFTrJaF5XMXYnFL</Link> */}
      </div>

      <div
        className={styless.prices}
        style={{
          borderTop: "solid 1px gray",
          borderBottom: "solid 1px gray",
          fontFamily: " ",
        }}
      >
        {/* {information?.auction || information?.auctionContract?.length > 0
          ? highestBid / ("1e" + 18)
          : getMarketItem()?.price / ("1e" + 18)}
           */}
        {highestBid / ("1e" + 18)}{" "}
        <span style={{ fontSize: "50%" }}> BNB </span>
      </div>

      <div className={styless.content}>
        {/* <div
          className={styless.description}
          style={{ fontFamily: " ", fontWeight: "300", textAlign: "left" }}
        >
          Creator royalties on secondary sales: <span style={{fontWeight:'bold'}}>15 %</span>
        </div> */}
        {/* {getMarketItem() ? ( */}
        <Row justify="space-between" gutter={24}>
          <Col span={12}>
            <Button
              className={btnstyles.exploreBtn}
              loading={loading}
              onClick={() =>
                window.open(
                  `${getExplorer(chainId)}address/${
                    information?.token_address
                  }`,
                  "_blank"
                )
              }
              style={{ fontFamily: "  ", marginTop: "10px" }}
            >
              <span>Trx Info</span>
            </Button>
          </Col>

          <Col span={12}>
            {information?.auction === true ? (
              <>
                {" "}
                {information?.owner_of?.toLowerCase() === account ? (
                  <Button
                    className={btnstyles.endBtn}
                    loading={loading}
                    style={{ fontFamily: "  ", marginTop: "10px" }}
                    onClick={() => endAuction()}
                    disabled={ended}
                  >
                    <span>
                      {ended ? "This Auction Have Been Ended" : "End"}
                    </span>
                  </Button>
                ) : (
                  <>
                    <Button
                      className={btnstyles.exploreBtn}
                      loading={loading}
                      onClick={() => withdrawAuction()}
                      style={{ fontFamily: "  ", marginTop: "10px" }}
                    >
                      <span>Claim</span>
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Button
                  className={btnstyles.btnInfo}
                  loading={loading}
                  onClick={() => purchase()}
                  style={{ fontFamily: "  ", marginTop: "10px" }}
                >
                  Buy
                </Button>
              </>
            )}
          </Col>
          <Col span={24}>
            {information?.auction === true ? (
              <>
                {" "}
                {information?.owner_of?.toLowerCase() === account ? (
                  <></>
                ) : (
                  <>
                    {!moment
                      .unix(timeEnded)
                      .utc()
                      .isSameOrBefore(moment.utc()) && (
                      <Button
                        className={btnstyles.btnBit}
                        loading={loading}
                        onClick={() => openModal()}
                        style={{ marginTop: "10px" }}
                      >
                        Bid
                      </Button>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
              </>
            )}
          </Col>
          {/* <Col span={12}>
            <Button
              className={btnstyles.endBtn}
              loading={loading}
              onClick={() =>
                window.open(
                  `${getExplorer(chainId)}address/${
                    information?.token_address
                  }`,
                  "_blank"
                )
              }
              style={{ fontFamily: "  ", marginTop: "10px" }}
            >
              <span>End</span>
            </Button>
          </Col> */}
          {/* <Col span={12}>
            <Button
              className={btnstyles.exploreBtn}
              loading={loading}
              onClick={() =>
                window.open(
                  `${getExplorer(chainId)}address/${
                    information?.token_address
                  }`,
                  "_blank"
                )
              }
              style={{ fontFamily: "  ", marginTop: "10px" }}
            >
              <span>Withdraw</span>
            </Button>
          </Col> */}
        </Row>
        {/* ) : (
          <div
            className={styless.description}
            style={{
              fontFamily: " ",
              fontWeight: "300",
              textAlign: "left",
            }}
          >
            <Alert
              message="This NFT is currently not for sale"
              type="warning"
            />
          </div>
        )} */}

        {/* <div
          className={styless.description}
          style={{ fontFamily: " ", fontWeight: "300"}}
        >
          Doublecheck everything before you buy! <a href="#" style={{color :'blue'}}> How to spot fakes?</a> 
           Read our Terms and Conditions before you buy!
        </div> */}
      </div>
      <Modal
        title="Place a bid"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Input
          autoFocus
          placeholder="Amount"
          onChange={(e) => onChangePrice(e.target.value)}
          min={highestBid / ("1e" + 18)}
          type="number"
          step={0.05}
          defaultValue={highestBid / ("1e" + 18)}
        />
        <span className={styless.available}>
          Available: {highestBid / ("1e" + 18)} BNB
        </span>
        <div style={{ color: "red" }}>
          {!price && formValid.priceErr ? "Please input your price" : ""}
        </div>
        <div style={{ color: "red" }}>
          {price && formValid.priceFormatErr ? "Price must greater than 0" : ""}
        </div>
      </Modal>
    </div>
  );
};

export default ImageBox;
