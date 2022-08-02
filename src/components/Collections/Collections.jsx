import { Skeleton } from "antd";
import React, { useState, useEffect, memo } from "react";
import CollectionCard from "./CollectionCard";
import CollectionCardOther from './CollectionCardOther'
import styless from "./Collections.module.css";
import CollectionBanner from "./CollectionBanner";
import { useMoralisQuery, useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";
import { getCollectionsByChain } from "helpers/collection";
import { useParams } from "react-router-dom";
import { auctionABI } from "helpers/auction";

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
  const { chainId } = useMoralis();
  const queryMarketItems = useMoralisQuery("MarketItemCreated");
  const queryListedItems = useMoralisQuery("ListedItem", q => q.descending('createdAt'));
  const [listNFT, setListNFT] = useState([]);
  // const [originListNFT, setOriginListNFT] = useState([]);
  const [marketItems, setMarketItems] = useState([]);

  //
  const contractProcessor = useWeb3ExecuteFunction();
  const contractAuctionABIJson = JSON.parse(auctionABI);

  // const collections = getCollectionsByChain(chainId);
  // const collection = collections.find(ele => ele.addrs === addrs);
  useNFTTokenIds(address).then((res) => setListData(res));
  const addrsList = ['0xfde910FbaA9A6fDD5d3F80cCD44a54763DE2d9d0']
  // useEffect(() => {
  //   if (address.address === "0xfde910FbaA9A6fDD5d3F80cCD44a54763DE2d9d0") {
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
        if (item?.auctionContract) {
          getHighestBid(item);
          // getTransaction();
        }
      });
      // if (collection?.added) {
      if (addrs === '0xfde910FbaA9A6fDD5d3F80cCD44a54763DE2d9d0') {
        // condtion for new main contract
        setListNFT([...listedItem.filter((ele) => { return !addrsList.includes(ele.token_address) })]);
      } else {
        let newArray = listedItem.filter((ele) => { return ele.token_address.toLowerCase() === addrs.toLowerCase() }).concat(listData);
        setListNFT([...newArray]);
      }
      // }
      // setListNFT([...listedItem]);
      // setOriginListNFT([...listedItem]); // port later
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, marketItems, chainId, listData]);

  const getHighestBid = async (item) => {
    let ops = {
      contractAddress: item?.auctionContract,
      functionName: "highestBid",
      abi: contractAuctionABIJson,
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: (res) => {
        item.price = res / ("1e" + 18);
      },
      onError: (e) => {
        console.log(e);
      },
    });
  };


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
            {(
              listNFT?.length > 0 ? (
                listNFT.map((nft, index) => (
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
