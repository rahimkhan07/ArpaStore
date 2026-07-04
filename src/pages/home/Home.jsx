import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../../context/data/MyState";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/CartSlice";
import { addToWishlist } from "../../redux/WishlistSlice";
import { toast } from "react-toastify";
import { FaHeart, FaCartShopping } from "react-icons/fa6";
import { FaStar, FaShieldAlt, FaTruck, FaGift } from "react-icons/fa";
import { FiSearch, FiArrowRight, FiShoppingBag, FiRefreshCw, FiShield, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import WhatsAppChat from "../../components/whatsapp/WhatsAppChat";

const PINK   = "#E91E8C";
const ROSE   = "#FF6B9D";
const LILAC  = "#C77DFF";
const CREAM  = "#FFF5F7";

/* ── Hero slides — left text + right image ── */
const HERO_SLIDES = [
  {
    tag:    "New Summer Drop · 2025",
    line1:  "Softly styled.",
    line2:  "Effortlessly you.",
    desc:   "Handpicked bows, scrunchies, clips & headbands — designed to feel light, look luxe, and last forever.",
    cta1:   { label: "Shop the Collection", to: "/allproducts" },
    cta2:   { label: "Explore Scrunchies",  to: "/allproducts?cat=scrunchies" },
    image:  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=700&q=80",
    bg:     "linear-gradient(135deg, #fdf2f8 0%, #f0e6ff 100%)",
  },
  {
    tag:    "Trending Now 🎀",
    line1:  "Hair that turns",
    line2:  "every head.",
    desc:   "Velvet scrunchies, satin bows & pearl pins — curated for every mood and every occasion.",
    cta1:   { label: "Shop Bows",      to: "/allproducts?cat=bows" },
    cta2:   { label: "Shop Scrunchies",to: "/allproducts?cat=scrunchies" },
    image:  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80",
    bg:     "linear-gradient(135deg, #fff0f5 0%, #ffe4f0 100%)",
  },
  {
    tag:    "Perfect Gift 🎁",
    line1:  "Gift the joy of",
    line2:  "beautiful hair.",
    desc:   "Beautifully curated gift sets for your loved ones — wrapped with love, delivered with care.",
    cta1:   { label: "Shop Gift Sets", to: "/allproducts?cat=sets" },
    cta2:   { label: "View All",       to: "/allproducts" },
    image:  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=700&q=80",
    bg:     "linear-gradient(135deg, #f5f0ff 0%, #ede4ff 100%)",
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
  const totalSlides = sliderImages.length > 0 ? sliderImages.length : HERO_SLIDES.length;

  // Auto-advance
  const timerRef = useRef(null);
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveSlide(p => (p + 1) % totalSlides);
    }, 4500);
  };
  useState(() => { startTimer(); return () => clearInterval(timerRef.current); });

  const goTo = (idx) => { setActiveSlide(idx); startTimer(); };
  const prev = () => goTo((activeSlide - 1 + totalSlides) % totalSlides);
  const next = () => goTo((activeSlide + 1) % totalSlides);

  const featuredProducts = product.filter(p => p.featured).slice(0, 8);
  const latestProducts   = [...product].reverse().slice(0, 8);

  const bg   = mode === "dark" ? "#1a0a14" : CREAM;
  const card = mode === "dark" ? "#2d1a26" : "#fff";
  const text = mode === "dark" ? "#FAFAFA" : "#2d2d2d";
  const muted= mode === "dark" ? "#c0a0b0" : "#888";

  return (
    <div style={{ background: bg, color: text }}>

      {/* ══════════════════════════════════════════
          HERO — split layout (text left / image right)
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: 480 }}>

        {/* Slides */}
        <AnimatePresence mode="wait">
          {sliderImages.length > 0 ? (
            /* Admin-uploaded: full-bleed image + overlay text */
            <motion.div key={`admin-${activeSlide}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full"
              style={{ height: "520px" }}>
              <img
                src={sliderImages[activeSlide]?.imageUrl}
                alt="slide"
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = "none"; }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }}>
                <div className="h-full flex flex-col justify-center px-8 sm:px-16 max-w-lg">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-3">
                    ArpaStore Collection
                  </p>
                  <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
                    Hair Accessories<br/>
                    <span style={{ color: "#FFB3D9" }}>You'll Love</span>
                  </h1>
                  <Link to="/allproducts"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white w-fit mt-2 transition hover:scale-105"
                    style={{ background: PINK, boxShadow: "0 8px 24px rgba(233,30,140,0.4)" }}>
                    <FiShoppingBag style={{ fontSize: 16 }} /> Shop Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Default branded split-hero */
            <motion.div key={`branded-${activeSlide}`}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="w-full"
              style={{ background: HERO_SLIDES[activeSlide].bg }}>

              <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20
                              grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[480px]">

                {/* ── LEFT: Text ── */}
                <div className="flex flex-col justify-center order-2 lg:order-1">
                  {/* Tag pill */}
                  <span className="inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-semibold mb-5"
                    style={{ background: "rgba(233,30,140,0.1)", color: PINK, border: "1px solid rgba(233,30,140,0.25)" }}>
                    {HERO_SLIDES[activeSlide].tag}
                  </span>

                  {/* Headline */}
                  <h1 className="font-black leading-tight mb-3"
                    style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#1a1a2e" }}>
                    {HERO_SLIDES[activeSlide].line1}<br />
                    <span style={{ color: PINK }}>{HERO_SLIDES[activeSlide].line2}</span>
                  </h1>

                  {/* Description */}
                  <p className="text-sm sm:text-base leading-relaxed mb-8 max-w-md"
                    style={{ color: "#5a5a7a" }}>
                    {HERO_SLIDES[activeSlide].desc}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    <Link to={HERO_SLIDES[activeSlide].cta1.to}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white text-sm transition hover:scale-105 hover:shadow-lg"
                      style={{ background: PINK, boxShadow: "0 6px 20px rgba(233,30,140,0.35)" }}>
                      {HERO_SLIDES[activeSlide].cta1.label} <FiArrowRight style={{ fontSize: 14 }} />
                    </Link>
                    <Link to={HERO_SLIDES[activeSlide].cta2.to}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition hover:bg-pink-50"
                      style={{ color: PINK, border: "1.5px solid rgba(233,30,140,0.3)", background: "#fff" }}>
                      {HERO_SLIDES[activeSlide].cta2.label}
                    </Link>
                  </div>

                  {/* Trust badges */}
                  <div className="flex flex-wrap gap-5 text-xs" style={{ color: "#888" }}>
                    {[
                      { icon: <FaTruck style={{ fontSize: 13 }}/>,      label: "Free shipping ₹499+" },
                      { icon: <FiRefreshCw style={{ fontSize: 12 }}/>,  label: "Easy returns" },
                      { icon: <FiShield style={{ fontSize: 12 }}/>,     label: "Handmade quality" },
                    ].map((b, i) => (
                      <span key={i} className="flex items-center gap-1.5 font-medium">
                        <span style={{ color: PINK }}>{b.icon}</span> {b.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ── RIGHT: Image ── */}
                <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative">
                    <div className="rounded-3xl overflow-hidden shadow-2xl"
                      style={{
                        width: "clamp(260px, 40vw, 440px)",
                        height: "clamp(320px, 48vw, 520px)",
                        boxShadow: "0 32px 64px rgba(233,30,140,0.18)",
                      }}>
                      <img
                        src={HERO_SLIDES[activeSlide].image}
                        alt="hair accessory"
                        className="w-full h-full object-cover"
                        onError={e => {
                          e.target.src = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80";
                        }}
                      />
                    </div>
                    {/* Floating badge */}
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -bottom-4 -left-4 px-4 py-2.5 rounded-2xl shadow-lg text-xs font-bold"
                      style={{ background: "#fff", color: PINK, border: "1.5px solid #FFD6E7" }}>
                      🎀 Premium Quality
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Slide controls ── */}
        {totalSlides > 1 && (
          <>
            {/* Prev / Next arrows */}
            <button onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition hover:scale-110"
              style={{ background: "rgba(255,255,255,0.9)", color: PINK }}>
              <FiChevronLeft style={{ fontSize: 18 }} />
            </button>
            <button onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition hover:scale-110"
              style={{ background: "rgba(255,255,255,0.9)", color: PINK }}>
              <FiChevronRight style={{ fontSize: 18 }} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width:      activeSlide === i ? 24 : 8,
                    height:     8,
                    background: activeSlide === i ? PINK : "rgba(233,30,140,0.3)",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── SEARCH BAR ── */}
      <section className="py-8 px-4">
        <div className="max-w-xl mx-auto">
          <div className="flex gap-2 rounded-2xl p-2 shadow-md"
            style={{ background: card, border: `1px solid #FFD6E7` }}>
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: 16, color: ROSE }} />
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
                View All <FiArrowRight style={{ fontSize: 14 }} />
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
                View All <FiArrowRight style={{ fontSize: 14 }} />
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
        onKeyDown={async e => {
          if (e.key === "Enter") {
            const ok = await subscribeNewsletter(email);
            if (ok) setEmail("");
          }
        }}
        className="flex-1 px-4 py-2.5 rounded-xl outline-none text-sm"
        style={{ background: "transparent", color: text }}
      />
      <button
        onClick={async () => {
          const ok = await subscribeNewsletter(email);
          if (ok) setEmail("");
        }}
        className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition hover:opacity-90"
        style={{ background: "#E91E8C" }}>
        Subscribe
      </button>
    </div>
  );
}
