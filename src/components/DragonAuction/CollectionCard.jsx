import { Divider, Row } from "antd";
import React, { useContext } from "react";
import styless from "./Collections.module.css";

import { DarkThemeContext } from "components/DarkMode";


const CollectionCard = ({ item }) => {
  // console.log(item)
  const { mainColor } = useContext(DarkThemeContext);

  return (
    <div
      className={styless.cardbox}
      style={{
        backgroundColor: mainColor.bgCard,
        color: mainColor.txt
      }}
      // onClick={() => nftInfo(item)}
    >
      <div
        className={styless.image}
        // style={{ backgroundImage: `url(https://ipfs.moralis.io:2053/ipfs/QmaiKJcgeWgY5XX6D41pcZti8NYuUMYKQrPbqbBNfBvLpH)` }}
      >
          <img alt="" src={`https://ipfs.moralis.io:2053/ipfs/QmWHSxn8ixJ6U7vKtDQwxfde8eyZ1wKSx89LuLcTCDqdMm/${item.name + 1}.jpeg`} className={styless.image} width="350" loading='lazy'/>
        {/* {
          mediaType.includes('video') ?
          <video className={styless.image} width="350" controls muted onClick={() => nftInfo(item)}> <source src={mediaSrc} type={mediaType}></source></video>
          :
          mediaType.includes('audio') ?
            <audio className={styless.image} width="350" controls muted onClick={() => nftInfo(item)}> <source src={mediaSrc} type={mediaType}></source></audio>
            :
            <img alt="" src={mediaSrc} type={mediaType} className={styless.image} width="350" onClick={() => nftInfo(item)} loading='lazy'/>
        } */}
      </div>
      <div className={styless.content}>
        <Row justify="space-between">
          <div className={styless.title} style={{ fontFamily: "GILROY " }}>
            Manahubs
          </div>
          {/* <div className={styless.icon} onClick={() => pressLike()}>
            {mainColor.isMode === "light" ? (
              <>
                {" "}
                {checkLike ? (
                  <HeartFilled style={{ color: "red", fontSize: '20px' }} />
                ) : (
                  <HeartOutlined style={{fontSize: '20px' }}/>
                )}
              </>
            ) : (
              <>
                {" "}
                {checkLike ? (
                  <HeartFilled style={{ color: "red", fontSize: '20px' }} />
                ) : (
                  <HeartTwoTone twoToneColor="#fff" style={{fontSize: '20px' }}/>
                )}
              </>
            )}
            <span style={{fontFamily: "GILROY", color: mainColor.txt, fontSize: '20px' }}>&ensp; {likeNum || 0}</span>
          </div> */}
        </Row>
        <Row justify="space-between">
          {/* <span className={styless.id} style={{ fontFamily: "GILROY " }}>
            1
          </span> */}
          {/* <span className={styless.price}>{item.token_id}</span> */}
          {/* <div className={styless.icon} onClick={() => like(item)}>
            {mainColor.isMode === "light" ? (
              <> {checkLike ? <HeartFilled /> : <HeartOutlined />}</>
            ) : (
              <> {checkLike ? <HeartTwoTone twoToneColor="#eb2f96" /> :  <HeartTwoTone twoToneColor="#fff" />}</>
            )}
          </div> */}
          {/* <div>
            {isWatching ? (
              ""
            ) : (
              <Button
                className={`${styless.button} ${styless.btnInfo}`}
                style={{ fontFamily: "GILROY " }}
              >
                {"Add To Watchlist"}{" "}
              </Button>
            )}
          </div> */}
        </Row>
        <Divider style={{ margin: "10px 0" }} />
        {/* <Row justify="space-between" gutter={16}>
          <Col span={12}>
            <Button
              className={`${styless.button} ${styless.btnInfo}`}
              style={{ fontFamily: "GILROY " }}
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
              style={{ fontFamily: "GILROY " }}
              onClick={() => handleBuyClick(item)}
            >
              Buy
            </Button>
          </Col>
        </Row> */}
      </div>
      {/* {getMarketItem(nftToBuy) ? (
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
                <div
                  style={{
                    width: "250px",
                    margin: "auto",
                    borderRadius: "10px",
                    marginBottom: "15px",
                  }}
                >
                  {
                    mediaType.includes('video') ?
                    <video className={styless.image} width="350" controls> <source src={mediaSrc} type={mediaType}></source></video>
                    :
                    mediaType.includes('audio') ?
                      <audio className={styless.image} width="350" controls> <source src={mediaSrc} type={mediaType}></source></audio>
                      :
                      <img alt="" src={mediaSrc} type={mediaType} className={styless.image} width="350" />
                  }
                </div>
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
          <div
            style={{
              width: "250px",
              margin: "auto",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          >
            {
              mediaType.includes('video') ?
              <video className={styless.image} width="350" controls> <source src={mediaSrc} type={'video/mp4'}></source></video>
              :
              mediaType.includes('audio') ?
                <audio className={styless.image} width="350" controls> <source src={mediaSrc} type={'audio/mp3'}></source></audio>
                :
                <img alt="" src={mediaSrc} type={'image'} className={styless.image} width="350" />
            }
          </div>
          <Alert message="This NFT is currently not for sale" type="warning" />
        </Modal>
      )} */}
    </div>
  );
};

export default CollectionCard;
