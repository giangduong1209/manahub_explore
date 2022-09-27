import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import GameDashboard from './components/GameDashboard';
import styles from './styles.module.css';

const Game = () => {
  const { type } = useParams();

  return <div className={styles.gameContainer}>
    <GameDashboard />
  </div>;
};

export default Game;
