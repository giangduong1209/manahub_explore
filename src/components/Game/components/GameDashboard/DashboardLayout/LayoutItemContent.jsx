import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "../../../styles.module.css";
import { Button } from "antd";
import { useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import Constants from "constant";
import { checkWalletConnection } from "helpers/auth";

const LayoutItemContent = ({ item, type, image }) => {
  const { Moralis, authenticate, account, isAuthenticated } = useMoralis();
  const serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;
  const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
  Moralis.initialize(appId);
  Moralis.serverURL = serverURL;
  const addrCollection = Constants.contracts.NFT_COLLECTION_ADDRESS;

  const addrStaking = Constants.contracts.STAKING_ADDRESS;
  const abiStaking = JSON.parse(Constants.contracts.STAKING_ABI);
  const [isLoading, setIsLoading] = useState(false);

  const contractProcessor = useWeb3ExecuteFunction();
    const saveUnStakingInfo = async () =>{
    console.log("Save unstaking nft on DB") 
    const Staking = Moralis.Object.extend("Staking");
    const query = new Moralis.Query(Staking);
    query.equalTo("tokenId", item.tokenId);
    query.equalTo("staker", account);
    query.equalTo("addressNFT", addrCollection);
    query.equalTo("addressStaking", addrStaking);
    const obj = await query.first();
    if (obj) {
      obj.set("unstake", true);
      await obj.save();
      setIsLoading(false);
      window.location.reload();
    }
    setIsLoading(false)
  }
  const unstake = async () => {
      console.log("Unstaking nft on blockchain")
      const ops = {
        contractAddress: addrStaking,
        functionName: "unStake",
        abi: abiStaking,
        params: {
          _tokenIds: [item.tokenId]
        },
      };
      await contractProcessor.fetch({
        params: ops,
        onSuccess: async () => {
          console.log("Unstake success");
          await saveUnStakingInfo();
        },
        onError: (error) => {
          setIsLoading(false)
          console.log("Unstake failed");
          return new Promise((resolve, reject) => reject(error));
        },
      });
    }
  async function handleUnStakeClicked() {
    setIsLoading(true);
    await checkWalletConnection(isAuthenticated, authenticate, unstake)
  }
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

        <Button className={styles.unStakingBtn}
          onClick={() => handleUnStakeClicked()}
          disabled={isLoading}
          style={{ marginBottom: 5, marginTop: "auto" }} block>
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
