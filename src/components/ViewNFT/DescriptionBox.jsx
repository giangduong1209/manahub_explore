
import React from "react";
import styless from "./ViewNFT.module.css";


const DescriptionBox = ({description}) => {
  return (
    <div className={styless.cardbox}>
      <div className={styless.description} style={{borderTop :'solid 1px gray',fontFamily:'none'}}>
        <pre style={{fontFamily:'GILROY'}}>
          {description ? description : 'No description'}
       </pre>
      </div>
    </div>
  );
};

export default DescriptionBox;
