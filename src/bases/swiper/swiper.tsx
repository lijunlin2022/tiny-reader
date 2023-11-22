import React from "react";

import "./styles/swiper.scss";
import SwiperIndicator from "./swiper-indicator";
import SwiperItem from "./swiper-item";

export interface SwiperProps {
  loop?: boolean;
  autoplay?: boolean;
  defaultIndex?: number;
  showIndicator?: boolean;
  children: React.ReactElement | React.ReactElement[];
  style?: React.CSSProperties &
    Partial<
      Record<
        "--height" | "--height" | "--border-radius" | "--track-padding",
        string
      >
    >;
  indicatorClassName?: string;
}

const classPrefix = "tiny-swiper";

const Swiper: React.FC<SwiperProps> = (props) => {
  const [currentIndex, setCurrentIndex] = React.useState<number>(
    props.defaultIndex || 0,
  );
  const [dragging, setDrugging] = React.useState<boolean>(false);

  const startRef = React.useRef<number>(0);
  const slideRatioRef = React.useRef<number>(0);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const { validChildren, count } = React.useMemo(() => {
    let count = 0;
    const validChildren = React.Children.map(props.children, (child) => {
      if (!React.isValidElement(child)) {
        return null;
      }
      if (child.type !== SwiperItem) {
        console.warn("Swiper children must be Swiper.Item components");
      }
      count++;
      return child;
    });
    return { validChildren, count };
  }, [props.children]);

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
    const max = count - 1;
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
    setDrugging(false);

    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
  };

  const onTouchMove = (e: TouchEvent) => {
    const currentX = e.changedTouches[0].clientX;
    const diff = startRef.current - currentX;

    slideRatioRef.current = getSlideRatio(diff);
    let position = currentIndex + slideRatioRef.current;
    if (!props.loop) {
      position = boundIndex(position);
    }
    setCurrentIndex(position);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startRef.current = e.changedTouches[0].clientX;

    setDrugging(true);

    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  };

  const getTransition = () => {
    if (dragging) {
      return "";
    }

    return "transform 0.3s ease-out";
  };

  const renderSwiperItem = () => {
    return (
      <div className={`${classPrefix}-track-inner`}>
        {React.Children.map(validChildren, (child, index) => {
          const position = getFinalPosition(index);
          return (
            <div
              className={`${classPrefix}-slide`}
              style={{
                left: `-${index * 100}%`,
                transform: `translateX(${position}%)`,
                transition: getTransition(position),
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

  if (count === 0 || !validChildren) {
    console.warn("Swiper at least one child element is required");
    return null;
  }

  return (
    <div className={classPrefix}>
      <div className={`${classPrefix}-track`} ref={trackRef}>
        {renderSwiperItem()}
      </div>
      {props?.showIndicator && (
        <SwiperIndicator
          total={count}
          current={
            slideRatioRef.current > 0
              ? Math.floor(currentIndex)
              : Math.ceil(currentIndex)
          }
          indicatorClassName={props?.indicatorClassName}
        />
      )}
    </div>
  );
};

export default Swiper;

Swiper.defaultProps = {
  autoplay: false,
  defaultIndex: 0,
  showIndicator: false,
  loop: false,
};

Swiper.displayName = "Swiper";
