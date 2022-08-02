import { FireFilled, GiftFilled, TrophyFilled } from "@ant-design/icons";
import { Layout, Tabs, Grid } from "antd";
import "antd/dist/antd.less";
import DEX from "components/DEX";
import ERC20Balance from "components/ERC20Balance";
import ERC20Transfers from "components/ERC20Transfers";
import Explore from "components/Explore";
import Gamify from "components/Gamify";
// import Home from "components/Home";
import MainFooter from "components/MainFooter";
import MainHeader from "components/MainHeader";
import NFTBalance from "components/NFTBalance";
// import NFTTokenIds from 'components/NFTTokenIds';
import Ramper from "components/Ramper";
import Wallet from "components/Wallet";
import NativeTransactions from "components/NativeTransactions";
import Collection from "components/Collection";
import MyCollection from "components/MyCollection";
import { useEffect, useCallback } from "react";
import { useMoralis } from "react-moralis";
// import Account from "components/Account/Account";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import "./style.less";
import Game from "components/Game";
// import P2P from "components/P2P";
// import P2PTable from "components/P2PTable";
import NFTCreate from "components/NFTCreate";
import Profile from "components/Profile";
import ViewNFT from 'components/ViewNFT';
import ViewNFTAuction from "components/ViewNFTAuction";
const { useBreakpoint } = Grid;

const App = ({ isServerInfo }) => {
  // const styles = {
  //   header: {
  //     textAlign: "center",
  //   },
  // };
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();
  const { Moralis } = useMoralis();
  // const [inputValue, setInputValue] = useState('explore');
  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
     Moralis.enableWeb3();

    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);
  const screens = useBreakpoint();

  // handle filter position
  const handleScroll = useCallback(
    (e) => {
      if (!screens.md) {
        const screenHeight = window.innerHeight;
        const offsetTop = e.target.scrollTop;
        const footer = document.querySelector(".ant-layout-footer");
        const rest = screenHeight - footer.offsetHeight;
        const filters = document.querySelectorAll(".filter-container");

        const footerOffset = footer.offsetTop;

        // console.log({ screenHeight, offsetTop, rest, footerOffset });

        if (e.target.scrollTop >= footerOffset - rest - footer.offsetHeight) {
          filters.forEach((filter) => {
            filter.style.bottom = (offsetTop-footerOffset + rest + footer.offsetHeight) + "px";
          });
        } else {
          filters.forEach((filter) => {
            filter.style.bottom = null;
          });
        }
      }
    },
    [screens.md]
  );
  // const [isPolis, setIsPolis] = useState("1");
  return (
    <Layout
      className="layout"
      style={{
        height: "100vh",
        minHeight: "100vh",
        overflow: "auto",
        background: "#F3F3F3", // will be define
      }}
      onScroll={handleScroll}
    >
      <Router>
        <MainHeader />
        <div>
          <Switch>
            <Route exact path="/gamify">
              <Tabs defaultActiveKey="1" tabPosition="left">
                <Tabs.TabPane
                  tab={
                    <span>
                      <FireFilled />
                      My Runes
                    </span>
                  }
                  key="1"
                >
                  <Gamify tab="runes" />
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={
                    <span>
                      <TrophyFilled /> Leaderboard
                    </span>
                  }
                  key="2"
                >
                  <Gamify tab="leaderboard" />
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={
                    <span>
                      <GiftFilled /> Rewards
                    </span>
                  }
                  key="3"
                >
                  <Gamify tab="rewards" />
                </Tabs.TabPane>
              </Tabs>
            </Route>
            <Route path="/dex/transfers">
              <Wallet />
            </Route>
            <Route path="/dex/balances">
              <ERC20Balance />
            </Route>
            <Route path="/dex/fiat">
              <Ramper />
            </Route>
            <Route path="/dex/transactions">
              <Tabs defaultActiveKey="0" centered>
                <Tabs.TabPane tab={<span>ERC20 Transactions</span>} key="1">
                  <ERC20Transfers />
                </Tabs.TabPane>
                {/* <Tabs.TabPane tab={<span>P2P Transactions</span>} key="2">
                  <P2PTable />
                </Tabs.TabPane> */}
              </Tabs>
            </Route>
            <Route path="/dex">
            <Tabs defaultActiveKey="1" style={{ alignItems: "center" }}>
                <Tabs.TabPane tab={<span>Ethereum</span>} key="1">
                  <DEX chain="eth" />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>Binance Smart Chain</span>} key="2">
                  <DEX chain="bsc" />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>Polygon</span>} key="3">
                  <DEX chain="polygon" />
                </Tabs.TabPane>
              
              </Tabs>
            </Route>
            <Route path="/create-nft">
              <NFTCreate />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/view-auction/:contract/:id/:deployContract">
              <ViewNFTAuction/>
            </Route>
            {/* <Route path="/nftMarket">
              <NFTTokenIds
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
            </Route> */}
            <Route path="/nftBalance">
              <NFTBalance />
            </Route>
            <Route path="/transaction">
              <NativeTransactions />
            </Route>
            <Route path="/explore">
              <Explore />
            </Route>
            <Route path="/collection/:addrs">
              <Collection />
            </Route>
            <Route path="/my-collection">
              <MyCollection />
            </Route>
            {/* <Route path="/contract">
              <Contract />
            </Route> */}
            <Route path="/dex">
              <Game />
            </Route>
            <Route path="/dex/:type">
              <Game />
            </Route>

            <Route path="/view-nft/:contract/:id">
              <ViewNFT/>
            </Route>

            <Route path="/game/:type">
              <Game />
            </Route>

            <Route path="/game">
              <Redirect to="/game/buy-properties" />
            </Route>
            <Route path="/">
              {/* <Home /> */}
              <Redirect to="/collection/0xfde910FbaA9A6fDD5d3F80cCD44a54763DE2d9d0" />
            </Route>
            <Route path="/ethereum-boilerplate">
              <Redirect to="/gamify" />
            </Route>

            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>
          </Switch>
        </div>

        <MainFooter />
      </Router>
    </Layout>
  );
};

export default App;
