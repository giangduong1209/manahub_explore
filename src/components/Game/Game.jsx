import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import BuyProperties from './components/BuyProperties';
import GameDashboard from './components/GameDashboard';
import GameLeaderboard from './components/GameLeaderboard';
import GameRewards from './components/GameRewards';
import styles from './styles.module.css';

const Game = () => {
  const { type } = useParams();
  const renderContent = useCallback((type) => {
    switch (type) {
      case 'buy-properties':
        return <BuyProperties />;

      case 'dashboard':
        return <GameDashboard />;

      case 'rewards':
        return <GameRewards />;

      case 'leaderboard':
        return <GameLeaderboard />;

      default:
        return <></>;
    }
  }, []);

  // const withLayout = useMemo(
  //   () => type === 'buy-properties' || type === 'dasboard',
  //   [type]
  // );

  return <div className={styles.gameContainer}>{renderContent(type)}</div>;
};

export default Game;
