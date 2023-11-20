import React from "react";

import "./styles/swiper.scss";

export interface SwiperProps {
  loop?: boolean;
  autoplay?: boolean;
  defaultIndex?: number;
  children: React.ReactElement | React.ReactElement[];
  style?: React.CSSProperties &
    Partial<
      Record<
        "--height" | "--height" | "--border-radius" | "--track-padding",
        string
      >
    >;
}

const classPrefix = "tiny-swiper";

const Swiper: React.FC<SwiperProps> = (props) => {
  const [currentIndex, setCurrentIndex] = React.useState<number>(
    props.defaultIndex || 0,
  );

  const startRef = React.useRef<number>(0);
  const slideRatioRef = React.useRef<number>(0);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const getFinalPosition = (index: number) => {
    const finalPosition = index * 100 - currentIndex * 100;
    return finalPosition;
  };

  const getSlideRatio = (diff: number) => {
    const element = trackRef.current;
    if (!element) {
      return 0;
    }
    return diff / element.offsetWidth;
  };

  const boundIndex = (index: number) => {
    const min = 0;
    const max = React.Children.count(props.children) - 1;
    let ret = index;
    ret = Math.max(index, min);
    ret = Math.min(ret, max);
    return ret;
  };

  const swipeTo = (index: number) => {
    const targetIndex = boundIndex(index);
    setCurrentIndex(targetIndex);
  };

  const onTouchEnd = () => {
    const index = Math.round(slideRatioRef.current);
    slideRatioRef.current = 0;

    const position = currentIndex + index;
    swipeTo(position);

    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
  };

  const onTouchMove = (e: TouchEvent) => {
    const currentX = e.changedTouches[0].clientX;
    const diff = startRef.current - currentX;

    slideRatioRef.current = getSlideRatio(diff);
    const position = currentIndex + slideRatioRef.current;
    setCurrentIndex(position);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startRef.current = e.changedTouches[0].clientX;

    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  };

  const renderSwiperItem = () => {
    return (
      <div className={`${classPrefix}-track-inner`}>
        {React.Children.map(props.children, (child, index) => {
          const position = getFinalPosition(index);
          return (
            <div
              className={`${classPrefix}-slide`}
              style={{
                left: `-${index * 100}%`,
                transform: `translateX(${position}%)`,
              }}
              onTouchStart={onTouchStart}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={classPrefix}>
      <div className={`${classPrefix}-track`} ref={trackRef}>
        {renderSwiperItem()}
      </div>
    </div>
  );
};

export default Swiper;

Swiper.displayName = "Swiper";
