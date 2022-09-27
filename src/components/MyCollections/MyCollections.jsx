import { Avatar, Pagination, Row, Space } from 'antd';
// import avatarFake from 'assets/images/avatar-explore.png';
// import imgFake from 'assets/images/img-explore.png';
import React, {useEffect, useState, memo} from "react";
import CollectionCard from './CollectionCard';
import styless from './MyCollections.module.css';
import { useMoralis, useNFTBalances } from "react-moralis";
import { useHistory } from 'react-router-dom';
import { useVerifyMetadata } from "hooks/useVerifyMetadata";
import { requireWalletConnection } from 'helpers/auth';
// const fakeDataItem = {
//   name: 'Name',
//   description:
//     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam orci congue diam tempor dui sed vitae. Urna, in metus, eu diam sit aliquet.',
//   avatar: avatarFake,
//   image: imgFake,
// };

const MyCollections = memo((props) => {
  const { data: NFTBalances, isFetching } = useNFTBalances();
  const [user, setUser] = useState("Manahubs");
  const { Moralis, account, isAuthenticated } = useMoralis();
  const serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;
  const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
  Moralis.initialize(appId);
  Moralis.serverURL = serverURL;
  const history = useHistory();
  const { verifyMetadata } = useVerifyMetadata();
  function itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return null;
    }
    if (type === 'next') {
      return null;
    }
    return originalElement;
  }
  useEffect(() => {
    if(isFetching === true) {
      console.time("getNFTBalances");
    }
    else{
      console.timeEnd("getNFTBalances");
    }
  }, [isFetching]);
  const checkAuthen = async () => {
    if(account && isAuthenticated){
      const users = Moralis.Object.extend("profile");
      const query = new Moralis.Query(users);
      query.equalTo("address", account.toLowerCase());
      const data = await query.first();
      console.log(data)
      if(data){
        setUser(data.attributes);
      }
      else{ 
        history.push("/profile")
      }
    }
  };

  useEffect(() => {
    checkAuthen()
  }, [account, isAuthenticated]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: '100%',
        backgroundImage: `url(${user?.background})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        // height: 'screen',
      }}
    >
    <div className={styless.wrapper}>
      <div>
        <Row justify="center">
          <Space direction="vertical" align="center">
            <Avatar size={140} src={user?.avatar}/>
            <div className={styless.headerTitle}>{user?.name}</div>
          </Space>
        </Row>
        <div className={styless.wrapper}>
          <div className={styless.wrapperInner}>
            { NFTBalances?.result &&
              NFTBalances.result.map((data, index) => {
                data = verifyMetadata(data);
                return (
              <CollectionCard
                key={index}
                item={{
                  ...data,
                  name: data.metadata?.name
                }}
              />
            )})}
          </div>
        </div>
        <Row justify="center" style={{ marginTop: '24px' }}>
          <Pagination
            itemRender={itemRender}
            className={styless.pagination}
            defaultCurrent={1}
            total={50}
          />
        </Row>
      </div>
    </div></div>
  );
});

export default MyCollections;
