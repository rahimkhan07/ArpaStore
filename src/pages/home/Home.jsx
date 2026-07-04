import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../context/data/MyState";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/CartSlice";
import { addToWishlist } from "../../redux/WishlistSlice";
import { toast } from "react-toastify";
import Slider from "react-slick";
import { FaHeart, FaCartShopping } from "react-icons/fa6";
import { FaStar, FaShieldAlt, FaTruck, FaGift } from "react-icons/fa";
import { Search, ArrowRight, ShoppingBag } from "lucide-react";
import WhatsAppChat from "../../components/whatsapp/WhatsAppChat";

const PINK   = "#E91E8C";
const ROSE   = "#FF6B9D";
const LILAC  = "#C77DFF";
const CREAM  = "#FFF5F7";

const HERO_SLIDES = [
  {
    title: "Adorn Your Hair,",
    sub: "Express Yourself",
    desc: "Premium bows, scrunchies & clips crafted with love for every style.",
    cta: "Shop Now",
    bg: "linear-gradient(135deg, #FFF0F5 0%, #FFD6E7 50%, #FFC0E0 100%)",
    accent: "#E91E8C",
    emoji: "🎀",
  },
  {
    title: "Scrunchie Season",
    sub: "Is Always",
    desc: "Velvet, satin & ribbon scrunchies in every colour you love.",
    cta: "Explore Scrunchies",
    bg: "linear-gradient(135deg, #F3E5FF 0%, #E0BAFF 50%, #D0A0FF 100%)",
    accent: "#9C27B0",
    emoji: "🪢",
  },
  {
    title: "Gift the Perfect",
    sub: "Hair Accessory Set",
    desc: "Beautifully curated gift sets for your loved ones.",
    cta: "Shop Gift Sets",
    bg: "linear-gradient(135deg, #FFF3E0 0%, #FFCBA4 50%, #FFB07C 100%)",
    accent: "#FF6B35",
    emoji: "🎁",
  },
];

const FEATURES = [
  { icon: <FaTruck  />, title: "Free Delivery", desc: "On orders above ₹499",   color: "#E91E8C" },
  { icon: <FaShieldAlt />, title: "Quality Assured", desc: "Premium handpicked products", color: "#9C27B0" },
  { icon: <FaGift   />, title: "Gift Wrapping",  desc: "Complimentary on request", color: "#FF6B35" },
  { icon: <FaStar   />, title: "Top Rated",      desc: "4.9★ by 2,000+ customers", color: "#F59E0B" },
];

const TESTIMONIALS = [
  { name: "Priya S.",    text: "The velvet scrunchies are SO soft! I ordered 3 packs 💕", rating: 5, avatar: "P" },
  { name: "Ayesha R.",   text: "Beautiful bows, exactly as shown. Fast delivery too!",   rating: 5, avatar: "A" },
  { name: "Meera K.",    text: "Gifted the set to my bestie — she absolutely loved it 🎀", rating: 5, avatar: "M" },
];

