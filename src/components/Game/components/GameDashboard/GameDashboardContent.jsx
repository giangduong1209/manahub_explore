import clsx from "clsx";
import React from "react";
import styles from "../../styles.module.css";
import { Button } from "antd";

import LayoutItemContent from "./DashboardLayout/LayoutItemContent";
import DashboardLayoutHeader from "./DashboardLayout/DashboardLayoutHeader";
import { properties } from "helpers/properties-full";
import { useState } from "react";
import { useMoralis, useMoralisWeb3Api } from 'react-moralis';

const GameDashboardContent = ({ setShow, show }) => {
  const { Moralis, account } = useMoralis();
  Moralis.start({ serverUrl: "https://bzyt487madhw.usemoralis.com:2053/server", appId: "ODKsAGfZTKjTaG2Xv2Kph0ui303CX3bRtIwxQ6pj" });
  const Web3Api = useMoralisWeb3Api();

  const prop = properties.slice(10, 17);
  const [total, setTotal] = useState(0);
  const [totalMyNFTs, setTotalMyNFTs] = useState(0);
  const [NFTs, setNFTs] = useState([]);
  const addr = "0xfde910FbaA9A6fDD5d3F80cCD44a54763DE2d9d0";

  const claim = () => {
    // setTotal(Math.round(2 * 7))
    // let a = Math.imul
    // console.log(a)
  }
  let arr = [];
  const getNFTs = async () => {
    const options = {
      chain: "bsc",
      address: account,
    };
    const res = await Web3Api.account.getNFTs(options);

    // console.log(res.result);
    for (let index = 0; index < res.result.length; index++) {
      const element = res.result[index];
      // console.log(element);
      if (element.token_address.toLowerCase() === addr.toLowerCase()) {
        arr.push(element);
      }
    }
    // console.log(arr);
    if (arr.length > 0) {
      setTotalMyNFTs(NFTs.length);
      setNFTs(arr);
    }
  };
  // console.log(NFTs);
  if (NFTs.length === 0) {
    getNFTs();
  }
  // console.log(prop);
  return (
    <div className={clsx(styles.gameDashboard)}>
      <DashboardLayoutHeader
        data={account}
        setShow={setShow}
        show={show}
        extraCn={styles.gameDashboardHeaderMobile}
      />

      <div className={clsx(styles.gameDashboardTitle)}>Stacking</div>

      <div className={clsx(styles.gameDashboardContent)}>
        {
          NFTs.map((e) => (
            <LayoutItemContent
              item={{
                title: e.name,
                description: JSON.parse(e.metadata).description,
                code: "#" + e.token_id,
                price: e.price,
                owner: {
                  name: e.owner,
                },
              }}
              type="sr"
              image={JSON.parse(e.metadata).image}
            />
          ))
        }
      </div>

      <div className={clsx(styles.gameDashboardFooter)}>
        <div>
          <p className={styles.gameDashboardFooterTitle}>Total Collectibles</p>
          <div className={clsx("input-text", styles.inputCollectible)}>
            {total}
          </div>
        </div>

        <div>
          <p className={styles.gameDashboardFooterTitle}>Daily NFTs Stacking</p>
          <Button block disabled={total > 0} onClick={() => claim()}>Claim</Button>
        </div>
      </div>
    </div>
  );
};

export default GameDashboardContent;
