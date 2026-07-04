import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useData } from "../../context/data/MyState";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/CartSlice";
import { addToWishlist } from "../../redux/WishlistSlice";
import { toast } from "react-toastify";
import { FaHeart, FaCartShopping } from "react-icons/fa6";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/loader/Loader";
import WhatsAppChat from "../../components/whatsapp/WhatsAppChat";

const PINK  = "#E91E8C";
const LILAC = "#C77DFF";

export default function AllProducts() {
  const { product, loading, hairCategories, calcOffer, mode, searchkey, setSearchkey,
          filterType, setFilterType } = useData();
  const dispatch  = useDispatch();
  const cartItems = useSelector(s => s.cart);
  const wishlist  = useSelector(s => s.wishlist);
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();

  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [wishedIds, setWishedIds] = useState(() => {
    const obj = {};
    wishlist.forEach(w => { obj[w.id] = true; });
    return obj;
  });

  // Sync URL params → filter state
  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("cat");
    if (q) setSearchkey(q);
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
        item.title.toLowerCase().includes(q) ||
        (item.category || "").toLowerCase().includes(q) ||
        (item.type || "").toLowerCase().includes(q);
    })
    .filter(item => {
      if (!filterType || filterType === "all") return true;
      return (item.category || "").toLowerCase() === filterType.toLowerCase();
    });

  if (sortBy === "price-asc")  filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
  if (sortBy === "name")       filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));

  const addCart = (item, e) => {
    e.preventDefault();
    if (!user) return toast.warning("Please login first!");
    const already = cartItems.some(c => c.id === item.id);
    if (already) return toast.info("Already in cart!");
    dispatch(addToCart(item));
    toast.success("Added to cart 🛒");
  };

  const addWish = (item, e) => {
    e.preventDefault();
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
      {loading && <Loader />}

      {/* ── Header ── */}
      <div className="pt-6 pb-4 px-4" style={{ borderBottom: "1px solid #FFD6E7" }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-black mb-4" style={{ color: text }}>
            {filterType && filterType !== "all"
              ? `${hairCategories.find(c => c.id === filterType)?.emoji || ""} ${hairCategories.find(c => c.id === filterType)?.label || "Products"}`
              : "✨ All Products"
            }
          </h1>

          {/* Search + Filters row */}
          <div className="flex gap-2 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: PINK }} />
              <input
                type="text"
                placeholder="Search products…"
                value={searchkey}
                onChange={e => setSearchkey(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl outline-none text-sm"
                style={{ background: card, border: "1.5px solid #FFD6E7", color: text }}
              />
              {searchkey && (
                <button onClick={() => setSearchkey("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: muted }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: card, border: "1.5px solid #FFD6E7", color: text }}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name: A → Z</option>
            </select>

            {/* Filter toggle (mobile) */}
            <button onClick={() => setShowFilters(p => !p)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold sm:hidden"
              style={{ background: PINK, color: "#fff" }}>
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>

          {/* Category Pills — desktop always visible, mobile collapsible */}
          <div className={`mt-3 flex flex-wrap gap-2 ${showFilters ? "flex" : "hidden sm:flex"}`}>
            {hairCategories.map(cat => (
              <button key={cat.id}
                onClick={() => setFilterType(cat.id === "all" ? "" : cat.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition hover:scale-105"
                style={{
                  background: (filterType === cat.id || (cat.id === "all" && !filterType))
                    ? PINK : card,
                  color: (filterType === cat.id || (cat.id === "all" && !filterType))
                    ? "#fff" : PINK,
                  border: "1.5px solid #FFD6E7",
                }}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-xs mb-4" style={{ color: muted }}>{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: text }}>No products found</h3>
            <p className="text-sm mb-4" style={{ color: muted }}>Try a different search or category</p>
            <button onClick={() => { setSearchkey(""); setFilterType(""); }}
              className="px-6 py-2.5 rounded-full font-semibold text-white text-sm"
              style={{ background: PINK }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            <AnimatePresence>
              {filtered.map((item, i) => {
                const isWished = wishedIds[item.id] || wishlist.some(w => w.id === item.id);
                return (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                    <Link to={`/productinfo/${item.id}`}>
                      <div
                        className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col"
                        style={{ background: card, border: "1px solid #FFD6E7", boxShadow: "0 2px 12px rgba(233,30,140,0.06)" }}
                      >
                        {/* Image */}
                        <div className="relative overflow-hidden" style={{ paddingBottom: "100%" }}>
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={e => { e.target.src = "https://via.placeholder.com/300x300?text=Arpa+Store"; }}
                          />
                          {item.featured && (
                            <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full text-white"
                              style={{ background: PINK }}>⭐ Best</span>
                          )}
                          {item.stock && Number(item.stock) <= 5 && Number(item.stock) > 0 && (
                            <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full text-white"
                              style={{ background: "#FF6B35" }}>Only {item.stock} left!</span>
                          )}
                          {item.stock && Number(item.stock) === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center"
                              style={{ background: "rgba(0,0,0,0.4)" }}>
                              <span className="text-white font-bold text-xs px-3 py-1 rounded-full"
                                style={{ background: "rgba(0,0,0,0.7)" }}>Out of Stock</span>
                            </div>
                          )}
                          <button onClick={e => addWish(item, e)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition"
                            style={{ background: "rgba(255,255,255,0.9)" }}>
                            <FaHeart style={{ color: isWished ? "#E91E8C" : "#ccc", fontSize: 12 }} />
                          </button>
                        </div>

                        {/* Info */}
                        <div className="p-3 flex flex-col flex-1">
                          <p className="text-[10px] font-medium mb-0.5" style={{ color: muted }}>{item.category}</p>
                          <h3 className="font-semibold text-sm truncate mb-1" style={{ color: text }}>{item.title}</h3>
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <div>
                              <span className="font-bold text-sm" style={{ color: PINK }}>₹{calcOffer(item.price)}</span>
                              <span className="text-xs line-through ml-1" style={{ color: "#ccc" }}>₹{item.price}</span>
                            </div>
                            <button onClick={e => addCart(item, e)}
                              disabled={Number(item.stock) === 0}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white transition hover:scale-110 disabled:opacity-40"
                              style={{ background: PINK }}>
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
      </div>

      <WhatsAppChat />
    </div>
  );
}
