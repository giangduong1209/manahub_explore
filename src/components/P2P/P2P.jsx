import USDTransfer from "./components/USDTransfer";
import BNBTransfer from "./components/BNBTransfer";
import { Card, Tabs } from "antd";

const styles = {
  title: {
    fontSize: "30px",
    fontWeight: "600",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    width: "450px",
    fontSize: "16px",
    fontWeight: "500",
  },
};

function P2P({ setV }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "0 0 2rem 0",
      }}
    >
      <Tabs defaultActiveKey="1" centered>
        <Tabs.TabPane tab={ <h1 style={{ color: "#e85443" }}>By VND</h1>} key="1">
          <Card style={styles.card}>
            <BNBTransfer />
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab={ <h1 style={{ color: "#e85443" }}>By USD</h1>} key="2">
          <Card style={styles.card}>
            <USDTransfer />
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default P2P;
