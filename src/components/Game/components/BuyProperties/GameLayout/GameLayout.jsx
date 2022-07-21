// import { Grid } from "antd";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import styles from "../../../styles.module.css";
import GameLayoutFooter from "./GameLayoutFooter";
import GameLayoutHeader from "./GameLayoutHeader";
import LayoutItem from "./LayoutItem";
// const { useBreakpoint } = Grid;
import { properties } from "helpers/properties-full";
// import testImg from './buildings/00001.png'

const GameLayout = ({ setShow, show }) => {
  const prop = properties
  // const item = prop[0]
  const [items, setItems] = useState([]);
  const ifAdded = useCallback((list, code) => list.includes(code), []);
  // const { md } = useBreakpoint();

  const handleAddToCart = useCallback(
    (code) => {
      setItems((prev) => {
        if (ifAdded(prev, code)) {
          return prev.filter((_code) => _code !== code);
        }
        return [...prev, code];
      });
    },
    [ifAdded]
  );

  console.log(prop)
  return (
    <div className={styles.gameLayout}>
      <GameLayoutHeader setShow={setShow} show={show} />

      <div
        className={clsx(styles.gameLayoutBody, {
          [styles.gameLayoutBodyShow]: show,
        })}>
         {
           prop.map((e) => (
          <LayoutItem
            added={ifAdded(items, e.code)}
            handleAddToCart={handleAddToCart}
            item={{
              title: e.name,
              description: e.address,
              code: e.code,
              price: e.price,
              owner: {
                name: e.owner,
              },
            }}
            type={e.type.toLowerCase()}
            image={e.image}
          />
           ))
         }
        {/* <LayoutItem
          added={ifAdded(items, "#00010")}
          handleAddToCart={handleAddToCart}
          item={{
            title: item.name,
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ipsum lorem, sodales ut molestie non, pharetra ut velit. Etiam tincidunt quam purus, vitae venenatis sapien cursus vel. Nam mollis, turpis at luctus commodo, dui urna imperdiet ante, et finibus velit nunc fermentum diam. Suspendisse tincidunt tempor neque, vel cursus lectus maximus eu",
            code: "#00010",
            price: "2000",
            owner: {
              name: "Lorem ipsum",
            },
          }}
          type="ssr"
          image={"https://picsum.photos/700/300"}
        />
        <LayoutItem
          added={ifAdded(items, "#00020")}
          handleAddToCart={handleAddToCart}
          item={{
            title: "Lorem ipsum",
            description: "Lorem ipsum ipsum ipsum",
            code: "#00020",
            price: "2000",
            owner: {
              name: "Lorem ipsum",
            },
          }}
          type="sr"
          image={"https://picsum.photos/700/300"}
        />
        <LayoutItem
          added={ifAdded(items, "#00030")}
          handleAddToCart={handleAddToCart}
          item={{
            title: "Lorem ipsum",
            description: "Lorem ipsum ipsum ipsum",
            code: "#00030",
            price: "2000",
            owner: {
              name: "Lorem ipsum",
            },
          }}
          type="r"
          image={"https://picsum.photos/700/300"}
        />
        <LayoutItem
          added={ifAdded(items, "#000a0")}
          handleAddToCart={handleAddToCart}
          item={{
            title: "Lorem ipsum",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ipsum lorem, sodales ut molestie non, pharetra ut velit. Etiam tincidunt quam purus, vitae venenatis sapien cursus vel. Nam mollis, turpis at luctus commodo, dui urna imperdiet ante, et finibus velit nunc fermentum diam. Suspendisse tincidunt tempor neque, vel cursus lectus maximus eu",
            code: "#000a0",
            price: "2000",
            owner: {
              name: "Lorem ipsum",
            },
          }}
          type="ssr"
          image={"https://picsum.photos/700/300"}
        />
        <LayoutItem
          added={ifAdded(items, "#0002c0")}
          handleAddToCart={handleAddToCart}
          item={{
            title: "Lorem ipsum",
            description: "Lorem ipsum ipsum ipsum",
            code: "#0002c0",
            price: "2000",
            owner: {
              name: "Lorem ipsum",
            },
          }}
          type="sr"
          image={"https://picsum.photos/700/300"}
        />
        <LayoutItem
          added={ifAdded(items, "#000t0")}
          handleAddToCart={handleAddToCart}
          item={{
            title: "Lorem ipsum",
            description: "Lorem ipsum ipsum ipsum",
            code: "#000t0",
            price: "2000",
            owner: {
              name: "Lorem ipsum",
            },
          }}
          type="r"
          image={"https://picsum.photos/700/300"}
        /> */}
      </div>
      <GameLayoutFooter items={items} setItems={setItems} />
    </div>
  );
};

export default GameLayout;
