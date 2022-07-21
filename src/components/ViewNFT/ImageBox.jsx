
import React from "react";
import styless from "./ViewNFT.module.css";
import { useState, useEffect } from "react";
// import MysteryBoxGif from "assets/images/mystery-box.gif";

const ImageBox = ({ image }) => {
  const [mediaType, setMediaType] = useState('');

  useEffect(() => {
    fetch(image)
      .then((rs) => {
        let type = rs.headers.get("content-type");
        setMediaType(type);
      })
      .catch((err) => console.log("fetch type media error:", err));
  }, [image]);

  return (
    <div className={styless.cardimgbox}>
      {/* <div
        className={styless.image}
        style={{ backgroundImage: `url(${image})` }}
      ></div> */}
      {
        mediaType.includes('video') ?
          <video className={styless.image} width="350" controls> <source src={image} type={mediaType}></source></video>
          :
          mediaType.includes('audio') ?
            <audio className={styless.image} width="350" controls> <source src={image} type={mediaType}></source></audio>
            :
            <img alt="" src={image} type={mediaType} className={styless.image} width="350" loading='lazy' />
      }
    </div>
  );
};

export default ImageBox;
