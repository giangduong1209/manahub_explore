import { Typography, Tag, Button } from 'antd';
import Runes from '../Runes.png';

export default function Gamify({ tab }) {
  const { Title } = Typography;

  const days = [10, 10, 10, 20, 20, 20, 50];

  const styles = {
    collected: {
      marginTop: '20px',
      marginBottom: '40px',
      width: '310px',
      height: '150px',
      background: '#21bf96',
      borderRadius: '20px',
      display: 'flex',
      overflow: 'hidden',
    },
    colHeading: {
      padding: '27px',
      fontSize: '12px',
      width: '200px',
    },
    count: {
      fontSize: '28px',
      fontWeight: '600',
      marginTop: '5px',
    },
    daily: {
      marginTop: '20px',
      marginBottom: '35px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    collect: {
      background: '#21bf96',
      borderColor: '#21bf96',
      width: '150px',
    },
    claimrow: {
      display: 'flex',
      gap: '25px',
      marginBottom: '35px',
      flexWrap: 'wrap',
    },
  };

  if (tab === 'runes') {
    return (
      <div style={{ paddingLeft: '5vw', width: '70vw' }}>
        <Title level={2} style={{ color: 'white' }}>
          My Moralis Runes
        </Title>
        <p style={{ color: 'gray' }}>
          Collect Moralis Runes, climb the communnity leaderboard and claim
          magical rewards
        </p>

        <div style={styles.collected}>
          <div style={styles.colHeading}>
            <span>My Runes</span>
            <p style={styles.count}>120</p>
          </div>
          <div>
            <img src={Runes} alt="" />
          </div>
        </div>

        <Tag color="rgba(47,79,79, 0.2)" style={{ color: '#21bf96' }}>
          Collect Runes
        </Tag>

        <div style={styles.daily}>
          <div>
            <Title level={3} style={{ color: 'white' }}>
              Daily Rune Collection
            </Title>
            <p style={{ color: 'gray' }}>
              If you visit us everyday you will have the opportunity to receive
              bonus runes
            </p>
          </div>
          <Button style={styles.collect}>Collect Runes</Button>
        </div>
        <div style={styles.claimrow}>
          {days.map((e, i) => (
            <>
              <div className={'runeBtn'}>
                <p style={{ fontSize: '12px' }}>{`Day ${i + 1}`}</p>
                <img
                  src={Runes}
                  alt=""
                  style={{ width: '40%', margin: '6px auto' }}
                />

                <p style={{ color: 'white', fontSize: '18px' }}>{`+${e}`}</p>
              </div>
            </>
          ))}
        </div>
        <span style={{ color: 'gray' }}>
          Learn more abour Moralis?{' '}
          <a href="https://www.moralis.io">Our website</a>
        </span>
      </div>
    );
  }

  if (tab === 'rewards') {
    return <div>rewards</div>;
  }

  if (tab === 'leaderboard') {
    return <div>leaderboard</div>;
  }
}
