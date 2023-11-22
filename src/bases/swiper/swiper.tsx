import React from "react";

import "./styles/swiper.scss";
import SwiperIndicator from "./swiper-indicator";
import SwiperItem from "./swiper-item";
import { modules } from "./utils";

export interface SwiperProps {
  loop?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
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
  const autoplaying = React.useRef<boolean>(false);
  const intervalRef = React.useRef<number>(0);

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
    let finalPosition = index * 100 - currentIndex * 100;

    if (!props.loop) {
      return finalPosition;
    }

    const totalWidth = count * 1000;

    // 无限轮播，当前轮播图前后平均分配轮播图的数量
    const flagWidth = totalWidth / 2;

    finalPosition = modules(finalPosition + flagWidth, totalWidth) - flagWidth;
    return finalPosition;
  };

  const getSlideRatio = (diff: number) => {
    const element = trackRef.current;
    if (!element) {
      return 0;
    }
    return diff / element.offsetWidth;
  };

  const boundIndex = React.useCallback(
    (index: number) => {
      const min = 0;
      const max = count - 1;
      let ret = index;
      ret = Math.max(index, min);
      ret = Math.min(ret, max);
      return ret;
    },
    [count],
  );

  const swipeTo = React.useCallback(
    (index: number) => {
      const targetIndex = props.loop
        ? modules(index, count)
        : boundIndex(index);
      setCurrentIndex(targetIndex);
    },
    [boundIndex, setCurrentIndex, count, props.loop],
  );

  const swipeNext = React.useCallback(() => {
    swipeTo(currentIndex + 1);
  }, [swipeTo, currentIndex]);

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
    clearInterval(intervalRef.current);
    autoplaying.current = false;

    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  };

  const getTransition = (position: number) => {
    if (dragging) {
      return "";
    } else if (autoplaying.current) {
      if (position === -100 || position === 0) {
        return "transform 0.3s ease-out";
      } else {
        return "";
      }
    } else if (position < -100) {
      return "";
    }

    return "transform 0.3s ease-out";
  };

  React.useEffect(() => {
    if (props.autoplay && !dragging) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      autoplaying.current = true;
      swipeNext();
    }, props.autoplayInterval);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [dragging, props.autoplay, props.autoplayInterval, swipeNext]);

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
    <div className={classPrefix} style={props.style}>
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
  autoplayInterval: 3000,
  defaultIndex: 0,
  showIndicator: false,
  loop: false,
};

Swiper.displayName = "Swiper";
