import React from "react";
import cx from "classnames";
import "./styles/swiper-indicator.scss";

export interface SwiperIndicatorProps {
  current: number;
  total: number;
  indicatorClassName?: string;
}

const classPrefix = "tiny-swiper-indicator";

const SwiperIndicator = (React.FC<SwiperIndicatorProps> = (props) => {
  const dots: React.ReactElement[] = React.useMemo(() => {
    return Array(props.total)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          className={cx(`${classPrefix}-dot`, {
            [`${classPrefix}-dot-active`]: props.current === index,
          })}
        />
      ));
  }, [props]);

  return <div className={classPrefix}>{dots}</div>;
});

export default SwiperIndicator;

SwiperIndicator.displayName = "SwiperIndicator";
