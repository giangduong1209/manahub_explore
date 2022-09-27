import React, { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import GameDashboardContent from "./GameDashboardContent";

const GameDashboard = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <GameDashboardContent show={show} setShow={setShow} />

      <DashboardLayout show={show} setShow={setShow} />
    </>
  );
};

export default React.memo(GameDashboard);
