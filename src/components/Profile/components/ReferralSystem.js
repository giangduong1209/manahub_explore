import { RightOutlined } from "@ant-design/icons";
import { Card, Col, Row, Tree, Typography, Tooltip, Grid, Spin } from "antd";
import clsx from "clsx";
import { CopyIcon } from "components/Icons";
import styles from "../styles.module.css";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import Constants from "constant";
import LoadingIndicator from "components/LoadingIndicator/LoadingIndicator";
// import { async } from "@firebase/util";
// Fake data to display
let fakeRef = [];
let totalSystemRef = 0;
let totalSystemVal = 0;
const { TreeNode } = Tree;
const { useBreakpoint } = Grid;

const ReferralSystem = ({ toggleReferral }) => {
  const { xs } = useBreakpoint();
  const [commission, setCommission] = useState(0);
  const [totalSystem, setTotalSystem] = useState(0);
  const [totalSystemValue, setTotalSystemValue] = useState(0);
  const { Moralis, account, isAuthenticated } = useMoralis();
  const [isLoading, setIsLoading] = useState(false);
  const [nodes, setNodes] = useState(fakeRef);
  const [currentAddress, setCurrentAddress] = useState(account);
  async function getRefInfo(address) {
    if (address) {
      totalSystemRef = 0;
      // totalSystemVal = 0;
      const queryInfo = new Moralis.Query("profile");
      queryInfo.equalTo("address", address);
      const info = await queryInfo.first();

      if (info?.attributes?.commission) {
        setCommission(info.attributes.commission / ("1e" + 18));
        totalSystemRef =
          totalSystemRef + info.attributes.commission / ("1e" + 18);
      } else {
        setCommission(0);
      }
      if (info?.attributes?.totalValue) {
        setTotalSystemValue(info?.attributes?.totalValue);
      }
      // totalSystemVal = info?.attributes?.totalValue ?? 0;
      // setTotalSystemValue(totalSystemVal);
      setIsLoading(true);
      await getRef(address, fakeRef);
      console.log("Fake ref", fakeRef);
      setNodes(fakeRef);
      setIsLoading(false);
    }
  }
  async function getRef(address, array, level = 1) {
    // if(level >= Constants.LIMIT_REFERRAL_LEVEL) {
    //   return;
    // }
    const query = new Moralis.Query("profile");
    query.equalTo("ref", address);
    const result = await query.find();
    for (let index = 0; index < result.length; index++) {
      const element = result[index].attributes;
      let addr =
        element.address.substring(0, 4) +
        "..." +
        element.address.substring(
          element.address.length - 4,
          element.address.length
        );

      let obj = {
        address: element.address,
        addressCompact: addr,
        commission: element.commission ? element.commission / ("1e" + 18) : 0,
        children: [],
      };
      array.push(obj);

      await getRef(element.address, obj.children, level + 1);
    }
  }
  function getTotalSystem(array) {
    array.forEach((element) => {
      // console.log(element);
      if (!element.commission) {
        element.commission = 0;
      }
      totalSystemRef = totalSystemRef + element.commission;
      if (element.children.length > 0) {
        getTotalSystem(element.children);
      }
    });
  }
  const renderValue = (number) => {
    if (number > 0) {
      return xs ? number.toFixed(7) : number.toFixed(10);
    } else {
      return number;
    }
  };
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };
  const renderNode = (ref) =>
    ref?.children?.map((_ref) => (
      <TreeNode
        selectable={false}
        key={_ref.address}
        title={
          <div
            className={clsx(styles.box, styles.nodeBox)}
            onClick={() => handleCopy(_ref.address)}
          >
            <Tooltip title="Copied" trigger="click" placement="left">
              <div className={styles.nodeLeft}>
                <Typography.Text strong>{_ref.addressCompact}</Typography.Text>
              </div>
            </Tooltip>
            <div className={styles.nodeRight}>
              Commission: {renderValue(_ref.commission)} BNB
            </div>
          </div>
        }
      >
        {_ref?.children && renderNode(_ref)}
      </TreeNode>
    ));
  useEffect(() => {
    if (account && isAuthenticated) {
      setCurrentAddress(account);
      fakeRef = [];
      getRefInfo(account);
    } else {
      setCurrentAddress("");
      setTotalSystem(0);
      setCommission(0);
      setNodes([]);
    }
  }, [account, isAuthenticated]);
  useEffect(() => {
    if (nodes.length > 0) {
      getTotalSystem(nodes);
      setTotalSystem(totalSystemRef.toFixed(10));
    }
  }, [nodes]);
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
                tooltip: currentAddress,
              }}
            >
              {currentAddress}
            </Typography.Text>
            <Tooltip title="Copied" trigger="click" placement="top">
              <span className={styles.iconCopy}>
                <CopyIcon
                  onClick={() => handleCopy(account)}
                  style={{ color: "#fff", fontSize: 12 }}
                />
              </span>
            </Tooltip>
          </div>
        </Col>
        <Col span={24}>
          <Spin spinning={isLoading}>
            <div className={clsx(styles.infoTotalBox, styles.box)}>
              <Row gutter={4} style={{ width: "100%" }}>
                <Col span={12}>
                  <span>Total System:</span>
                </Col>
                <Col span={12}>
                  <span>{totalSystemValue} BNB</span>
                </Col>
              </Row>
            </div>
          </Spin>
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
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <Col span={24}>
            <div className={styles.tree}>
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
                        onClick={() => handleCopy(ref.address)}
                      >
                        <Tooltip
                          title="Copied"
                          trigger="click"
                          placement="left"
                        >
                          <div className={styles.nodeLeft}>
                            <Typography.Text strong>
                              {ref.addressCompact}
                            </Typography.Text>
                          </div>
                        </Tooltip>
                        <div className={styles.nodeRight}>
                          Commission: {renderValue(ref.commission)} BNB
                        </div>
                      </div>
                    }
                  >
                    {renderNode(ref)}
                  </TreeNode>
                ))}
              </Tree>
            </div>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default ReferralSystem;
