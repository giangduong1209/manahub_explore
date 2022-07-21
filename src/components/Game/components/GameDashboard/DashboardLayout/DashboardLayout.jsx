import clsx from "clsx";
import React from "react";
import styles from "../../../styles.module.css";
import DashboardLayoutHeader from "./DashboardLayoutHeader";
import LayoutItem from "./LayoutItem";
import { properties } from "helpers/properties-full";

const DashboardLayout = ({ setShow, show }) => {
  const prop = properties.slice(0,10);
  return (
    <div
      className={clsx(styles.gameLayout, styles.gameDashboardLayout, {
        [styles.show]: show,
      })}>
      <DashboardLayoutHeader
        show={show}
        setShow={setShow}
        extraCn={styles.gameDashboardHeaderDesktop}
      />

      <div className={clsx(styles.gameLayoutBody, styles.dasboardLayoutBody)}>
      {
           prop.map((e) => (
          <LayoutItem
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
          item={{
            title: "Lorem ipsum",
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
    </div>
  );
};

export default DashboardLayout;
