import { Avatar } from 'antd';
import React from 'react';
import styless from './Explores.module.css';
import { useHistory } from 'react-router-dom';

const Cardbox = ({ item }) => {

  const history = useHistory();

  const goToPage = () => {
    history.push(`/collection/${item.addrs}`)
  }
  return (
    <div className={styless.cardbox} onClick={() => goToPage()}>
      <div
        className={styless.image}
        style={{ backgroundImage: `url(${item.banner})` }}
      >
        <Avatar src={item.image} className={styless.avatar} size={80} />
      </div>
      <div className={styless.content}>
        <div className={styless.title}>{item.name}</div>
        {/* <div className={styless.byAuthor}>
          by <span>METAMINT</span>
        </div> */}
        <div className={styless.description}>{item.description}</div>
      </div>
    </div>
  );
};

export default Cardbox;
