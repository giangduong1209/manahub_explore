import {
  Button,
  Col,
  Form,
  Grid,
  Input,
  Layout,
  List,
  Row,
  Typography,
} from 'antd';
import FooterBg from 'assets/images/Footer/Footer.png';
import polisLogo from 'assets/images/Metapolis_logo-03.png';
import { AiOutlineMedium } from 'react-icons/ai';
import {
  FaFacebook,
  FaPhone,
  FaTelegram,
  FaTwitter,
  FaYoutube,
  FaMapPin,
} from 'react-icons/fa';
import { MdMail } from 'react-icons/md';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './styles.module.css';
import React, { useMemo } from 'react';
import logoManahubs from "./ManaHub_logo_light.svg";

const { Title } = Typography;
const { Footer } = Layout;
const { useBreakpoint } = Grid;

const data = [
  { icon: FaPhone, text: '+84 961793930' },
  { icon: MdMail, text: 'contact@metapolis.gg' },
  { icon: FaMapPin, text: `62 Tran Quang Khai, Tan Dinh, District 1,HCMC, Vietnam` },
];

const MainFooter = () => {
  const [form] = Form.useForm();
  const { lg ,md, sm, xs } = useBreakpoint();
  const location = useLocation();
  const isHomePage = useMemo(
    () => location.pathname === '/',
    [location.pathname]
  );

  console.log("lg ",lg);
  console.log("md ",md);

  console.log("sm ",sm);

  console.log("xs ",xs);


  return (
    <Footer className={styles.footer}>
      {isHomePage && (
        <div className={styles.contacUs}>
          <Row justify="space-between" className={styles.topFooter}>
            {lg ?(
            <> 
            <Col span={24} md={24} lg={10} className={styles.leftFooter}>
              <div
                className={styles.leftFooterBg}
                style={{ backgroundImage: `url(${FooterBg})` }}
              >
                <List
                  className={styles.listItem}
                  dataSource={data}
                  renderItem={(item) => (
                    <List.Item>
                      <Typography.Text className={styles.contactIcon}>
                        <item.icon />
                      </Typography.Text>{' '}
                      <p>{item.text.substring(0, 29)} <br /> {item.text.substring(29)}</p>
                    </List.Item>
                  )}
                />
                <div className={styles.circle}></div>
                <div className={styles.socialList}>
                  <FaTwitter />
                  <AiOutlineMedium />
                  <FaYoutube />
                  <FaTelegram />
                  <FaTelegram />
                  <FaFacebook />
                </div>
              </div>
            </Col>
            <Col md={24} lg={10} className={styles.rightFooter}
              style={{ marginTop: md || sm || xs ? 48 : 0 }}
            >
              <Title level={2} style={{ color: 'white' }}>
                CONTACT US
              </Title>
              <Typography.Text style={{ color: '#fff' }}>
                We are always open and we welcome any questions you have for our
                teams. If you wish to get in touch, please fill out the form
                below. Someone from our team will get back to you slowly.
              </Typography.Text>
              <Form form={form} layout="vertical" className={styles.form}>
                <Row gutter={32}>
                  <Col span={12}>
                    <Form.Item label="YOUR NAME">
                      <Input placeholder="Introduce yourself" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="YOUR EMAIL">
                      <Input placeholder="Who do we reply tor" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="YOUR MESSAGE">
                      <Input.TextArea
                        placeholder="Leave your question or comment here"
                        rows={5}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    span={24}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      // onClick={() => history.push("/explore")}
                      size="large"
                      className={styles.exploreBtn}
                    >
                      Send
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
         
            </>):(
            <> 
            <Col md={24} lg={10} className={styles.rightFooter}
              style={{ marginTop: md || sm || xs ? 48 : 0 }}
            >
              <Title level={2} style={{ color: 'white' }}>
                CONTACT US
              </Title>
              <Typography.Text style={{ color: '#fff' }}>
                We are always open and we welcome any questions you have for our
                teams. If you wish to get in touch, please fill out the form
                below. Someone from our team will get back to you slowly.
              </Typography.Text>
              <Form form={form} layout="vertical" className={styles.form}>
                <Row gutter={32}>
                  <Col xs={{ span: 24 }} md={{ span: 12 }}>
                    <Form.Item label="YOUR NAME">
                      <Input placeholder="Introduce yourself" />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 12 }}>
                    <Form.Item label="YOUR EMAIL">
                      <Input placeholder="Who do we reply tor" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="YOUR MESSAGE">
                      <Input.TextArea
                        placeholder="Leave your question or comment here"
                        rows={5}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    span={24}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      // onClick={() => history.push("/explore")}
                      size="large"
                      className={styles.exploreBtn}
                    >
                      Send
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col span={24} md={24} lg={10} className={styles.leftFooter}>
              <div
                className={styles.leftFooterBg}
                style={{ backgroundImage: `url(${FooterBg})` }}
              >
                <List
                  className={styles.listItem}
                  dataSource={data}
                  renderItem={(item) => (
                    <List.Item>
                      <Typography.Text className={styles.contactIcon}>
                        <item.icon />
                      </Typography.Text>{' '}
                      <p>{item.text.substring(0, 29)} <br /> {item.text.substring(29)}</p>
                    </List.Item>
                  )}
                />
                <div className={styles.circle}></div>
                <div className={styles.socialList}>
                  <FaTwitter />
                  <AiOutlineMedium />
                  <FaYoutube />
                  <FaTelegram />
                  <FaTelegram />
                  <FaFacebook />
                </div>
              </div>
            </Col>
           </>)}
          </Row>
        </div>
      )}

      <div className={styles.container}>
        <Row className={styles.bottomFooter} justify="space-between">
          <Col>
            <a href="https://metapolis.gg" rel="noopener noreferrer">
              <img
                src={logoManahubs}
                alt="logo footer"
                className={styles.footerLogo}
                width={180}
                height={39}
              />
            </a>
          </Col>
          <Col flex="auto">
            <div className={styles.menuWrapper}>
              {/* <div className={styles.menuItems}>
                <NavLink to="/">NFT Marketplace</NavLink>
                <NavLink to="/">DEX</NavLink>
                <NavLink to="/">Game</NavLink>
              </div>
              <div className={styles.menuItems}>
                <a
                  href="https://metapolis.gg/collection"
                  rel="noopener noreferrer"
                >
                  NFT Collection
                </a>
                <a
                  href="https://metapolis.gg/economy"
                  rel="noopener noreferrer"
                >
                  NFT Economy
                </a>
                <a href="https://docs.metapolis.gg" rel="noopener noreferrer">
                  Whitepaper
                </a>
              </div> */}
            </div>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default MainFooter;
