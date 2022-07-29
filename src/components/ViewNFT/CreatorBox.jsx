import { Row, Avatar, Col, Menu, notification } from "antd";
import React from "react";
import styless from "./ViewNFT.module.css";
import { HeartOutlined, HeartFilled, CopyOutlined } from "@ant-design/icons";
import btnstyles from "./ViewNFT2.module.css";
// import MysteryBoxGif from "assets/images/mystery-box.gif";
import ShareLink from "react-facebook-share-link";
import ShareLinkTwitter from "react-twitter-share-link";
import { BsShareFill, BsFacebook, BsTwitter } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useMoralisQuery, useMoralis } from "react-moralis";
import { getEllipsisTxt } from "helpers/formatters";
import { CopyToClipboard } from "react-copy-to-clipboard";
import HelmetMetaData from "../HelmetMetaData";

const ImageBox = ({ information }) => {
  // console.log(information)
  const [checkLike, setCheckLike] = useState(false);
  const { SubMenu } = Menu;
  const { Moralis, account, isAuthenticated, authenticate } = useMoralis();
  const [likeNum, setLikeNum] = useState(0);
  const queryMarketItems = useMoralisQuery("MarketItemCreateds");
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
  const queryProfile = useMoralisQuery("profile");
  const fetchProfile = JSON.parse(
    JSON.stringify(queryProfile.data, [
      "address",
      "email",
      "name",
      "phone",
      "background",
      "avatar",
      "bio",
    ])
  );
  const favorite = Moralis.Object.extend("favorite");

  const getAllFavorite = async () => {
    const query = new Moralis.Query("favorite");
    return await query.find();
  };

  useEffect(() => {
    showLike(information);
    // showWatching(information);
    countLike(information);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const showLike = (item) => {
    getLike().then((res) => {
      const check = res.find(
        (e) =>
          e.attributes.tokenId === item?.token_id &&
          e.attributes.tokenAddress === item?.token_address
      );
      if (check) {
        setCheckLike(true);
      } else {
        setCheckLike(false);
      }
    });
  };

  const getLike = async () => {
    const query = new Moralis.Query("favorite");
    const result = await query.find();
    const data = result.filter(
      (item) => item.attributes.userAddress === account
    );
    return data;
  };

  const countLike = (item) => {
    // console.log(item);
    getAllFavorite().then((res) => {
      const data = res.filter(
        (ele) =>
          ele.attributes.tokenAddress === item?.token_address &&
          ele.attributes.tokenId === item?.token_id
      );
      // console.log(data)
      setLikeNum(data.length);
    });
  };

  const pressLike = () => {
    if (isAuthenticated) {
      like(information);
    } else {
      authenticate({
        onSuccess: () => {
          like(information);
        },
        onError: () => {
          openNotification();
        },
      });
    }
  };

  const openNotification = (placement) => {
    const args = {
      message: "You haven't sign in yet",
      placement: "bottomRight",
    };
    notification.error(args);
  };

  const openNotificationCopy = (placement) => {
    const args = {
      message: "Link Copied !",
      placement: "bottomRight",
    };
    notification.success(args);
  };

  const like = async (item) => {
    const result = await getLike();
    const check = result.find(
      (e) =>
        e.attributes.tokenId === item.token_id &&
        e.attributes.tokenAddress === item.token_address
    );

    const saveData = new favorite();
    if (check) {
      setCheckLike(false);
      check.destroy().then(() => {
        console.log("Deleted");
        // showLike(true);
      });
    } else {
      setCheckLike(true);
      saveData.set("userAddress", account);
      saveData.set("tokenAddress", item.token_address);
      saveData.set("tokenId", item.token_id);

      saveData.save();
    }
  };

  const getMarketItem = () => {
    const result = fetchMarketItems?.find(
      (e) =>
        e.nftContract === information?.token_address &&
        e.tokenId === information?.token_id
    );

    return result;
  };

  const getProfile = () => {
    const result =
      fetchProfile.find(
        (element) => element.address === getMarketItem()?.seller
      ) || null;
    // console.log(result)
    return result;
  };
  console.log({ information });

  return (
    <div className={styless.cardcreatorbox}>
      <HelmetMetaData
        title={information?.name}
        description={information?.name}
        image={information?.image}
        url={`https://ecosystem.metapolis.gg/view-nft/${information?.token_address}/${information?.token_id}`}
      />
      {/* Fake to test */}
      {/* <HelmetMetaData
        title="Dauntless Alpie 977"
        description="NFT Dauntless Alpie 977"
        image="https://ipfs.moralis.io:2053/ipfs/QmXWT47iEK8y2PZNEFXN7rhezUNfsV449Y2TMR2XdkZAL9"
        url="https://marketplace.metamints.app/view-nft/0x3d4f238adf678988824831382df24a73af992664/57"
      /> */}
      <div className={styless.content}>
        <div className={styless.viewArea} >
          <Row>
            <Col span={20}></Col>
            {/* <div className={styless.view}>
              <EyeOutlined />
              {8}
            </div> */}
            <div
              className={styless.view}
              style={{ color: "red" }}
              onClick={() => pressLike()}
            >
              {checkLike ? (
                <HeartFilled style={{ color: "red", fontSize: "20px" }} />
              ) : (
                <HeartOutlined style={{ fontSize: "20px" }} />
              )}
              <span style={{fontSize: "20px" }}>
                &ensp; {likeNum || 0}
              </span>
            </div>
          </Row>
        </div>
        <div
          style={{
            fontWeight: "bold",
            textAlign: "left",
            
            fontSize: "20px",
          }}
        >
          &ensp;Creator
        </div>
        <div className={styless.wrapperAvatar} style={{marginTop:'-20px'}}>
          <Row>
            <Col span={4}>
              <Avatar
                src={getProfile()?.avatar}
                className={styless.avatar}
                size={60}
              />
            </Col>
            <Col span={20}>
              <div
                className={styless.inforAvatar}
                style={{ marginTop: "30px",marginLeft:'-30px'}}
              >
                {" "}
                <span style={{ fontWeight: "bold" }}>{getProfile()?.name}</span>
                <br />
                <span>{getEllipsisTxt(getMarketItem()?.seller, 4)}</span>
              </div>
            </Col>
          </Row>
        </div>
        <br/>
        <div
          className={styless.accountName}
          style={{
            // borderTop: "solid 1px gray",
            borderBottom: "solid 1px gray",
            marginBottom: "5px",
   
          }}
        >
          {information?.metadata?.name}
        </div>
        <div className={styless.accountTag} >
          <Row>
            <div className={styless.tag}>Collectible</div>
            <div className={styless.tag}>Painting</div>
            <div className={styless.tag}>Print</div>
            <div className={styless.tag}>Image</div>
          </Row>
        </div>
        <div
          className={styless.description}
          style={{
         
            fontWeight: "300",
            textAlign: "left",
            marginTop: "5px",
            borderTop: "solid 1px gray",
            borderBottom: "solid 1px gray",
          }}
        >
          <div style={{ fontWeight: "bold" }}>Collection</div>
          <Row>
            <Col span={4}>
              <Avatar
                src={'https://ipfs.moralis.io:2053/ipfs/QmYadFxBzqoDivZ56dxb6DrPNhVwSEkuwcRpKjo15xFUCf'}
                className={styless.avatarCollection}
                size={60}
              />
            </Col>
            <Col span={20}>
              <div className={styless.infoBottom} style={{marginLeft:'-30px' }}>
                <div className={styless.titleCollection}>
                  {/* {information?.name} */}
                  Manahubs
                </div>
                Manahubs Marketplace{" "}
              </div>
            </Col>
          </Row>
        </div>
        <div className={styless.description} >
          {" "}
        </div>
        <Row>
          <Col span={4}>
            <div
              className={btnstyles.shareBtn}
              style={{ borderRadius: "10px", borderColor: "#FEA013" }}
            >
              <Menu
                mode="horizontal"
                inlineCollapsed="true"
                className={styless.shareButtonItem}
                style={{
                  background: "none",
                  width: "auto",
                  height: "40px",
                  marginTop: "-5px",
                  color: "black",
                }}
              >
                <SubMenu
                  key="sub2"
                  title="Share"
                  icon={
                    <BsShareFill
                    // style={{
                    //   marginTop: "15px",
                    //   marginLeft: "-12px",
                    //   fontSize: "18px",
                    // }}
                    />
                  }
                  style={{ width: "30px" }}
                >
                  <Menu.Item
                    key="1"
                    // style={{ fontSize: "15px", textAlign: "center" }}
                  >
                    <CopyToClipboard
                      onCopy={openNotificationCopy}
                      text={`https://ecosystem.metapolis.gg/view-nft/${information?.token_address}/${information?.token_id}`}
                    >
                      <span>
                        {" "}
                        <CopyOutlined />
                        &ensp;Copy Link
                      </span>
                    </CopyToClipboard>
                  </Menu.Item>
                  <Menu.Item
                    key="2"
                    // style={{ fontSize: "15px", textAlign: "center" }}
                  >
                    <ShareLink
                      link={`https://ecosystem.metapolis.gg/view-nft/${information?.token_address}/${information?.token_id}`}
                    >
                      {(link) => (
                        <a href={link} target="blank">
                          {" "}
                          <BsFacebook />
                          &ensp;Share on Facebook
                        </a>
                      )}
                    </ShareLink>
                    {/* <FacebookShareButton
                      title={"testing"}
                      url={
                        "https://console.firebase.google.com/project/fb-20-8a602/firestore/data/~2Fposts~2F3t0jZF1CDnAvbsFS2O1Q&imgurl=https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=959514238108782&height=50&width=50&ext=1639482313&hash=AeQW9JjFvK4otTde01E"
                      }
                      quote={
                        "testing to share the content to social media using react js and react share package"
                      }
                      hashtag={"#reactJs"}
                      description={"aiueo"}
                      className="Demo__some-network__share-button"
                    >
                      <BsFacebook size={32} round />
                    </FacebookShareButton> */}
                  </Menu.Item>
                  <Menu.Item
                    key="3"
                    //style={{ fontSize: "15px", textAlign: "center" }}
                  >
                    <ShareLinkTwitter
                      link={`https://ecosystem.metapolis.gg/view-nft/${information?.token_address}/${information?.token_id}`}
                    >
                      {(link) => (
                        <a href={link} target="blank">
                          {" "}
                          <BsTwitter />
                          &ensp;Share on Twitter
                        </a>
                      )}
                    </ShareLinkTwitter>
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </div>
          </Col>
          {/* <Col span={4} offset={3}>
            <Button
              className={btnstyles.viewBtn}
              // onClick={() => getRandomReward()}
              style={{ fontFamily: "GILROY " }}
            >
              View on MetaMints
            </Button>
          </Col> */}
        </Row>
      </div>
    </div>
  );
};

export default ImageBox;
