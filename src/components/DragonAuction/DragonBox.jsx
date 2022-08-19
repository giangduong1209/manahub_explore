// import { Row, Col } from "antd";
import CollectionBanner from "./CollectionBanner";
import CardBox from "./Cardbox";
// import CollectionCard from "./CollectionCard";
// import Dragon1988 from './nftLs'
import styless from "./Dragon.module.css";

const MysteryBox = () => {
  // console.log(Dragon1988);
  return (
    <>
      <CollectionBanner />
      <CardBox />
      <div
        style={{ display: "flex", position: "relative"}}
      >
        <div className={styless.wrapper}>
          <div className={styless.wrapperInner}>
            {/* <Row gutter={[10, 16]}>
              {Array.from(Array(18).keys()).map((index) => (
                <Col
                  span={24}
                  sm={{ span: 12 }}
                  xl={{ span: 6 }}
                  key={index}
                >
                  <CollectionCard
                    key={index}
                    item={{
                      ...index,
                      name: index
                    }}
                  />
                </Col>
              ))}
            </Row> */}
          </div>
        </div>
      </div>

      <br />
    </>
  );
};

export default MysteryBox;
