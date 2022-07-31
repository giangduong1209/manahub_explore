import { RightOutlined } from '@ant-design/icons';
import { Card, Col, Row, Tree, Typography } from 'antd';
import clsx from 'clsx';
import { CopyIcon } from 'components/Icons';
import styles from '../styles.module.css';

const { TreeNode } = Tree;

const ReferralSystem = ({ toggleReferral }) => {
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
                maxWidth: '100%',
              }}
              ellipsis={{
                tooltip: '0x4C53029ef9c695B66F57fc1611121711B23C2F57',
              }}
            >
              0x4C53029ef9c695B66F57fc1611121711B23C2F57
            </Typography.Text>
            <span className={styles.iconCopy}>
              <CopyIcon style={{ color: '#fff', fontSize: 12 }} />
            </span>
          </div>
        </Col>
        <Col span={24}>
          <div className={clsx(styles.infoTotalBox, styles.box)}>
            <Row gutter={4} style={{ width: '100%' }}>
              <Col span={12}>
                <span>Total System:</span>
              </Col>
              <Col span={12}>
                <span>#### BNB</span>
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={24}>
          <div className={clsx(styles.infoCommissionlBox, styles.box)}>
            <Row gutter={4} style={{ width: '100%' }}>
              <Col span={12}>
                <span>Your Commission:</span>
              </Col>
              <Col span={12}>
                <span>#### BNB</span>
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
            <TreeNode
              selectable={false}
              title={
                <div className={clsx(styles.box, styles.nodeBox)}>
                  <div className={styles.nodeLeft}>
                    <Typography.Text strong>0x4C53...3C2F57</Typography.Text>
                  </div>
                  <div className={styles.nodeRight}>Total System: #### BNB</div>
                </div>
              }
              key="0-0-1"
            />
            <TreeNode
              selectable={false}
              title={
                <div className={clsx(styles.box, styles.nodeBox)}>
                  <div className={styles.nodeLeft}>
                    <Typography.Text strong>0x4C53...3C2F57</Typography.Text>
                  </div>
                  <div className={styles.nodeRight}>Total System: #### BNB</div>
                </div>
              }
              key="0-0-2"
            />
          </Tree>
        </Col>
      </Row>
    </Card>
  );
};

export default ReferralSystem;
