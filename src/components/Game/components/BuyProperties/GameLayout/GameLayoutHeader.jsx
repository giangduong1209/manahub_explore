import { Button, Grid } from 'antd';
import clsx from 'clsx';
import styles from '../../../styles.module.css';
import MapSvg from '../../GameDashboard/MapSvg';

const { useBreakpoint } = Grid;

const GameLayoutHeader = ({ setShow, show }) => {
  const { md } = useBreakpoint();
  return (
    <div className={styles.gameLayoutHeader}>
      <div className={styles.gameLayoutHeaderItem}>
        <p>$POLIS Balance</p>
        <div className={clsx('input-text')}>50000 POLIS</div>
      </div>

      <div className={styles.gameLayoutHeaderItem}>
        <p>Available NFTs</p>
        <div className={clsx('input-text')}>2,499 / 9,999</div>
      </div>
      {!md && (
        <div className={styles.gameLayoutHeaderItem} style={{ flex: 0 }}>
          <p style={{ opacity: 0 }}>a</p>

          <Button
            style={{
              ...(show
                ? {
                    color: '#fff',
                    background:
                      'linear-gradient(180deg, #FEA013 0%, #FEA013 100%)',
                  }
                : {
                    color: '#FEA013',
                    background: '#fff',
                    border: '1px solid #FEA013',
                  }),
              border: 'none',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '28px',
            }}
            onClick={() => setShow((prev) => !prev)}
            icon={<MapSvg />}
          />
        </div>
      )}
    </div>
  );
};

export default GameLayoutHeader;
