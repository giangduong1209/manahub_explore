import React, { useState } from "react";
import GameLayout from "./GameLayout";
import GameMap from "./GameMap";

const BuyProperties = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <GameMap show={show} />
      <GameLayout setShow={setShow} show={show} />
    </>
  );
};

export default BuyProperties;
