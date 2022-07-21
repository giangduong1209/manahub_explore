import React from 'react';
import FilterBox from './FilterBox';
import MyCollections from './MyCollections';
import styles from "./styles.module.css"

const MyCollection = () => {
  return (
    <div className={styles.mycollectionwrap} style={{ display: 'flex', position: 'relative' }}>
      <FilterBox />
      <MyCollections />
    </div>
  );
};

export default MyCollection;
