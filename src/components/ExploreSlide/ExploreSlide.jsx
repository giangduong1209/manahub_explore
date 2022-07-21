import { Typography, Grid } from 'antd';
import { Navigation } from 'swiper';
import Cardbox from 'components/Explores/Cardbox';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
// import { ArrowIconNext, ArrowIconPrev } from 'components/ArrowIcon/ArrowIcon';
import styles from './styles.module.css';
import { NavLink } from 'react-router-dom';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { getCollectionsByChain } from "helpers/collection";


const { useBreakpoint } = Grid;

const ExploreSlide = () => {
  const { sm, md } = useBreakpoint();
  const NFTCollections = getCollectionsByChain('0x1');

  return (
    <div className={styles.exploreMainWrapper}>
      <div className={styles.exploreSlideWrapper}>
        <NavLink to="/explore">
          <Typography.Title level={3}>Explore</Typography.Title>
        </NavLink>
      </div>
      <Swiper
        slidesPerView={md ? 3 : sm ? 2 : 1}
        spaceBetween={15}
        navigation={{
          nextEl: '.next-btn',
          prevEl: '.prev-btn',
        }}
        modules={[Navigation]}
        className={styles.mySwiper}
      >
        {NFTCollections && NFTCollections.map((item, index) => (
          <SwiperSlide key={index}>
            {/* <Link to="/collection" className="link-custom"> */}
              <Cardbox
                item={{
                  ...item,
                  name: item.name ,
                }}
              />
            {/* </Link> */}
          </SwiperSlide>
        ))}

        <div className={styles.arrowWrapper}>
          <div className={`${styles.btnArrow} prev-btn`}>
            <LeftOutlined />
          </div>
          <div className={`${styles.btnArrow} next-btn`}>
            <RightOutlined />
          </div>
        </div>
      </Swiper>
    </div>
  );
};

export default ExploreSlide;
