import clsx from "clsx";
import React, { useEffect, useState } from "react";

import styles from "../../styles.module.css";

export const CitySvg = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.53414 0C6.93106 0 8.33285 0 9.72977 0C9.90499 0.0978472 9.9488 0.254403 9.9488 0.445205C9.94393 0.919764 9.9488 1.39432 9.9488 1.86888C9.9488 2.01565 9.9488 2.16732 9.9488 2.29941C9.98287 2.31898 9.9926 2.32876 10.0072 2.32876C10.2652 2.33366 10.5231 2.33366 10.786 2.33366C11.1997 2.33366 11.2824 2.41683 11.2824 2.84246C11.2824 4.91682 11.2824 6.99608 11.2824 9.07044C11.2824 9.15361 11.2824 9.23678 11.2824 9.33462C11.5793 9.33462 11.847 9.33462 12.1196 9.33462C12.1634 9.33462 12.2072 9.32973 12.2608 9.32484C12.2656 9.28081 12.2705 9.25145 12.2705 9.2221C12.2705 8.94324 12.2656 8.66437 12.2754 8.38061C12.2802 8.11153 12.3922 8.00879 12.6599 7.99901C12.7475 7.99901 12.8351 7.99901 12.9227 7.99901C12.9714 7.72993 12.8449 7.3679 13.244 7.34343C13.7161 7.31408 13.5603 7.72993 13.6236 7.99901C13.7307 7.99901 13.8329 7.99412 13.9351 7.99901C14.1396 8.00879 14.2418 8.10664 14.2612 8.31212C14.271 8.41486 14.2661 8.52249 14.2661 8.62523C14.2661 8.85517 14.2661 9.08511 14.2661 9.31995C14.3927 9.31995 14.4851 9.31995 14.5971 9.31995C14.5971 9.23188 14.5971 9.1585 14.5971 9.08022C14.5971 7.42171 14.5971 5.75831 14.5971 4.0998C14.5971 3.76712 14.6993 3.66927 15.0254 3.66438C15.2104 3.66438 15.3953 3.66438 15.5949 3.66438C15.5949 3.33659 15.59 3.03816 15.5949 2.73972C15.5998 2.4315 15.6971 2.33366 16.0037 2.33366C16.5878 2.33366 17.167 2.33366 17.7511 2.33366C18.1551 2.33366 18.2427 2.42172 18.2427 2.82289C18.2427 3.10176 18.2427 3.37573 18.2427 3.66927C18.4812 3.66927 18.6954 3.66438 18.9095 3.66927C19.1042 3.67416 19.2064 3.77201 19.2259 3.9677C19.2356 4.0362 19.2356 4.10958 19.2356 4.18297C19.2356 9.28081 19.2356 14.3786 19.2356 19.4716C19.2356 19.545 19.2356 19.6135 19.2308 19.6869C19.2162 19.8826 19.1042 19.9755 18.9193 19.9951C18.856 20 18.7878 20 18.7246 20C12.655 20 6.59035 20 0.520803 20C0.457528 20 0.389385 20.0049 0.32611 19.9951C0.141152 19.9755 0.0243366 19.8826 0.014602 19.6869C0 19.6135 0 19.5352 0 19.4569C0 16.9325 0 14.408 0 11.8787C0 11.8053 0 11.7368 0.00486732 11.6634C0.0243366 11.4481 0.121683 11.3503 0.335845 11.3307C0.438059 11.3209 0.540272 11.3307 0.632751 11.3307C0.647353 11.2965 0.657088 11.2867 0.657088 11.272C0.661955 11.0029 0.661955 10.7387 0.661955 10.4697C0.661955 10.0832 0.749567 9.99509 1.12922 9.99509C1.70356 9.99509 2.28277 9.99509 2.85712 9.99509C3.2173 9.99509 3.31464 10.0929 3.31464 10.4599C3.31464 10.7436 3.31464 11.0274 3.31464 11.3111C3.54827 11.3111 3.75757 11.3111 3.9766 11.3111C3.9766 11.2182 3.9766 11.1399 3.9766 11.0616C3.9766 8.32191 3.9766 5.58218 3.9766 2.84246C3.9766 2.40704 4.04961 2.33366 4.4828 2.33366C4.7505 2.33366 5.02307 2.33366 5.30051 2.33366C5.30051 1.67808 5.30538 1.05186 5.30051 0.430528C5.30051 0.239726 5.35405 0.0880625 5.53414 0ZM7.31071 10.0049C7.31071 13.1213 7.31071 16.2231 7.31071 19.3199C7.52974 19.3199 7.73417 19.3199 7.95806 19.3199C7.95806 19.2319 7.95806 19.1536 7.95806 19.0753C7.95806 16.4432 7.95806 13.816 7.95806 11.1839C7.95806 11.091 7.96293 11.0029 7.97753 10.9149C8.00674 10.7387 8.13815 10.6653 8.29878 10.6702C8.46426 10.6751 8.58595 10.7583 8.60542 10.9344C8.61515 11.0225 8.61515 11.1154 8.61515 11.2084C8.61515 13.8307 8.61515 16.453 8.61515 19.0802C8.61515 19.1634 8.61515 19.2417 8.61515 19.3199C8.85365 19.3199 9.05808 19.3199 9.27711 19.3199C9.27711 19.2221 9.27711 19.1389 9.27711 19.0557C9.27711 16.4383 9.27711 13.8209 9.27711 11.2035C9.27711 11.1106 9.28197 11.0225 9.29171 10.9295C9.31604 10.7485 9.43773 10.6751 9.59835 10.6653C9.76871 10.6556 9.89526 10.7632 9.92446 10.9344C9.93906 11.0225 9.93906 11.1154 9.93906 11.2084C9.93906 13.8258 9.93906 16.4432 9.93906 19.0606C9.93906 19.1438 9.93906 19.227 9.93906 19.3199C10.1678 19.3199 10.3771 19.3199 10.601 19.3199C10.601 19.2221 10.601 19.1389 10.601 19.0557C10.601 16.4383 10.601 13.8209 10.601 11.2035C10.601 11.1106 10.601 11.0225 10.6108 10.9295C10.6351 10.7485 10.7568 10.6702 10.9223 10.6653C11.078 10.6605 11.2046 10.7289 11.2386 10.8953C11.2581 10.9882 11.263 11.091 11.263 11.1839C11.263 13.8062 11.263 16.4285 11.263 19.0557C11.263 19.1389 11.263 19.2221 11.263 19.315C11.4917 19.315 11.701 19.315 11.9249 19.315C11.9249 19.227 11.9249 19.1487 11.9249 19.0704C11.9249 16.4383 11.9249 13.8111 11.9249 11.179C11.9249 11.0959 11.9249 11.0078 11.9347 10.9246C11.959 10.7583 12.0709 10.6751 12.2267 10.6653C12.3825 10.6556 12.5139 10.7143 12.5577 10.8757C12.582 10.9687 12.5869 11.0665 12.5869 11.1644C12.5869 13.8013 12.5869 16.4383 12.5869 19.0753C12.5869 19.1585 12.5869 19.2368 12.5869 19.315C12.8254 19.315 13.0298 19.315 13.2488 19.315C13.2488 19.227 13.2488 19.1487 13.2488 19.0753C13.2488 16.4383 13.2488 13.8013 13.2488 11.1644C13.2488 11.0861 13.244 11.0078 13.2586 10.9295C13.2878 10.7534 13.4046 10.6702 13.5701 10.6653C13.7258 10.6605 13.8524 10.7289 13.8913 10.8953C13.9108 10.9833 13.9157 11.0763 13.9157 11.1644C13.9157 13.8062 13.9157 16.4481 13.9157 19.0949C13.9157 19.1683 13.9157 19.2465 13.9157 19.3199C14.1493 19.3199 14.3537 19.3199 14.563 19.3199C14.563 16.2084 14.563 13.1066 14.563 9.99998C12.1537 10.0049 9.7395 10.0049 7.31071 10.0049ZM18.5542 19.3297C18.5542 14.3248 18.5542 9.33952 18.5542 4.34931C17.4493 4.34931 16.3591 4.34931 15.2639 4.34931C15.2639 9.3493 15.2639 14.3346 15.2639 19.3297C16.3639 19.3297 17.4493 19.3297 18.5542 19.3297ZM10.5961 9.32973C10.5961 7.21623 10.5961 5.11741 10.5961 3.02348C10.5669 3.01369 10.5572 3.0088 10.5426 3.0088C10.2749 3.0088 10.0121 3.0088 9.74437 3.00391C9.37932 3.00391 9.28197 2.90606 9.27711 2.54403C9.27711 1.99119 9.27711 1.43835 9.27711 0.885517C9.27711 0.817024 9.27224 0.748531 9.26737 0.680038C8.15762 0.680038 7.06248 0.680038 5.96246 0.680038C5.96246 1.18884 5.96246 1.68297 5.96246 2.1771C5.96733 2.95988 6.03547 3.02348 5.14475 3.00391C4.97927 2.99902 4.81378 3.00391 4.64829 3.00391C4.64829 5.79256 4.64829 8.55674 4.64829 11.316C4.87218 11.316 5.08148 11.316 5.29564 11.316C5.29564 11.2231 5.29564 11.1448 5.29564 11.0665C5.29564 8.76711 5.29564 6.47259 5.29564 4.17318C5.29564 4.08512 5.29564 3.98727 5.31998 3.9041C5.36378 3.73287 5.49033 3.66438 5.66069 3.67906C5.82131 3.68884 5.92353 3.78179 5.95273 3.94324C5.96733 4.02152 5.96246 4.0998 5.96246 4.17808C5.96246 6.48238 5.96246 8.78668 5.96246 11.091C5.96246 11.1693 5.96246 11.2426 5.96246 11.3258C6.19609 11.3258 6.40539 11.3258 6.62442 11.3258C6.62442 11.2329 6.62442 11.1595 6.62442 11.0812C6.62442 8.78179 6.62442 6.48727 6.62442 4.18786C6.62442 4.09001 6.62929 3.99217 6.65362 3.89921C6.69743 3.73776 6.82398 3.67416 6.97973 3.68395C7.14035 3.69373 7.24744 3.7769 7.27664 3.94324C7.29124 4.02641 7.28637 4.10958 7.28637 4.19765C7.28637 5.83169 7.28637 7.46574 7.28637 9.09979C7.28637 9.17807 7.28637 9.25145 7.28637 9.33462C7.52 9.33462 7.7293 9.33462 7.94833 9.33462C7.94833 9.24167 7.94833 9.16828 7.94833 9.09001C7.94833 7.45596 7.94833 5.82191 7.94833 4.18786C7.94833 4.0998 7.9532 4.00195 7.97267 3.91878C8.01647 3.74755 8.14302 3.67906 8.30851 3.68884C8.46913 3.69862 8.57621 3.78669 8.60055 3.94813C8.61028 4.03131 8.61028 4.11448 8.61028 4.20254C8.61028 5.83659 8.61028 7.47063 8.61028 9.10468C8.61028 9.18296 8.61028 9.25635 8.61028 9.33462C8.84391 9.33462 9.05321 9.33462 9.27224 9.33462C9.27224 9.23188 9.27224 9.14872 9.27224 9.06555C9.27224 7.45107 9.27224 5.83659 9.27224 4.22211C9.27224 4.12915 9.27711 4.04109 9.28684 3.94813C9.31118 3.77201 9.42799 3.69373 9.59835 3.68884C9.77357 3.68395 9.89039 3.7818 9.91959 3.95792C9.93419 4.04109 9.93419 4.12426 9.93419 4.21232C9.93419 5.84148 9.93419 7.46574 9.93419 9.0949C9.93419 9.17807 9.93419 9.25635 9.93419 9.34441C10.1824 9.32973 10.382 9.32973 10.5961 9.32973ZM0.681424 12.0059C0.681424 14.452 0.681424 16.8884 0.681424 19.3199C1.79117 19.3199 2.88145 19.3199 3.98147 19.3199C3.98147 19.227 3.98147 19.1487 3.98147 19.0704C3.98147 17.0939 3.98147 15.1125 3.98147 13.136C3.98147 12.7593 4.07394 12.6663 4.4536 12.6663C5.10582 12.6663 5.7629 12.6663 6.41512 12.6663C6.48327 12.6663 6.55141 12.6663 6.61468 12.6663C6.61468 12.4266 6.61468 12.2211 6.61468 12.0107C4.63369 12.0059 2.66242 12.0059 0.681424 12.0059ZM6.61955 16.0029C6.48813 16.0029 6.37619 16.0029 6.2691 16.0029C6.03547 15.998 5.80184 16.0029 5.57308 15.9833C5.40272 15.9687 5.29564 15.8219 5.31511 15.6507C5.32971 15.4843 5.40759 15.362 5.58768 15.3473C5.80184 15.3327 6.016 15.3376 6.23017 15.3327C6.36158 15.3327 6.493 15.3327 6.62442 15.3327C6.62442 15.0929 6.62442 14.8875 6.62442 14.6624C6.34698 14.6624 6.08415 14.6624 5.81644 14.6624C5.45626 14.6624 5.31024 14.5597 5.31511 14.3248C5.31998 14.0949 5.466 13.997 5.81158 13.997C6.07928 13.997 6.35185 13.997 6.62442 13.997C6.62442 13.7622 6.62442 13.5567 6.62442 13.3415C5.96246 13.3415 5.31511 13.3415 4.65802 13.3415C4.65802 15.3424 4.65802 17.3287 4.65802 19.3199C5.31998 19.3199 5.9722 19.3199 6.62442 19.3199C6.62442 19.0998 6.62442 18.8943 6.62442 18.6692C6.31291 18.6692 6.01114 18.679 5.70936 18.6644C5.59741 18.6595 5.4514 18.6105 5.39299 18.5274C5.33458 18.4491 5.31998 18.2779 5.36378 18.1898C5.40759 18.1017 5.54874 18.0186 5.65096 18.0137C5.9722 17.9892 6.29344 18.0039 6.63902 18.0039C6.63902 17.8816 6.63902 17.7788 6.63902 17.6761C6.63902 17.5685 6.63902 17.4608 6.63902 17.3336C6.54654 17.3336 6.47353 17.3336 6.40539 17.3336C6.15716 17.3336 5.91379 17.3434 5.66556 17.3287C5.38325 17.3141 5.2421 17.0743 5.35405 16.8395C5.42219 16.6927 5.55361 16.6634 5.69476 16.6634C6.0014 16.6634 6.31291 16.6634 6.62929 16.6634C6.61955 16.4383 6.61955 16.2329 6.61955 16.0029ZM16.2617 3.6497C16.7144 3.6497 17.1427 3.6497 17.5661 3.6497C17.5661 3.42954 17.5661 3.22407 17.5661 3.01369C17.1232 3.01369 16.6949 3.01369 16.2617 3.01369C16.2617 3.23385 16.2617 3.43933 16.2617 3.6497ZM2.64295 11.3209C2.64295 11.1008 2.64295 10.8904 2.64295 10.68C2.20003 10.68 1.7717 10.68 1.34338 10.68C1.34338 10.9051 1.34338 11.1154 1.34338 11.3209C1.78631 11.3209 2.20976 11.3209 2.64295 11.3209ZM12.9471 8.67905C12.9471 8.9041 12.9471 9.11447 12.9471 9.32484C13.1661 9.32484 13.3705 9.32484 13.5847 9.32484C13.5847 9.10468 13.5847 8.8992 13.5847 8.67905C13.3657 8.67905 13.1612 8.67905 12.9471 8.67905Z"
      fill="black"
    />
  </svg>
);

