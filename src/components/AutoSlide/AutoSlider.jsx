import styles from './styles.module.css';
import Marquee from 'react-fast-marquee';
// import { ArrowIconPrev, ArrowIconNext } from 'components/ArrowIcon/ArrowIcon';
import { AutoSlideItem } from './AutoSlideItem';
import img1 from 'assets/images/AutoSlider/slider-1.png';
import img2 from 'assets/images/AutoSlider/slider-2.jpeg';
import img3 from 'assets/images/AutoSlider/slider-3.jpeg';
import img4 from 'assets/images/AutoSlider/slider-4.png';
import img5 from 'assets/images/AutoSlider/slider-5.jpeg';
import img6 from 'assets/images/AutoSlider/slider-6.jpeg';
import img7 from 'assets/images/AutoSlider/slider-7.jpeg';
import img8 from 'assets/images/AutoSlider/slider-8.png';
import img9 from 'assets/images/AutoSlider/slider-9.png';
import img10 from 'assets/images/AutoSlider/slider-10.png';
import img11 from 'assets/images/AutoSlider/slider-11.jpeg';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useState } from 'react';

const data = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
];

export const AutoSlider = () => {
  const [direction, setDirection] = useState('left');

  return (
    <div className={styles.marqueeSlideWrapper}>
      <div
        className={`${styles.btnPrev} ${styles.btnArrow} prev-btn`}
        onClick={() => setDirection('left')}
      >
        <LeftOutlined />
      </div>
      <Marquee speed={70} gradientWidth={50} direction={direction}>
        {data.map((item, idx) => (
          <AutoSlideItem key={idx} imgUrl={item} />
        ))}
      </Marquee>
      <div
        className={`${styles.btnNext} ${styles.btnArrow} next-btn`}
        onClick={() => setDirection('right')}
      >
        <RightOutlined />
      </div>
    </div>
  );
};
