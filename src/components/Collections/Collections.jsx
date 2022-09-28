import { Skeleton } from "antd";
import React, { useState, useEffect, memo } from "react";
import CollectionCardOther from './CollectionCardOther'
import styless from "./Collections.module.css";
import CollectionBanner from "./CollectionBanner";
import { useMoralisQuery, useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";
import { useParams } from "react-router-dom";
import { auctionABI } from "helpers/auction";
import Constants from "constant";


const Collections = memo(({ address }) => {
  const { addrs } = useParams();
  const [listData, setListData] = useState([]);
  const { chainId } = useMoralis();
  const queryMarketItems = useMoralisQuery("MarketItemCreated");
  const queryListedItems = useMoralisQuery("ListedItem", q => q.descending('createdAt'));
  const [listNFT, setListNFT] = useState([]);
  const [marketItems, setMarketItems] = useState([]);

  const contractProcessor = useWeb3ExecuteFunction();
  const contractAuctionABIJson = JSON.parse(auctionABI);
  useNFTTokenIds(address).then((res) => setListData(res));
  const addrsList = [Constants.contracts.MARKETPLACE_ADDRESS]

  const { data: marketData } = queryMarketItems;
  useEffect(() => {
    setMarketItems([...marketData]);
  }, [marketData]); // data

  let { data } = queryListedItems
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
      if (addrs === Constants.contracts.MARKETPLACE_ADDRESS) {
        // condtion for new main contract
        setListNFT([...listedItem.filter((ele) => { return !addrsList.includes(ele.token_address) })]);
      } else {
        let newArray = listedItem.filter((ele) => { return ele.token_address.toLowerCase() === addrs.toLowerCase() }).concat(listData);
        setListNFT([...newArray]);
      }
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
    </>
  );
});

export default Collections;
