import { Swiper } from "@/bases";
import "./index.module.scss";

function Home() {
  const banners = [
    {
      src: "/banner1.jpg",
      alt: "banner1",
    },
    {
      src: "/banner2.jpg",
      alt: "banner2",
    },
    {
      src: "/banner3.jpg",
      alt: "banner3",
    },
    {
      src: "/banner4.jpg",
      alt: "banner4",
    },
  ];

  return (
    <Swiper showIndicator loop>
      {banners.map((item, index) => (
        <Swiper.Item key={index}>
          <img src={item.src} alt={item.alt} width="100%" height="100%" />
        </Swiper.Item>
      ))}
    </Swiper>
  );
}

export default Home;
