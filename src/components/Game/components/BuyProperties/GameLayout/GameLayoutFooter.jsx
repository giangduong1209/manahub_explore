import { Button, Collapse, Tag } from "antd";
import clsx from "clsx";
import { useCallback, useState } from "react";
import styles from "../../../styles.module.css";
import { CitySvg, UpIconvg } from "../GameMap";

const { Panel } = Collapse;

const data = [
  { value: 1, label: "Hà Nội " },
  { value: 2, label: "Đà Nẵng" },
  { value: 3, label: "TP.Hồ Chí Minh" },
  // { value: 4, label: 'ABC' },
  // { value: 5, label: 'CDF' },
  // { value: 6, label: 'GHJ' },
];

const GameLayoutFooter = ({ items, setItems }) => {
  const [key, setKey] = useState(0);

  const [remove, setRemove] = useState(false);
  const [itemsToRemove, setItemsToRemove] = useState([]);
  const [value, setValue] = useState(null);

  const toggleOpen = useCallback(
    () =>
      setKey((prevKey) => {
        if (prevKey === 1) {
          return 0;
        }
        return 1;
      }),
    []
  );

  const toggleRemove = () => setRemove((prev) => !prev);
  const handleAddItem = (code) => {
    if (!remove) return;

    setItemsToRemove((prev) => {
      if (prev.includes(code)) return prev.filter((_code) => _code !== code);
      return [...prev, code];
    });
  };

  const onClickBtn = useCallback(() => {
    if (!remove) return;

    setItems((prev) => prev.filter((_code) => !itemsToRemove.includes(_code)));
    setItemsToRemove([]);
  }, [itemsToRemove, remove, setItems]);

  return (
    <>
      <div
        className={clsx(styles.gameLayoutFooter, {
          [styles.removeMode]: remove,
        })}
      >
        <Collapse className={styles.mobilePropertiesFilter}>
          <Panel
            key={1}
            showArrow={false}
            header={
              <div
                className={clsx(styles.propertiesFilterAnchor, {
                  [styles.showFilter]: true,
                })}
              >
                <div className={styles.propertiesFilterHeader}>
                  <CitySvg />
                  <span className={styles.propertiesFilterTitle}>City 1</span>
                  <span
                    style={{
                      cursor: "pointer",
                    }}
                    className={styles.arrowIcon}
                  >
                   <UpIconvg />
                  </span>
                </div>
              </div>
            }
          >
            <div className={styles.propertiesFilterContent}>
              {data.map(({ value: _value, label }) => (
                <div
                  onClick={() => setValue(_value)}
                  className={clsx(styles.propertiesFilterItem, {
                    [styles.filterSelected]: _value === value,
                  })}
                  key={_value}
                >
                  {label}
                </div>
              ))}
            </div>
          </Panel>
        </Collapse>

        <Collapse className={styles.myCartCollapse} activeKey={key}>
          <Panel
            key={1}
            collapsible="header"
            showArrow={false}
            header={
              <div className={styles.footerCollapseHeader}>
                <div onClick={toggleRemove} className={styles.left}>
                  {remove ? "Back" : "Remove"}
                </div>

                <div onClick={toggleOpen} className={styles.middle}>
                  My Cart
                </div>

                <div onClick={toggleOpen} className={styles.right}>
                  <svg
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 1.66658L7 6.33325L2 1.66658"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            }
          >
            <div>
              <div className={styles.gameCartContainer}>
                {items.map((code) => (
                  <Tag
                    key={code}
                    className={clsx(styles.cartTag, {
                      [styles.addToRemove]: itemsToRemove.includes(code),
                    })}
                    onClick={() => handleAddItem(code)}
                  >
                    {code}
                  </Tag>
                ))}
              </div>
              <Button
                block
                className={clsx(styles.gameCartBtn, {
                  [styles.removeMode]: remove,
                })}
                onClick={onClickBtn}
              >
                {remove ? "Remove" : "Buy"}
              </Button>
            </div>
          </Panel>
        </Collapse>
      </div>

      <div className={styles.gameLayoutFooterDummy} />
    </>
  );
};

export default GameLayoutFooter;
