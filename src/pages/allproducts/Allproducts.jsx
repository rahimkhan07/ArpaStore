import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useData } from "../../context/data/MyState";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/CartSlice";
import { addToWishlist } from "../../redux/WishlistSlice";
import { toast } from "react-toastify";
import { FaHeart, FaCartShopping } from "react-icons/fa6";
import { Search, SlidersHorizontal, X, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppChat from "../../components/whatsapp/WhatsAppChat";

const PINK = "#E91E8C";

/* ── Skeleton card shown while loading ── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: "#fff", border: "1px solid #FFD6E7" }}>
      <div style={{ paddingBottom: "100%", position: "relative", background: "#FFE4F0" }} />
      <div className="p-3 space-y-2">
        <div className="h-2.5 rounded-full w-1/2" style={{ background: "#FFD6E7" }} />
        <div className="h-3 rounded-full w-3/4" style={{ background: "#FFE4F0" }} />
        <div className="h-3 rounded-full w-1/3" style={{ background: "#FFD6E7" }} />
      </div>
    </div>
  );
}

export default function AllProducts() {
  const {
    product, loading, hairCategories, calcOffer, mode,
    searchkey, setSearchkey,
    filterType, setFilterType,
  } = useData();

  const dispatch  = useDispatch();
  const cartItems = useSelector(s => s.cart);
  const wishlist  = useSelector(s => s.wishlist);
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();

  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy,      setSortBy]      = useState("default");
  const [wishedIds,   setWishedIds]   = useState(() => {
    const obj = {};
    wishlist.forEach(w => { obj[w.id] = true; });
    return obj;
  });

  useEffect(() => {
    const q   = searchParams.get("q");
    const cat = searchParams.get("cat");
    if (q)   setSearchkey(q);
    if (cat) setFilterType(cat);
    window.scrollTo(0, 0);
  }, []);

  const bg   = mode === "dark" ? "#1a0a14" : "#FFF5F7";
  const card = mode === "dark" ? "#2d1a26" : "#fff";
  const text = mode === "dark" ? "#FAFAFA" : "#2d2d2d";
  const muted= mode === "dark" ? "#c0a0b0" : "#888";

  /* ── Filter + Sort ── */
  let filtered = product
    .filter(item => {
      const q = searchkey.toLowerCase();
      return !q ||
        (item.title || "").toLowerCase().includes(q) ||
        (item.category || "").toLowerCase().includes(q) ||
        (item.type || "").toLowerCase().includes(q);
    })
    .filter(item => {
      if (!filterType || filterType === "all") return true;
      return (item.category || "").toLowerCase() === filterType.toLowerCase();
    });

  if (sortBy === "price-asc")  filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
  if (sortBy === "name")       filtered = [...filtered].sort((a, b) => (a.title || "").localeCompare(b.title || ""));

  const addCart = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return toast.warning("Please login first!");
    if (cartItems.some(c => c.id === item.id)) return toast.info("Already in cart!");
    dispatch(addToCart(item));
    toast.success("Added to cart 🛒");
  };

  const addWish = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return toast.warning("Please login first!");
    if (!wishedIds[item.id]) {
      dispatch(addToWishlist(item));
      setWishedIds(p => ({ ...p, [item.id]: true }));
      toast.success("Added to wishlist 💕");
    } else {
      toast.info("Already in wishlist!");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: bg }}>

      {/* ── Header ── */}
      <div className="pt-6 pb-4 px-4" style={{ borderBottom: "1px solid #FFD6E7" }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-black mb-4" style={{ color: text }}>
            {filterType && filterType !== "all"
              ? `${hairCategories.find(c => c.id === filterType)?.emoji || ""} ${hairCategories.find(c => c.id === filterType)?.label || "Products"}`
              : "✨ All Products"
            }
          </h1>

          <div className="flex gap-2 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: PINK }} />
              <input
                type="text"
                placeholder="Search products…"
                value={searchkey}
                onChange={e => setSearchkey(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl outline-none text-sm"
                style={{ background: card, border: "1.5px solid #FFD6E7", color: text }}
              />
              {searchkey && (
                <button onClick={() => setSearchkey("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: muted }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
              style={{ background: card, border: "1.5px solid #FFD6E7", color: text }}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name: A → Z</option>
            </select>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(p => !p)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold sm:hidden"
              style={{ background: PINK, color: "#fff" }}>
              <SlidersHorizontal size={14} />
              {showFilters ? "Hide" : "Filters"}
            </button>
          </div>

          {/* Category Pills */}
          <div className={`mt-3 flex flex-wrap gap-2 ${showFilters ? "flex" : "hidden sm:flex"}`}>
            {hairCategories.map(cat => {
              const isActive = filterType === cat.id || (cat.id === "all" && !filterType);
              return (
                <button key={cat.id}
                  onClick={() => setFilterType(cat.id === "all" ? "" : cat.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    background:  isActive ? PINK : card,
                    color:       isActive ? "#fff" : PINK,
                    border:      "1.5px solid #FFD6E7",
                    boxShadow:   isActive ? "0 4px 12px rgba(233,30,140,0.25)" : "none",
                  }}>
                  {cat.emoji} {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Products loaded */}
        {!loading && (
          <>
            <p className="text-xs mb-4" style={{ color: muted }}>
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            </p>

            {filtered.length === 0 ? (
              /* Empty state */
              <div className="text-center py-20">
                <Package size={52} style={{ color: "#FFD6E7", margin: "0 auto 16px" }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: text }}>
                  {product.length === 0 ? "No products yet" : "No products found"}
                </h3>
                <p className="text-sm mb-5" style={{ color: muted }}>
                  {product.length === 0
                    ? "Admin se products add karwao 🎀"
                    : "Try a different search or category"}
                </p>
                {(searchkey || filterType) && (
                  <button
                    onClick={() => { setSearchkey(""); setFilterType(""); }}
                    className="px-6 py-2.5 rounded-full font-semibold text-white text-sm transition hover:opacity-90"
                    style={{ background: PINK }}>
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              /* Product cards */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                <AnimatePresence>
                  {filtered.map((item, i) => {
                    const isWished   = wishedIds[item.id] || wishlist.some(w => w.id === item.id);
                    const outOfStock = item.stock !== undefined && item.stock !== "" && Number(item.stock) === 0;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.3 }}>

                        <Link to={`/productinfo/${item.id}`}>
                          <div
                            className="group rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer"
                            style={{
                              background:  card,
                              border:      "1px solid #FFD6E7",
                              boxShadow:   "0 2px 12px rgba(233,30,140,0.06)",
                              transition:  "transform 0.25s ease, box-shadow 0.25s ease",
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = "translateY(-4px)";
                              e.currentTarget.style.boxShadow = "0 12px 28px rgba(233,30,140,0.18)";
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 2px 12px rgba(233,30,140,0.06)";
                            }}>

                            {/* ── Image ── */}
                            <div className="relative overflow-hidden flex-shrink-0"
                              style={{ paddingBottom: "100%", position: "relative" }}>
                              <img
                                src={item.imageUrl || "https://via.placeholder.com/300x300?text=ArpaStore"}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={e => {
                                  e.target.onerror = null;
                                  e.target.src = "https://via.placeholder.com/300x300?text=ArpaStore";
                                }}
                              />

                              {/* Featured badge */}
                              {item.featured && !outOfStock && (
                                <span
                                  className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full text-white"
                                  style={{ background: PINK }}>
                                  ⭐ Best
                                </span>
                              )}

                              {/* Low stock badge */}
                              {!outOfStock && item.stock > 0 && Number(item.stock) <= 5 && (
                                <span
                                  className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full text-white"
                                  style={{ background: "#FF6B35" }}>
                                  Only {item.stock} left!
                                </span>
                              )}

                              {/* Out of stock overlay */}
                              {outOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center"
                                  style={{ background: "rgba(0,0,0,0.45)" }}>
                                  <span className="text-white font-bold text-xs px-3 py-1.5 rounded-full"
                                    style={{ background: "rgba(0,0,0,0.65)" }}>
                                    Out of Stock
                                  </span>
                                </div>
                              )}

                              {/* Wishlist button */}
                              <button
                                onClick={e => addWish(item, e)}
                                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
                                style={{ background: "rgba(255,255,255,0.92)" }}>
                                <FaHeart style={{
                                  color:    isWished ? "#E91E8C" : "#ddd",
                                  fontSize: 12,
                                  transition: "color 0.2s",
                                }} />
                              </button>
                            </div>

                            {/* ── Info ── */}
                            <div className="p-3 flex flex-col flex-1">
                              <p className="text-[10px] font-medium mb-0.5 capitalize" style={{ color: muted }}>
                                {item.category || "accessories"}
                              </p>
                              <h3
                                className="font-semibold text-sm leading-snug mb-1"
                                style={{
                                  color:          text,
                                  display:        "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow:        "hidden",
                                }}>
                                {item.title}
                              </h3>

                              <div className="flex items-center justify-between mt-auto pt-2">
                                <div className="flex items-baseline gap-1">
                                  <span className="font-bold text-sm" style={{ color: PINK }}>
                                    ₹{calcOffer(item.price)}
                                  </span>
                                  <span className="text-xs line-through" style={{ color: "#ccc" }}>
                                    ₹{item.price}
                                  </span>
                                </div>

                                {/* Cart button */}
                                <button
                                  onClick={e => addCart(item, e)}
                                  disabled={outOfStock}
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
                                  style={{ background: PINK, flexShrink: 0 }}>
                                  <FaCartShopping style={{ fontSize: 11 }} />
                                </button>
                              </div>
                            </div>

                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      <WhatsAppChat />
    </div>
  );
}
