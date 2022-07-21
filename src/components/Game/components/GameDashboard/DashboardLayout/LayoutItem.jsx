import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "../../../styles.module.css";
import { Button } from "antd";

const LayoutItem = ({ item, type, image }) => {
  return (
    <div className={clsx([styles.layoutItem, styles[type]])}>
      <span className={styles.code}>{item.code}</span>
      <span className={styles.type}>{item.code}</span>
      <img alt="" src={image} />

      <div className={styles.layoutItemRight}>
        <p className={styles.title}>{item.title}</p>
        <p className={styles.description}>{item.description}</p>
        <div
          className={clsx("input-text")}
          style={{ marginBottom: 5, marginTop: "auto" }}
        >
          10
        </div>

        <Button
          style={{ marginBottom: 5 }}
          className={styles.startStackingBtn}
          block
        >
          Start Stacking
        </Button>

        <Button className={styles.sellOnMpBtn} block>
          Sell on Marketplace
        </Button>
      </div>
    </div>
  );
};

LayoutItem.propTypes = {
  type: PropTypes.oneOf(["ssr", "sr", "r"]),
};

export default LayoutItem;
