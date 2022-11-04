import { Grid, Table, Tag, Space, Modal, Button, Spin, Skeleton } from "antd";
import "antd/dist/antd.css";
// import TransactionFilterBox from 'components/TransactionFilterBox';
// import TransactionRow from 'components/TransactionRow';
// import useNativeTransactions from "hooks/useNativeTransactions";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import React, { useEffect, useState } from "react";
import { useMoralisQuery } from "react-moralis";
import moment from "moment";
import { DeleteOutlined } from "@ant-design/icons";
// import styles from "./styles";
import styles from "./styles.module.css";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
// import srcBlankImg from 'assets/images/play.png';
import { useHistory } from "react-router-dom";
import { useNativeTransactions } from "react-moralis";
import { useNFTTransfers } from "react-moralis";
import { getEllipsisTxt } from "helpers/formatters";
import { getExplorer } from "helpers/networks";
import { useChain } from "react-moralis";
function NativeTransactions() {
  // const { getNativeTransations, data, chainId, error, isLoading, isFetching } =
  //   useNativeTransactions();
  const { chainId } = useChain();
  const { getNFTTransfers, data, error, isLoading, isFetching } =
    useNFTTransfers();

  const [nativeTransactions, setNativeTransactions] = useState([]);
  const [NFTTransfers, setNFTTransfers] = useState();
  const { walletAddress, marketAddress, contractABI } = useMoralisDapp();
  const contractABIJson = JSON.parse(contractABI);
  const queryItemImages = useMoralisQuery("ItemImages");
  // const { nativeTransactions } = useNativeTransactions();
  const { Moralis, authenticate } = useMoralis();
  const history = useHistory();

  useEffect(() => {
    getNFTTransfers({ params: { chain: chainId } });
  }, []);
  console.log("useNFTTransfers", useNFTTransfers());
  useEffect(() => (data ? setNFTTransfers(data?.result) : []), [data]);
  console.log("Data", NFTTransfers);
  const { useBreakpoint } = Grid;
  const { sm } = useBreakpoint();
  const contractProcessor = useWeb3ExecuteFunction();
  const [visible, setVisibility] = useState(false);
  const [recordDelist, setRecordDelist] = useState();
  const [loading, setLoading] = useState(false);

  const fetchItemImages = JSON.parse(
    JSON.stringify(queryItemImages.data, [
      "nftContract",
      "tokenId",
      "name",
      "image",
    ])
  );

  console.log("fetchItemImages", fetchItemImages);

  const addrsList = [];

  const columns = [
    {
      title: "Token",
      dataIndex: "token_address",
      key: "token_address",
      render: (token) => getEllipsisTxt(token, 8),
    },
    {
      title: "Token Id",
      dataIndex: "token_id",
      key: "token_id",
      render: (token) => token,
    },
    {
      title: "From",
      dataIndex: "from_address",
      key: "from_address",
      render: (from) => getEllipsisTxt(from, 8),
    },
    {
      title: "To",
      dataIndex: "to_address",
      key: "to_address",
      render: (to) => getEllipsisTxt(to, 8),
    },
    // {
    //   title: "Value",
    //   dataIndex: "value",
    //   key: "value",
    //   render: (value, item) => {
    //     return parseFloat(Moralis.Units.FromWei(value, item.decimals)).toFixed(
    //       6
    //     );
    //   },
    // },
    {
      title: "Hash",
      dataIndex: "transaction_hash",
      key: "transaction_hash",
      render: (hash) => (
        <a
          href={`${getExplorer(chainId)}tx/${hash}`}
          target="_blank"
          rel="noreferrer"
        >
          <div style={{ color: "#FEA013" }}>View Transaction</div>
        </a>
      ),
    },
  ];

  async function handleDelistClick(record) {
    console.log(record);
    setVisibility(true);
    setRecordDelist(record);
  }

  async function approveAll() {
    // console.log(itemDelist)
    setLoading(true);
    authenticate({
      chainId: 56,
      onSuccess: async () => {
        const ops = {
          contractAddress: marketAddress,
          functionName: "setApprovalForAll",
          abi: contractABIJson,
          params: {
            operator: recordDelist.collection,
            approved: true,
          },
        };
        console.log("approve all >>>>>>>>>", ops);
        await contractProcessor.fetch({
          params: ops,
          onSuccess: () => {
            console.log("Approval Received");
            // setLoading(false);
            // setVisibility(false);
            // succApprove(item);
            delist();
          },
          onError: (error) => {
            console.log(error);
            setLoading(false);
            failApprove();
          },
        });
      },
      onError: () => {
        setLoading(false);
        failApprove();
      },
    });
  }

  function failApprove() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem with setting approval`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  async function delist() {
    // let itemDelist = data.filter(item => item.key === recordDelist.index);
    removeFromDB();
    removeFromDB2();
    const ops = {
      contractAddress: marketAddress,
      functionName: "handleDelist",
      abi: contractABIJson,
      params: {
        nftContract: recordDelist?.collection,
        itemId: recordDelist?.itemId,
        tokenId: recordDelist?.item,
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        setVisibility(false);
        removeMarketItemsFromDB();
        if (addrsList.includes(recordDelist.nftContract)) {
          updateDB();
        } else {
          removeListedItemFromDB();
        }
        successDelist();
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        failDelist();
      },
    });
  }

  async function removeMarketItemsFromDB() {
    // let itemDelist = data.filter(item => item.key === recordDelist.index);

    const query = new Moralis.Query("MarketItemCreated");
    query.equalTo("nftContract", recordDelist.nftContract);
    query.equalTo("tokenId", recordDelist.tokenId);
    const object = await query.first();
    if (object) {
      object.destroy().then(
        () => {
          console.log("");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  async function updateDB() {
    const query = new Moralis.Query("ListedItem");
    query.equalTo("nftContract", recordDelist.nftContract);
    query.equalTo("tokenId", recordDelist.tokenId);
    let object = await query.first();
    if (object) {
      object.set("typeNFT", "mint");
      object.set("price", "0");
      object.set("price2", 0);
      object.save();
    }
  }

  async function removeListedItemFromDB() {
    const query = new Moralis.Query("ListedItem");
    query.equalTo("token_address", recordDelist.nftContract);
    query.equalTo("token_id", recordDelist.tokenId);
    // query.equalTo("itemId", information.itemId);
    const object = await query.first();
    if (object) {
      object.destroy().then(
        () => {
          console.log("The object was deleted");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  async function removeFromDB() {
    // let itemDelist = data.filter(item => item.key === recordDelist.index);

    const query = new Moralis.Query("MarketItemCreated");
    query.equalTo("nftContract", recordDelist.collection);
    query.equalTo("tokenId", recordDelist.item);
    const object = await query.first();
    if (object) {
      object.destroy().then(
        () => {
          console.log("");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  async function removeFromDB2() {
    const query = new Moralis.Query("ListedItem");
    query.equalTo("token_address", recordDelist.collection);
    query.equalTo("token_id", recordDelist.item);
    // query.equalTo("itemId", information.itemId);
    const object = await query.first();
    if (object) {
      object.destroy().then(
        () => {
          console.log("The object was deleted");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  function successDelist() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Your NFT is delisted`,
    });
    history.push("/my-collection");
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failDelist() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem with delist`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function getImage(addrs, id) {
    const img = fetchItemImages.find(
      (element) => element.nftContract === addrs && element.tokenId === id
    );
    return img?.image;
  }

  function getName(addrs, id) {
    const nme = fetchItemImages.find(
      (element) => element.nftContract === addrs && element.tokenId === id
    );
    return nme?.name;
  }

  const queryMarketItems = useMoralisQuery("MarketItemCreated");
  const fetchMarketItems = JSON.parse(
    JSON.stringify(queryMarketItems.data, [
      "updatedAt",
      "price",
      "nftContract",
      "itemId",
      "sold",
      "tokenId",
      "seller",
      "owner",
    ])
  )
    .filter(
      (item) => item.seller === walletAddress || item.owner === walletAddress
    )
    .sort((a, b) =>
      a.updatedAt < b.updatedAt ? 1 : b.updatedAt < a.updatedAt ? -1 : 0
    );

  // const data = fetchMarketItems?.map((item, index) => ({
  //   key: index,
  //   date: moment(item.updatedAt).format("DD-MM-YYYY HH:mm"),
  //   collection: item.nftContract,
  //   item: item.tokenId,
  //   tags: [item.seller, item.sold],
  //   price: item.price / ("1e" + 18),
  //   itemId: item.itemId,
  //   action: item,
  // }));

  // function getType(addrs, id) {
  //   const img = fetchItemImages.find(
  //     (element) => element.nftContract === addrs && element.tokenId === id
  //   );
  //   return img?.type;
  // }

  // const dataTest = [{ tags: ['test', false], price: '1 ETH' }];
  let key = 0;
  return (
    // <div style={{ display: "flex", position: "relative" }}>
    //   {/* <TransactionFilterBox /> */}
    //   <div className={styles.transactionWrapper}>
    //     <Table
    //       pagination={false}
    //       className={styles.table}
    //       columns={columns}
    //       // dataSource={NFTTransfers}
    //       // dataSource={dataTest}
    //     />
    //   </div>
    //   <Modal
    //     title={`Delist`}
    //     visible={visible}
    //     onCancel={() => setVisibility(false)}
    //     footer={[
    //       <Button
    //         key="1"
    //         loading={loading}
    //         className={styles.btnCancel}
    //         onClick={() => setVisibility(false)}
    //       >
    //         Cancel
    //       </Button>,
    //       // <Button key="2" type="primary" onClick={() => approve()}>Approve</Button>,
    //       <Button
    //         key="3"
    //         loading={loading}
    //         className={styles.btnDelist}
    //         type="primary"
    //         onClick={() => approveAll()}
    //       >
    //         Delist
    //       </Button>,
    //     ]}
    //   >
    //     <Spin spinning={loading}>
    //       <img
    //         alt="Delist NFT"
    //         src={
    //           // visible ?
    //           //   (
    //           //     getType(recordDelist.collection, recordDelist.item)?.includes("image")
    //           //     ?
    //           //     getImage(recordDelist.collection, recordDelist.item)
    //           //     :
    //           //     srcBlankImg
    //           //   )
    //           //   :
    //           getImage(recordDelist?.collection, recordDelist?.item)
    //         }
    //         style={{
    //           width: "250px",
    //           margin: "auto",
    //           borderRadius: "10px",
    //           marginBottom: "15px",
    //         }}
    //       />
    //     </Spin>
    //   </Modal>
    // </div>
    <div
      style={{
        maxWidth: "1200px",
        padding: "15px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h1 className={styles.title}>NFT Transfer</h1>
      <div className={styles.transactionWrapper}>
        <Skeleton loading={!NFTTransfers}>
          <Table
            className={styles.table}
            dataSource={NFTTransfers}
            columns={columns}
            rowKey={(record) => {
              key++;
              return `${record.transaction_hash}-${key}`;
            }}
            pagination={{
              total: data?.total,
              page_size: data?.page_size,
              // onChange: handlePageChange,
            }}
          />
        </Skeleton>
      </div>
    </div>
  );
}

export default NativeTransactions;
