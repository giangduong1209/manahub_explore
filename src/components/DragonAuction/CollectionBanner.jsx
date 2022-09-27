import { Avatar, Col, Row, Space, Menu, notification } from "antd";
import React from "react";
import styless from "./Collections.module.css";
import FloorPriceIcon from "../Collections/FloorPriceIcon";
import { MoreOutlined, ReloadOutlined, CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  BsShareFill,
  BsArrowUpRightSquare,
  BsFacebook,
  BsTwitter,
} from "react-icons/bs";
import Constants from "constant";
import ShareLink from "react-facebook-share-link";
import ShareLinkTwitter from "react-twitter-share-link";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { getCollectionByIndex } from "helpers/collection";
import { useParams } from "react-router";
import{useState, useEffect} from "react";
let totalVol = 0;
let isGetingVol = true;

const CollectionBanner = () => {
  const {index} = useParams();
  const { Moralis, chainId } = useMoralis();
  const [collection, setCollection] = useState({});
  const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;
  const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
  Moralis.start({ serverUrl, appId });

  const manahubAddr = Constants.contracts.NFT_COLLECTION_ADDRESS;
  const Web3Api = useMoralisWeb3Api();

  const { SubMenu } = Menu;
  useEffect(() => {
    const NFTCollections =  getCollectionByIndex( index, chainId );
    console.log(chainId,index);
    setCollection(NFTCollections);
    console.log(collection);

  }, [chainId, index])
  
  const openNotification = (placement) => {
    const args = {
      message: "Link Copied !",
      placement: "bottomRight",
    };
    notification.success(args);
  };
  // if (isGetingVol) {
  //   isGetingVol = false;
  //   getVolumeTrade();
  // }

  // async function getVolumeTrade() {

  //   const options = {
  //     address: manahubAddr,
  //     chain: "bsc",
  //   };


  //   const nftTransfers = await Web3Api.token.getContractNFTTransfers(options);

  //   let arrNftTransfers = nftTransfers.result;
  //   let countTransfers = 0;

  //   arrNftTransfers.forEach((tx) => {
  //     if (parseInt(tx.value) > 10 ** 18) {
  //       countTransfers++;
  //       totalVol = 2 * countTransfers;
  //       document.getElementById("volumTrade").innerHTML = totalVol + " BNB";
  //     }
  //   })
  // }
  return (
    <div>
      <div
        className={styless.bg}
      // style={{ backgroundClip: `url(${DragonClip})` }}
      >
        <div className = {styless.bannerWrapper}>
          <img className={styless.bannerImg} src={collection?.banner}  />
        </div>
        {/* <video muted autoPlay loop width='100%'> <source src={'https://ipfs.moralis.io:2053/ipfs/QmNXHTD2oWKC8m4AusReS1J48QEVFFPMucu9pZ9Jm8Co29'} type="video/mp4"></source></video> */}
        <Avatar src={collection?.image} className={styless.avatar} size={160} />
      </div>
      <div className={styless.endRow}>
        <div className={styless.socialIconsContainer}>
          <div className={styless.socialIconsWrapper}>
            <div className={styless.socialIconsContent}>
              <Row>
                <div className={styless.socialIcon}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a href="#">
                    <ReloadOutlined
                      style={{
                        marginTop: "7px",
                        marginLeft: "7px",
                        fontSize: "25px",
                      }}
                    />
                  </a>
                </div>

                <div className={styless.divider} />
                <div className={styless.socialIcon}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a href={"#"}>
                    <BsArrowUpRightSquare
                      style={{
                        marginTop: "7px",
                        marginLeft: "7px",
                        fontSize: "25px",
                      }}
                    />
                  </a>
                </div>

                <div className={styless.divider} />
                <div className={styless.socialIcon}>
                  <Menu
                    mode="horizontal"
                    inlineCollapsed="true"
                    style={{
                      background: "none",
                      width: "40px",
                      height: "40px",
                      color: "black",
                    }}
                  >
                    <SubMenu
                      key="sub2"
                      icon={
                        <BsShareFill
                          style={{
                            marginTop: "7px",
                            marginLeft: "-15px",
                            fontSize: "25px",
                          }}
                        />
                      }
                      style={{ width: "30px" }}
                    >
                      <Menu.Item
                        key="1"
                      // style={{ fontSize: "15px", textAlign: "center" }}
                      >
                        <CopyToClipboard
                          onCopy={openNotification}
                          text={"https://marketplace.metamints.app/dragon-auction"}
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
                        <ShareLink link="https://marketplace.metamints.app/dragon-auction">
                          {(link) => (
                            <a href={link}>
                              {" "}
                              <BsFacebook />
                              &ensp;Share on Facebook
                            </a>
                          )}
                        </ShareLink>
                      </Menu.Item>
                      <Menu.Item
                        key="3"
                      //style={{ fontSize: "15px", textAlign: "center" }}
                      >
                        <ShareLinkTwitter link="https://marketplace.metamints.app/dragon-auction">
                          {(link) => (
                            <a href={link}>
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
                <div className={styless.divider} />
                <div className={styless.socialIcon}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a href={"#"}>
                    <MoreOutlined
                      style={{
                        marginTop: "7px",
                        marginLeft: "7px",
                        fontSize: "25px",
                      }}
                    />
                  </a>
                </div>
              </Row>
            </div>
          </div>
        </div>
      </div>
      <div className={styless.bannerContent} style={{ fontFamily: "GILROY " }}>
        <div className={styless.bannerTitle}>{collection?.name}</div>

        <div className={styless.createdBy}>
          Created by <span>{collection?.createdBy}</span>
        </div>
        <div className={styless.statics}>
          <Row gutter={{ xs: 12, sm: 32, xl: 64 }}>
            <Col>
              <Space direction="vertical" size={0}>
                <span
                  className={styless.number}
                  style={{ fontFamily: "GILROY " }}
                >
                  {collection?.statistics?.totalItems}
                </span>
                <span
                  className={styless.attr}
                  style={{ fontFamily: "GILROY " }}
                >
                  Items
                </span>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" size={0}>
                <span
                  id="owners"
                  className={styless.number}
                  style={{ fontFamily: "GILROY " }}
                >
                  {collection?.statistics?.totalOwners}
                </span>
                <span
                  className={styless.attr}
                  style={{ fontFamily: "GILROY " }}
                >
                  Owner
                </span>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" size={0}>
                <span
                  className={styless.number}
                  style={{ fontFamily: "GILROY " }}
                >
                  <Space>
                    <FloorPriceIcon className={styless.icon} />
                    {collection?.statistics?.floorPrice}
                  </Space>
                </span>
                <span
                  className={styless.attr}
                  style={{ fontFamily: "GILROY " }}
                >
                  Floor Price
                </span>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" size={0}>
                <span
                  id="volumTrade"
                  className={styless.number}
                  style={{ fontFamily: "GILROY " }}
                >
                  {collection?.statistics?.totalVolume} BNB
                </span>
                <span
                  className={styless.attr}
                  style={{ fontFamily: "GILROY " }}
                >
                  Volume Traded
                </span>
              </Space>
            </Col>
          </Row>
        </div>
        <div className={styless.desc} style={{ fontFamily: "GILROY " }}>{collection?.description}</div>
      </div>
    </div>
  );
};

export default CollectionBanner;
