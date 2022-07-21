import { Card } from 'antd';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

const { Meta } = Card;

export const CategoryCard = ({ imgUrl, title }) => {
  return (
    <Link to="/explore">
      <Card
        className={styles.cardbox}
        hoverable
        style={{ width: '100%' }}
        cover={
          <img alt="" src={imgUrl} style={{ width: '100%', height: 140 }} />
        }
      >
        <Meta title={title} />
      </Card>
    </Link>
  );
};
