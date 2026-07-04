import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useData } from "../../context/data/MyState";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/CartSlice";
import { addToWishlist, deleteFromWishlist } from "../../redux/WishlistSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaHeart, FaCartShopping, FaWhatsapp } from "react-icons/fa6";
import { FaStar, FaShieldAlt, FaTruck } from "react-icons/fa";
import { FiArrowLeft, FiPackage } from "react-icons/fi";
import Loader from "../../components/loader/Loader";

const PINK = "#E91E8C";

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

  const item    = product.find(p => p.id === id);
  const isWished = wishlist.some(w => w.id === id);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const bg   = mode === "dark" ? "#1a0a14" : "#FFF5F7";
  const card = mode === "dark" ? "#2d1a26" : "#fff";
  const text = mode === "dark" ? "#FAFAFA" : "#2d2d2d";
  const muted= mode === "dark" ? "#c0a0b0" : "#888";

  if (loading && !item) return <Loader />;

  if (!item) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
      style={{ background: bg }}>
      <div className="text-5xl">😕</div>
      <h2 className="text-xl font-bold" style={{ color: text }}>Product not found</h2>
      <Link to="/allproducts"
        className="px-6 py-2.5 rounded-full text-white font-semibold"
        style={{ background: PINK }}>
        Browse Products
      </Link>
    </div>
  );

  const images    = [item.imageUrl, item.imageUrl2, item.imageUrl3, item.imageUrl4].filter(Boolean);
  const related   = product.filter(p => p.category === item.category && p.id !== id).slice(0, 4);

  // Out of stock: only when stock field exists, is a number, and equals 0
  const stockNum  = item.stock !== undefined && item.stock !== "" ? Number(item.stock) : null;
  const outOfStock = stockNum !== null && stockNum === 0;

  const addCart = () => {
    if (!user) return toast.warning("Please login first!");
    if (item.sizes?.length > 0 && !selectedSize)
      return toast.warning("Please select a size!");
    // Check for exact duplicate (same id + same size)
    const isDuplicate = cartItems.some(
      c => c.id === item.id && (c.selectedSize ?? null) === (selectedSize ?? null)
    );
    if (isDuplicate) return toast.info("Already in cart!");
    dispatch(addToCart({ ...item, selectedSize }));
    toast.success("Added to cart 🛒");
  };

  const toggleWish = () => {
    if (!user) return toast.warning("Please login first!");
    if (isWished) {
      dispatch(deleteFromWishlist(item));
      toast.info("Removed from wishlist");
    } else {
      dispatch(addToWishlist(item));
      toast.success("Added to wishlist 💕");
    }
  };

  const buyNow = () => {
    if (!user) return navigate("/login");
    if (item.sizes?.length > 0 && !selectedSize)
      return toast.warning("Please select a size!");
    // Add to cart only if not already there
    const isDuplicate = cartItems.some(
      c => c.id === item.id && (c.selectedSize ?? null) === (selectedSize ?? null)
    );
    if (!isDuplicate) dispatch(addToCart({ ...item, selectedSize }));
    navigate("/cart");
  };

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      {/* Back */}
      <div className="px-4 pt-4 max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium mb-4"
          style={{ color: muted }}>
          <FiArrowLeft style={{ fontSize: 16 }} /> Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ── Images ── */}
          <div>
            <div className="relative rounded-3xl overflow-hidden mb-3"
              style={{ paddingBottom: "100%", background: card }}>
              <motion.img
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={images[activeImg] || "https://via.placeholder.com/600?text=🎀"}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={e => { e.target.src = "https://via.placeholder.com/600?text=ArpaStore"; }}
              />
              {item.featured && (
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full text-white"
                  style={{ background: PINK }}>⭐ Bestseller</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="w-16 h-16 rounded-xl overflow-hidden border-2 transition"
                    style={{ borderColor: activeImg === i ? PINK : "transparent" }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2 capitalize"
              style={{ color: PINK }}>{item.category}</p>
            <h1 className="text-2xl font-black mb-3" style={{ color: text }}>{item.title}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-black" style={{ color: PINK }}>
                ₹{calcOffer(item.price)}
              </span>
              <span className="text-lg line-through" style={{ color: muted }}>₹{item.price}</span>
              <span className="text-xs font-bold px-2 py-1 rounded-full"
                style={{ background: "#FFE4F0", color: PINK }}>10% OFF</span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-4">
              <FiPackage style={{ fontSize: 14, color: outOfStock ? "#EF4444" : "#10B981" }} />
              <span className="text-sm font-medium"
                style={{ color: outOfStock ? "#EF4444" : "#10B981" }}>
                {outOfStock
                  ? "Out of Stock"
                  : stockNum !== null
                  ? `${stockNum} in stock`
                  : "In Stock"}
              </span>
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-sm leading-relaxed mb-5" style={{ color: muted }}>
                {item.description}
              </p>
            )}

            {/* Sizes */}
            {item.sizes?.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: muted }}>
                  Select Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {item.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold border-2 transition"
                      style={{
                        background:  selectedSize === size ? PINK : card,
                        color:       selectedSize === size ? "#fff" : text,
                        borderColor: selectedSize === size ? PINK : "#FFD6E7",
                      }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mb-3">
              <button onClick={addCart} disabled={outOfStock}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                style={{ background: PINK }}>
                <FaCartShopping />
                {outOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
              <button onClick={toggleWish}
                className="w-14 flex items-center justify-center rounded-2xl border-2 transition hover:scale-105"
                style={{ borderColor: "#FFD6E7", background: card }}>
                <FaHeart style={{ color: isWished ? PINK : "#ccc", fontSize: 18, transition: "color 0.2s" }} />
              </button>
            </div>

            <button onClick={buyNow} disabled={outOfStock}
              className="w-full py-3.5 rounded-2xl font-bold transition hover:opacity-90 disabled:opacity-50 mb-3"
              style={{ background: "linear-gradient(135deg, #E91E8C, #9C27B0)", color: "#fff" }}>
              Buy Now
            </button>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi! I'm interested in "${item.title}" (₹${calcOffer(item.price)}). Can you help?`)}`}
              target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-white transition hover:opacity-90"
              style={{ background: "#25D366" }}>
              <FaWhatsapp size={16} /> Ask on WhatsApp
            </a>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {[
                { icon: <FaTruck />,      label: "Free delivery above ₹499" },
                { icon: <FaShieldAlt />,  label: "Secure checkout" },
              ].map((g, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-xl"
                  style={{ background: mode === "dark" ? "#3d1a2e" : "#FFF0F5" }}>
                  <span style={{ color: PINK }}>{g.icon}</span>
                  <span className="text-xs" style={{ color: muted }}>{g.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-black mb-5" style={{ color: text }}>
              You may also like 💕
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(rel => (
                <Link key={rel.id} to={`/productinfo/${rel.id}`}
                  onClick={() => { setActiveImg(0); setSelectedSize(null); window.scrollTo(0, 0); }}>
                  <div className="rounded-2xl overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
                    style={{ background: card, border: "1px solid #FFD6E7" }}>
                    <div style={{ paddingBottom: "100%", position: "relative" }}>
                      <img src={rel.imageUrl} alt={rel.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={e => { e.target.src = "https://via.placeholder.com/300?text=🎀"; }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-xs truncate" style={{ color: text }}>{rel.title}</p>
                      <p className="font-bold text-sm mt-1" style={{ color: PINK }}>₹{calcOffer(rel.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
