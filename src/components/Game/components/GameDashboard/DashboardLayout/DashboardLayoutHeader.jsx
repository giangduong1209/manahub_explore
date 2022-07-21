import { Button, Grid } from 'antd';
import React from 'react';
import styles from '../../../styles.module.css';

import clsx from 'clsx';
import StackSvg from '../StackSvg';
const { useBreakpoint } = Grid;

const DashboardLayoutHeader = ({ setShow, extraCn, show }) => {
  const { md } = useBreakpoint();
  return (
    <div className={clsx(styles.gameLayoutHeader, extraCn)}>
      <div className={styles.gameLayoutHeaderItem}>
        <p>$POLIS Balance</p>
        <div className={clsx('input-text')}>50000 POLIS</div>
      </div>

      <div className={styles.gameLayoutHeaderItem}>
        <p>My Total NFTs</p>
        <div className={clsx('input-text')}>135</div>
      </div>

      {!md && (
        <div className={styles.gameLayoutHeaderItem} style={{ flex: 0 }}>
          <p style={{ opacity: 0 }}>a</p>
          <Button
            style={{
              ...(show
                ? { color: '#F27252', background: '#fff' }
                : {
                    color: '#fff',
                    background:
                      'linear-gradient(180deg, #F27252 0%, #E85443 100%)',
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