/* ── Small Product Card for homepage ── */
function MiniProductCard({ item }) {
  const { calcOffer, mode } = useData();
  const dispatch  = useDispatch();
  const cartItems = useSelector(s => s.cart);
  const wishlist  = useSelector(s => s.wishlist);
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();
  const [wished, setWished] = useState(wishlist.some(w => w.id === item.id));

  const addCart = (e) => {
    e.preventDefault();
    if (!user) return toast.warning("Please login first!");
    const already = cartItems.some(c => c.id === item.id);
    if (already) return toast.info("Already in cart!");
    dispatch(addToCart(item));
    toast.success("Added to cart 🛒");
  };

  const addWish = (e) => {
    e.preventDefault();
    if (!user) return toast.warning("Please login first!");
    if (!wished) {
      dispatch(addToWishlist(item));
      setWished(true);
      toast.success("Added to wishlist 💕");
    } else {
      toast.info("Already in wishlist!");
    }
  };

  return (
    <Link to={`/productinfo/${item.id}`}>
      <div
        className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        style={{ background: "#fff", border: "1px solid #FFD6E7", boxShadow: "0 2px 12px rgba(233,30,140,0.08)" }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ paddingBottom: "100%" }}>
          <img
            src={item.imageUrl}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {item.featured && (
            <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full text-white"
              style={{ background: PINK }}>
              ⭐ Featured
            </span>
          )}
          <button onClick={addWish}
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition"
            style={{ background: "rgba(255,255,255,0.9)" }}>
            <FaHeart style={{ color: wished ? "#E91E8C" : "#ccc", fontSize: 13 }} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs font-medium mb-0.5" style={{ color: "#aaa" }}>{item.category}</p>
          <h3 className="font-semibold text-sm truncate mb-1" style={{ color: "#2d2d2d" }}>{item.title}</h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-base" style={{ color: PINK }}>₹{calcOffer(item.price)}</span>
              <span className="text-xs line-through ml-1" style={{ color: "#bbb" }}>₹{item.price}</span>
            </div>
            <button onClick={addCart}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white transition hover:scale-110"
              style={{ background: PINK }}>
              <FaCartShopping style={{ fontSize: 12 }} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { product, hairCategories, mode, sliderImages } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    beforeChange: (_, next) => setActiveSlide(next),
    appendDots: dots => (
      <div style={{ bottom: 12 }}>
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div style={{
        width: i === activeSlide ? 20 : 7, height: 7,
        borderRadius: 999, background: i === activeSlide ? PINK : "rgba(233,30,140,0.3)",
        transition: "all 0.3s",
      }} />
    ),
  };

  const featuredProducts = product.filter(p => p.featured).slice(0, 8);
  const latestProducts   = product.slice(-8).reverse();

  const bg   = mode === "dark" ? "#1a0a14" : CREAM;
  const card = mode === "dark" ? "#2d1a26" : "#fff";
  const text = mode === "dark" ? "#FAFAFA" : "#2d2d2d";
  const muted= mode === "dark" ? "#c0a0b0" : "#888";

  return (
    <div style={{ background: bg, color: text }}>

      {/* ── HERO SLIDER ── */}
      <section className="relative">
        {sliderImages.length > 0 ? (
          /* Admin-uploaded full-image slides */
          <Slider {...sliderSettings}>
            {sliderImages.map((img, i) => (
              <div key={i}>
                <div className="relative" style={{ height: "420px" }}>
                  <img
                    src={img.imageUrl}
                    alt={`Slide ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = "none"; }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
                    style={{ background: "rgba(0,0,0,0.25)" }}>
                    <Link to="/allproducts"
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg transition hover:scale-105 mt-4"
                      style={{ background: PINK }}>
                      <ShoppingBag size={16} /> Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          /* Default branded slides */
          <Slider {...sliderSettings}>
            {HERO_SLIDES.map((slide, i) => (
              <div key={i}>
                <div
                  className="flex flex-col items-center justify-center text-center py-16 px-4 sm:py-24 min-h-[360px] sm:min-h-[440px]"
                  style={{ background: slide.bg }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}>
                    <div className="text-5xl sm:text-7xl mb-4">{slide.emoji}</div>
                    <h1 className="text-3xl sm:text-5xl font-black mb-2" style={{ color: slide.accent }}>
                      {slide.title}
                    </h1>
                    <h2 className="text-2xl sm:text-4xl font-black mb-4" style={{ color: "#2d2d2d" }}>
                      {slide.sub}
                    </h2>
                    <p className="text-sm sm:text-base mb-8 max-w-md mx-auto" style={{ color: "#555" }}>
                      {slide.desc}
                    </p>
                    <Link to="/allproducts"
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg transition hover:scale-105"
                      style={{ background: slide.accent }}>
                      <ShoppingBag size={16} /> {slide.cta}
                    </Link>
                  </motion.div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </section>

      {/* ── SEARCH BAR ── */}
      <section className="py-8 px-4">
        <div className="max-w-xl mx-auto">
          <div className="flex gap-2 rounded-2xl p-2 shadow-md"
            style={{ background: card, border: `1px solid #FFD6E7` }}>
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: ROSE }} />
              <input
                type="text"
                placeholder="Search scrunchies, bows, clips…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && navigate(`/allproducts?q=${search}`)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none text-sm"
                style={{ background: "transparent", color: text }}
              />
            </div>
            <button
              onClick={() => navigate(`/allproducts?q=${search}`)}
              className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition hover:opacity-90"
              style={{ background: PINK }}>
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ── CATEGORY CHIPS ── */}
      <section className="px-4 pb-6">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2 justify-center">
          {hairCategories.slice(1).map(cat => (
            <button key={cat.id}
              onClick={() => navigate(`/allproducts?cat=${cat.id}`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition hover:scale-105"
              style={{ background: card, border: `1.5px solid #FFD6E7`, color: PINK }}>
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-8 px-4" style={{ background: mode === "dark" ? "#2d1a26" : "#FFF0F5" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-4 rounded-2xl"
              style={{ background: card }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 text-xl"
                style={{ background: `${f.color}18`, color: f.color }}>
                {f.icon}
              </div>
              <p className="font-bold text-sm" style={{ color: text }}>{f.title}</p>
              <p className="text-xs mt-0.5" style={{ color: muted }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {featuredProducts.length > 0 && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 inline-block"
                  style={{ background: "#FFE4F0", color: PINK }}>⭐ Featured</span>
                <h2 className="text-2xl font-black" style={{ color: text }}>Bestsellers</h2>
              </div>
              <Link to="/allproducts"
                className="flex items-center gap-1 text-sm font-semibold"
                style={{ color: PINK }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {featuredProducts.map(item => <MiniProductCard key={item.id} item={item} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── LATEST ARRIVALS ── */}
      {latestProducts.length > 0 && (
        <section className="py-10 px-4" style={{ background: mode === "dark" ? "#2d1a26" : "#FFF8FB" }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 inline-block"
                  style={{ background: "#F3E5FF", color: LILAC }}>✨ New Arrivals</span>
                <h2 className="text-2xl font-black" style={{ color: text }}>Just Dropped</h2>
              </div>
              <Link to="/allproducts"
                className="flex items-center gap-1 text-sm font-semibold"
                style={{ color: LILAC }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {latestProducts.map(item => <MiniProductCard key={item.id} item={item} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── BANNER ── */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #E91E8C 0%, #9C27B0 100%)" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between p-8 gap-6">
            <div className="text-white text-center sm:text-left">
              <p className="text-sm font-semibold opacity-80 mb-1">Limited Time Offer 🎉</p>
              <h3 className="text-2xl sm:text-3xl font-black mb-2">10% OFF on Every Order!</h3>
              <p className="opacity-80 text-sm">Use code <span className="font-black">ARPA10</span> at checkout</p>
            </div>
            <Link to="/allproducts"
              className="flex-shrink-0 bg-white font-bold px-8 py-3 rounded-full transition hover:scale-105"
              style={{ color: PINK }}>
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-10 px-4" style={{ background: mode === "dark" ? "#2d1a26" : "#FFF0F5" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black" style={{ color: text }}>What Our Customers Say 💬</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl"
                style={{ background: card, border: "1px solid #FFD6E7" }}>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <FaStar key={j} style={{ color: "#F59E0B", fontSize: 12 }} />
                  ))}
                </div>
                <p className="text-sm mb-4" style={{ color: muted }}>"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: PINK }}>{t.avatar}</div>
                  <span className="font-semibold text-sm" style={{ color: text }}>{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-4xl mb-3">💌</div>
          <h2 className="text-2xl font-black mb-2" style={{ color: text }}>Stay in the Loop</h2>
          <p className="text-sm mb-6" style={{ color: muted }}>
            Get early access to new drops, exclusive offers & styling tips.
          </p>
          <NewsletterInput mode={mode} card={card} text={text} />
        </div>
      </section>

      {/* Floating WhatsApp */}
      <WhatsAppChat />
    </div>
  );
}

function NewsletterInput({ mode, card, text }) {
  const { subscribeNewsletter } = useData();
  const [email, setEmail] = useState("");
  return (
    <div className="flex gap-2 rounded-2xl p-1.5 shadow-sm"
      style={{ background: card, border: "1px solid #FFD6E7" }}>
      <input type="email" placeholder="your@email.com" value={email}
        onChange={e => setEmail(e.target.value)}
        className="flex-1 px-4 py-2.5 rounded-xl outline-none text-sm"
        style={{ background: "transparent", color: text }}
      />
      <button
        onClick={() => { subscribeNewsletter(email); setEmail(""); }}
        className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition hover:opacity-90"
        style={{ background: PINK }}>
        Subscribe
      </button>
    </div>
  );
}
