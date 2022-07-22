import { Skeleton } from "antd";
import React, { useState, useEffect, memo } from "react";
import CollectionCard from "./CollectionCard";
import CollectionCardOther from './CollectionCardOther'
import styless from "./Collections.module.css";
import CollectionBanner from "./CollectionBanner";
import { useMoralisQuery, useMoralis } from "react-moralis";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";
// import { getCollectionsByChain } from "helpers/collection";
import { useParams } from "react-router-dom";

// const fakeDataItem = {
//   name: 'Name',
//   description:
//     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam orci congue diam tempor dui sed vitae. Urna, in metus, eu diam sit aliquet.',
//   avatar: avatarFake,
//   image: imgFake,
// };

const Collections = memo(({ address }) => {
  const { addrs } = useParams();
  const [listData, setListData] = useState([]);
  // const [type, setType] = useState(false);
  // setListData(useNFTBalances(address));
  // const { data: list } = useNFTBalances(address);
  const { chainId } = useMoralis()
  const queryMarketItems = useMoralisQuery("MarketItemCreateds");
  const queryListedItems = useMoralisQuery("ListedItem", q => q.descending('createdAt'));
  const [listNFT, setListNFT] = useState([]);
  // const [originListNFT, setOriginListNFT] = useState([]);
  const [marketItems, setMarketItems] = useState([]);
  // const collections = getCollectionsByChain(chainId);
  // const collection = collections.find(ele => ele.addrs === addrs);
  const collection = {
    addrs: "0x230f55e5d30dfc1bd9de65d9b644820553e72486",
    banner: "https://lh3.googleusercontent.com/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIvv6DHm4m2R3y7hMajbsv14pSZK8mhs=h600",
    image: "https://lh3.googleusercontent.com/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB=s130",
    name: "Bored Ape Yacht Club"
  }
  // console.log(collection);
  useNFTTokenIds(address).then((res) => setListData(res));
  const addrsList = ['0x230f55e5d30dfc1bd9de65d9b644820553e72486']
  // useEffect(() => {
  //   if (address.address === "0x230f55e5d30dfc1bd9de65d9b644820553e72486") {
  //     setType(true);
  //   } else {
  //     setType(false);
  //   }
  // }, [address]);

  const { data: marketData } = queryMarketItems;
  useEffect(() => {
    setMarketItems([...marketData]);
  }, [marketData]); // data

  let { data } = queryListedItems //useMoralisQuery('ListedItem');
  useEffect(() => {
    if (data) {
      let listedItem = []
      data.forEach(el => {
        listedItem.push({ ...el.attributes })
      })
      listedItem.forEach((item, idx) => {
        marketItems?.forEach((ele) => {
          if (
            ele.attributes.nftContract === item.token_address &&
            ele.attributes.tokenId === item.token_id
          ) {
            item.price = ele.attributes.price / ("1e" + 18);
          }
        });
      });
      if (collection?.added) {
        if (addrs === '0x68F33d25b2Ba9d60Cc6615d29d30fF069F840911') {
          // condtion for new main contract
          setListNFT([...listedItem.filter((ele) => { return !addrsList.includes(ele.token_address) })]);
        } else {
          let newArray = listedItem.filter((ele) => { return ele.token_address.toLowerCase() === addrs.toLowerCase() }).concat(listData);
          setListNFT([...newArray]);
        }
      }
      // setListNFT([...listedItem]);
      // setOriginListNFT([...listedItem]); // port later
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, marketItems, chainId, listData]);


  // function itemRender(current, type, originalElement) {
  //   if (type === "prev") {
  //     return null;
  //   }
  //   if (type === "next") {
  //     return null;
  //   }
  //   return originalElement;
  // }
  return (
    <>
      <CollectionBanner address={address} />
      <div className={styless.wrapper}>
        <div className={styless.wrapperInner}>
          <Skeleton loading={!listNFT || !listData} active>
            {collection?.added ? (
              listNFT?.length > 0 ? (
                listNFT.map((nft, index) => (
                  <CollectionCard
                    item={{
                      ...nft,
                      name: nft?.metadata.name,
                    }}
                    key={index}
                  />
                ))
              ) : (
                <h2>No NFTs found</h2>
              )
            ) : (
              listData?.length > 0 ? (
                listData.map((nft, index) => (
                  <CollectionCardOther
                    item={{
                      ...nft,
                      name: nft.metadata?.name,
                    }}
                    key={index}
                  />
                ))
              ) : (
                <h2>No NFTs found</h2>
              )
            )}
          </Skeleton>
        </div>
      </div>
      {/* <Row justify="center" style={{ margin: "24px 0 40px" }}>
        <Pagination
          itemRender={itemRender}
          className={styless.pagination}
          defaultCurrent={1}
          total={50}
        />
      </Row> */}
    </>
  );
});

export default Collections;
