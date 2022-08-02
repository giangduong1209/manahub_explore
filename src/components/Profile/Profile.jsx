import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
} from 'antd';
import Text from 'antd/lib/typography/Text';
import SiteMapIcon from 'components/Icons/SiteMapIcon';
import { useEffect, useState } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useHistory } from 'react-router-dom';
import ReferralSystem from './components/ReferralSystem';
import styles from './styles.module.css';
import axios from "axios";


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
/* eslint-enable no-template-curly-in-string */
// const { useBreakpoint } = Grid;
function Profile() {
  const history = useHistory();
  const { web3, Moralis, account } = useMoralis();
  const [auth, setAuth] = useState();
  const [refDisabled, setrefDisabled] = useState(false);
  const queryProfile = useMoralisQuery('profile');

  const fetchProfile = JSON.parse(JSON.stringify(queryProfile.data));
  const [form] = Form.useForm();
  const [image, setImage] = useState('');
  const [bg, setBg] = useState('');
  const [loading, setLoading] = useState(false);
  const [changeAva, setChangeAva] = useState(false);
  const [rewards, setRewards] = useState(0);
  const [isOpenReferral, setIsOpenReferral] = useState(false);
  const domain = "http://localhost:8181";
  // const domain = "http://45.77.39.122:8181";

  const checkAuthen = async () => {
    Moralis.initialize("ODKsAGfZTKjTaG2Xv2Kph0ui303CX3bRtIwxQ6pj");
    Moralis.serverURL = "https://bzyt487madhw.usemoralis.com:2053/server";
    let query = new Moralis.Query('profile');
    let subscription = await query.subscribe();
    subscription.on('update', (obj) => {
      // console.log(obj.attributes);
      setRewards(obj.attributes.rewards);
    })
    const result =
      fetchProfile.find((element) => element.address === account) || null;
    if (result && account !== undefined) {
      setAuth(true);
      if (result.ref) {
        setrefDisabled(true);
      }
      setRewards(result.rewards);
      form.setFieldsValue({
        ref: result.ref,
        name: result.name,
        email: result.email,
        phone: result.phone,
        bio: result.bio,
      });
      setBg(result.background);
      setImage(result.avatar);
    } else {
      setAuth(false);
    }
  };
  useEffect(() => {
    if (!changeAva) {
      checkAuthen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const onFinish = async (values) => {
    if (account) {
      const users = Moralis.Object.extend('profile');
      const query = new Moralis.Query(users);
      let save;
      if (auth) {
        query.equalTo('address', account);
        save = await query.first();
      } else {
        save = new users();
      }
      let refs = [];
      if (values.ref) {
        const resultGetRefs =
          fetchProfile.find(
            (element) => element.address === values.ref.toLowerCase()
          ) || null;

        if (resultGetRefs) {
          if (resultGetRefs.refs) {
            refs = JSON.parse(resultGetRefs.refs);
          }
        }
        if (values.ref !== account) {
          refs.push(values.ref.toLowerCase());
        }
      }
      const data = {
        refs: JSON.stringify(refs),
        ref: values.ref.toLowerCase(),
        address: account,
        name: values.name,
        email: values.email,
        phone: values.phone,
        avatar: values.image,
        background: bg,
        bio: values.bio,
      }
      const fetchAPI = await axios.post(domain + "/user/updateProfile", {
        data: data,
      });
      if (fetchAPI) {
        let secondsToGo = 2;
        const modal = Modal.success({
          title: 'Success!',
          content: `Save success`,
        });
        // props.getAuthenticate({ authenticated: false });
        history.push('/my-collection');
        setTimeout(() => {
          modal.destroy();
        }, secondsToGo * 1000);
      }

    } else {
      let secondsToGo = 2;
      const modal = Modal.error({
        title: 'Error!',
        content: `Please sign in wallet`,
      });
      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    }
  };
  const onChange = async (e) => {
    setLoading(true);
    setChangeAva(true);
    const image = await uploadImageData(e);
    setImage(image);
    setLoading(false);
  };

  const onChangeBackground = async (e) => {
    setChangeAva(true);
    setLoading(true);
    const bg = await uploadImageData(e);
    setBg(bg);
    setLoading(false);
  };

  const uploadImageData = async (e) => {
    const data = e.target.files[0];
    const file = new Moralis.File(data.name, data);
    await file.saveIPFS();
    return file.ipfs();
  };

  const toggleReferral = () => setIsOpenReferral((v) => !v);

  async function claim() {
    setLoading(true);
    const fetchAPI = await axios.post(domain + "/w3/claim", {
      address: account,
    });
    let signTx = fetchAPI?.data?.signTx;
    if (signTx) {
      // console.log(web3.eth);
      // await web3.eth.sendSignedTransaction(signTx.rawTransaction);
      let hash = await web3.eth.sendTransaction({ from: account, gas: signTx.gas, to: signTx.to, data: signTx.data });
      // console.log(hash);
      if (hash) {
        await axios.post(domain + "/w3/update", {
          address: account,
        });
      }
    }
  }
  return (
    <>
      <div>
        {!auth ? (
          <Alert
            message="Please type your information for going the next page"
            type="info"
          />
        ) : (
          <></>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundImage: `url(${bg})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        {isOpenReferral ? (
          <ReferralSystem toggleReferral={toggleReferral} />
        ) : (
          <Card
            className={styles.card}
            title={
              <div className={styles.header}>
                <Avatar
                  size={{ xs: 64, sm: 64, md: 64, lg: 64, xl: 80, xxl: 100 }}
                  // icon={<AntDesignOutlined />}
                  src={image}
                />
                <div className={styles.rowLabel}>
                  <Row>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'between',
                        padding: '20px',
                      }}
                    >
                      <Col span={12}>
                        <label
                          className={styles.label}
                          style={{ textAlign: `center` }}
                        >
                          &ensp;&emsp;Upload Avatar&emsp;&ensp;
                          <Input
                            type="file"
                            onChange={onChange}
                            bordered={false}
                            className={styles.btnAvatar}
                            style={{ display: 'none' }}
                            disabled={loading}
                          />
                        </label>
                      </Col>
                      &ensp;
                      <Col span={12} offset={0}>
                        <label className={styles.label}>
                          Upload Background
                          <Input
                            type="file"
                            onChange={onChangeBackground}
                            bordered={false}
                            style={{ display: 'none' }}
                            disabled={loading}
                          />
                        </label>
                      </Col>
                    </div>{' '}
                  </Row>{' '}
                </div>
              </div>
            }
          >
            <Form
              {...layout}
              name="nest-messages"
              onFinish={onFinish}
              validateMessages={validateMessages}
              form={form}
            >
              <div className={styles.card1}>
                <div className={styles.tranfer}>
                  <div className={styles.header}>
                    <h3>Your Information</h3>
                  </div>
                  <div className={styles.select}>
                    <div className={styles.textWrapper}>
                      <Text strong>Referral</Text>
                    </div>
                    <Row
                      align="middle"
                      gutter={8}
                      style={{ width: '100%' }}
                      wrap={false}
                    >
                      <Col flex={1}>
                        <Form.Item
                          name={'ref'}
                          // rules={[{ required: true }]}
                          style={{ width: '100%', marginTop: '20px' }}
                        >
                          <Input
                            style={{ width: '100%' }}
                            disabled={refDisabled}
                          />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Button
                          onClick={setIsOpenReferral}
                          icon={<SiteMapIcon style={{ color: '#fff' }} />}
                          type="primary"
                          style={{
                            marginTop: '-4px',
                            background: '#FEA013',
                            borderRadius: 8,
                            border: 'none',
                          }}
                        ></Button>
                      </Col>
                    </Row>
                  </div>
                  <div className={styles.select}>
                    <div className={styles.textWrapper}>
                      <Text strong>Rewards</Text>
                    </div>
                    <Form.Item
                      name={'rewards'}
                      rules={[{ required: true }]}
                      style={{ width: '100%', marginTop: '20px' }}
                    >
                      <span>{rewards / ("1e" + 18)} BNB </span>
                      <Button
                        onClick={claim}
                        disabled={loading}
                        icon={<SiteMapIcon style={{ color: '#fff' }} />}
                        type="primary"
                        style={{
                          marginTop: '-4px',
                          background: '#FEA013',
                          borderRadius: 8,
                          border: 'none',
                        }}
                      >Claim</Button>
                    </Form.Item>
                  </div>
                  <div className={styles.select}>
                    <div className={styles.textWrapper}>
                      <Text strong>Name *</Text>
                    </div>
                    <Form.Item
                      name={'name'}
                      rules={[{ required: true }]}
                      style={{ width: '100%', marginTop: '20px' }}
                    >
                      <Input style={{ width: '100%' }} />
                    </Form.Item>
                  </div>
                  <div className={styles.select}>
                    <div className={styles.textWrapper}>
                      <Text strong>Email *</Text>
                    </div>
                    <Form.Item
                      name={'email'}
                      rules={[{ type: 'email' }, { required: true }]}
                      style={{ width: '200%' }}
                    >
                      <Input style={{ width: '100%' }} />
                    </Form.Item>
                  </div>
                  <div className={styles.select}>
                    <div className={styles.textWrapper}>
                      <Text strong>Phone *</Text>
                    </div>
                    <Form.Item
                      name={'phone'}
                      rules={[{ required: true }]}
                      style={{ width: '100%', marginTop: '20px' }}
                    >
                      <Input style={{ width: '100%' }} />
                    </Form.Item>
                  </div>
                  <div className={styles.select}>
                    <div className={styles.textWrapper}>
                      <Text strong>Bio</Text>
                    </div>
                    <Form.Item name={'bio'} style={{ width: '100%' }}>
                      <Input.TextArea style={{ width: '100%' }} />
                    </Form.Item>
                  </div>
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      className={`${styles.button} ${styles.btnUpdate}`}
                      loading={loading}
                      style={{
                        marginTop: '25px',
                      }}
                      disabled={loading}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          </Card>
        )}
      </div>
    </>
  );
}

export default Profile;
