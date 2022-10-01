import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "../../../styles.module.css";
import { Button, Statistic } from "antd";
import { useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import Constants from "constant";
import { checkWalletConnection } from "helpers/auth";
import { failureModal } from "helpers/modals";

const LayoutItemContent = ({ item, type, image }) => {
  const { Countdown } = Statistic;
  const stakeTime = new Date(item.stakeTime);
  const stakingTimeDuration = Constants.staking.duration;
  const deadline = moment(stakeTime).add(stakingTimeDuration.VALUE,stakingTimeDuration.UNIT).toDate() // Hong Kong timezone
	let flag = false
	if(Date.now() >= deadline) {
		flag = true
	}
  const [isHitToDeadline, setIsHitToDeadline] = useState(flag);
  const [format, setFormat] = useState(
      "D [days] H [hours] m [minutes]"
  );
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
    else{
      failureModal("Unstaking failed", "Cannot find this staking info");
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
          failureModal("Unstake failed", error.message);
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
  function handleChangeTimeCountDown(time) {
      if (time <= 60 * 60 * 24 * 1000) {
          setFormat("H [hours] m [minutes] s [seconds]");
      }
  }
  return (
    <div className={clsx([styles.layoutItem, styles[type]])}>
      <img src={image} alt="img" />

      <div className={styles.layoutItemRight}>
        <div>
        {item.title && <p className={styles.title}>{item.title}</p>}
        <p className={styles.description}>{item.description}</p>
        </div>

        {/* <div
          className={clsx("input-text")}
          style={{ marginBottom: 5, marginTop: "auto" }}
        >
          2
        </div> */}
        {
          isHitToDeadline ? (
            <Button className={styles.unStakingBtn}
              onClick={() => handleUnStakeClicked()}
              loading={isLoading}
              style={{ marginBottom: 5, marginTop: "auto" }} block>
              UnStaking
            </Button>
          ) : (
            
              <div>
                  <div
                      className={styles.description}
                      style={{ fontFamily: "GILROY " }}
                  >
                      Available for un-staking after:
                  </div>
                  <Countdown
                      onChange={handleChangeTimeCountDown}
                      onFinish={() => setIsHitToDeadline(true)}
                      value={deadline}
                      format={format}
                      valueStyle={{
                          paddingLeft: "10px",
                          color: "#36a920",
                          fontSize: "12px",
                          fontWeight: "bold",
                          textAlign: "center",
                      }}
                  />
              </div>
          )
        }
      </div>
    </div>
  );
};

LayoutItemContent.propTypes = {
  type: PropTypes.oneOf(["ssr", "sr", "r"]),
};

export default LayoutItemContent;