export const BackSvg = () => (
  <svg
    width="10"
    height="18"
    viewBox="0 0 10 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 17L1 9L9 1"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const UpIconvg = () => (
  <svg
    width="18"
    height="10"
    viewBox="0 0 18 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 9L9 1L17 9"
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const data = [
  { value: 1, label: "Hà Nội" },
  { value: 2, label: "Đà Nẵng" },
  { value: 3, label: "TP.Hồ Chí Minh" },
];

const GameMap = ({ show }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    const initMap = () => {
      let options = {
        center: { lat: 10.771994, lng: 106.705795 },
        zoom: 18,
        tilt: 60,
        controls: true,
      };
      let map = new window.map4d.Map(
        document.getElementById("game-map-target"),
        options
      );
      map.enable3dMode(true);
    };

    initMap();
  }, []);

  return (
    <div
      id="game-map-target"
      className={clsx(styles.gameBuyProperties, { [styles.show]: show })}
    >
      <div className={styles.propertiesFilter}>
        {!showFilter ? (
          <div
            className={styles.propertiesFilterAnchor}
            style={{ cursor: "pointer" }}
            onClick={() => setShowFilter(true)}
          >
            <CitySvg />
          </div>
        ) : (
          <div
            className={clsx(styles.propertiesFilterAnchor, {
              [styles.showFilter]: showFilter,
            })}
          >
            <div className={styles.propertiesFilterHeader}>
              <CitySvg />
              <span className={styles.propertiesFilterTitle}>City</span>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setShowFilter(false)}
              >
                <BackSvg />
              </span>
            </div>
          </div>
        )}

        {showFilter && (
          <div className={styles.propertiesFilterContent}>
            {data.map(({ value: _value, label }) => (
              <div
                onClick={() => setValue(_value)}
                className={clsx(styles.propertiesFilterItem, {
                  [styles.filterSelected]: _value === value,
                })}
                key={_value}
              >
                {label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameMap;
