import React from "react";
import styless from "./ViewNFT.module.css";
import { Table } from "antd";
import {
  // useMoralisWeb3Api,
  useMoralisQuery,
  useMoralis
} from "react-moralis";
import { useState, useEffect } from "react";
import moment from "moment";

const HistoryBox = ({ information }) => {
  const { Moralis } = useMoralis();
  // const Web3Api = useMoralisWeb3Api();
  const [dataLs, setDataLs] = useState([]);
  const queryListedItems = useMoralisQuery("AuctionBid");
  
  const columns = [
    // {
    //   title: "Event",
    //   dataIndex: "event",
    //   key: "event",
    // },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "From",
      dataIndex: "from",
      key: "fromAddress",
    },
    {
      title: "To",
      dataIndex: "to",
      key: "toAddress",
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (to) => <a style={{color:'#FEA013'}}>{to}</a>
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "createdAt",
    },
  ];

  let { data } = queryListedItems
  useEffect(() => {
    if(information?.auctionContract) {
      getTransaction()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  
  const getTransaction = async () => {

    const query = new Moralis.Query('AuctionBid')
    query.equalTo('toAddress', information?.auctionContract)
    const object = await query.find();
    let list = [];
    if(object.length > 0){
      list = object.map((ele) => {
        let item = {
          date: moment(ele.attributes.createdAt).format('MMM Do YYYY'),
          from: ele.attributes.fromAddress.substring(0, 5) + '...' + ele.attributes.fromAddress.substring(ele.attributes.fromAddress.length, ele.attributes.fromAddress.length - 5),
          to: ele.attributes.toAddress.substring(0, 5) + '...' + ele.attributes.toAddress.substring(ele.attributes.toAddress.length, ele.attributes.toAddress.length - 5),
          price: ele.attributes.price / ('1e' + 18)
        }
        return item
      })
    }
    // setData(object)
      setDataLs(list)
      console.log(list);
  }
  return (
    <div className={styless.cardhistorybox}>
      <div className={styless.title} style={{ fontFamily: "GILROY " }}>
        History
      </div>
      <br />
      <Table  className={styless.table} dataSource={dataLs} columns={columns} />
    </div>
  );
};

export default HistoryBox;
