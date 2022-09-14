import { Button, Col, Dropdown, Grid, Layout, Menu, Row } from "antd";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useChain, useMoralis } from "react-moralis";
import { Link, useLocation } from "react-router-dom";
import { AvaxLogo, BSCLogo, ETHLogo, PolygonLogo } from "../Chains/Logos";
import { HambugerBar } from "./IconHeader";
import RoutingMenu from "./RoutingMenu";
import styles from "./styles.module.css";
import { Dot } from "./TopMenuItem";
import logoManahubsStaking from "./Logo_Staking.svg";
import logoManahubsDex from "./Logo_Dex.svg";
import logoManahubsMKP from "./Logo_MKP.svg";
import DexLogo from "components/Icons/DexLogo";
// import GameLogo from "components/Icons/GameLogo";
import MarketplaceLogo from "components/Icons/MarketplaceLogo";

const { Header } = Layout;
const { useBreakpoint } = Grid;

const customStyles = {
  item: {
    display: "flex",
    alignItems: "center",
    height: "42px",
    fontWeight: "500",
    fontFamily: "Roboto, sans-serif",
    fontSize: "14px",
    padding: "0 20px",
  },
  button: {
    border: "2px solid rgb(231, 234, 243)",
    borderRadius: "12px",
    // marginLeft: "10px"
  },
};

const menuItems = [
  {
    key: "0x1",
    value: "Ethereum",
    icon: <ETHLogo />,
  },
  {
    key: "0x539",
    value: "Local Chain",
    icon: <ETHLogo />,
  },
  {
    key: "0x3",
    value: "Ropsten Testnet",
    icon: <ETHLogo />,
  },
  {
    key: "0x4",
    value: "Rinkeby Testnet",
    icon: <ETHLogo />,
  },
  {
    key: "0x2a",
    value: "Kovan Testnet",
    icon: <ETHLogo />,
  },
  {
    key: "0x5",
    value: "Goerli Testnet",
    icon: <ETHLogo />,
  },
  {
    key: "0x38",
    value: "Binance",
    icon: <BSCLogo />,
  },
  {
    key: "0x61",
    value: "BSC Testnet",
    icon: <BSCLogo />,
  },
  {
    key: "0x89",
    value: "Polygon",
    icon: <PolygonLogo />,
  },
  {
    key: "0x13881",
    value: "Mumbai",
    icon: <PolygonLogo />,
  },
  {
    key: "0xa86a",
    value: "Avalanche",
    icon: <AvaxLogo />,
  },
  {
    key: "0xa869",
    value: "Avalanche Testnet",
    icon: <AvaxLogo />,
  },
];

function MainHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [visileSubMenu, setVisileSubMenu] = useState(false);
  // const history = useHistory();
  const { pathname } = useLocation();

  const { chainId } = useChain();
  // const { isAuthenticated } = useMoralis();
  const [selected, setSelected] = useState({});
  const { isAuthenticated, account } = useMoralis();

  useEffect(() => {
    const defaultChain = menuItems.find((item) => item.key === "0x61");

    if (!chainId || !isAuthenticated || !account) {
      setSelected(defaultChain);
    } else {
      const newSelected = menuItems.find((item) => item.key === chainId);
      setSelected(newSelected);
    }
  }, [chainId, isAuthenticated, account]);

  const menu = (
    <Menu>
      {/* <Menu.Item key="1" icon={<UserOutlined />}>
        1st menu item
      </Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />}>
        2nd menu item
      </Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />}>
        3rd menu item
      </Menu.Item> */}
    </Menu>
  );

  const { sm, md, xs } = useBreakpoint();

  useEffect(() => {
    if (md && !isOpen) {
      setIsOpen(true);
    }
  }, [md, isOpen]);

  const handleClickSubMenu = () => {
    setVisileSubMenu(false);
  };

  const routePage = useMemo(() => {
    if (pathname.includes("game")) return "game";
    if (pathname.includes("dex")) return "dex";
    return "marketplace";
  }, [pathname]);

  return (
    <>
      <Header theme="dark" className={styles.header}>
        <Row className={styles.topBg} wrap>
          <div
            className={`${styles.topHeader} ${!md ? styles.topHeaderMd : ""}`}
          >
            <Col xs={12} sm={11} md={18} lg={16}>
              <div className={!md || xs || sm ? styles.hambugerWrapper : ""}>
                {!md && (
                  <HambugerBar onClick={() => setIsOpen((val) => !val)} />
                )}
                <div
                  className={`${styles.topMenuWrapper} ${!md ? styles.topMenuMdWrapper : ""
                    }`}
                >
                  {(md || routePage === "marketplace") && (
                    <div className={styles.topMenuIcon}>
                      <a href="/">
                        <div className={styles.topMenuIcon}>
                          <img src={logoManahubsMKP} />
                        </div>
                      </a>

                      {md && routePage === "marketplace" && (
                        <Dot className={styles.topMenuIconDot} />
                      )}
                    </div>
                  )}

                  {(md || routePage === "dex") && (
                    <div className={styles.topMenuIcon}>
                      <Link to="/dex">
                        <div className={styles.topMenuIcon}>
                          <img src={logoManahubsDex} />
                        </div>
                      </Link>

                      {md && routePage === "dex" && (
                        <Dot className={styles.topMenuIconDot} />
                      )}
                    </div>
                  )}

                  {(md || routePage === "game") && (
                    <div className={styles.topMenuIcon}>
                      <Link to="/game/dashboard">
                        <div className={styles.topMenuIcon}>
                          <img src={logoManahubsStaking} />
                        </div>
                      </Link>

                      {md && routePage === "game" && (
                        <Dot className={styles.topMenuIconDot} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Col>
            <Col xs={10} sm={10} md={4} lg={5}>
              <div>
                <Dropdown
                  overlay={menu}
                  className={styles.dropdown}
                  placement="bottom"
                >
                  <Button
                    key={selected?.key}
                    icon={selected?.icon}
                    style={{ ...customStyles.button, ...customStyles.item }}
                  >
                    <span className={styles.textChain} style={{ marginLeft: "5px" }}>{selected?.value}</span>
                  </Button>
                </Dropdown>
              </div>
            </Col>
          </div>
        </Row>

        <RoutingMenu
          isOpen={isOpen}
          setVisileSubMenu={setVisileSubMenu}
          visileSubMenu={visileSubMenu}
        />

        {!md && visileSubMenu && (
          <div className={styles.subMenuMobile}>
            <Link
              to="/collection/0xfde910FbaA9A6fDD5d3F80cCD44a54763DE2d9d0"
              className={styles.subMenuMobileLink}
              onClick={handleClickSubMenu}
            >
              <div
                className={clsx(styles.logoLink, {
                  [styles.logoActive]: routePage === "marketplace",
                })}
              >
                <MarketplaceLogo
                  onClick={() => setVisileSubMenu(true)}
                  className="icon-logo"
                />
              </div>
              <span className={styles.textLink}>Marketplace</span>
            </Link>

            <Link
              to="/dex"
              className={styles.subMenuMobileLink}
              onClick={handleClickSubMenu}
            >
              <div
                className={clsx(styles.logoLink, {
                  [styles.logoActive]: routePage === "dex",
                })}
              >
                <DexLogo
                  onClick={() => setVisileSubMenu(true)}
                  className="icon-logo"
                />
              </div>
              <span className={styles.textLink}>DEX</span>
            </Link>
            <Link
              to="/game/dashboard"
              className={styles.subMenuMobileLink}
              onClick={handleClickSubMenu}
              ư
            >
              <div
                className={clsx(styles.logoLink, {
                  [styles.logoActive]: routePage === "game",
                })}
              >
                <DexLogo
                  onClick={() => setVisileSubMenu(true)}
                  className="icon-logo"
                />
              </div>
              <span className={styles.textLink}>Staking</span>
            </Link>

            {/* <Link to="/marketplace">
              <Space
                onClick={handleClickSubMenu}
                className={clsx({
                  [styles.mainMenuActive]: routePage === "marketplace",
                })}
              >
                <img src={marketPlaceLogo} alt="marketplace logo" />
                <span>NFT Marketplace</span>
              </Space>
            </Link>

            <Link to="/dex">
              <Space
                onClick={handleClickSubMenu}
                className={clsx({
                  [styles.mainMenuActive]: routePage === "dex",
                })}
              >
                <img src={dexLogo} alt="dex logo" />
                <span>DEX</span>
              </Space>
            </Link>

            <Link to="/game">
              <Space
                onClick={handleClickSubMenu}
                className={clsx({
                  [styles.mainMenuActive]: routePage === "game",
                })}
              >
                <img src={gameLogo} alt="game logo" />
                <span>Game</span>
              </Space>
            </Link> */}
          </div>
        )}
      </Header>
    </>
  );
}

export default MainHeader;
