import clsx from "clsx";
import React from "react";
import styles from "../styles.module.css";

const demo = [
  {
    name: 'Hung Vu',
    avatar: 'https://ipfs.moralis.io:2053/ipfs/QmUn5q6DYh9WzNym8DX6e5Rc75hoRFAhvfzNvCC4RUqG9w',
    amount: 200
  },
  {
    name: 'Hai Nguyen',
    avatar: 'https://ipfs.moralis.io:2053/ipfs/QmXzBtMuTXgw393xQS19Na8dCpL9C1ThKrpgpVsxWmzm57',
    amount: 101
  },
  {
    name: 'Man Nguyen',
    avatar: 'https://ipfs.moralis.io:2053/ipfs/QmecR6YN3zFgZM1Fa4TvKdK8rNapBJqTV2TmzjrdsxHLSu',
    amount: 50
  },
  {
    name: 'Hao Lieu',
    avatar: 'https://ipfs.moralis.io:2053/ipfs/QmVQHAdVotNSh9bB6478iSLkS2cc6wVH1RVHFo6Soq6YYj',
    amount: 10
  },
  {
    name: 'Khai Vu',
    avatar: 'https://ipfs.moralis.io:2053/ipfs/QmXzBtMuTXgw393xQS19Na8dCpL9C1ThKrpgpVsxWmzm57',
    amount: 5
  }
]

const GameLeaderboard = () => {
  return (
    <div className={styles.gameLBContainer}>
      {demo.map((e, i) => (
        <div className={styles.gameLBItem} key={i}>
          <div
            className={clsx(styles.gameLBItemIndex, {
              [styles.highlight]: i < 3,
            })}>
            {i + 1}
          </div>
          <img
            alt=""
            className={styles.gameLBItemImg}
            src={e.avatar}
          />
          <div className={styles.gameLBItemName}>
            {i === 0
              ? e.name.toUpperCase()
              : e.name}
          </div>
          <div className={styles.gameLBItemAmt}>{e.amount}</div>
        </div>
      ))}
    </div>
  );
};

export default GameLeaderboard;
