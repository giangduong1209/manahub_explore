import {
  FilterOutlined,
  LeftOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Divider, Form, Layout, Typography, Grid } from "antd";
import React, { useState, useEffect } from "react";
import CategoryFilter from "./CategoryFilter";
import CollectionFilter from "./CollectionFilter";
import PriceFilter from "./PriceFilter";
import SortByFilter from "./SortByFilter";
import styless from "./Filter.module.css";
import clsx from "clsx";

const { Sider } = Layout;
const { useBreakpoint } = Grid;

const FilterBox = () => {
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState(false);
  const [visibleContent, setVisibleContent] = useState(false);

  const screens = useBreakpoint();

  useEffect(() => {
    if (Object.keys(screens).length !== 0) {
      setCollapsed(!screens.md);
      setVisibleContent(!screens.md);
    }
  }, [screens]);

  const toggle = () => {
    setCollapsed((collapsed) => !collapsed);

    setTimeout(
      () => {
        setVisibleContent(!collapsed);
      },
      !collapsed ? 0 : 70
    );
  };
  return (
    <div
      className={`${collapsed && styless.wrapperCollapsed}`}
      onScroll={(e) => console.log(e.target.scrollTop)}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        collapsedWidth={56}
        width={300}
        className={clsx(styless.filterSider, "filter-container")}
      >
        {!visibleContent ? (
          <div className={styless.filterTitle}>
            <FilterOutlined />
            <Typography.Text strong>Filter</Typography.Text>
            {!screens.md ? (
              <DownOutlined onClick={toggle} />
            ) : (
              <LeftOutlined onClick={toggle} />
            )}
          </div>
        ) : (
          <div
            className={!screens.md ? styless.filterTitle : styless.filterIcon}
            onClick={toggle}
          >
            <FilterOutlined />
            {!screens.md && <Typography.Text strong>Filter</Typography.Text>}
            {!screens.md && <UpOutlined />}
          </div>
        )}
        {!visibleContent && (
          <Form form={form}>
            <Divider className={styless.divider} />
            <SortByFilter />
            <Divider className={styless.divider} />
            <PriceFilter form={form} />
            <Divider className={styless.divider} />
            <CollectionFilter form={form} />
            <Divider className={styless.divider} />
            <CategoryFilter form={form} />
          </Form>
        )}
      </Sider>
    </div>
  );
};

export default FilterBox;
