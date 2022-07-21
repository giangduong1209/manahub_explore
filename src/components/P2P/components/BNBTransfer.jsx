import { CreditCardOutlined } from "@ant-design/icons";
import { Button, Input, notification, Spin } from "antd";
import Text from "antd/lib/typography/Text";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import transferStyles from "./transferStyles.module.css";
import { useWeb3Transfer } from "react-moralis"; // useNFTBalances, 
import { FaAirbnb } from "react-icons/fa";
import { useMoralisDapp } from 'providers/MoralisDappProvider/MoralisDappProvider';
import { useHistory } from "react-router-dom";




const SERVER_HOST = process.env.REACT_APP_SERVER_HOST;
const WALLET_ADDRESS = process.env.REACT_APP_WALLET_ADDRESS;

const styles = {
  card: {
    alignItems: "center",
    width: "100%",
  },
  header: {
    textAlign: "center",
  },
  input: {
    width: "100%",
    outline: "none",
    fontSize: "16px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textverflow: "ellipsis",
    appearance: "textfield",
    color: "#041836",
    fontWeight: "700",
    border: "none",
    backgroundColor: "transparent",
  },
  select: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
  },
  textWrapper: { maxWidth: "80px", width: "100%" },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexDirection: "row",
  },
};

function Transfer() {
  const { Moralis } = useMoralis();
  const [isloading, setIsLoading] = useState(false);
  const [tx, setTx] = useState();
  const [amount, setAmount] = useState(0);
  const [bank, setBank] = useState();
  const [no, setNo] = useState();
  const [name, setName] = useState();
  const [balancePVND, setBalancePVND] = useState(0);
  // const { data: balance } = useNativeBalance();
  const { walletAddress } = useMoralisDapp();
  const history = useHistory();

  // add to env


  useEffect(() => {
    no && name && bank && amount ? setTx({ no, name, bank, amount }) : setTx();
  }, [no, name, bank, amount]);

  // useEffect(() => {
  //  if(amount === "" ||bank === ""||name === ""||no === ""){

  //  }else{

  //  }
  // }, [amount,no,bank,name]);


  // const { data : dataTrader } = queryTrader;
  // const queryItemImages = useMoralisQuery("ItemImages");

  useEffect( () => {
    async function getBalance() {
      // You can await here
      const options = { chain: 'BSC', address: walletAddress }
      const balances = await Moralis.Web3.getAllERC20(options);
      balances.forEach(bal => {
        if(bal.symbol === 'pVND'){
          let _balance = bal.balance / ("1e" + 18)
          setBalancePVND(_balance)
        }
      })
    }
    getBalance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress])

  async function handleOkClick() {
    setIsLoading(true)
    openNotification(3, 'Please wait... Transaction is progressing');
    // send ether to metapolis wallet
    // sending 0.5 tokens with 18 decimals
    const options = {
      type: "erc20",
      amount: Moralis.Units.Token(amount ? amount : 0, "18"),
      receiver: WALLET_ADDRESS,
      contractAddress: "0xA4389f795F5Ad3715bA1b153F82E89DD652Fe43D",
    };
    let result = await Moralis.transfer(options);
    if (result.status) {
      addNewTransaction();
    }
    return;
    // sendEth({
    //   throwOnError: true,
    //   onComplete: (tx) => {
    //     console.log('done sent token');
    //   },
    //   onSuccess: (tx) => {
    //     addNewTransaction()
    //   },
    //   onError: (err) => console.log('create transaction failed', err)
    // });
  }

  // eslint-disable-next-line no-unused-vars
  const { fetch: sendEth } = useWeb3Transfer({
    type: "native",
    amount: Moralis.Units.ETH(amount ? amount : 0),
    receiver: WALLET_ADDRESS
  });

  function addNewTransaction() {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Credentials': false,
        // 'Access-Control-Max-Age': 2592000,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          sender: walletAddress,
          bank: bank,
          account: no,
          name: name,
          amount: amount
        }
      )
    };
    fetch(SERVER_HOST.concat('/api/p2p-transaction/select-trader'), requestOptions)
      .then(res => {
        if (res.ok) {
          setIsLoading(false)
          openNotification(5, "Transation success")
          clearForm();
          history.push('/dex/transactions');
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }


  function openNotification(time, msg) {
    notification.open({
      placement: "top",
      message: msg,
      duration: time,
    });
  };

  function clearForm() {
    setAmount(0);
    setBank();
    setNo();
    setName();
  }

  return (
    <Spin spinning={isloading}>
      <div style={styles.card}>
        <div style={styles.tranfer}>
          <div style={styles.select}>
            <div style={styles.textWrapper}>
              <Text strong>Amount:</Text>
            </div>
            <Input
              size="large"
              suffix={<FaAirbnb />}
              value={amount}
              type={'number'}
              onChange={(e) => {
                setAmount(`${e.target.value}`);
              }}
            />
          </div>
          <p className={transferStyles.balances}
          >
            {balancePVND + ' pVND'}
          </p>
          <div style={styles.select}>
            <div style={styles.textWrapper}>
              <Text strong>Bank:</Text>
            </div>
            <Input
              size="large"
              prefix={<CreditCardOutlined />}
              value={bank}
              onChange={(e) => {
                setBank(`${e.target.value}`);
              }}
            />
          </div>

          <div style={styles.select}>
            <div style={styles.textWrapper}>
              <Text strong>No. Account:</Text>
            </div>
            <Input
              size="large"
              value={no}
              onChange={(e) => {
                setNo(`${e.target.value}`);
              }}
            />
          </div>
          <div style={styles.select}>
            <div style={styles.textWrapper}>
              <Text strong>Name:</Text>
            </div>
            <Input
              size="large"
              value={name}
              onChange={(e) => {
                setName(`${e.target.value}`);
              }}
            />
          </div>
          <Button
            type="text"
            size="large"
            className={
              !tx ? transferStyles.transferBtn2 : transferStyles.transferBtn
            }
            onClick={() => handleOkClick()}
            disabled={!tx}
          >
            OK
          </Button>
        </div>
      </div>
    </Spin>
  );
}

export default Transfer;
