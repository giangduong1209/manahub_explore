import { SearchOutlined } from '@ant-design/icons';
import { Grid, Input, Menu } from 'antd';
import clsx from 'clsx';
import Account from 'components/Account/Account';
import DexLogo from 'components/Icons/DexLogo';
import GameLogo from 'components/Icons/GameLogo';
import MarketplaceLogo from 'components/Icons/MarketplaceLogo';
import { NavLink } from 'react-router-dom';
import { Link, matchPath, useHistory, useLocation } from 'react-router-dom';
import { IconArrowDown } from './IconHeader';
import styles from './styles.module.css';
import { UserIcon } from '../MainHeader/IconHeader';
// import { InstallApp } from "./IconHeader";

const { useBreakpoint } = Grid;
const gamePaths = [
  '/game/buy-properties',
  '/game/dasboard',
  '/game/rewards',
  '/game/leaderboard',
];

const dexPaths = [
  '/dex',
  '/dex/transfers',
  '/dex/balances',
  '/dex/fiat',
  '/dex/transactions',
];

const RoutingMenu = ({ isOpen, visileSubMenu, setVisileSubMenu }) => {
  const { pathname } = useLocation();

  const history = useHistory();
  const matchedPath = matchPath(pathname, { path: '/game/:type' });
  // const dexMatchedPath = matchPath(pathname, { path: "/dex/:type" });

  const isGamePath = gamePaths.includes(pathname);
  const isDexPath = dexPaths.includes(pathname);

  const selectedKey = pathname.split('/')[1];
  const selectedKeydex = pathname.split('/dex/')[1];
  const { sm, md } = useBreakpoint();

  let deferredInstall = null;

  const renderGameMenu = () => {
    return (
      !visileSubMenu && (
        <div className={styles.bottomBg}>
          <div
            className={isOpen ? styles.bottomHeader : styles.bottomHeaderClose}
          >
            {!md ? (
              <div className={styles.logoHomeWrapper}>
                <div className={styles.logoMobile}>
                  <GameLogo
                    onClick={() => setVisileSubMenu(true)}
                    className="icon-logo"
                  />
                </div>{' '}
                <IconArrowDown />
              </div>
            ) : (
              <div className={styles.logoHomeWrapper}>
                <GameLogo
                  onClick={() => history.push('/game/buy-properties')}
                  className="icon-logo"
                />
              </div>
            )}

            <div className={styles.menuRight}>
              <div className={styles.menuItems}>
                <Menu
                  theme="dark"
                  mode="horizontal"
                  // defaultSelectedKeys={['explore']}
                  className={`${styles.bottomMenu} ${
                    !sm ? styles.bottomMenuSm : ''
                  }`}
                  selectedKeys={[matchedPath?.params?.type]}
                >
                  <Menu.Item key="buy-properties">
                    <Link to="/game/buy-properties" className={styles.menuLink}>
                      Buy Properties
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="dasboard">
                    <Link to="/game/dasboard" className={styles.menuLink}>
                      Dashboard
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="rewards">
                    <Link to="/game/rewards" className={styles.menuLink}>
                      Rewards
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="leaderboard">
                    <Link to="/game/leaderboard" className={styles.menuLink}>
                      Leaderboard
                    </Link>
                  </Menu.Item>
                </Menu>
                <div className={styles.walletInfo}>
                  <div
                    onClick={() => history.push('/profile')}
                    className={styles.icon1}
                  >
                    <UserIcon className={styles.svgIcon1} />
                  </div>
                </div>
                <div
                  className={styles.walletInfo}
                  style={{ marginLeft: '10px' }}
                >
                  <Account />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    );
  };
  const renderDexMenu = () => {
    return (
      !visileSubMenu && (
        <div className={styles.bottomBg}>
          <div
            className={isOpen ? styles.bottomHeader : styles.bottomHeaderClose}
          >
            {!md ? (
              <div className={styles.logoHomeWrapper}>
                <div className={styles.logoMobile}>
                  <DexLogo
                    onClick={() => setVisileSubMenu(true)}
                    className="icon-logo"
                  />
                </div>
                <IconArrowDown />
              </div>
            ) : (
              <div className={styles.logoHomeWrapper}>
                <DexLogo
                  onClick={() => history.push('/dex')}
                  className="icon-logo"
                />
              </div>
            )}

            <div className={styles.menuRight}>
              {!md && (
                <div className={styles.walletInfoMobile}>
                  <Account />
                </div>
              )}
              <div className={styles.menuItems}>
                <Menu
                  theme="dark"
                  mode="horizontal"
                  // defaultSelectedKeys={['explore']}
                  className={`${styles.bottomMenu} ${
                    !sm ? styles.bottomMenuSm : ''
                  }`}
                  overflowedIndicator={null}
                  selectedKeys={selectedKeydex ? selectedKeydex : 'dex'}
                >
                  <Menu.Item key="dex">
                    <Link to="/dex" className={styles.menuLink}>
                      DEX
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="transfers">
                    <Link to="/dex/transfers" className={styles.menuLink}>
                      Transfer
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="balances">
                    <Link to="/dex/balances" className={styles.menuLink}>
                      Balances
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="transactions">
                    <Link to="/dex/transactions" className={styles.menuLink}>
                      Transactions
                    </Link>
                  </Menu.Item>
                </Menu>
                <div className={styles.walletInfo}>
                  <div
                    onClick={() => history.push('/profile')}
                    className={styles.icon1}
                  >
                    <UserIcon className={styles.svgIcon1} />
                  </div>
                </div>
                {md && (
                  <div
                    className={styles.walletInfo}
                    style={{ marginLeft: '10px' }}
                  >
                    <Account />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    );
  };

  // if (isGamePath) {
  //   return renderGameMenu();
  // }

  if (isDexPath) {
    return renderDexMenu();
  }

  //listen for `appinstalled` event
  window.addEventListener('appinstalled', (evt) => {
    //deprecated but still runs in Chrome-based browsers.
    //Not very useful event.
    //Better to use the DOMContentLoaded and then look at how it was launched
  });

  //listen for `beforeinstallprompt` event
  window.addEventListener('beforeinstallprompt', (ev) => {
    // Prevent the mini-infobar from appearing on mobile
    ev.preventDefault();
    // Stash the event so it can be triggered later.
    deferredInstall = ev;
    console.log('saved the install event');
    // Update UI notify the user they can install the PWA
    // if you want here...
  });

  function startChromeInstall() {
    if (deferredInstall) {
      console.log(deferredInstall);
      deferredInstall.prompt();
      deferredInstall.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          //they installed
          console.log('installed');
        } else {
          console.log('cancel');
        }
      });
    }
  }

  // Render Marketplace Menu
  return (
    !visileSubMenu && (
      <div className={styles.bottomBg}>
        <div
          className={isOpen ? styles.bottomHeader : styles.bottomHeaderClose}
        >
          {!md ? (
            <div className={styles.logoHomeWrapper}>
              <div className={styles.logoMobile}>
                <MarketplaceLogo
                  onClick={() => setVisileSubMenu(true)}
                  className="icon-logo"
                />
              </div>
              <IconArrowDown />
            </div>
          ) : (
            <div className={styles.logoHomeWrapper}>
              <MarketplaceLogo
                onClick={() => history.push('/')}
                className="icon-logo"
              />
            </div>
          )}
          <div className={styles.menuRight}>
            {!md && (
              <Input
                className={styles.input}
                size="large"
                placeholder="Enter your search here"
                prefix={
                  <SearchOutlined style={{ fontSize: '20px', color: '#fff' }} />
                }
              />
            )}
            {!md && (
              <div className={styles.walletInfoMobile}>
                <Account />
              </div>
            )}

            <div className={styles.menuItems}>
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['/']}
                className={`${styles.bottomMenu} ${
                  !sm ? styles.bottomMenuSm : ''
                }`}
                selectedKeys={selectedKey}
              >
                <Menu.Item key="explore">
                  <NavLink
                    to="/collection/0xfde910FbaA9A6fDD5d3F80cCD44a54763DE2d9d0"
                    className={styles.menuLink}
                  >
                    Explore
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="my-collection">
                  <NavLink to="/my-collection" className={styles.menuLink}>
                    My Collections
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="staking">
                  <NavLink to="/game/dasboard" className={styles.menuLink}>
                    Staking
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="transaction">
                  <NavLink to="/transaction" className={styles.menuLink}>
                    Transactions
                  </NavLink>
                </Menu.Item>
                <Menu.Item className={styles.btnCreate}>
                  <NavLink to="/create-nft" className={clsx(styles.menuLink)}>
                    Create
                  </NavLink>
                </Menu.Item>
              </Menu>
              {md && (
                <Input
                  className={`${styles.input} ${styles.inputDesktop}`}
                  size="large"
                  placeholder="Enter your search here"
                  prefix={
                    <SearchOutlined
                      style={{ fontSize: '20px', color: '#fff' }}
                    />
                  }
                />
              )}
              {/* <div className={styles.walletInfo} style={{ marginLeft: "10px" }}>
                <div
                  onClick={() => startChromeInstall()}
                  className={styles.icon1}
                >
                  <InstallApp className={styles.svgIcon1}/>
                </div>
              </div> */}
              <div className={styles.walletInfo}>
                <div
                  onClick={() => history.push('/profile')}
                  className={styles.icon1}
                >
                  <UserIcon className={styles.svgIcon1} />
                </div>
              </div>
              {md && (
                <div
                  className={styles.walletInfo}
                  style={{ marginLeft: '10px' }}
                >
                  <Account />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default RoutingMenu;
