import { Col, Form, Radio, Row, Grid } from "antd";
import React, { useState } from "react";
import styless from "./Filter.module.css";
const options = [
  { label: "Buy", value: "buy" },
  { label: "Sell", value: "sell" },
  { label: "Confirmed", value: "confirmed", optionClass: "option-confirmed" },
  { label: "Waiting", value: "waiting", optionClass: "option-waiting" },
];
const { useBreakpoint } = Grid;

const StatusFilter = ({ form }) => {
  const [value, setValue] = useState(null);
  const { md } = useBreakpoint();
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const onResetValue = () => {
    setValue(null);
    form.setFieldsValue({ status: null });
  };

  const handleClickOption = (e) => {
    const thisValue = e.target.value;
    thisValue === value && onResetValue();
  };

  return (
    <>
      <div className={styless.title}>Sort by</div>
      <Form.Item name="status" noStyle>
        <Radio.Group
          onChange={onChange}
          value={value}
          buttonStyle="solid"
          optionType="button"
          style={{ width: "100%" }}
        >
          <Row gutter={[10, 10]}>
            {options.map((option) => {
              return (
                <Col xs={{ span: 6 }} md={{ span: 12 }} key={option.value}>
                  <Radio.Button
                    value={option.value}
                    className={`${!md && "mobile"} ${
                      option?.optionClass && styless[option?.optionClass]
                    } ${styless.label}`}
                    onClick={handleClickOption}
                  >
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

export default StatusFilter;
