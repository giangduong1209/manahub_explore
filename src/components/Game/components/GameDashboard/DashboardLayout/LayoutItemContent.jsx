import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "../../../styles.module.css";
import { Button } from "antd";

const LayoutItemContent = ({ item, type, image }) => {
  return (
    <div className={clsx([styles.layoutItem, styles[type]])}>
      <span className={styles.code}>{item.code}</span>
      <span className={styles.type}>{item.code}</span>
      <img src={image} alt="img" />

      <div className={styles.layoutItemRight}>
        <p className={styles.title}>{item.title}</p>
        <p className={styles.description}>{item.description}</p>

        {/* <div
          className={clsx("input-text")}
          style={{ marginBottom: 5, marginTop: "auto" }}
        >
          2
        </div> */}

        <Button className={styles.unStakingBtn} style={{ marginBottom: 5, marginTop: "auto" }} block>
          UnStaking
        </Button>
      </div>
    </div>
  );
};

LayoutItemContent.propTypes = {
  type: PropTypes.oneOf(["ssr", "sr", "r"]),
};

export default LayoutItemContent;
