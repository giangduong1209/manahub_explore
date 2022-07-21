import { CloseOutlined } from "@ant-design/icons";
import { Avatar, Col, Form, Radio, Row, Space, Typography } from "antd";
// import StreetArt from "assets/images/Collection/Street-Art.png";
import React, { useState } from "react";
import styless from "./Filter.module.css";
import Art from "assets/images/CategoryCard/Art.png";
import Collectibles from "assets/images/CategoryCard/Collectibles.png";
import Domain from "assets/images/CategoryCard/Domain.png";
import Music from "assets/images/CategoryCard/Music.png";
import Photography from "assets/images/CategoryCard/Photography.png";
import Sport from "assets/images/CategoryCard/Sport.png";
import Trading from "assets/images/CategoryCard/Trading.png";
import Utility from "assets/images/CategoryCard/Utility.png";
import Virtual from "assets/images/CategoryCard/Virtual.png";

const options = [
  { label: "Art", value: "Art", image: Art },
  { label: "Collectibles", value: "Collectibles", image: Collectibles },
  { label: "Domain Names", value: "Domain Names", image: Domain },
  { label: "Music", value: "Music", image: Music },
  { label: "Photography", value: "Photography", image: Photography },
  { label: "Sport", value: "Sport", image: Sport },
  { label: "Trading Cards", value: "Trading Cards", image: Trading },
  { label: "Utility", value: "Utility", image: Utility },
  { label: "Virtual Worlds", value: "Virtual Worlds", image: Virtual },
];


const CategoryFilter = ({ form }) => {
  const [value, setValue] = useState(null);
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const onResetValue = () => {
    setValue(null);
    form.setFieldsValue({ category: null });
  };

  return (
    <>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "10px" }}
      >
        <div className={styless.titleGroup}>Categories</div>
        {value && <CloseOutlined onClick={onResetValue} />}
      </Row>
      <Form.Item name="category" noStyle>
        <Radio.Group
          onChange={onChange}
          value={value}
          buttonStyle="solid"
          optionType="button"
        >
          <Row gutter={0}>
            {options.map((option) => {
              return (
                <Col xs={{ span: 12 }} md={{ span: 24 }}>
                  <Radio.Button
                    key={option.value}
                    value={option.value}
                    className={styless.collectionLabel}
                  >
                    <Space size={10}>
                      <Avatar
                        src={option.image}
                        shape="square"
                        size={20}
                        className={styless.avatarCategory}
                      />
                      <Typography.Text className={styless.labelText}>
                        {option.label}
                      </Typography.Text>
                    </Space>
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

export default CategoryFilter;
