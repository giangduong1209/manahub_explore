import { Modal, Input, Button, Spin, Row, Col, notification } from "antd";
import { useRef, useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import styles from "./styles.module.css";
// import { getDoc, doc } from "firebase/firestore";
// import db from "../../firebase";
import Countdown from 'react-countdown';


const SERVER_HOST = process.env.REACT_APP_SERVER_HOST;

function ModalDeposit(props) {
    const { transaction } = props
    const socketRef = useRef();
    const [isLoading, setLoading] = useState(false);
    // const [transactionInfo, setTranstionInfo] = useState({});
    
    function toUpper(str) {
      return str
        ?.toLowerCase()
        .split(" ")
        .map(function (Word) {
          return Word[0].toUpperCase() + Word.substr(1);
        })
        .join(" ");
    }

  useEffect(() => {
    socketRef.current = socketIOClient.connect(SERVER_HOST);

    socketRef.current.on("getId", (data) => {
      // setId(data)
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

    function close() {
        props.closeModalChat(false);
    }

    // useEffect(() => {
    //   getDoc(doc(db, 'P2PTransactions', transaction.id))
    //   .then(rs=> {
    //     setTranstionInfo({...rs.data()})
    //   })
    //   .catch(err => console.log('err', err))
    // }, [transaction.id]);

    function handleTransfer() {
        setLoading(true)
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT',
                'Access-Control-Max-Age': 2592000,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    transactionId: transaction.id, // update trans status
                }
            )
        };

        // Send sms to the Sender
        // "Transfered"
        let URL = SERVER_HOST.concat("/api/p2p-transaction/update-transfer-status");
        if(transaction.token === 'pUSD'){
          URL = SERVER_HOST.concat("/api/p2p-transaction-usd/update-transfer-status");
        }
        
        fetch(URL, requestOptions)
            .then(res => {
                if (res.ok) {
                  res.json().then(data => {
                    if(data.status){
                      notification.open({
                        placement: "top",
                        message: data.message,
                        duration: 5
                      })
                    } else {
                      notification.open({
                        placement: "top",
                        message: data.message,
                        duration: 5
                      })
                    }
                  })
                    setLoading(false)
                    close()
                }
            })
            .catch((error) => {
                console.log('handleReject', error);
            });
    }

  return (
    <Modal
      title={<div style={{width:'100%',fontSize:'20px',fontWeight:'Bold',textAlign:'center'}} >Deposit</div>}
      centered
      visible={true}
      onOk={() => close()}
      onCancel={() => close()}
      width={1000}
      footer={<div style={{width:'100%',fontSize:'20px',fontWeight:'Bold',textAlign:'center',color:'#f27252'}} ><Countdown color='red' date={ Date.now()  + 90000}/> </div>}
    >
<Spin spinning={isLoading}>
      <Row>
        <Col span={12}>
          <h3 style={{ color: "#e85443" }}>Sender Info</h3>
          <br />
          <Row>
            <Col span={5}>
              <label className="floating-label">Name</label>
            </Col>
            <Col span={18}>
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
            <Col span={18}>
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
            <Col span={18}>
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
            <Col span={18}>
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
            <Col span={18}>
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
            <Col span={18}>
              <Input
                className="floating-label-field"
                value={` ${toUpper(transaction?.status[0])}`}
                // placeholder={data.placeholder}
              />
            </Col>
          </Row>
          <br />
          <Col>
            <div style={{ width: "100%", textAlign: "center" }}>
              <Button
                onClick={handleTransfer}
                style={{ textAlign: "right" }}
                className={styles.buttonTransfer}
                type="primary"
              >
                {"Transferred, notify seller"}
              </Button>
            </div>
          </Col>
        </Col>
        <Col span={12}>
          <h3 style={{ color: "#e85443" }}>Chatting</h3>
          <br />
          {/* <div className={styles.boxChatMessage}></div> */}
          <br />
          <Input type={"text"}  style={{height:'300px',marginTop:'-20px'}}/>
          <br />
          <br/>
          <div style={{ width: "100%", textAlign: "right" }}>
            <Button type="primary" className={styles.buttonTransfer}>Send</Button>
          </div>
        </Col>
      </Row>
      </Spin>
    </Modal>
  );
}

export default ModalDeposit;
