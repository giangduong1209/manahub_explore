import { Row, Col, Grid } from "antd";
import ImageBox from "./ImageBox";
import DescriptionBox from "./DescriptionBox";
// import HistoryBox from "./HistoryBox";
import ListedBox from "./ListedBox";
import CreatorBox from "./CreatorBox";
import HistoryBox from "./HistoryBox";
import { useParams } from "react-router";
import { useMoralisQuery } from "react-moralis";
import { useState, useEffect } from "react";

const { useBreakpoint } = Grid;

const ViewNFTAuction = () => {
  const { contract, id, deployContract } = useParams();
  // console.log(contract, id);
  const [nft, setNft] = useState({});
  // const { data: NFTTokenIds } = useNFTBalances({
  //   address: "0x3d4f238aDf678988824831382Df24a73AF992664",
  // });
  const queryListedItems = useMoralisQuery("ListedItem", q => q.descending('createdAt'));

  // const Web3Api = useMoralisWeb3Api();

  // const fetchTokenIdOwners = async () => {
  //   const options = {
  //     address: contract,
  //     token_id: id,
  //   };
  //   const tokenIdOwners = await Web3Api.token.getTokenIdOwners(options);
  //   console.log(tokenIdOwners);
  // };
  const { data } = queryListedItems
  useEffect(() => {
    console.log(data);
    let listedItem = []
      data.forEach(el => {
        listedItem.push({...el.attributes})
    })
    console.log(listedItem)
    const nft = listedItem?.find(
      // eslint-disable-next-line array-callback-return
      (e) => e.token_address === contract && e.token_id === id && e.auctionContract === deployContract
    );
    // console.log("nfts " + nft);
    setNft(nft);
    // fetchTokenIdOwners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  

  const { xl } = useBreakpoint();
  return (
    <>
      <br />
      <Row>
        <Col xs={{ span: 24 }} md={{ span: 24 }} xl={{ span: 12 }}>
          <ImageBox image={nft?.image} />
          <br />
          <DescriptionBox description={nft?.metadata?.description} />
        </Col>

        <Col xs={{ span: 24 }} md={{ span: 24 }} xl={{ span: 12 }}>
          {!xl ? (
            <>
              {" "}
              <br />
            </>
          ) : (
            <> </>
          )}
          <CreatorBox information={nft} />
          <br />
          <ListedBox information={nft} />
          {nft?.auction || nft?.auctionContract?.length > 0 ? (
            <>
              {" "}
              <br />
              <HistoryBox information={nft}/>
            </>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ViewNFTAuction;
