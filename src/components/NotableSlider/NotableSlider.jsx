import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Grid, Typography } from 'antd';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { NotableItem } from './NotableItem';
import styles from './styles.module.css';

const { useBreakpoint } = Grid;

const data = [
  {
    avatarUrl: 'https://lh3.googleusercontent.com/LIov33kogXOK4XZd2ESj29sqm_Hww5JSdO7AFn5wjt8xgnJJ0UpNV9yITqxra3s_LMEW1AnnrgOVB_hDpjJRA1uF4skI5Sdi_9rULi8=s0',
    imgUrl: 'https://lh3.googleusercontent.com/H4Iu36XQNJqVlF99-0BuQna0sUlUcIrHt97ss3le_tAWw8DveEBfTktX3S0bP6jpC9FhN1CKZjoYzZFXpWjr1xZfQIwSSLeDjdi0jw=h600',
    title: 'Cool Cats NFT',
    name: 'AI Artists',
    addrs: "0x1A92f7381B9F03921564a437210bB9396471050C",
  },
  {
    avatarUrl: 'https://lh3.googleusercontent.com/LIpf9z6Ux8uxn69auBME9FCTXpXqSYFo8ZLO1GaM8T7S3hiKScHaClXe0ZdhTv5br6FE2g5i-J5SobhKFsYfe6CIMCv-UfnrlYFWOM4=s0',
    imgUrl: 'https://lh3.googleusercontent.com/8QAOgrzgfu8tR0K80iZW_93o9dUpyGMACpwr4kSeTvinu2hYBvzMOyLoHspo6IPpz7G2Xe57VTXfgGPECzWTaH_oYFNVCuA12AIDJA=h600',
    title: 'CyberKongz',
    name: 'AI Artists',
    addrs: "0x57a204AA1042f6E66DD7730813f4024114d74f37",
  },
  {
    avatarUrl: 'https://lh3.googleusercontent.com/7gOej3SUvqALR-qkqL_ApAt97SpUKQOZQe88p8jPjeiDDcqITesbAdsLcWlsIg8oh7SRrTpUPfPlm12lb4xDahgP2h32pQQYCsuOM_s=s0',
    imgUrl: 'https://lh3.googleusercontent.com/a5IYMKaL19_3PhnVHM1f4pavIGLos1VEIw61d5yDPJprXdvmnTmc-EZMibYW8mOo4d8mP02KQ0SK_2RFUR0Hbajd6E7v-unyrD0vxw=h600',
    title: '0N1 Force',
    name: 'AI Artists',
    addrs: "0x3bf2922f4520a8BA0c2eFC3D2a1539678DaD5e9D",
  },
  {
    avatarUrl: 'https://lh3.googleusercontent.com/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ=s0',
    imgUrl: 'https://lh3.googleusercontent.com/svc_rQkHVGf3aMI14v3pN-ZTI7uDRwN-QayvixX-nHSMZBgb1L1LReSg1-rXj4gNLJgAB0-yD8ERoT-Q2Gu4cy5AuSg-RdHF9bOxFDw=h600',
    title: 'Doodles',
    name: 'AI Artists',
    addrs: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
  },
];

const NotableSlider = () => {
  const { md, lg } = useBreakpoint();

  return (
    <div style={{ marginBottom: 120 }}>
      <div className={styles.notableSliderWrapper}>
        <Typography.Title level={3}>
          Notable <Typography.Text>Collections</Typography.Text>
        </Typography.Title>
      </div>
      <Swiper
        loop={true}
        slidesPerView={!md ? 1 : 2}
        spaceBetween={lg ? 30 : 15}
        centeredSlides={true}
        // pagination={{
        //   clickable: true,
        // }}
        navigation={{
          nextEl: '.next-btn',
          prevEl: '.prev-btn',
        }}
        modules={[Navigation]}
        className={styles.mySwiper}
      >
        <div className={`${styles.btnPrev} ${styles.btnArrow} prev-btn`}>
          <LeftOutlined />
        </div>

        {data.map((item, i) => (
          <SwiperSlide key={i}>
            <NotableItem
              imgUrl={item.imgUrl}
              avatarUrl={item.avatarUrl}
              title={item.title}
              name={item.name}
              addrs={item.addrs}
            />
          </SwiperSlide>
        ))}
        <div className={`${styles.btnNext} ${styles.btnArrow} next-btn`}>
          <RightOutlined />
        </div>
      </Swiper>
    </div>
  );
};

export default NotableSlider;
