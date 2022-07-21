import { useMoralis, useERC20Balances } from "react-moralis";
import { Skeleton, Table } from "antd";
import { getEllipsisTxt } from "../helpers/formatters";
import styles from "./styles.module.css";

function ERC20Balance(props) {
  const { data: assets } = useERC20Balances(props);
  const { Moralis } = useMoralis();

  const columns = [
    {
      title: "",
      dataIndex: "logo",
      key: "logo",
      render: (logo) => (
        <img
          src={logo || "https://etherscan.io/images/main/empty-token.png"}
          alt="nologo"
          width="28px"
          height="28px"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => name,
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (symbol) => symbol,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (value, item) =>
        parseFloat(Moralis.Units.FromWei(value, item.decimals).toFixed(6)),
    },
    {
      title: "Address",
      dataIndex: "token_address",
      key: "token_address",
      render: (address) => getEllipsisTxt(address, 5),
    },
  ];

  return (
    <div
      style={{
        maxWidth: "1200px",
        padding: "15px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h1 className={styles.title}>Token Balances</h1>
      <div className={styles.balanceWrapper}>
        <Skeleton loading={!assets}>
          <Table
            className={styles.table}
            dataSource={assets}
            columns={columns}
            rowKey={(record) => {
              return record.token_address;
            }}
          />
        </Skeleton>
      </div>
    </div>
  );
}
export default ERC20Balance;
