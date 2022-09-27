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
import Web3 from "web3";
import axios from "axios";
import Constants from 'constant';

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
  
  // get nft by provider
  const abiCollection = JSON.parse(Constants.contracts.NFT_COLLECTION_ABI);
  const addrCollection = Constants.contracts.NFT_COLLECTION_ADDRESS;
  const [NFTs, setNFTs] = useState([]);
  const web3Js = new Web3(new Web3.providers.WebsocketProvider('wss://ws-nd-524-739-052.p2pify.com/9984e6c12c83e092549386bc36509a29'));
  const smNFTs = new web3Js.eth.Contract(abiCollection, addrCollection);
  let arr = [];

  const getNFTs = async () => {
    try {
      if (account && smNFTs) {
        let balance = await smNFTs.methods.balanceOf(account).call();
        for (let i = 0; i < balance; i++) {
          let tokenId = await smNFTs.methods.tokenOfOwnerByIndex(account, i).call();
          let tokenURI = await smNFTs.methods.tokenURI(tokenId).call();
          if (tokenURI.includes('ipfs://bafy')) {
            tokenURI = tokenURI.replace('ipfs://', '');
            let arrStr = tokenURI.split('/');
            tokenURI = 'https://'+ arrStr[0]+'.ipfs.nftstorage.link/'+arrStr[1];
          }
          const metadata = (await axios.get(tokenURI)).data;
          // console.log(metadata);
          if (metadata) {
            let linkImage = metadata.image.replace('ipfs://', '');
            let arrStr = linkImage.split('/');
            linkImage = 'https://'+ arrStr[0]+'.ipfs.nftstorage.link/'+arrStr[1];
            let item = {
              image: linkImage,
              description: metadata.description,
              tokenId: tokenId,
              name: metadata.name,
            }
            arr.push(item);
          }

        }
        setNFTs(arr);
      }
    } catch (error) {
      console.log(error);
    }

  };
  useEffect(() => {
    if (isAuthenticated) {
      if (account) {
        getNFTs();
      }
    } else {
      setNFTs([]);
    }
  }, [account, isAuthenticated]);

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
            { NFTs?.result &&
              NFTs.result.map((data, index) => {
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
