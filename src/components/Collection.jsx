import React from 'react';
import Collections from './Collections';
import { useParams } from 'react-router-dom';

const Collection = () => {
  const address = useParams();

  return (
    <div>
      <Collections address={address}/>
    </div>
  );
};

export default Collection;
