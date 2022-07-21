import { Row, Col, Typography, Button, Grid } from 'antd';
import { AutoSlider } from './AutoSlider';
import styles from './styles.module.css';

const { useBreakpoint } = Grid;

const AutoSlide = () => {
  const { md, sm, xs } = useBreakpoint();

  return (
    <div className={styles.slide}>
      <div className={styles.autoSlideWrapper}>
        <Row gutter={64}>
          <Col sm={24} md={8} className={styles.leftAutoSlide}>
            <Typography.Title level={3}>
              Let’s earn by colleting and trading NFTs
            </Typography.Title>
            <Button
              // onClick={() => history.push("/explore")}
              size="large"
              className={styles.exploreBtn}
            >
              Explore
            </Button>
          </Col>
          <Col
            sm={24}
            md={16}
            style={{ marginTop: md || sm || xs ? 48 : 0 }}
            className={styles.rightAutoSlide}
          >
            <AutoSlider />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AutoSlide;
