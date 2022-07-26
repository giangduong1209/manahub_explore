import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Skeleton, Table, Tag, Button, Modal, notification, Row, Col, Input } from "antd";
import styles from "./styles.module.css";
import { useMoralisDapp } from 'providers/MoralisDappProvider/MoralisDappProvider';
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import db from '../../firebase';
import ModalDeposit from "./ModalDeposit";
import ModalTransfer from "./ModalTransfer";
import { getEllipsisTxt } from "../../helpers/formatters";
import moment from 'moment'

const SERVER_HOST = process.env.REACT_APP_SERVER_HOST;

function ERC20Transfers() {
  // const { ERC20Transfers, chainId } = useERC20Transfers();
  const { walletAddress } = useMoralisDapp();
  const [listTrans, setListTrans] = useState([]);
  const [visible, setVisibility] = useState(false);
  const [transaction, setTransaction] = useState();
  const [senderList, setSenderList] = useState([]);
  const [walletAddressList, setWalletAddressList] = useState([]);
  const [isFormDeposit, setFormDeposit] = useState(false);
  const [isFormTransfer, setFormTransfer] = useState(false);

  function toUpper(str) {
    return str
      ?.toLowerCase()
      .split(" ")
      .map(function (Word) {
        return Word[0].toUpperCase() + Word.substr(1);
      })
      .join(" ");
  }

  const columns = [
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (time) => moment(time).format('YYYY-MM-DD HH:mm:ss').concat(' GMT +7')
    },
    {
      title: "From",
      dataIndex: "sender",
      key: "sender",
      render: (sender) => getEllipsisTxt(sender, 8),
    },
    {
      title: "",
      dataIndex: "isSender",
      key: "isSender",
      render: (isSender) =>
        isSender ? (
          <Tag style={{ borderColor: "#FEA013" }}>
            {" "}
            <div className={styles.tagIn} style={{ color: "#FEA013" }}>
              OUT
            </div>
          </Tag>
        ) : (
          <Tag style={{ borderColor: "#FEA013" }}>
            {" "}
            <div className={styles.tagIn} style={{ color: "#FEA013", padding: '0 5px' }}>
              IN
            </div>
          </Tag>
        ),
    },
    {
      title: "To",
      dataIndex: "wallet_address",
      key: "wallet_address",
      render: (wallet_address) => getEllipsisTxt(wallet_address, 8),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => amount,
    },
    {
      title: "Direction",
      dataIndex: "direction",
      className: "bg-green",
      key: "direction",
      render: (direction) => toUpper(direction),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (tags, record) => (
        <div className={styles.statusCol}>
          <div>
            {tags.map((tag) => {
              let color = "geekblue";
              let status = "buy";
              if (tag === "waiting") {
                color = "#444";
                status = "waiting";
              } else if (tag === "done") {
                color = "green";
                status = "done";
              } else if (tag === "cancel") {
                color = "#b5473a";
                status = "cancel";
              } else if (tag === "progress") {
                color = "#E7A600";
                status = "In Progress";
              }

              return (
                <Tag
                  style={{ borderColor: color }}
                  className={styles.tagStatus}
                  key={status}
                >
                  <div
                    style={{
                      width: "100%",
                      textAlign: "center",
                      color: color,
                    }}
                  >
                    {status.toUpperCase()}
                  </div>
                </Tag>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "action",
      dataIndex: "action",
      render: (record) => (
        <div className={styles.statusCol}>
          {
            <Button
              className={styles.btnView}
              onClick={() => handleViewClick(record)}
              size="small"
              type="default"
            >
              View
            </Button>
          }
        </div>
      ),
    },
  ];

  function handleViewClick(record) {
    setTransaction({ ...record });
    setVisibility(true);

    // handle form send token
    if (
      record?.isSender &&
      record?.status[0] === "progress" &&
      record?.isTransfer
    ) {
      openFormSentToken();
    }
    // handle form deposit
    if (
      !record?.isSender &&
      record?.status[0] === "progress" &&
      !record?.isTransfer
    ) {
      openFormDeposit();
    }
  }
  
  // transaction IN
  useEffect(() => {
    const queryWalletAddress = query(
      collection(db, "P2PTransactions"),
      where("wallet_address", "==", walletAddress.toLowerCase()),
      orderBy("createdAt", "desc")
    );
    onSnapshot(queryWalletAddress, (snapshot) => {
      setWalletAddressList(
        snapshot.docs.map((tk) => ({
          ...tk.data(),
          id: tk.id,
          isSender:
            tk.data().wallet_address === walletAddress.toLowerCase()
              ? false
              : true,
          amount: tk.data().amount +' '+ tk.data().token,
          action: {
            ...tk.data(),
            id: tk.id,
            isSender:
              tk.data().wallet_address === walletAddress.toLowerCase()
                ? false
                : true,
          },
        }))
      );
    });
  }, [walletAddress]);

  // transaction OUT
  useEffect(() => {
    const querySender = query(collection(db, 'P2PTransactions'), 
      where("sender", "==", walletAddress.toLowerCase()),
      orderBy("createdAt", "desc")
    );
    onSnapshot(querySender, (snapshot) => {
      setSenderList(
        snapshot.docs.map((tk) => ({
          ...tk.data(),
          id: tk.id,
          isSender:
            tk.data().sender === walletAddress.toLowerCase() ? true : false,
          amount: tk.data().amount +' '+ tk.data().token,
          action: {
            ...tk.data(),
            id: tk.id,
            isSender:
              tk.data().sender === walletAddress.toLowerCase() ? true : false,
          },
        }))
      );
    });
  }, [walletAddress]);

  useEffect(() => {
    setListTrans([]);
    // Transaction Out
    if(senderList.length > 0){
      senderList.filter(trans => trans.sender === walletAddress.toLowerCase())
    }
    // Transaction In
    if(walletAddressList.length > 0){
      walletAddressList.filter(trans => trans.wallet_address === walletAddress.toLowerCase())
    }
    
    setListTrans([...senderList, ...walletAddressList]);
  }, [senderList, walletAddressList, walletAddress]);

  function handleAccept() {
    const requestOptions = {
      method: 'PUT',
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':'OPTIONS, GET, POST, PUT',
        'Access-Control-Max-Age': 2592000,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(
        {
          transactionId: transaction.id, // update trans status
        }
      )
    };

    let URL = SERVER_HOST.concat("/api/p2p-transaction/handle-accept");
    if(transaction.token === 'pUSD'){
      URL = SERVER_HOST.concat("/api/p2p-transaction-usd/handle-accept");
    }

    fetch( URL, requestOptions )
      .then((res) => {
        if (res.ok) {
          res.json().then(data=>{
            console.log(data);
          })
        }
      })
      .catch((error) => {
        console.log("handleAccept", error);
      });

    // socketRef.current.emit('SendDataToSeller', 'Accepted');
    setVisibility(false);
    setFormDeposit(true);
  }

  function handleReject() {
    const requestOptions = {
      method: 'PUT',
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':'OPTIONS, GET, POST, PUT',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Max-Age': 2592000,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(
        {
          transactionId: transaction.id, // update trans status
          walletAddress: walletAddress.toLowerCase() // update trader status
        }
      )
    };
    let URL = SERVER_HOST.concat("/api/p2p-transaction/handle-reject");
    if(transaction.token === 'pUSD'){
      URL = SERVER_HOST.concat("/api/p2p-transaction-usd/handle-reject");
    }

    fetch( URL, requestOptions )
      .then((res) => {
        if (res.ok) {
          notification.open({
            placement: "top",
            message: "Transaction Rejected",
            duration: 3,
          });
        }
      })
      .catch((error) => {
        console.log("handleReject", error);
      });

    setVisibility(false);
  }

  function closeModalChat(val) {
    setFormDeposit(val);
  }

  function closeModalTransfer(val) {
    setFormTransfer(val);
  }

  function openFormSentToken() {
    setVisibility(false);
    setFormDeposit(false);
    setFormTransfer(true);
  }

  function openFormDeposit() {
    setVisibility(false);
    setFormTransfer(false);
    setFormDeposit(true);
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        padding: "15px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h1 className={styles.title}>P2P Transactions</h1>
      <Skeleton loading={!listTrans}>
        <div className={styles.transactionWrapper}>
          <Table
            className={styles.table}
            columns={columns}
            dataSource={listTrans}
            // rowClassName={(record, index) => (record.isNew === true ?  "blue-color" : "green")}
            rowClassName="bg-red"
          />
        </div>
        <Modal
          title={`Transaction`}
          visible={visible}
          onCancel={() => setVisibility(false)}
          footer={
            transaction?.isSender
              ? transaction?.status[0] === "cancel" ||
                transaction?.status[0] === "done" ||
                transaction?.status[0] === "waiting" ||
                (transaction?.status[0] === "progress" &&
                  !transaction?.isTransfer)
                ?  null 
                
                : [
                    <Button
                      key="1"
                      className={styles.buttonTransfer}
                      onClick={() => {
                        handleReject();
                      }}
                    >
                      Reject
                    </Button>,
                    <Button
                      key="3"
                      className={styles.btnAccept}
                      type="primary"
                      onClick={() => {
                        handleAccept();
                      }}
                    >
                      Accept
                    </Button>
                  ]
              : [
                  transaction?.status[0] === "cancel" ||
                  transaction?.status[0] === "done" ||
                  (transaction?.status[0] === "progress" &&
                    transaction?.isTransfer)
                    ? null
                    : [
                        <Button
                          key="1"
                          className={styles.buttonTransfer}
                          onClick={() => {
                            handleReject();
                          }}
                        >
                          Reject
                        </Button>,
                        <Button
                          key="3"
                          className={styles.btnAccept}
                          type="primary"
                          onClick={() => {
                            handleAccept();
                          }}
                        >
                          Accept
                        </Button>
                      ]
                    ]
          }
        >
          <Row>
            <Col span={5}>
              <label className="floating-label">Name</label>
            </Col>
            <Col span={19}>
              <Input
                className="floating-label-field"
                value={`${transaction?.name}`}
                // placeholder={data.placeholder}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={5}>
              <label className="floating-label">Bank</label>
            </Col>
            <Col span={19}>
              <Input
                className="floating-label-field"
                value={`${transaction?.bank}`}
                // placeholder={data.placeholder}

              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={5}>
              <label className="floating-label">Account</label>
            </Col>
            <Col span={19}>
              <Input
                className="floating-label-field"
                value={`${transaction?.account}`}
                // placeholder={data.placeholder}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={5}>
              <label className="floating-label">Amount</label>
            </Col>
            <Col span={19}>
              <Input
                className="floating-label-field"
                value={`${transaction?.amount}`}
                // placeholder={data.placeholder}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={5}>
              <label className="floating-label">Direction</label>
            </Col>
            <Col span={19}>
              <Input
                className="floating-label-field"
                value={`${toUpper(transaction?.direction)}`}
                // placeholder={data.placeholder}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={5}>
              <label className="floating-label">Status</label>
            </Col>
            <Col span={19}>
              <Input
                className="floating-label-field"
                value={` ${toUpper(transaction?.status[0])}`}
                // placeholder={data.placeholder}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={5}>
              <label className="floating-label">Deposit</label>
            </Col>
            <Col span={19}>
              <Input
                className="floating-label-field"
                value={` ${transaction?.isTransfer ? "Deposited" : "Not yet"}`}
                // placeholder={data.placeholder}
              />
            </Col>
          </Row>
        </Modal>
      </Skeleton>
      {isFormDeposit && (
        <ModalDeposit
          closeModalChat={(e) => closeModalChat(e)}
          transaction={transaction}
        />
      )}
      {isFormTransfer && (
        <ModalTransfer
          closeModalTransfer={(e) => closeModalTransfer(e)}
          transaction={transaction}
        />
      )}
    </div>
  );
}

export default ERC20Transfers;
