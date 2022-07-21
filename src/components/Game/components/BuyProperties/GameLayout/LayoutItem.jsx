import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "../../../styles.module.css";

import { Button } from "antd";

const LayoutItem = ({
  item,
  type,
  image,
  handleAddToCart,
  handleRemoveFromCart,
  added,
}) => {
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
          {item.price}
        </div>

        <Button
          className={added ? styles.rmFromCartBtn : styles.addToCartBtn}
          onClick={() => handleAddToCart(item.code)}
          block
        >
          {added ? "Remove from cart" : "Add to cart"}
        </Button>

        <div className={styles.itemOwner}>
          <p>Owner</p>
          <p>{item?.owner?.name}</p>
        </div>
      </div>
    </div>
  );
};

LayoutItem.propTypes = {
  type: PropTypes.oneOf(["ssr", "sr", "r"]),
};

export default LayoutItem;
