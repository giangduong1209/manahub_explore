import clsx from "clsx";
import React from "react";
import styles from "../../../styles.module.css";
import DashboardLayoutHeader from "./DashboardLayoutHeader";
import LayoutItem from "./LayoutItem";
import { properties } from "helpers/properties-full";
import { useMoralis } from 'react-moralis';
import { useState } from "react";
import Web3 from "web3";
import abiNFTs from "../abi_nfts";
import axios from "axios";
let isRunning = false;

const DashboardLayout = ({ setShow, show }) => {
  const web3Js = new Web3(Web3.givenProvider || 'https://data-seed-prebsc-1-s1.binance.org:8545/');
  const { account } = useMoralis();


  const [NFTs, setNFTs] = useState([]);
  const addrNFT = "0x505D5fF937bB7E377Ed94b99A992db40A0276B67";
  const smNFTs = new web3Js.eth.Contract(abiNFTs, addrNFT);
  let arr = [];

  const getNFTs = async () => {
    try {
      if (account && smNFTs) {
        let balance = await smNFTs.methods.balanceOf(account).call();
        for (let i = 0; i < balance; i++) {
          let tokenId = await smNFTs.methods.tokenOfOwnerByIndex(account, i).call();
          let tokenURI = await smNFTs.methods.tokenURI(tokenId).call();
          if (tokenURI.includes('ipfs://bafy')) {
            tokenURI = tokenURI.replace('ipfs://', 'https://nftstorage.link/ipfs/');
          }
          const metadata = (await axios.get(tokenURI)).data;
          // console.log(metadata);
          if (metadata) {
            let item = {
              image: metadata.image.replace('ipfs://', 'https://nftstorage.link/ipfs/'),
              description: metadata.description,
              tokenId: tokenId,
              name: metadata.name,
            }
            arr.push(item);
          }

        }
        setNFTs(arr);
      }
    } catch (error) {
      console.log(error);
    }

  };
  getNFTs();


  return (
    <div
      className={clsx(styles.gameLayout, styles.gameDashboardLayout, {
        [styles.show]: show,
      })}>
      <DashboardLayoutHeader
        show={show}
        setShow={setShow}
        extraCn={styles.gameDashboardHeaderDesktop}
      />

      <div className={clsx(styles.gameLayoutBody, styles.dasboardLayoutBody)}>
        {
          NFTs.map((e) => (
            <LayoutItem
              item={{
                title: e.name,
                description: e.description,
                code: "#" + e.tokenId,
                tokenId: e.tokenId,
              }}
              type="sr"
              image={e.image}
            />
          ))
        }
      </div>
    </div>
  );
};

export default DashboardLayout;
