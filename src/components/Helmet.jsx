import React from "react";
import { Helmet } from "react-helmet";
export default function HelmetMetaData(props) {
   //  console.log(props);
   let currentUrl = props.url !== undefined ? props.url :  "https://marketplace.metamints.app/" ;
//    let quote = props.quote !== undefined ? props.quote : "";
   let title = props.title !== undefined ? props.title : "Metamints";
   let image = props.image !== undefined ? props.image : "https://i.postimg.cc/wxcg3n23/meta-img.jpg"
   let description = props.description !== undefined ? props.description  : "WonderfullDay Metamints";
//    let hashtag = props.hashtag !== undefined ? props.hashtag : "#reactJs";
return (
 <Helmet>
     <title>{title}</title>
    <meta name="og:url" content={currentUrl} />
    <meta property="og:title" content="MetaMints" />
    <meta property="og:type" content=""/>
    <meta property="og:url" content={currentUrl}/>
    <meta property="og:image" content={image}/>
    <meta content="image/*" property="og:image:type" />
    <meta property="og:image:url" content={image}/>
    <meta property="og:image:width" content="200" />
    <meta property="og:image:height" content="200" />
    <meta property="og:image:alt" content="" />
    <meta property="og:description" content={description} /> 
     </Helmet>
);
}
