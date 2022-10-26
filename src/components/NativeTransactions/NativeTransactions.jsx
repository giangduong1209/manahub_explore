import { Grid, Table, Tag, Space, Modal, Button, Spin } from "antd";
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

function NativeTransactions() {
  const { getNativeTransations, data, chainId, error, isLoading, isFetching } =
    useNativeTransactions();
  const { walletAddress, marketAddress, contractABI } = useMoralisDapp();
  const contractABIJson = JSON.parse(contractABI);
  const queryItemImages = useMoralisQuery("ItemImages");
  const { nativeTransactions } = useNativeTransactions();
  const { Moralis, authenticate } = useMoralis();
  const history = useHistory();

  // useEffect(() => {}, [nativeTransactions]);
  const { useBreakpoint } = Grid;
  const { sm } = useBreakpoint();
  const contractProcessor = useWeb3ExecuteFunction();
  const [visible, setVisibility] = useState(false);
  const [recordDelist, setRecordDelist] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chainId) {
      getNativeTransations({ params: chainId });
    }
    console.log("data", data);
  }, [chainId]);

  const fetchItemImages = JSON.parse(
    JSON.stringify(queryItemImages.data, [
      "nftContract",
      "tokenId",
      "name",
      "image",
    ])
  );

  const addrsList = [];

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: !sm ? "60px" : "auto",
    },
    {
      title: "Item",
      key: "item",
      render: (text, record) => (
        <Space size="middle">
          <img
            src={getImage(record.collection, record.item)}
            style={{ width: "40px", height: "40px", borderRadius: "4px" }}
            alt="info"
          />
          <span>#{record.item}</span>
        </Space>
      ),
    },
    {
      title: "Collection",
      key: "collection",
      render: (text, record) => (
        <Space size="middle">
          <span>{getName(record.collection, record.item)}</span>
        </Space>
      ),
    },
    {
      title: "Transaction Status",
      key: "tags",
      dataIndex: "tags",
      render: (tags, record) => (
        <div className={styles.statusCol}>
          <div>
            {tags.map((tag) => {
              let color = "geekblue";
              let status = "Buy";
              if (tag === false) {
                color = "#444";
                status = "Waiting";
              } else if (tag === true) {
                color = "green";
                status = "Confirmed";
              }
              if (tag === walletAddress) {
                status = "Sell";
              }
              return (
                <Tag
                  color={color}
                  className={`custom-tag tag-${status}`}
                  key={status}
                >
                  {status.toUpperCase()}
                </Tag>
              );
            })}
          </div>
          <span className={styles.resPrice}>{record.price}</span>
        </div>
      ),
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
      render: (e) => (
        <Space size="middle">
          {/* <PolygonCurrency/> */}
          <span style={{ fontSize: "14px", fontWeight: 700 }}>{e}</span>
        </Space>
      ),
      responsive: ["md"],
    },
    {
      render: (_, { tags }) => {
        return tags.some((tag) => tag === walletAddress) ? (
          <span
            className={styles.btnDelete}
            onClick={() => handleDelistClick(_)}
          >
            <DeleteOutlined />
          </span>
        ) : null;
      },
      width: "30px",
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

  return (
    <div style={{ display: "flex", position: "relative" }}>
      {/* <TransactionFilterBox /> */}
      <div className={styles.transactionWrapper}>
        <Table
          pagination={false}
          className={styles.table}
          columns={columns}
          // dataSource={data}
          // dataSource={dataTest}
        />
      </div>
      <Modal
        title={`Delist`}
        visible={visible}
        onCancel={() => setVisibility(false)}
        footer={[
          <Button
            key="1"
            loading={loading}
            className={styles.btnCancel}
            onClick={() => setVisibility(false)}
          >
            Cancel
          </Button>,
          // <Button key="2" type="primary" onClick={() => approve()}>Approve</Button>,
          <Button
            key="3"
            loading={loading}
            className={styles.btnDelist}
            type="primary"
            onClick={() => approveAll()}
          >
            Delist
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <img
            alt="Delist NFT"
            src={
              // visible ?
              //   (
              //     getType(recordDelist.collection, recordDelist.item)?.includes("image")
              //     ?
              //     getImage(recordDelist.collection, recordDelist.item)
              //     :
              //     srcBlankImg
              //   )
              //   :
              getImage(recordDelist?.collection, recordDelist?.item)
            }
            style={{
              width: "250px",
              margin: "auto",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          />
        </Spin>
      </Modal>
    </div>
  );
}

export default NativeTransactions;
