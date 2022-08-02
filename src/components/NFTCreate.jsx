import {
  Button,
  Col,
  Form,
  Grid,
  Input,
  Modal,
  Row,
  Select,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { useHistory } from 'react-router-dom';
// import axios from "axios";
import urlLoading from '../assets/images/loading.gif';
import styles from './styles.module.css';
import { useWeb3ExecuteFunction } from 'react-moralis';
import { useMoralisDapp } from 'providers/MoralisDappProvider/MoralisDappProvider';
const { useBreakpoint } = Grid;

function NFTCreate(props) {
  const contractProcessor = useWeb3ExecuteFunction();
  const { marketAddress, contractABI } = useMoralisDapp();
  const contractABIJson = JSON.parse(contractABI);
  const createToken = 'createToken';
  const { Moralis, account } = useMoralis();
  const [form] = Form.useForm();
  const history = useHistory();
  const { md } = useBreakpoint();

  const [formInput, updateFormInput] = useState({ name: '', description: '' });
  const [fileType, setFileType] = useState();
  const [fileName, setFileName] = useState('');
  const [visible, setVisible] = useState(false);
  const [metadata, setMetadata] = useState();
  const [formValid, setFormValid] = useState({
    nameErr: false,
    descriptionErr: false,
    fileErr: false,
  });
  const [nameValid, setNameValid] = useState(false);
  const [descValid, setDescValid] = useState(false);
  const [isValidType, setIsValidType] = useState(true);
  const [mediaSrc, setMediaSrc] = useState();
  const [isValidFileName, setValidFileName] = useState(true);

  const checkAuthen = async () => {
    const users = Moralis.Object.extend('profile');
    const query = new Moralis.Query(users);
    query.equalTo('address', account);
    const data = await query.first();
    return data;
  };

  // useEffect(() => {
  //   checkAuthen().then((res) => {
  //     if (res) {
  //       // setAuthenticate(true);
  //       //  setUser(res.attributes.name)
  //     } else {
  //       // props.getAuthenticate({ authenticated: true });
  //       history.push('/profile');
  //     }
  //   });
  // });

  function checkValidType(file) {
    let result = false;
    // .JPG, .PNG, .MP4, .MP3, .WAV.
    let fileExtension = file.name.slice(-4).toLowerCase();
    let filesize = file.size;

    if (
      (fileExtension === '.jpg' ||
        fileExtension === 'jpeg' ||
        fileExtension === '.png' ||
        fileExtension === '.mp4' ||
        fileExtension === '.mp3' ||
        fileExtension === '.wav') &&
      filesize <= 52428800
    ) {
      result = true;
    }
    return result;
  }

  function checkValidName(name) {
    let extensionLength = 4;
    let fileExtension = name.slice(-5).toLowerCase();
    if (fileExtension === '.jpeg') {
      extensionLength = 5;
    }

    let _name = name.substring(0, name.length - extensionLength);
    // eslint-disable-next-line
    let format = /[^A-Z a-z0-9_-]/;
    return format.test(_name) ? false : true;
  }

  const onChangeImage = async (e) => {
    if (!nameValid || !descValid) return;
    let file = e.target.files[0];
    setIsValidType(true);
    setMetadata(null);
    setFileName('');
    setMediaSrc('');
    setFileType('');
    setValidFileName(true);
    setFormValid({ ...formValid, fileErr: false });

    if (file === undefined) return;

    if (!checkValidType(file)) {
      setIsValidType(false);
      return;
    }

    if (!checkValidName(file.name)) {
      setValidFileName(false);
      setFileName(file.name);
      return;
    }

    setFileName(file.name);
    setFileType(file.type);
    const image = await uploadImageData(e);
    const _metadata = await uploadMetaData(image);
    setMetadata(_metadata);
    setVisible(false);
  };

  const uploadImageData = async (e) => {
    const data = e.target.files[0];
    const file = new Moralis.File(data.name, data);
    await file.saveIPFS();
    let fileUrl = file.ipfs();
    setMediaSrc(fileUrl);
    return fileUrl;
  };

  const uploadMetaData = async (imgUrl) => {
    const metadata = {
      name: formInput.name,
      description: formInput.description,
      image: imgUrl,
    };

    const file = new Moralis.File('file.json', {
      base64: btoa(JSON.stringify(metadata)),
    });
    await file.saveIPFS();
    return file.ipfs();
  };

  function isFormValid() {
    if (
      formInput.name === '' &&
      formInput.description === '' &&
      fileName === ''
    ) {
      setFormValid({
        ...formValid,
        nameErr: true,
        descriptionErr: true,
        fileErr: true,
      });
      return false;
    }

    if (formInput.name === '' && formInput.description === '') {
      setFormValid({ ...formValid, nameErr: true, descriptionErr: true });
      return false;
    }

    if (formInput.name === '' && fileName === '') {
      setFormValid({ ...formValid, nameErr: true, fileErr: true });
      return false;
    }

    if (formInput.description === '' && fileName === '') {
      setFormValid({ ...formValid, descriptionErr: true, fileErr: true });
      return false;
    }

    if (formInput.name === '') {
      setFormValid({ ...formValid, nameErr: true });
      return false;
    }

    if (formInput.description === '') {
      setFormValid({ ...formValid, descriptionErr: true });
      return false;
    }

    if (fileName === '') {
      setFormValid({ ...formValid, fileErr: true });
      return false;
    }

    if (
      formInput.name !== '' &&
      formInput.description !== '' &&
      fileName !== ''
    ) {
      setFormValid({
        ...formValid,
        nameErr: false,
        descriptionErr: false,
        fileErr: false,
      });
      return true;
    }
  }

  function checkValidInput(input) {
    if (input === '') return true;
    let format = /[^A-Z a-z0-9!@#$%^&*().,_+<>/?:"'|\\[={}`~\]\-\n]/;
    return format.test(input) ? false : true;
  }

  const handleInputName = (name) => {
    updateFormInput({ ...formInput, name: name });
    if (checkValidInput(name)) {
      setNameValid(true);
      return;
    }
    setNameValid(false);
  };

  const handleInputDesc = (description) => {
    updateFormInput({ ...formInput, description: description });
    if (checkValidInput(description)) {
      setDescValid(true);
      return;
    }
    setDescValid(false);
  };

  async function createNFT() {
    if (isFormValid()) {
      if (!nameValid || !descValid) return;
      setVisible(true);
      const ops = {
        contractAddress: marketAddress,
        functionName: createToken,
        abi: contractABIJson,
        params: {
          tokenURI: metadata,
        },
      };
      await contractProcessor.fetch({
        params: ops,
        onSuccess: () => {
          setTimeout(() => {
            setVisible(false);
            successCreate();
          }, 33000);
        },
        onError: (error) => {
          updateFormInput({ ...formInput, name: '', description: '' });
          setFileType('');
          setMediaSrc('');
          setVisible(false);
          failCreate();
        },
      });
    }
  }

  function successCreate() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: 'Success!',
      content: `NFT is created, you may check your NFT`,
    });
    history.push('/my-collection');
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failCreate() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: 'Error!',
      content: `There was a problem with creating NFT`,
    });
    setFileName('');
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  return (
    <div className={styles.CreateWrapper}>
      <Form form={form} layout="vertical">
        <Row gutter={32}>
          <Col span={24} md={12}>
            <Row>
              <Typography.Title level={3} style={{ color: '#000' }}>
                Create Works
              </Typography.Title>
              <Col span={24}>
                <Form.Item>
                  <label>Work Name</label>
                  <Input
                    value={formInput.name}
                    placeholder="Enter the name of the work"
                    onChange={(e) => handleInputName(e.target.value)}
                  />
                  <div style={{ color: 'red' }}>
                    {!formInput.name && formValid.nameErr
                      ? 'Please input your asset name'
                      : formInput.name && !nameValid
                      ? 'English only'
                      : ''}
                  </div>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <label>Collection</label>
                  <Select
                    style={{ width: '100%' }}
                    defaultValue="Manahubs"
                    options={[
                      {
                        value: 'Manahubs',
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <label>Work Description(Optional)</label>
                  <Input.TextArea
                    placeholder="Add description to the work"
                    rows={5}
                    value={formInput.description}
                    onChange={(e) => handleInputDesc(e.target.value)}
                    style={{ 'white-space': 'pre-wrap' }}
                  />
                  <div style={{ color: 'red' }}>
                    {!formInput.description && formValid.descriptionErr
                      ? 'Please input your description'
                      : formInput.description && !descValid
                      ? 'English only'
                      : ''}
                  </div>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <label>Unlockable(Optional)</label>
                  <br />
                  <Typography.Text type="secondary">
                    The work is available to its owner only.
                  </Typography.Text>
                  <Input.TextArea
                    placeholder="You can add links and text description."
                    rows={5}
                    style={{ 'white-space': 'pre-wrap' }}
                  />
                  <div style={{ color: 'red' }}>
                    {!formInput.description && formValid.descriptionErr
                      ? 'Please input your description'
                      : formInput.description && !descValid
                      ? 'English only'
                      : ''}
                  </div>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <label>Copyright(Optional)</label>
                  <Input.TextArea
                    placeholder="The creator has the copyright or use right to this work. You may not modify, copy, reproduce, transmit, or in anyway exploit any such content, without the authorization and consent of the creator. The creator reserve the right to take legal action against any infringement. "
                    rows={5}
                    style={{ 'white-space': 'pre-wrap' }}
                  />
                  <div style={{ color: 'red' }}>
                    {!formInput.description && formValid.descriptionErr
                      ? 'Please input your description'
                      : formInput.description && !descValid
                      ? 'English only'
                      : ''}
                  </div>
                </Form.Item>
              </Col>
              {md && (
                <Col
                  span={24}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Button
                    onClick={() => createNFT()}
                    size="large"
                    type="primary"
                    htmlType="submit"
                    className={styles.btnCreate}
                    loading={visible ? true : false}
                    disabled={
                      !metadata && fileType && isValidType ? true : false
                    }

                    // style={{ width: "auto", borderRadius: "12px" }}
                  >
                    {visible ? 'Creating' : 'Create'}
                  </Button>
                </Col>
              )}
            </Row>
          </Col>
          <Col span={24} md={12} order={0}>
            <Form.Item>
              <label>Image</label>
              <Input
                allowClear
                type="file"
                onChange={onChangeImage}
                accept=".jpg,.jpeg,.mp4,.mp3,.png,.wav"
              />
              {!metadata && fileType && isValidType ? (
                <img
                  alt=""
                  src={urlLoading}
                  style={{ margin: '10px 0 10px 0' }}
                  width="45"
                />
              ) : metadata && mediaSrc && fileType?.includes('video') ? (
                <video width="350" controls style={{ margin: '10px 0 10px 0' }}>
                  {' '}
                  <source src={mediaSrc} type={fileType}></source>
                </video>
              ) : metadata && mediaSrc && fileType?.includes('audio') ? (
                <audio width="350" controls style={{ margin: '10px 0 10px 0' }}>
                  {' '}
                  <source src={mediaSrc} type={fileType}></source>
                </audio>
              ) : metadata && mediaSrc && fileType?.includes('image') ? (
                <img
                  alt=""
                  src={mediaSrc}
                  style={{
                    margin: '10px 0 10px 0',
                    width: '210px',
                    height: '210px',
                  }}
                  type={fileType}
                  width="350"
                />
              ) : (
                ''
              )}
              <div style={{ color: 'red' }}>
                {!fileName && formValid.fileErr
                  ? 'Please upload your NFT file'
                  : ''}
              </div>
              <div style={{ color: 'red' }}>
                {!isValidFileName
                  ? 'Please remove the special character in the filename'
                  : ''}
              </div>
              <div
                style={
                  isValidType
                    ? { color: 'black', fontSize: '12px' }
                    : { color: 'red', fontSize: '12px' }
                }
              >
                supports JPG,JPEG,PNG,GIF,SVG,MPEG,MPG,MPEG3,MP3,MP4 files no
                larger than 40M
              </div>
              {/* <div
                    style={
                      isValidType
                        ? { color: 'black', fontSize: '12px' }
                        : { color: 'red', fontSize: '12px' }
                    }
                  >
                    Max file size : 50MB
                  </div> */}
            </Form.Item>
          </Col>
          {!md && (
            <Col
              span={24}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Button
                onClick={() => createNFT()}
                size="large"
                type="primary"
                htmlType="submit"
                className={styles.btnCreate}
                loading={visible ? true : false}
                disabled={!metadata && fileType && isValidType ? true : false}

                // style={{ width: "auto", borderRadius: "12px" }}
              >
                {visible ? 'Creating' : 'Create'}
              </Button>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
}

export default NFTCreate;
