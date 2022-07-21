import { Modal, Input, Button, Radio, Row, Col, notification, Spin } from "antd";
import { useState, useEffect } from "react";
import {
  getDoc,
  doc
} from "firebase/firestore";
import db from "../../firebase";
// import Web3 from 'web3'
import styles from './styles.module.css'
// let Tx = require('ethereumjs-tx').Transaction
// var Tx = require('@ethereumjs/tx').Transaction;


const SERVER_HOST = process.env.REACT_APP_SERVER_HOST;

function ModalTransfer(props) {
    const { transaction } = props
    const [received, setReceived] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [transactionInfo, setTranstionInfo] = useState({});


    useEffect(() => {
      getDoc(doc(db, 'P2PTransactions', transaction.id))
      .then(rs=> {
        setTranstionInfo({...rs.data()})
      })
      .catch(err => console.log('err', err))
    }, [transaction.id]);

    
    function close() {
        props.closeModalTransfer(false);
    }

    function updateTransactionStatus() {

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
        let URL = SERVER_HOST.concat("/api/p2p-transaction/handle-payment-received");
        if(transaction.token === 'pUSD'){
          URL = SERVER_HOST.concat("/api/p2p-transaction-usd/handle-payment-received");
        }
        
        fetch(URL, requestOptions)
            .then(res => {
                if (res.ok) {
                    notification.open({
                        placement: "top",
                        message: 'Completed',
                        duration: 5
                    })
                    setLoading(false);
                    setTimeout(()=>{
                        close();
                    }, 1000)
                }
            })
            .catch((error) => {
                console.log('updateTransactionStatus', error);
            });
    }

    async function handlePaymentReceived() {

        if (received) {
            notification.open({
                placement: "top",
                message: 'Waiting for transferring Tokens',
                duration: 3,
            });
            setLoading(true)
            updateTransactionStatus(); 
            // eslint-disable-next-line no-unreachable
            // let web3 = new Web3('https://rinkeby.infura.io/v3/');
            // web3.eth.setProvider(Web3.givenProvider);

            // var privateKey = Buffer.from(SECRET_KEY, 'hex');

            // let nonce = await web3.eth.getTransactionCount(WALLET_ADDRESS, 'pending')
            // const newNonce = web3.utils.toHex(nonce.toString(16))

            // var rawTx = {
            //     nonce: newNonce,
            //     gas: web3.utils.toHex(6000000),
            //     gasPrice: web3.utils.toHex(web3.utils.toWei('15', 'gwei')),
            //     to: transaction.wallet_address,
            //     value: web3.utils.toHex(web3.utils.toWei(transaction.amount, "ether"))
            // }

            // var tx = new Tx(rawTx, { 'chain': 'rinkeby' });
            // tx.sign(privateKey);
            // var serializedTx = tx.serialize();

            // web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
            //     .on('receipt', receipt => {
            //         if (receipt?.status) {
                         
            //         }

            //     })
            //     .on('error', err => {
            //         setLoading(false);
            //         notification.open({
            //             placement: "top",
            //             message: `Something wrongs, Please contact to the Metapolis`,
            //             duration: 5
            //         })
            //     });

        } else {
            notification.open({
                placement: "top",
                message: 'Your notification has been accepted.'
            });
        }

    }

    function onReceivedChange(e) {
        setReceived(e.target.value)
    }

  return (
    <Modal
      title={<div style={{width:'100%',fontSize:'20px',fontWeight:'Bold',textAlign:'center'}} >Transfer</div>}
      centered
      visible={true}
      onOk={() => close()}
      onCancel={() => close()}
      width={1000}
      footer={null}
    >
      <Spin spinning={isLoading}>
        <Row>
          <Col span={12}>
            <Row>
              <Col span={5}>
                <label className="floating-label">Wallet</label>
              </Col>
              <Col span={18}>
                <Input
                  className="floating-label-field"
                  value={`${transactionInfo.wallet_address}`}
                  // placeholder={data.placeholder}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={5}>
                <label className="floating-label">Crypto amount</label>
              </Col>
              <Col span={18}>
                <Input
                  className="floating-label-field"
                  value={`${transactionInfo.amount}`}
                  // placeholder={data.placeholder}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={5}>
                <label className={styles.buttonView}>Fiat amount</label>
              </Col>
              <Col span={18}>
                <Input
                  className="floating-label-field"
                  value={`...`}
                  // placeholder={data.placeholder}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={5}>
                <label className="floating-label">Price</label>
              </Col>
              <Col span={18}>
                <Input
                  className="floating-label-field"
                  value={` ...`}
                  // placeholder={data.placeholder}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={5}>
                <label className="floating-label">Deposit</label>
              </Col>
              <Col span={18}>
                <Input
                  className="floating-label-field"
                  value={` ${
                    transactionInfo?.isTransfer ? "Deposited" : "Not yet"
                  }`}
                  // placeholder={data.placeholder}
                />
              </Col>
            </Row>
            
            <div >
              <Radio.Group
                onChange={(e) => onReceivedChange(e)}
                value={received}
                className={styles.radioGroup}
              >
                <Radio value={false} className={styles.radioGroupItem}>
                  {"I have not received payment from the buyer"}
                </Radio>
                <Radio value={true} className={styles.radioGroupItem}>
                  {
                    "I have received the correct payment amount and confirm to release my crypto"
                  }
                </Radio>
              </Radio.Group>
            </div>
            <div style={{ width: "100%", textAlign: "center" }}>
              <Button  className={styles.buttonTransfer} onClick={() => handlePaymentReceived()}>
                {"Confirm"}
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <h3 style={{ color: "#e85443" }}>Chatting</h3>
            <br />
            {/* <div className={styles.boxChatMessage} style={{marginTop:'-0px'}}></div> */}
            <br />
            <Input type={"text"}  style={{height:'260px',marginTop:'-15px'}}/>
            <br />
            <br />
            <div style={{ width: "100%", textAlign: "right",marginTop:'-25px' }}>
              <Button className={styles.buttonTransfer}>
                Send
              </Button>
            </div>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
}

export default ModalTransfer;
