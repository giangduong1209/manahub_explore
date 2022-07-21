import React from "react";
import Explores from "./Explores";
import FilterBox from "./FilterBox";

const Explore = () => {
  return (
    <div style={{ display: "flex", position: "relative" }}>
      <FilterBox />
      <Explores />
    </div>
  );
};

export default Explore;
