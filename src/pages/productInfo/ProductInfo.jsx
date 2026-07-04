import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useData } from "../../context/data/MyState";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/CartSlice";
import { addToWishlist, deleteFromWishlist } from "../../redux/WishlistSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaCartShopping, FaWhatsapp, FaStar } from "react-icons/fa6";
import { FaTruck, FaShieldAlt, FaUndo, FaCheckCircle, FaTag } from "react-icons/fa";
import { FiArrowLeft, FiPackage, FiChevronLeft, FiChevronRight, FiShare2 } from "react-icons/fi";
import Loader from "../../components/loader/Loader";

const PINK   = "#E91E8C";
const PURPLE = "#9C27B0";

/* ── A+ feature rows ── */
const FEATURE_ROWS = [
  { icon: <FaTruck />,       title: "Free Delivery",     desc: "On orders above ₹499. Express shipping available." },
  { icon: <FaUndo />,        title: "Easy Returns",      desc: "7-day hassle-free return policy." },
  { icon: <FaShieldAlt />,   title: "Secure Checkout",   desc: "100% safe & encrypted payments." },
  { icon: <FaCheckCircle />, title: "Premium Quality",   desc: "Handpicked, handcrafted accessories." },
];

export default function ProductInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, calcOffer, mode } = useData();
  const dispatch  = useDispatch();
  const cartItems = useSelector(s => s.cart);
  const wishlist  = useSelector(s => s.wishlist);
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();

  const [activeImg,    setActiveImg]    = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [zoomed,       setZoomed]       = useState(false);

  const item     = product.find(p => p.id === id);
  const isWished = wishlist.some(w => w.id === id);

  useEffect(() => { window.scrollTo(0, 0); setActiveImg(0); setSelectedSize(null); }, [id]);

  const bg    = mode === "dark" ? "#1a0a14" : "#FFF5F7";
  const card  = mode === "dark" ? "#2d1a26" : "#fff";
  const text  = mode === "dark" ? "#FAFAFA" : "#1a1a2e";
  const muted = mode === "dark" ? "#c0a0b0" : "#666";
  const divider = mode === "dark" ? "rgba(255,255,255,0.08)" : "#FFE4F0";

  if (loading && !item) return <Loader />;
  if (!item) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: bg }}>
      <div className="text-5xl">😕</div>
      <h2 className="text-xl font-bold" style={{ color: text }}>Product not found</h2>
      <Link to="/allproducts" className="px-6 py-2.5 rounded-full text-white font-semibold"
        style={{ background: PINK }}>Browse Products</Link>
    </div>
  );

  const images   = [item.imageUrl, item.imageUrl2, item.imageUrl3, item.imageUrl4].filter(Boolean);
  const related  = product.filter(p => p.category === item.category && p.id !== id).slice(0, 6);
  const stockNum = item.stock !== undefined && item.stock !== "" ? Number(item.stock) : null;
  const outOfStock = stockNum !== null && stockNum === 0;
  const lowStock   = stockNum !== null && stockNum > 0 && stockNum <= 5;
  const discount   = Math.round(((Number(item.price) - Number(calcOffer(item.price))) / Number(item.price)) * 100);

  const addCart = () => {
    if (!user) return toast.warning("Please login first!");
    if (item.sizes?.length > 0 && !selectedSize) return toast.warning("Please select a size!");
    const dup = cartItems.some(c => c.id === item.id && (c.selectedSize ?? null) === (selectedSize ?? null));
    if (dup) return toast.info("Already in cart!");
    dispatch(addToCart({ ...item, selectedSize }));
    toast.success("Added to cart 🛒");
  };

  const toggleWish = () => {
    if (!user) return toast.warning("Please login first!");
    if (isWished) { dispatch(deleteFromWishlist(item)); toast.info("Removed from wishlist"); }
    else           { dispatch(addToWishlist(item));     toast.success("Added to wishlist 💕"); }
  };

  const buyNow = () => {
    if (!user) return navigate("/login");
    if (item.sizes?.length > 0 && !selectedSize) return toast.warning("Please select a size!");
    const dup = cartItems.some(c => c.id === item.id && (c.selectedSize ?? null) === (selectedSize ?? null));
    if (!dup) dispatch(addToCart({ ...item, selectedSize }));
    navigate("/cart");
  };

  const prevImg = () => setActiveImg(p => (p - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg(p => (p + 1) % images.length);

  return (
    <div className="min-h-screen" style={{ background: bg }}>

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2 flex items-center gap-2 text-xs" style={{ color: muted }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:underline font-medium" style={{ color: PINK }}>
          <FiArrowLeft style={{ fontSize: 13 }} /> Back
        </button>
        <span>/</span>
        <Link to="/allproducts" className="hover:underline capitalize">{item.category}</Link>
        <span>/</span>
        <span className="truncate max-w-[200px]" style={{ color: text }}>{item.title}</span>
      </div>

      {/* ══════════════════════════════
          MAIN PRODUCT SECTION
      ══════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* ── COL 1: Image Gallery ── */}
          <div className="lg:col-span-5">

            {/* Thumbnail strip (vertical on lg) */}
            <div className="flex lg:flex-row gap-3">

              {/* Thumbs — hidden on mobile, vertical sidebar on desktop */}
              {images.length > 1 && (
                <div className="hidden lg:flex flex-col gap-2 flex-shrink-0">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className="w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition"
                      style={{
                        borderColor: activeImg === i ? PINK : divider,
                        boxShadow:   activeImg === i ? `0 0 0 2px ${PINK}33` : "none",
                      }}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div className="relative flex-1 rounded-3xl overflow-hidden cursor-zoom-in"
                style={{ background: card, aspectRatio: "1 / 1", border: `1px solid ${divider}` }}
                onClick={() => setZoomed(true)}>
                <AnimatePresence mode="wait">
                  <motion.img key={activeImg}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    src={images[activeImg] || "https://via.placeholder.com/600?text=🎀"}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={e => { e.target.src = "https://via.placeholder.com/600?text=ArpaStore"; }}
                  />
                </AnimatePresence>
                {/* Badges */}
                {item.featured && (
                  <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white z-10"
                    style={{ background: PINK }}>⭐ Bestseller</span>
                )}
                {discount > 0 && (
                  <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white z-10"
                    style={{ background: "#F59E0B" }}>{discount}% OFF</span>
                )}
                {/* Arrows */}
                {images.length > 1 && (
                  <>
                    <button onClick={e => { e.stopPropagation(); prevImg(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                      style={{ background: "rgba(255,255,255,0.9)", color: PINK }}>
                      <FiChevronLeft style={{ fontSize: 16 }} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); nextImg(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                      style={{ background: "rgba(255,255,255,0.9)", color: PINK }}>
                      <FiChevronRight style={{ fontSize: 16 }} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile thumbs (horizontal) */}
            {images.length > 1 && (
              <div className="flex lg:hidden gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition"
                    style={{ borderColor: activeImg === i ? PINK : divider }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── COL 2: Product Details ── */}
          <div className="lg:col-span-4 flex flex-col gap-4">

            {/* Category + Title */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1 capitalize" style={{ color: PINK }}>
                {item.category}
              </p>
              <h1 className="text-2xl font-black leading-tight" style={{ color: text }}>{item.title}</h1>
              {item.type && (
                <p className="text-sm mt-1" style={{ color: muted }}>{item.type}</p>
              )}
            </div>

            {/* Rating row (static 4.5★) */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <FaStar key={s} style={{ fontSize: 13, color: s <= 4 ? "#F59E0B" : "#e0e0e0" }} />
                ))}
              </div>
              <span className="text-xs font-semibold" style={{ color: PINK }}>4.0</span>
              <span className="text-xs" style={{ color: muted }}>· Verified buyers</span>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: divider }} />

            {/* Price block */}
            <div className="p-4 rounded-2xl" style={{ background: mode === "dark" ? "#3d1a2e" : "#FFF0F5" }}>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-black" style={{ color: PINK }}>
                  ₹{calcOffer(item.price)}
                </span>
                <span className="text-base line-through" style={{ color: muted }}>₹{item.price}</span>
                <span className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{ background: "#FFE4F0", color: PINK }}>{discount}% OFF</span>
              </div>
              <p className="text-xs" style={{ color: muted }}>Inclusive of all taxes</p>
            </div>

            {/* Stock badge */}
            <div className="flex items-center gap-2">
              <FiPackage style={{ fontSize: 14, color: outOfStock ? "#EF4444" : "#10B981" }} />
              <span className="text-sm font-semibold"
                style={{ color: outOfStock ? "#EF4444" : lowStock ? "#F59E0B" : "#10B981" }}>
                {outOfStock ? "Out of Stock"
                  : lowStock ? `Only ${stockNum} left — order soon!`
                  : stockNum !== null ? `In Stock (${stockNum} units)`
                  : "In Stock"}
              </span>
            </div>

            {/* Description */}
            {item.description && (
              <div className="p-4 rounded-2xl" style={{ background: card, border: `1px solid ${divider}` }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: muted }}>
                  About this item
                </p>
                <p className="text-sm leading-relaxed" style={{ color: text }}>{item.description}</p>
              </div>
            )}

            {/* Sizes */}
            {item.sizes?.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: muted }}>
                  Select Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {item.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className="w-12 h-12 rounded-full text-sm font-bold border-2 transition hover:scale-105"
                      style={{
                        background:  selectedSize === size ? PINK : card,
                        color:       selectedSize === size ? "#fff" : text,
                        borderColor: selectedSize === size ? PINK : divider,
                        boxShadow:   selectedSize === size ? `0 4px 12px ${PINK}44` : "none",
                      }}>
                      {size}
                    </button>
                  ))}
                </div>
                {item.sizes?.length > 0 && !selectedSize && (
                  <p className="text-xs mt-1.5" style={{ color: "#F59E0B" }}>⚠ Please select a size</p>
                )}
              </div>
            )}
          </div>

          {/* ── COL 3: Buy Box (sticky) ── */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-20 rounded-3xl overflow-hidden shadow-xl"
              style={{ background: card, border: `1px solid ${divider}` }}>

              {/* Price summary */}
              <div className="p-5" style={{ borderBottom: `1px solid ${divider}` }}>
                <p className="text-2xl font-black mb-0.5" style={{ color: PINK }}>
                  ₹{calcOffer(item.price)}
                </p>
                <p className="text-xs" style={{ color: muted }}>
                  M.R.P: <span className="line-through">₹{item.price}</span>
                  <span className="ml-2 font-bold" style={{ color: "#10B981" }}>You save ₹{Number(item.price) - Number(calcOffer(item.price))}</span>
                </p>
              </div>

              <div className="p-5 space-y-3">
                {/* Add to Cart */}
                <button onClick={addCart} disabled={outOfStock}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-white text-sm transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: PINK, boxShadow: `0 6px 20px ${PINK}44` }}>
                  <FaCartShopping style={{ fontSize: 14 }} />
                  {outOfStock ? "Out of Stock" : "Add to Cart"}
                </button>

                {/* Buy Now */}
                <button onClick={buyNow} disabled={outOfStock}
                  className="w-full py-3.5 rounded-full font-bold text-white text-sm transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${PINK}, ${PURPLE})` }}>
                  Buy Now
                </button>

                {/* WhatsApp */}
                <a href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi! I'm interested in "${item.title}" (₹${calcOffer(item.price)}). Can you help?`)}`}
                  target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-white text-sm transition hover:opacity-90"
                  style={{ background: "#25D366" }}>
                  <FaWhatsapp style={{ fontSize: 15 }} /> Ask on WhatsApp
                </a>

                {/* Wishlist + Share row */}
                <div className="flex gap-2">
                  <button onClick={toggleWish}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold border-2 transition hover:bg-pink-50"
                    style={{ borderColor: "#FFD6E7", color: isWished ? PINK : muted, background: card }}>
                    <FaHeart style={{ fontSize: 13, color: isWished ? PINK : "#ccc" }} />
                    {isWished ? "Wishlisted" : "Wishlist"}
                  </button>
                  <button
                    onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                    className="w-11 h-11 rounded-full flex items-center justify-center border-2 transition hover:bg-pink-50"
                    style={{ borderColor: "#FFD6E7", color: muted, background: card }}>
                    <FiShare2 style={{ fontSize: 14 }} />
                  </button>
                </div>

                {/* Trust badges */}
                <div className="pt-2 space-y-2" style={{ borderTop: `1px solid ${divider}` }}>
                  {[
                    { icon: <FaTruck />,      label: "Free delivery above ₹499" },
                    { icon: <FaShieldAlt />,  label: "Secure checkout" },
                    { icon: <FaUndo />,       label: "7-day easy returns" },
                  ].map((g, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span style={{ color: PINK, fontSize: 12 }}>{g.icon}</span>
                      <span className="text-xs" style={{ color: muted }}>{g.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>{/* end main grid */}
      </div>

      {/* ══════════════════════════════
          A+ CONTENT — Feature Highlights
      ══════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 pb-8">

        {/* Feature strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {FEATURE_ROWS.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center text-center p-5 rounded-2xl gap-3"
              style={{ background: card, border: `1px solid ${divider}` }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
                style={{ background: `${PINK}15`, color: PINK }}>
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-sm mb-0.5" style={{ color: text }}>{f.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: muted }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── A+ Image + Text Modules ── */}
        <div className="rounded-3xl overflow-hidden mb-8"
          style={{ background: card, border: `1px solid ${divider}` }}>

          {/* Module header */}
          <div className="px-6 py-4" style={{ borderBottom: `1px solid ${divider}`, background: mode === "dark" ? "#3d1a2e" : "#FFF0F5" }}>
            <h2 className="font-black text-lg" style={{ color: text }}>Product Details</h2>
          </div>

          {/* Module 1: Full-width description banner */}
          {images[0] && (
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
                <img src={images[0]} alt={item.title}
                  className="w-full h-full object-cover"
                  style={{ minHeight: 280 }}
                  onError={e => { e.target.src = "https://via.placeholder.com/600x400?text=ArpaStore"; }} />
              </div>
              <div className="flex flex-col justify-center p-8 gap-4"
                style={{ background: mode === "dark" ? "#2d1a26" : "#FFF8FB" }}>
                <span className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: PINK }}>About This Product</span>
                <h3 className="text-xl font-black leading-tight" style={{ color: text }}>
                  {item.title}
                </h3>
                {item.description ? (
                  <p className="text-sm leading-relaxed" style={{ color: muted }}>{item.description}</p>
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: muted }}>
                    Premium quality hair accessory crafted with care. Designed for everyday elegance — lightweight, durable, and style-forward.
                  </p>
                )}
                <div className="flex flex-col gap-2 mt-2">
                  {["Handpicked premium materials", "Lightweight & comfortable all day", "Suitable for all hair types", "Perfect for gifting"].map((pt, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm" style={{ color: text }}>
                      <FaCheckCircle style={{ color: PINK, fontSize: 13, flexShrink: 0 }} />
                      {pt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Module 2: Second image reversed */}
          {images[1] && (
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderTop: `1px solid ${divider}` }}>
              <div className="flex flex-col justify-center p-8 gap-4 order-2 md:order-1"
                style={{ background: mode === "dark" ? "#2d1a26" : "#F5F0FF" }}>
                <span className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: PURPLE }}>Why Choose Us</span>
                <h3 className="text-xl font-black leading-tight" style={{ color: text }}>
                  Quality You Can Feel
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: muted }}>
                  Every ArpaStore accessory goes through strict quality checks before it reaches you. Soft on hair, strong on hold — that's our promise.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {[
                    { label: "Material",  val: "Premium fabric" },
                    { label: "Category",  val: item.category   },
                    { label: "Stock",     val: stockNum !== null ? `${stockNum} units` : "Available" },
                    { label: "Discount",  val: `${discount}% off` },
                  ].map((spec, i) => (
                    <div key={i} className="p-3 rounded-xl"
                      style={{ background: mode === "dark" ? "#3d1a2e" : "#fff", border: `1px solid ${divider}` }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: muted }}>{spec.label}</p>
                      <p className="text-sm font-bold capitalize" style={{ color: text }}>{spec.val}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative overflow-hidden order-1 md:order-2" style={{ minHeight: 280 }}>
                <img src={images[1]} alt={item.title}
                  className="w-full h-full object-cover"
                  style={{ minHeight: 280 }}
                  onError={e => { e.target.src = "https://via.placeholder.com/600x400?text=ArpaStore"; }} />
              </div>
            </div>
          )}

          {/* Module 3: 3-image grid (if images 2 & 3 exist) */}
          {images.length >= 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0" style={{ borderTop: `1px solid ${divider}` }}>
              {images.slice(images[1] ? 2 : 1, images[1] ? 4 : 3).concat(["style"]).slice(0, 3).map((src, i) => (
                <div key={i} className="relative overflow-hidden" style={{ minHeight: 220 }}>
                  {src === "style" ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
                      style={{ background: `linear-gradient(135deg, ${PINK}22, ${PURPLE}22)`, minHeight: 220 }}>
                      <div className="text-5xl mb-3">🎀</div>
                      <h4 className="font-black text-lg mb-2" style={{ color: text }}>Style Every Day</h4>
                      <p className="text-sm" style={{ color: muted }}>Express yourself with every look</p>
                    </div>
                  ) : (
                    <img src={src} alt="" className="w-full h-full object-cover"
                      style={{ minHeight: 220 }}
                      onError={e => { e.target.src = "https://via.placeholder.com/400x300?text=ArpaStore"; }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Comparison / Offer Banner ── */}
        <div className="rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center gap-6 justify-between"
          style={{ background: `linear-gradient(135deg, ${PINK}, ${PURPLE})` }}>
          <div className="text-white text-center sm:text-left">
            <p className="text-sm font-semibold opacity-80 mb-1">🎉 Limited Time Deal</p>
            <h3 className="text-2xl font-black mb-1">Get {discount}% OFF Today!</h3>
            <p className="opacity-80 text-sm">
              Pay only <span className="font-black text-lg">₹{calcOffer(item.price)}</span>
              {" "}instead of ₹{item.price}
            </p>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
            <button onClick={addCart} disabled={outOfStock}
              className="px-8 py-3 rounded-full font-black text-sm text-pink-600 bg-white transition hover:scale-105 disabled:opacity-50 whitespace-nowrap"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
              🛒 Add to Cart — ₹{calcOffer(item.price)}
            </button>
            <button onClick={buyNow} disabled={outOfStock}
              className="px-8 py-3 rounded-full font-bold text-sm text-white border-2 border-white/50 transition hover:bg-white/10 disabled:opacity-50 whitespace-nowrap">
              Buy Now
            </button>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black" style={{ color: text }}>
                You May Also Like 💕
              </h2>
              <Link to={`/allproducts?cat=${item.category}`}
                className="text-sm font-semibold flex items-center gap-1"
                style={{ color: PINK }}>
                View All <FiChevronRight style={{ fontSize: 14 }} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {related.map(rel => (
                <Link key={rel.id} to={`/productinfo/${rel.id}`}
                  onClick={() => { setActiveImg(0); setSelectedSize(null); window.scrollTo(0, 0); }}>
                  <div className="rounded-2xl overflow-hidden transition hover:-translate-y-1 hover:shadow-lg group"
                    style={{ background: card, border: `1px solid ${divider}` }}>
                    <div className="relative overflow-hidden" style={{ paddingBottom: "100%" }}>
                      <img src={rel.imageUrl} alt={rel.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={e => { e.target.src = "https://via.placeholder.com/300?text=🎀"; }} />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold truncate mb-0.5" style={{ color: text }}>{rel.title}</p>
                      <p className="text-xs font-black" style={{ color: PINK }}>₹{calcOffer(rel.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.9)" }}
            onClick={() => setZoomed(false)}>
            <motion.img
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              src={images[activeImg]}
              alt={item.title}
              className="max-w-full max-h-full rounded-2xl object-contain"
              style={{ maxWidth: "90vw", maxHeight: "90vh" }}
              onClick={e => e.stopPropagation()}
            />
            <button onClick={() => setZoomed(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ background: "rgba(255,255,255,0.15)" }}>×</button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
