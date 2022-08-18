import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "../../../styles.module.css";
import { Button } from "antd";
import Web3 from "web3";
import abiStaking from "../abi_staking";
import { useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';

const LayoutItemContent = ({ item, type, image }) => {
  const { Moralis, authenticate, account } = useMoralis();
  const addrNFTs = "0x70cbc0e9eb87035ad2fbb5eba433b9496195e991";

  const addrStaking = "0xE2C7f1bE4d452d82b78989cBf60108c1E0f768bF";
  const [isDisable, setIsDisable] = useState(false);

  const contractProcessor = useWeb3ExecuteFunction();
  async function unstake() {
    authenticate({
      onSuccess: async () => {
        setIsDisable(true);
        console.log(item);
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
            const Staking = Moralis.Object.extend("Staking");
            const query = new Moralis.Query(Staking);
            query.equalTo("tokenId", item.tokenId);
            query.equalTo("staker", account);
            query.equalTo("addressNFT", addrNFTs);
            query.equalTo("addressStaking", addrStaking);
            query.equalTo("unstake", false);
            const obj = await query.first();
            if (obj) {
              obj.set("unstake", true);
              await obj.save();
              window.location.reload();
            }
          }
        });
      },
      onError: () => {
        console.log('err');
      }
    })
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
          onClick={() => unstake()}
          disabled={isDisable}
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
