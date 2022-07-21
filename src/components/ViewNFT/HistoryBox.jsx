
import React from "react";
import styless from "./ViewNFT.module.css";


const HistoryBox = () => {
  return (
    <div className={styless.cardhistorybox}>
      <div className={styless.title} >
        History
      </div>
      <br />
      <div className={styless.description} style={{textAlign:'left' }}>
        {" "}
        No history of sales on Solsea!{" "}
      </div>
    </div>
  );
};

export default HistoryBox;
