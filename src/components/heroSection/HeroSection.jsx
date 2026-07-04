import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import banner1 from "../../assets/banner.png";
import banner2 from "../../assets/banner2.png";
import { useData } from '../../context/data/MyState';

const fallbackImages = [banner1, banner2];

const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
    style={{ color:"#fff", background:"rgba(0,0,0,0.6)", padding:8, borderRadius:"50%", lineHeight:0 }}
  >
    <FaChevronRight size={16}/>
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
    style={{ color:"#fff", background:"rgba(0,0,0,0.6)", padding:8, borderRadius:"50%", lineHeight:0 }}
  >
    <FaChevronLeft size={16}/>
  </div>
);

function HeroSection() {
  const { sliderImages } = useData();
  const images = sliderImages.length > 0 ? sliderImages.map(img => img.imageUrl) : fallbackImages;

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    adaptiveHeight: true,
    dotsClass: "slick-dots ig-dots",
  };

  return (
    <div style={{ background:"#000" }}>
      {/* Title */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-8 md:py-14 lg:py-8">
        <h1 className="text-3xl sm:text-4xl md:text-7xl font-extrabold mb-3"
          style={{ background:"linear-gradient(45deg,#F58529,#DD2A7B,#8134AF)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
          ARPA
        </h1>
        <h2 className="text-lg sm:text-xl md:text-3xl font-semibold mb-3" style={{ color:"#FAFAFA" }}>
          Scrunchie And Fashion Accessories
        </h2>
        <h3 className="text-sm sm:text-base font-light max-w-2xl" style={{ color:"#A8A8A8" }}>
          "Elevate Your Hair Game with Our Stylish Scrunchies 🌟 | Over 1000 Scrunchies Sold Last Month!"
        </h3>
      </div>

      {/* Slider */}
      <div className="relative w-full overflow-hidden">
        <Slider {...settings}>
          {images.map((src, index) => (
            <div key={index} className="w-full">
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-48 sm:h-56 md:h-72 lg:h-96 object-cover object-top"
                onError={e => { e.target.src = banner1; }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default HeroSection;
