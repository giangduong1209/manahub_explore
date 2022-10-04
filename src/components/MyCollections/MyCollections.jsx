import { Avatar, Pagination, Row, Space } from 'antd';
import { Alchemy, Network } from "alchemy-sdk";
import React, {useEffect, useState, memo} from "react";
import CollectionCard from './CollectionCard';
import styless from './MyCollections.module.css';
import { useMoralis } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useHistory } from 'react-router-dom';
import { useVerifyMetadata } from "hooks/useVerifyMetadata";
import Constants from 'constant';

const MyCollections = memo((props) => {
  const [user, setUser] = useState("Manahubs");
  const { Moralis, account, isAuthenticated } = useMoralis();
  const {chainId} = useMoralisDapp();
  const serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;
  const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
  Moralis.initialize(appId);
  Moralis.serverURL = serverURL;
  const history = useHistory();
  const { verifyMetadata } = useVerifyMetadata();
  const [nftCollections, setNftCollections] = useState([]);
  const [totalNFTs, setTotalNFTs] = useState(0);
  const [NFTs, setNFTs] = useState([]);
  function itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return null;
    }
    if (type === 'next') {
      return null;
    }
    return originalElement;
  }
  const checkAuthen = async () => {
    if(account && isAuthenticated){
      const users = Moralis.Object.extend("profile");
      const query = new Moralis.Query(users);
      query.equalTo("address", account.toLowerCase());
      const data = await query.first();
      if(data){
        setUser(data.attributes);
      }
      else{ 
        history.push("/profile")
      }
    }
  };

  const loadAllNFTs = async () => {
    const config = {
      apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET
    };
    console.log("config",config);
    const alchemy = new Alchemy(config);
    console.log("account", account)
    const nfts = await alchemy.nft.getNftsForOwner(account);
    console.log(nfts)
    setNFTs(nfts?.ownedNfts || []);
  }
  const loadNFTCollections = (page, pageSize)=>{
    console.log(page, pageSize)
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    if(NFTs){
      const NFTsByPage = NFTs.slice(skip, skip + limit);
      setNftCollections(NFTsByPage);
    }
  }
  useEffect(() => {
    if(account){
      loadAllNFTs();
    }
  }, [account]);
  useEffect(() => {
    if(NFTs){
      setTotalNFTs(NFTs.length ?? 0);
    }
    else{
      setTotalNFTs(0);
    }
  },[NFTs]);
  useEffect(() => {
    checkAuthen()
    loadNFTCollections(1, Constants.pagination.PAGE_SIZE);
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
            { nftCollections &&
              nftCollections.map((data, index) => {
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
            defaultPageSize={Constants.pagination.PAGE_SIZE}
            onChange = {loadNFTCollections}
            total={totalNFTs}
          />
        </Row>
      </div>
    </div></div>
  );
});

export default MyCollections;
