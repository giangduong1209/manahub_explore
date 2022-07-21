import { Col, Pagination, Row } from "antd";
import { getCollectionsByChain } from "helpers/collection";
import React from "react";
import { useMoralis } from "react-moralis";
import { useHistory } from "react-router-dom";
import Cardbox from "./Cardbox";
import styless from "./Explores.module.css";

const Explores = () => {
  const { chainId } = useMoralis();
  const NFTCollections = getCollectionsByChain(chainId);
  const history = useHistory();

  console.log(chainId)
  function itemRender(current, type, originalElement) {
    if (type === "prev") {
      return null;
    }
    if (type === "next") {
      return null;
    }
    return originalElement;
  }
  function goToCollections(addrs) {
    history.push(`/collection/${addrs}`);
  }
  return (
    <div
      className={styless.wrapper}
      onScroll={(e) => console.log(e.target.scrollTop)}
    >
      <Row
        gutter={[10, 16]}
        justify={NFTCollections?.length < 3 ? "center" : "start"}
      >
        {NFTCollections &&
          NFTCollections.map((nft, index) => (
            // <Link to={`/collection/${nft.addrs}`}>
            <Col
              span={24}
              sm={{ span: 12 }}
              xl={{ span: 8 }}
              onClick={() => goToCollections(nft.addrs)}
              key={index}
            >
              <Cardbox
                item={{
                  ...nft,
                  name: nft.name,
                }}
              />
            </Col>
            // </Link>
          ))}
        <Col span={24}>
          <Row justify="center" style={{ marginTop: "24px" }}>
            <Pagination
              itemRender={itemRender}
              className={styless.pagination}
              defaultCurrent={1}
              total={50}
            />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Explores;
