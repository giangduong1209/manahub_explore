import { RightOutlined } from "@ant-design/icons";
import { Card, Col, Row, Tree, Typography } from "antd";
import clsx from "clsx";
import { CopyIcon } from "components/Icons";
import styles from "../styles.module.css";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useEffect, useState } from "react";
import { async } from "@firebase/util";
// Fake data to display
const fakeRef = [
  {
    address: "0x4C53...3C2123",
    totalTreeSystem: "#FIRST",
    children: [
      {
        address: "0x4C53...3C2123123",
        totalTreeSystem: "ERR####",
      },
      {
        address: "0x4C53...3C2123456",
        totalTreeSystem: "F1####",
        children: [
          {
            address: "0x4C53...3C211123",
            totalTreeSystem: "F2####",
            children: [
              {
                address: "0x4C53...3C4123",
                totalTreeSystem: "F3LAST",
              },
              {
                address: "0x4C53...3C04456",
                totalTreeSystem: "F3LAST",
              },
            ],
          },
          {
            address: "0x4C53...3C214456",
            totalTreeSystem: "F1####",
          },
        ],
      },
    ],
  },
  {
    address: "0x4C53...3C232456",
    totalTreeSystem: "#FIRST",
  },
  {
    address: "0x4C53...3C2789",
    totalTreeSystem: "#FIRST",
    children: [
      {
        address: "0x4C53...3C2141123",
        totalTreeSystem: "####",
      },
      {
        address: "0x4C53...3C8283456",
        totalTreeSystem: "####",
      },
    ],
  },
];
const { TreeNode } = Tree;

const ReferralSystem = ({ toggleReferral }) => {
  const [arrRefs, setArrRefs] = useState([]);
  const [commission, setCommission] = useState(0);
  const [totalSystem, setTotalSystem] = useState(0);
  const { Moralis, account } = useMoralis();
  const Profile = Moralis.Object.extend("profile");
  const [nodes, setNodes] = useState(fakeRef);

  async function getRef(address) {
    const queryInfo = new Moralis.Query(Profile);
    queryInfo.equalTo("address", address);
    const info = await queryInfo.first();
    if (info?.attributes?.totalRewardsTreeSystem) {
      setTotalSystem(info.attributes.totalRewardsTreeSystem);
    }
    if (info?.attributes?.commission) {
      setCommission(info.attributes.commission);
    }

    const query = new Moralis.Query(Profile);
    query.equalTo("ref", address);
    const result = await query.find();
    let arr = [];
    result.forEach((element) => {
      arr.push(element.attributes);
    });
    setArrRefs(arr);
  }
  if (arrRefs.length === 0) {
    getRef(account);
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
              Total System: {_ref.totalTreeSystem} BNB
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
                tooltip: "0x4C53029ef9c695B66F57fc1611121711B23C2F57",
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
                <span>{commission} BNB</span>
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
                      Total System: {ref.totalTreeSystem} BNB
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
