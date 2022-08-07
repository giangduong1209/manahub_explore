import { Button, Grid } from 'antd';
import React, { useState } from 'react';
import styles from '../../../styles.module.css';

import clsx from 'clsx';
import StackSvg from '../StackSvg';
import { useMoralis, useMoralisWeb3Api } from 'react-moralis';
const { useBreakpoint } = Grid;

const DashboardLayoutHeader = ({data, setShow, extraCn, show }) => {
  const { md } = useBreakpoint();
  return (
    <div className={clsx(styles.gameLayoutHeader, extraCn)}>
      <div className={styles.gameLayoutHeaderItem}>
        <p>$MataHubs Balance</p>
        <div className={clsx('input-text')}>0</div>
      </div>

      <div className={styles.gameLayoutHeaderItem}>
        <p>My Total NFTs</p>
        <div className={clsx('input-text')}>0</div>
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
