import styles from "./styles.module.css";

export const AutoSlideItem = ({ imgUrl }) => {
  return <img alt="" src={imgUrl} className={`${styles.slideImg} slider-item`} />;
};
