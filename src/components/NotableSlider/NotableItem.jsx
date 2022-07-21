import { Avatar, Button, Card } from 'antd';
import AvatarImg from 'assets/images/Notable/Avatar.png';
import Notable from 'assets/images/Notable/Notable-1.png';
import styles from './styles.module.css';
import { useHistory } from "react-router-dom";

const { Meta } = Card;

export const NotableItem = ({ imgUrl, avatarUrl, title, name, addrs }) => {
  const history = useHistory();
  
  function goToCollections() {
    history.push(`/collection/${addrs}`);
  }
  return (
    <div
      className={styles.notableItem}
      style={{
        backgroundImage: `linear-gradient(black,
        transparent 20%,
        transparent 80%,
        black), url(${imgUrl || Notable})`,
      }}
    >
      <div className={styles.notableInfo}>
        <Meta
          avatar={<Avatar src={avatarUrl || AvatarImg} />}
          title={title}
          description={
            <p>
              by{' '}
              <span style={{ color: '#F27352', fontWeight: 700 }}>{name}</span>
            </p>
          }
        />
        {/* <Link to="/collection"> */}
          <Button
            onClick={() => goToCollections()}
            size="large"
            className={styles.exploreBtn}
          >
            See more
          </Button>
        {/* </Link> */}
      </div>
    </div>
  );
};
