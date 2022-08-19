import { RightOutlined } from "@ant-design/icons";
import { Card, Col, Row, Tree, Typography } from "antd";
import clsx from "clsx";
import { CopyIcon } from "components/Icons";
import styles from "../styles.module.css";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useEffect, useState } from "react";
import { async } from "@firebase/util";
// import { async } from "@firebase/util";
// Fake data to display
let fakeRef = [
];
let totalSystemRef = 0;
const { TreeNode } = Tree;

const ReferralSystem = ({ toggleReferral }) => {
  const [commission, setCommission] = useState(0);
  const [totalSystem, setTotalSystem] = useState(0);
  const { Moralis, account } = useMoralis();
  const Profile = Moralis.Object.extend("profile");
  const [nodes, setNodes] = useState(fakeRef);
  const [gotRefInfo, setGotRefInfo] = useState(false);

  async function getRefInfo(address) {
    totalSystemRef = 0;
    await getRef(address, fakeRef);
    setNodes(fakeRef);


    // console.log(nodes);
    const queryInfo = new Moralis.Query(Profile);
    queryInfo.equalTo("address", address);
    const info = await queryInfo.first();
    if (info?.attributes?.commission) {
      setCommission(info.attributes.commission / ("1e" + 18));
      totalSystemRef = totalSystemRef + info.attributes.commission / ("1e" + 18);
    }
    setTotalSystem(totalSystemRef.toFixed(10));
  }

  async function getRef(address, array) {
    const query = new Moralis.Query(Profile);
    query.equalTo("ref", address);
    const result = await query.find();
    for (let index = 0; index < result.length; index++) {
      const element = result[index].attributes;
      let address = element.address.substring(0, 4) + "..." + element.address.substring(element.address.length - 4, element.address.length);

      let obj = {
        address: address,
        totalTreeSystem: element.commission / ("1e" + 18),
        children: []
      }
      let exist = false;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element.address != obj.address) {
          exist = true;
        }
      }
      if (!exist) {
        array.push(obj);
      }
      await getRef(element.address, obj.children);
    }

    // setNodes(...arr);
    // console.log(nodes);
  }

  if (!gotRefInfo) {
    setGotRefInfo(true);
    fakeRef = [];
    getRefInfo(account);
  }

  function getTotalSystem(array) {
    array.forEach(element => {
      // console.log(element);
      totalSystemRef = totalSystemRef + element.totalTreeSystem;
      if (element.children.length > 0) {
        getTotalSystem(element.children);
      }
    });
  }

  if (nodes.length > 0) {
    totalSystemRef = 0;
    getTotalSystem(nodes);
  }

  const addNodeRef = (address) => {
    console.log("add nod here", address);
  };

  const renderNode = (ref) =>
    ref?.children?.map((_ref) => (
      <TreeNode
        selectable={false}
        key={_ref.address}
        title={
          <div
            className={clsx(styles.box, styles.nodeBox)}
            onClick={() => addNodeRef(_ref.address)}
          >
            <div className={styles.nodeLeft}>
              <Typography.Text strong>{_ref.address}</Typography.Text>
            </div>
            <div className={styles.nodeRight}>
              Total System: {_ref.totalTreeSystem > 0 ? _ref.totalTreeSystem.toFixed(10) : _ref.totalTreeSystem} BNB
            </div>
          </div>
        }
      >
        {_ref?.children && renderNode(_ref)}
      </TreeNode>
    ));

  return (
    <Card className={styles.card}>
      <RightOutlined onClick={toggleReferral} className={styles.btnBack} />
      <Row gutter={[16, 16]}>
        <div className={styles.referralTitle}>Referral System</div>
        <Col span={24}>
          <div className={clsx(styles.addressBox, styles.box)}>
            <Typography.Text
              strong
              style={{
                maxWidth: "100%",
              }}
              ellipsis={{
                tooltip: account,
              }}
            >
              {account}
            </Typography.Text>
            <span className={styles.iconCopy}>
              <CopyIcon style={{ color: "#fff", fontSize: 12 }} />
            </span>
          </div>
        </Col>
        <Col span={24}>
          <div className={clsx(styles.infoTotalBox, styles.box)}>
            <Row gutter={4} style={{ width: "100%" }}>
              <Col span={12}>
                <span>Total System:</span>
              </Col>
              <Col span={12}>
                <span>{totalSystem} BNB</span>
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={24}>
          <div className={clsx(styles.infoCommissionlBox, styles.box)}>
            <Row gutter={4} style={{ width: "100%" }}>
              <Col span={12}>
                <span>Your Commission:</span>
              </Col>
              <Col span={12}>
                <span>{commission.toFixed(10)} BNB</span>
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={24}>
          <Tree
            showLine={{ showLeafIcon: false }}
            defaultExpandAll={true}
            switcherIcon={null}
            className={styles.referralNode}
          >
            {nodes?.map((ref) => (
              <TreeNode
                selectable={false}
                key={ref.address}
                title={
                  <div
                    className={clsx(styles.box, styles.nodeBox)}
                    onClick={() => addNodeRef(ref.address)}
                  >
                    <div className={styles.nodeLeft}>
                      <Typography.Text strong>{ref.address}</Typography.Text>
                    </div>
                    <div className={styles.nodeRight}>
                      Commission: {ref.totalTreeSystem} BNB
                    </div>
                  </div>
                }
              >
                {renderNode(ref)}
              </TreeNode>
            ))}
          </Tree>
        </Col>
      </Row>
    </Card>
  );
};

export default ReferralSystem;
