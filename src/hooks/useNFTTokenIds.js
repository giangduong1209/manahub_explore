import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useNFTTokenIds = async ({ address }) => {
  const { token } = useMoralisWeb3Api();
  const { Moralis, chainId } = useMoralis();
  const { resolveLink } = useIPFS();
  const [NFTTokenIds, setNFTTokenIds] = useState([]);
  const options = {
    address: "0xBE87ef0FF214c4484D31031863Cb88863b65858E",
    chain: chainId,
  };
  Moralis.CoreManager.get("VERSION");
  const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
  const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;
  Moralis.start({ serverUrl: SERVER_URL, appId: APP_ID });

  useEffect(() => {
    async function fetchData() {
      // You can await here
      let res = await token.getAllTokenIds(options);
      if (res.result) {
        const NFTs = res.result;
        for (let NFT of NFTs) {
          if (NFT.metadata) {
            NFT.metadata = JSON.parse(NFT.metadata);
            NFT.image = resolveLink(NFT.metadata.image);
          }
        }
        setNFTTokenIds(NFTs.slice(0, 50))
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  // console.log(data)
  // useEffect(() => {
  //   let data = fetchData();
  //   console.log(data);
  //   if (data?.result) {
  //     const NFTs = data.result;
  //     for (let NFT of NFTs) {
  //       if (NFT?.metadata) {
  //         NFT.metadata = JSON.parse(NFT.metadata);
  //         // metadata is a string type
  //         NFT.image = resolveLink(NFT.metadata?.image);
  //       }
  //     }
  //     setNFTTokenIds(NFTs);
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // });
  // async function fetchData() {
  //   return await Web3Api.token.getAllTokenIds(options);
  // }

  return NFTTokenIds;
};

export default useNFTTokenIds;