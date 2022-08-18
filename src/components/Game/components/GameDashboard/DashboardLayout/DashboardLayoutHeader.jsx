import { Button, Grid } from 'antd';
import React, { useState, useEffect } from 'react';
import styles from '../../../styles.module.css';

import clsx from 'clsx';
import StackSvg from '../StackSvg';
import { useMoralis } from 'react-moralis';
import Web3 from "web3";
import abiNFTs from "../abi_nfts";

const { useBreakpoint } = Grid;
let isRunning = false;

const DashboardLayoutHeader = ({ setShow, extraCn, show }) => {
  const web3Js = new Web3(Web3.givenProvider || 'https://data-seed-prebsc-1-s1.binance.org:8545/');
  const { Moralis, account } = useMoralis();
  const addrNFT = "0x505D5fF937bB7E377Ed94b99A992db40A0276B67";
  const { md } = useBreakpoint();
  const [total, setTotal] = useState(0);
  const [totalMyNFTs, setTotalMyNFTs] = useState(0);

  const smNFTs = new web3Js.eth.Contract(abiNFTs, addrNFT);

  async function getNFTBalance() {
    let balance = await smNFTs.methods.totalSupply().call();
    setTotal(balance);
  }
  async function getMyNft() {
    let balance = await smNFTs.methods.balanceOf(account).call();
    setTotalMyNFTs(balance);
  }
  if (account) {
    getNFTBalance();
    getMyNft();
  }



  return (
    <div className={clsx(styles.gameLayoutHeader, extraCn)}>
      <div className={styles.gameLayoutHeaderItem}>
        <p>$MAH Balance</p>
        <div className={clsx('input-text')}>{total}</div>
      </div>

      <div className={styles.gameLayoutHeaderItem}>
        <p>My Total NFTs</p>
        <div className={clsx('input-text')}>{totalMyNFTs}</div>
      </div>

      {!md && (
        <div className={styles.gameLayoutHeaderItem} style={{ flex: 0 }}>
          <p style={{ opacity: 0 }}>a</p>
          <Button
            style={{
              ...(show
                ? { color: '#FEA013', background: '#fff' }
                : {
                  color: '#fff',
                  background:
                    'linear-gradient(180deg, #FEA013 0%, #FEA013 100%)',
                }),
              border: 'none',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => setShow((prev) => !prev)}
            icon={<StackSvg />}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardLayoutHeader;
