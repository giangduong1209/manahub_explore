import { Card, Avatar } from "antd";
import img from "assets/images/Banner/Card.png";
import ava from "assets/images/Banner/Avatar.png";

const { Meta } = Card;

export const CardBanner = ({ height, title, description, avatarUrl }) => {
  return (
    <Card
      hoverable
      style={{ width: "100%", height: height || "auto" }}
      cover={
        <img
          alt=""
          src={img}
          style={{ width: "100%", height: height || "auto" }}
        />
      }
    >
      <Meta
        avatar={<Avatar src={avatarUrl || ava} />}
        title={title || "Pixelate High School"}
        description={
          description || (
            <p>
              by{" "}
              <span style={{ color: "#F27352", fontWeight: 700 }}>
                POMCHUBOI
              </span>
            </p>
          )
        }
      />
    </Card>
  );
};
