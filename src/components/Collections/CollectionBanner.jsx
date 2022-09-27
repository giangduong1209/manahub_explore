import {Col, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './nft.css';
import styless from './Collections.module.css';
import { useMoralis } from 'react-moralis';
import { getCollectionsByChain } from 'helpers/collection';
import exploreData from '../../data/nfts/explore.json';
import headerData from './header.json';
import {
  FireIcon,
  GemIcon,
  BaseketBallIcon,
  FemaleIcon,
  PlaystationIcon,
} from 'components/Icons';
import clsx from 'clsx';

const icons = {
  fire: <FireIcon />,
  gem: <GemIcon />,
  ball: <BaseketBallIcon />,
  female: <FemaleIcon />,
  playstation: <PlaystationIcon />,
};

const CollectionBanner = ({ address }) => {
  const [explores, setExplores] = React.useState(exploreData);
  const [currentExplore, setCurrentExplore] = useState(1);
  const history = useHistory();
  const { chainId } = useMoralis();
  console.log(chainId)
  const [collections, setCollections] = useState([]);
  
  function linkMintNFT(index) {
    if(index === 1){
      history.push('/mint/'+index);
    }
  }
  useEffect(() => {
    const NFTCollections = getCollectionsByChain("0x38");
    setCollections(NFTCollections);
  }, [chainId])
  return (
    <div>
      <div>
        <div className="" style={{ display: 'flex', height: '250px' }}>
          <div className="slide-vertical st1 mr-20">
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st2">
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st3 ml-20">
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st1 mr-20">
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st2">
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st3 ml-20">
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className={styless.bannerContentWrapper}>
          <div className={styless.sectionHeader}>
            <span className={styless.sectionTitle}>
              <FireIcon /> Hot Collections
            </span>
          </div>
          <Row gutter={[16, 16]} className={styless.cardWrapper}>
            {collections && collections.map((item, index) => (
              <Col span={24} md={{ span: 8 }} key = {index}>
                <div className={styless.cardItem}>
                  <Row gutter={[8, 8]}>
                    <Col span={12} className={styless.topImg}>
                      <img src={item.imageCollections.img_0} alt="" />
                    </Col>
                    <Col span={12} className={styless.topImg}>
                      <img src={item.imageCollections.img_1} alt="" />
                    </Col>
                    <Col span={24} className={styless.midImg}>
                      <img src={item.imageCollections.img_2} alt="" />
                    </Col>
                  </Row>
                  <div>
                    <div className={styless.cardItemAvatar}>
                      <img src={item.image} alt="" />
                    </div>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Space direction="vertical" align="start" size={0}>
                          <span className={styless.cardCollectionName}>
                            {item.name}
                          </span>
                          <span className={styless.cardCreateBy}>
                            Created by : <b>{item.createdBy}</b>
                          </span>
                        </Space>
                      </Col>
                      <Col>
                        <span className={styless.itemSeeMore} onClick = {()=>linkMintNFT(item.index)}>See more</span>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>

            ))}
          </Row>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col>
              <h1
                style={{
                  color: '#FEA013',
                  fontSize: '32px',
                }}
              >
                Explore NFTs
              </h1>
            </Col>
            <Col>
              <Row gutter={[10, 10]}>
                {explores.tabs.map((tab) => (
                  <Col>
                    <div
                      className={clsx(styless.itemExplore, {
                        [styless.currentActive]: tab.id === currentExplore,
                      })}
                      key={tab.id}
                      onClick={() => {
                        setCurrentExplore(tab.id);
                      }}
                    >
                      <Space>
                        {icons[tab.icon]}
                        {tab.title}
                      </Space>
                    </div>
                  </Col>
                ))}
              </Row>
              {/* <div className="tab-links">
                <ul
                  className="rest flex"
                  style={{ display: 'inline-flex', margin: 0, padding: 0 }}
                >
                  {explores.tabs.map((tab, i) => (
                    <li
                      className={`item-link ${i === 0 ? 'current' : ''}`}
                      data-tab={`tab-${tab.id}`}
                      //  onClick={() => openTab(tab.id)}
                      key={i}
                    >
                      <span className="explore-link">
                        <Space>
                          {icons[tab.icon]}
                          {tab.title}
                        </Space>
                      </span>
                    </li>
                  ))}
                </ul>
              </div> */}
            </Col>
          </Row>
        </div>
        <div className={styless.bannerContent}>
          {/* <div className={styless.bannerTitle}>{info?.name}</div> */}
          {/* <div className={styless.createdBy}>
          Created by <span>MetaMints</span>
        </div> */}
          <div className={styless.statics}>
            {/* <Row gutter={{ xs: 12, sm: 32, xl: 64 }}>
            <Col>
              <Space direction="vertical" size={0}>
                <span className={styless.number}>300</span>
                <span className={styless.attr}>Items</span>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" size={0}>
                <span className={styless.number}>1</span>
                <span className={styless.attr}>Owners</span>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" size={0}>
                <span className={styless.number}>
                  <Space>
                    <FloorPriceIcon className={styless.icon} />
                    300
                  </Space>
                </span>
                <span className={styless.attr}>Floor Price</span>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" size={0}>
                <span className={styless.number}>150.5K</span>
                <span className={styless.attr}>Volume Traded</span>
              </Space>
            </Col>
          </Row> */}
          </div>
          {/* <div className={styless.desc}>
          AI Robotic brings the next level of AI-infused companions to life
          seamlessly
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default CollectionBanner;
