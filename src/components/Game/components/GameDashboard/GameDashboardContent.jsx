import clsx from "clsx";
import React from "react";
import styles from "../../styles.module.css";
import { Button } from "antd";

import LayoutItemContent from "./DashboardLayout/LayoutItemContent";
import DashboardLayoutHeader from "./DashboardLayout/DashboardLayoutHeader";
import { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import abiStaking from "./abi_staking";
import Web3 from "web3";
let isRunning = false;

const GameDashboardContent = ({ setShow, show }) => {
  const [isDisable, setIsDisable] = useState(false);
  const { Moralis, account } = useMoralis();
  Moralis.start({ serverUrl: "https://bzyt487madhw.usemoralis.com:2053/server", appId: "ODKsAGfZTKjTaG2Xv2Kph0ui303CX3bRtIwxQ6pj" });
  const web3Js = new Web3(Web3.givenProvider || 'https://data-seed-prebsc-1-s1.binance.org:8545/');
  const [total, setTotal] = useState(0);
  const [NFTs, setNFTs] = useState([]);
  const addr = "0x70cbc0e9eb87035ad2fbb5eba433b9496195e991";
  const addrStaking = "0xE2C7f1bE4d452d82b78989cBf60108c1E0f768bF";
  const contractProcessor = useWeb3ExecuteFunction();
  const smStaking = new web3Js.eth.Contract(abiStaking, addrStaking);

  const claim = async () => {
    setIsDisable(true);
    console.log('claim');
    const ops = {
      contractAddress: addrStaking,
      functionName: "claimRewards",
      abi: abiStaking,
      params: {
      },
    };
    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        setTotal(0);
      }
    });
  }
  let arr = [];
  const getNFTs = async () => {
    const Staking = Moralis.Object.extend("Staking");
    const query = new Moralis.Query(Staking);
    query.equalTo("staker", account);
    query.equalTo("addressNFT", addr);
    query.equalTo("addressStaking", addrStaking);
    query.equalTo("unstake", false);
    const arrObj = await query.find();
    setNFTs(arrObj);
  };

  const getTotal = async () => {
    const res = await smStaking.methods.userStakeInfo(account).call();
    // console.log(res);
    setTotal(res._availableRewards / 10 ** 18)
  }
  // console.log(NFTs);
  useEffect(() => {
    if (account) {
      getTotal();
      getNFTs();
    }
  });



  // console.log(prop);
  return (
    <div className={clsx(styles.gameDashboard)}>
      <DashboardLayoutHeader
        setShow={setShow}
        show={show}
        extraCn={styles.gameDashboardHeaderMobile}
      />

      <div className={clsx(styles.gameDashboardTitle)}>Staking</div>

      <div className={clsx(styles.gameDashboardContent)}>
        {
          NFTs.map((e) => (
            <LayoutItemContent
              item={{
                title: e.attributes.name,
                description: e.attributes.description,
                code: "#" + e.attributes.tokenId,
                tokenId: e.attributes.tokenId
              }}
              type={e.attributes.type}
              image={e.attributes.image}
            />
          ))
        }
      </div>

      <div className={clsx(styles.gameDashboardFooter,{
        [styles.show]: show,
      })}>
        <div>
          <p className={styles.gameDashboardFooterTitle}>Total Collectibles</p>
          <div className={clsx("input-text", styles.inputCollectible)}>
            {total.toFixed(16)}
          </div>
        </div>

        <div>
          <p className={styles.gameDashboardFooterTitle}>Daily NFTs Staking</p>
          <Button block disabled={isDisable} onClick={() => claim()}>Claim</Button>
        </div>
      </div>
    </div>
  );
};

export default GameDashboardContent;
