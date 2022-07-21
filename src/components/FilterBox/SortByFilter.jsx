import { Col, Form, Radio, Row } from "antd";
import React from "react";
import styless from "./Filter.module.css";
const options = [
  { label: "Most Recent", value: "most-recent" },
  { label: "Most Viewed", value: "most-viewed" },
  { label: "Most Liked", value: "most-liked" },
  { label: "On Auction", value: "on-auction" },
];

const SortByFilter = () => {
  return (
    <>
      <div className={styless.title}>Sort by</div>
      <Form.Item name="sortBy" noStyle>
        <Radio.Group
          buttonStyle="solid"
          optionType="button"
          style={{ width: "100%" }}
        >
          <Row gutter={[10, 10]}>
            {options.map((option) => {
              return (
                <Col xs={{ span: 6 }} md={{ span: 12 }} key={option.value}>
                  <Radio.Button value={option.value} className={styless.label}>
                    {option.label}
                  </Radio.Button>
                </Col>
              );
            })}
          </Row>
        </Radio.Group>
      </Form.Item>
    </>
  );
};

export default SortByFilter;
