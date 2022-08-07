import clsx from "clsx";
import React from "react";
import styles from "../../../styles.module.css";
import DashboardLayoutHeader from "./DashboardLayoutHeader";
import LayoutItem from "./LayoutItem";
import { properties } from "helpers/properties-full";
import { useMoralis, useMoralisWeb3Api } from 'react-moralis';
import { useState } from "react";

const DashboardLayout = ({ setShow, show }) => {
  const { Moralis, account } = useMoralis();
  Moralis.start({ serverUrl: "https://bzyt487madhw.usemoralis.com:2053/server", appId: "ODKsAGfZTKjTaG2Xv2Kph0ui303CX3bRtIwxQ6pj" });
  const Web3Api = useMoralisWeb3Api();

  const [NFTs, setNFTs] = useState([]);
  const addr = "0xfde910FbaA9A6fDD5d3F80cCD44a54763DE2d9d0";

  const prop = properties.slice(0, 10);
  let arr = [];
  const getNFTs = async () => {
    const options = {
      chain: "bsc",
      address: account,
    };
    const res = await Web3Api.account.getNFTs(options);

    // console.log(res.result);
    for (let index = 0; index < res.result.length; index++) {
      const element = res.result[index];
      // console.log(element);
      if (element.token_address.toLowerCase() === addr.toLowerCase()) {
        arr.push(element);
      }
    }
    // console.log(arr);
    if (arr.length > 0) {
      setNFTs(arr);
    }
  };
  console.log(NFTs);
  if (NFTs.length === 0) {
    getNFTs();
  }
  return (
    <div
      className={clsx(styles.gameLayout, styles.gameDashboardLayout, {
        [styles.show]: show,
      })}>
      <DashboardLayoutHeader
        show={show}
        setShow={setShow}
        extraCn={styles.gameDashboardHeaderDesktop}
      />

      <div className={clsx(styles.gameLayoutBody, styles.dasboardLayoutBody)}>
        {
          NFTs.map((e) => (
            <LayoutItem
              item={{
                title: e.name,
                description: JSON.parse(e.metadata).description,
                code: "#" + e.token_id,
                price: e.price,
                owner: {
                  name: e.owner,
                },
              }}
              type="sr"
              image={JSON.parse(e.metadata).image}
            />
          ))
        }
        {/* <LayoutItem
          item={{
            title: "Lorem ipsum",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ipsum lorem, sodales ut molestie non, pharetra ut velit. Etiam tincidunt quam purus, vitae venenatis sapien cursus vel. Nam mollis, turpis at luctus commodo, dui urna imperdiet ante, et finibus velit nunc fermentum diam. Suspendisse tincidunt tempor neque, vel cursus lectus maximus eu",
            code: "#00010",
            price: "2000",
            owner: {
              name: "Lorem ipsum",
            },
          }}
          type="ssr"
          image={"https://picsum.photos/700/300"}
        />
        <LayoutItem
          item={{
            title: "Lorem ipsum",
            description: "Lorem ipsum ipsum ipsum",
            code: "#00020",
            price: "2000",
            owner: {
              name: "Lorem ipsum",
            },
          }}
          type="sr"
          image={"https://picsum.photos/700/300"}
        />
        <LayoutItem
          item={{
            title: "Lorem ipsum",
            description: "Lorem ipsum ipsum ipsum",
            code: "#00030",
            price: "2000",
            owner: {
              name: "Lorem ipsum",
            },
          }}
          type="r"
          image={"https://picsum.photos/700/300"}
        />
        <LayoutItem
          item={{
            title: "Lorem ipsum",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ipsum lorem, sodales ut molestie non, pharetra ut velit. Etiam tincidunt quam purus, vitae venenatis sapien cursus vel. Nam mollis, turpis at luctus commodo, dui urna imperdiet ante, et finibus velit nunc fermentum diam. Suspendisse tincidunt tempor neque, vel cursus lectus maximus eu",
            code: "#000a0",
            price: "2000",
            owner: {
              name: "Lorem ipsum",
            },
          }}
          type="ssr"
          image={"https://picsum.photos/700/300"}
        />
        <LayoutItem
          item={{
            title: "Lorem ipsum",
            description: "Lorem ipsum ipsum ipsum",
            code: "#0002c0",
            price: "2000",
            owner: {
              name: "Lorem ipsum",
            },
          }}
          type="sr"
          image={"https://picsum.photos/700/300"}
        />
        <LayoutItem
          item={{
            title: "Lorem ipsum",
            description: "Lorem ipsum ipsum ipsum",
            code: "#000t0",
            price: "2000",
            owner: {
              name: "Lorem ipsum",
            },
          }}
          type="r"
          image={"https://picsum.photos/700/300"}
        /> */}
      </div>
    </div>
  );
};

export default DashboardLayout;
