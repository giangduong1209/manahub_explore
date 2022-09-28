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
  Spin
} from 'antd';
import Text from 'antd/lib/typography/Text';
import SiteMapIcon from 'components/Icons/SiteMapIcon';
import { useEffect, useState } from 'react';
import { useMoralis, useMoralisQuery, useWeb3ExecuteFunction } from 'react-moralis';
import { useHistory } from 'react-router-dom';
import ReferralSystem from './components/ReferralSystem';
import styles from './styles.module.css';
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import constant from 'constant';
import { checkWalletConnection } from "helpers/auth";

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
  const { Moralis, account, authenticate, isAuthenticated } = useMoralis();
  const serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;
  const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
  Moralis.initialize(appId);
  Moralis.serverURL = serverURL;
  const [auth, setAuth] = useState();
  const [refDisabled, setrefDisabled] = useState(false);
  const queryProfile = useMoralisQuery('profile');

  const fetchProfile = JSON.parse(JSON.stringify(queryProfile.data));
  const [form] = Form.useForm();
  const [image, setImage] = useState('');
  const [bg, setBg] = useState('');
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [isBgLoading, setIsBgLoading] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [rewards, setRewards] = useState(0);
  const [isOpenReferral, setIsOpenReferral] = useState(false);
  const { contractABI } = useMoralisDapp();
  const contractABIJson = JSON.parse(contractABI);

  const contractProcessor = useWeb3ExecuteFunction();

    const checkAuthen = async () => {
    if(isAuthenticated && account) {
      const Profile = Moralis.Object.extend("profile");
      const query = new Moralis.Query(Profile);
      query.equalTo("address", account); 
      const result = await query.first();
      if (result) {
          setAuth(true);
          if(result.attributes.ref){
            setrefDisabled(true);
          }
          if(result.attributes.rewards){
            setRewards(result.attributes.rewards);
          } else {
            setRewards(0);
          }
          setIsDisabled(false)
          form.setFieldsValue({
            ref: result.attributes.ref,
            name: result.attributes.name,
            email: result.attributes.email,
            phone: result.attributes.phone,
            bio: result.attributes.bio,
          });
          setBg(result.attributes.background);
          setImage(result.attributes.avatar);
        }
        else{
          setAuth(false);
          setRewards(0);
          setrefDisabled(false);
          setIsDisabled(false)
          form.setFieldsValue({
            ref: "",
            name: "",
            email: "",
            phone: "",
            bio: "",
          });
          setBg("");
          setImage("");

        }
  } else {
      setAuth(false);
      setrefDisabled(true);
      setRewards(0);
      setIsDisabled(true);
      form.setFieldsValue({
        ref: "",
        name: "",
        email: "",
        phone: "",
        bio: "",
      });
      setBg("");
      setImage("");
    }
  };
  useEffect(() => {
      checkAuthen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, account]);

  const onFinish = async (values) => {
    setIsUpdateLoading(true);
    if (account && isAuthenticated) {
      const users = Moralis.Object.extend('profile');
      const query = new Moralis.Query(users);
      query.equalTo('address', account);
      const result = await query.first();
      let refs = [];
      if (values.ref) {
        const resultGetRefs =
          fetchProfile.find(
            (element) => element.address === values.ref.toLowerCase()
          ) || null;

        if (resultGetRefs && resultGetRefs.refs) {    
          refs = JSON.parse(resultGetRefs.refs);
        }
        if (values.ref !== account) {
          refs.push(values.ref.toLowerCase());
        }
      }
      let data = {
        address: account,
        name: values.name,
        email: values.email,
        phone: values.phone,
        avatar: image,
        background: bg,
        bio: values.bio,
      }
      if (values.ref) {
        data.ref = values.ref.toLowerCase();
        data.refs = JSON.stringify(refs);
      }
      await updateProfile(data);
      // await Moralis.Cloud.run("updateProfile", data);
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
    setIsUpdateLoading(false);
  };
  const onChangeAvatar = async (e) => {
    setIsUpdateLoading(true);
    setIsAvatarLoading(true);
    const image = await uploadImageData(e);
    setImage(image);
    setIsUpdateLoading(false);
    setIsAvatarLoading(false);
  };

  const onChangeBackground = async (e) => {
    setIsUpdateLoading(true);
    setIsBgLoading(true);
    const bg = await uploadImageData(e);
    setBg(bg);
    setIsUpdateLoading(false);
    setIsBgLoading(false);
  };

  const uploadImageData = async (e) => {
    const data = e.target.files[0];
    const file = new Moralis.File(data.name, data);
    await file.saveIPFS();
    return file.ipfs();
  };

  const toggleReferral = () => setIsOpenReferral((v) => !v);
  const claim = async (obj) => {
    console.log("Claim on blockchain");
    const addressMKP = constant.contracts.MARKETPLACE_ADDRESS;
    const addressHash = process.env.MARKETPLACE_HASH;
      const ops = {
        contractAddress: addressMKP,
        functionName: "claim",
        abi: contractABIJson,
        params: {
          amount: obj.attributes?.rewards ?? 0,
          sender: obj.attributes.address,
          checkHash: addressHash
        },
      };
      await contractProcessor.fetch({params: ops, 
        onSuccess: async () => {
          console.log("Claim success");
          await resetRewards();
        },
        onError: (error) => {
          console.log("Claim failed");
          console.error(error); 
        }
      });
  }
  async function handleClaimClink() {
    setLoadingClaim(true);
    const addr = account;
    const queryClaim = new Moralis.Query("Claim");
    queryClaim.equalTo("getFrom", addr);
    const arrClaim = await queryClaim.find();
    let totalClaim = 0;
    for (let index = 0; index < arrClaim.length; index++) {
      const element = arrClaim[index].attributes;
      totalClaim = totalClaim + parseInt(element.amount);
    }

    const query = new Moralis.Query("profile");
    query.equalTo("address", addr);
    let obj = await query.first({ useMasterKey: true });
    console.log("obj", obj);
    if (obj) {
      if (obj.attributes?.rewards > 0) {
        if ((obj.attributes.commission - totalClaim) == obj.attributes?.rewards) {
          await checkWalletConnection(isAuthenticated, authenticate, async () => {
            await claim(obj);
          }) 
        } else {
          const query = new Moralis.Query("profile");
          query.equalTo("address", addr);
          let obj = await query.first({ useMasterKey: true });
          if (obj) {
            obj.set("rewards", 0);
            await obj.save(null, { useMasterKey: true });
          }
        }
      }
    }
    setLoadingClaim(false);
  }
  async function resetRewards() {
    const addr = account;
    const query = new Moralis.Query("profile");
    query.equalTo("address", addr);
    let obj = await query.first({ useMasterKey: true });
    if (obj) {
      obj.set("rewards", 0);
      await obj.save(null, { useMasterKey: true });
    }
  }

  async function updateProfile(profile) {
    // const profile = request.params;
    const query = new Moralis.Query('profile');
    query.equalTo("address", profile.address);
    let obj = await query.first({ useMasterKey: true });
    if (obj) {
      await Object.keys(profile).forEach(function (key) {
        obj.set(key, profile[key]);
      });
      if(profile.refs){
        updateRefs(JSON.parse(profile.refs), profile.address);
      }
      await obj.save(null, { useMasterKey: true });
    } else {
      const classMoralis = Moralis.Object.extend('profile');
      const newClass = new classMoralis();
      await Object.keys(profile).forEach(function (key) {
        newClass.set(key, profile[key]);
      });
      newClass.save(null, { useMasterKey: true });
    }
  }

  const updateRefs = async (refs, account) => {
    const users = Moralis.Object.extend('profile');
    const query = new Moralis.Query(users);
    query.fullText("refs", account.toLowerCase());
    let arrRefs = await query.find();
    if (arrRefs.length > 0) {
      arrRefs.forEach(element => {
        let str = element.attributes.refs;
        refs.push(account.toLowerCase());
        let arr = JSON.stringify(refs);
        arr = arr.replace('[', "");
        arr = arr.replace(']', "");
        str = str.replace('"' + account.toLowerCase() + '"', arr);
        element.set("refs", str);
        element.save(null, { useMasterKey: true });
      });
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
                <Spin spinning={isAvatarLoading}>
                <Avatar
                  size={{ xs: 64, sm: 64, md: 64, lg: 64, xl: 80, xxl: 100 }}
                  // icon={<AntDesignOutlined />}
                  src={image}
                />
                </Spin>
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
                            onChange={onChangeAvatar}
                            bordered={false}
                            className={styles.btnAvatar}
                            style={{ display: 'none' }}
                            disabled={isUpdateLoading || isDisabled}
                          />
                        </label>
                      </Col>
                      &ensp;
                      <Col span={12} offset={0}>
                      <Spin spinning={isBgLoading}>
                        <label className={styles.label}>
                          Upload Background
                          <Input
                            type="file"
                            onChange={onChangeBackground}
                            bordered={false}
                            style={{ display: 'none' }}
                            disabled={isUpdateLoading || isDisabled}
                          />
                        </label>
                        </Spin>
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
                      style={{ width: '100%', marginTop: '20px' }}
                    >
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: "5px"}}>
                      <span>{rewards / ("1e" + 18)} BNB </span>
                      <Button
                        onClick={handleClaimClink}
                        loading={isUpdateLoading}
                        disabled = {isDisabled}
                        icon={<SiteMapIcon style={{ color: '#fff' }} />}
                        type="primary"
                        style={{
                          marginTop: '-4px',
                          background: '#FEA013',
                          borderRadius: 8,
                          border: 'none',
                        }}
                      >Claim</Button>
                    </div>
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
                      loading={isUpdateLoading}
                      style={{
                        marginTop: '25px',
                      }}
                      disabled={loadingClaim || isDisabled}
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
