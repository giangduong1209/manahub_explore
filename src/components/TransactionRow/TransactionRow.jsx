import { Card, Avatar } from "antd";
import styles from "./styles.module.css";

const TransactionRow = ({ imgUrl, text }) => {
  return (
    <Card.Meta className={styles.transactionRow}
      avatar={
        <Avatar
          shape="square"
          src={imgUrl || "https://picsum.photos/200/300"}
          className={styles.avatar}
        />
      }
      title="Name"
      description={
        <p>
          by <span style={{ color: "#F27352", fontWeight: 700 }}>{text}</span>
        </p>
      }
    />
  );
};

export default TransactionRow;
