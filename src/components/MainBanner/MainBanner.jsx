import { Row, Col, Typography, Button, Grid } from "antd";
import { useHistory } from "react-router-dom";
import { CardBanner } from "./CardBanner";
import styles from "./styles.module.css";

const { useBreakpoint } = Grid;

const MainBanner = () => {
  const history = useHistory();
  const { sm, xs } = useBreakpoint();

  return (
    <div className={styles.mainBannerBg}>
      <Row className={styles.mainBannerWrapper} gutter={30}>
        <Col
          lg={12}
          className={styles.mainBannerLeft}
          style={{ marginBottom: sm || xs ? 30 : 0 }}
        >
          <Typography.Title level={1} strong>
            The first native multi-chain NFTs Marketplace
          </Typography.Title>
          <Typography.Text>
            Create, buy, sell and earn with NFTs
            <br /> Faster and cheaper fees under $1
            <br />
            Stake your NFTs and earn more
          </Typography.Text>
          <Button
            onClick={() => history.push("/explore")}
            size="large"
            className={styles.exploreBtn}
          >
            Explore
          </Button>
        </Col>
        <Col
          lg={12} className={styles.mainBannerRight}>
          <CardBanner />
        </Col>
      </Row>
    </div>
  );
};

export default MainBanner;
