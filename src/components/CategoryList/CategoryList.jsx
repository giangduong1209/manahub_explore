import { Col, Row, Typography } from "antd";
import { CategoryCard } from "./CategoryCard";
import Art from "assets/images/CategoryCard/Art.png";
import Collectibles from "assets/images/CategoryCard/Collectibles.png";
import Domain from "assets/images/CategoryCard/Domain.png";
import Music from "assets/images/CategoryCard/Music.png";
import Photography from "assets/images/CategoryCard/Photography.png";
import Sport from "assets/images/CategoryCard/Sport.png";
import Trading from "assets/images/CategoryCard/Trading.png";
import Utility from "assets/images/CategoryCard/Utility.png";
import Virtual from "assets/images/CategoryCard/Virtual.png";
import styles from "./styles.module.css";

const data = [
  { title: "Art", imgUrl: Art },
  {
    title: "Collectibles",
    imgUrl: Collectibles,
  },
  { title: "Domain Names", imgUrl: Domain },
  { title: "Music", imgUrl: Music },
  {
    title: "Photography",
    imgUrl: Photography,
  },
  { title: "Sport", imgUrl: Sport },
  { title: "Trading", imgUrl: Trading },
  { title: "Utility", imgUrl: Utility },
  { title: "Virtual Worlds", imgUrl: Virtual },
];

const CategoryList = () => {
  return (
    <div className={styles.categoryListWrapper}>
      <Typography.Title level={3}>
        Browse <Typography.Text>by Category</Typography.Text>
      </Typography.Title>
      <Row wrap justify="space-around" gutter={[16, 24]}>
        {data.map(({ title, imgUrl }) => (
          <Col key={title} md={12} lg={8}>
            <CategoryCard imgUrl={imgUrl} title={title} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategoryList;
