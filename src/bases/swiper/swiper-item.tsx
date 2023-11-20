import React from "react";

import "./styles/swiper-item.scss";

export interface SwiperItemProps {
  children?: React.ReactNode;
}

const classPrefix = "tiny-swiper-item";

const SwiperItem: React.FC<SwiperItemProps> = (props) => {
  return <div className={classPrefix}>{props.children}</div>;
};

export default SwiperItem;

SwiperItem.displayName = "SwiperItem";
