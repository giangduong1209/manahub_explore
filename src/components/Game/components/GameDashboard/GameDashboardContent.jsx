import clsx from "clsx";
import React from "react";
import styles from "../../styles.module.css";
import { Button } from "antd";

import LayoutItemContent from "./DashboardLayout/LayoutItemContent";
import DashboardLayoutHeader from "./DashboardLayout/DashboardLayoutHeader";
import { properties } from "helpers/properties-full";
import { useState } from "react";

const GameDashboardContent = ({ setShow, show }) => {
  const prop = properties.slice(10, 17);
  const [total, setTotal] = useState(0);
  const claim = () => {
    setTotal(Math.round(2 * 7))
    // let a = Math.imul
    // console.log(a)
  }
  console.log(prop);
  return (
    <div className={clsx(styles.gameDashboard)}>
      <DashboardLayoutHeader
        setShow={setShow}
        show={show}
        extraCn={styles.gameDashboardHeaderMobile}
      />

      <div className={clsx(styles.gameDashboardTitle)}>Stacking</div>

      <div className={clsx(styles.gameDashboardContent)}>
      {
        prop.map((e) => (
          <LayoutItemContent
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
        {/* <LayoutItemContent
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
        <LayoutItemContent
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
        <LayoutItemContent
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
        <LayoutItemContent
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
        <LayoutItemContent
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
        <LayoutItemContent
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
        <LayoutItemContent
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
        <LayoutItemContent
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
        /> */}
      </div>

      <div className={clsx(styles.gameDashboardFooter)}>
        <div>
          <p className={styles.gameDashboardFooterTitle}>Total Collectibles</p>
          <div className={clsx("input-text", styles.inputCollectible)}>
            {total}
          </div>
        </div>

        <div>
          <p className={styles.gameDashboardFooterTitle}>Daily NFTs Stacking</p>
          <Button block disabled={total > 0} onClick={() => claim()}>Claim</Button>
        </div>
      </div>
    </div>
  );
};

export default GameDashboardContent;
