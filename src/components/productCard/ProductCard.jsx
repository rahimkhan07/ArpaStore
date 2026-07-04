import { useEffect, useRef, useState } from "react";
import { useData } from "../../context/data/MyState";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/CartSlice";
import { toast } from "react-toastify";
import { addToWishlist } from "../../redux/WishlistSlice";
import { FaHeart, FaCartShopping } from "react-icons/fa6";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const IG_BTN = "linear-gradient(45deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)";

/* ── Per-card image slider ── */
function CardImageSlider({ item, isWished, animating, onWishlist, onNavigate }) {
  const images = [item.imageUrl, item.imageUrl2, item.imageUrl3, item.imageUrl4].filter(Boolean);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (images.length < 2) return;
    clearInterval(timerRef.current);
    if (hovered) {
      timerRef.current = setInterval(() => setActive(p => (p + 1) % images.length), 1000);
    } else {
      setActive(0);
    }
    return () => clearInterval(timerRef.current);
  }, [hovered, images.length]);

  const prev = e => { e.stopPropagation(); clearInterval(timerRef.current); setActive(p => (p - 1 + images.length) % images.length); };
  const next = e => { e.stopPropagation(); clearInterval(timerRef.current); setActive(p => (p + 1) % images.length); };

  return (
    <div className="relative overflow-hidden w-full h-44 sm:h-52"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {images.map((src, i) => (
        <img key={i} src={src} alt={item.title} onClick={onNavigate}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-500"
          style={{ opacity: active === i ? 1 : 0 }}/>
      ))}

      {/* Category badge */}
      <span className="absolute top-2 left-3 z-20 text-[10px] font-semibold px-2 py-[2px] rounded-full"
        style={{ background:"rgba(0,0,0,0.6)", color:"#FAFAFA", backdropFilter:"blur(4px)" }}>
        {item.category}
      </span>

      {/* Wishlist */}
      <button onClick={e => { e.stopPropagation(); onWishlist(); }}
        className="absolute top-2 right-2 z-20 p-[6px] rounded-full shadow transition"
        style={{ background:"rgba(0,0,0,0.55)", backdropFilter:"blur(4px)" }}>
        <FaHeart className={`text-sm transition-transform duration-300 ${animating ? "scale-150" : "scale-100"}`}
          style={{ color: isWished ? "#ED4956" : "rgba(255,255,255,0.5)" }}/>
      </button>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full shadow transition-all duration-200"
            style={{ background:"rgba(0,0,0,0.5)", color:"#fff", opacity: hovered ? 1 : 0 }}
            aria-label="Previous image">
            <MdChevronLeft size={18}/>
          </button>
          <button onClick={next}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full shadow transition-all duration-200"
            style={{ background:"rgba(0,0,0,0.5)", color:"#fff", opacity: hovered ? 1 : 0 }}
            aria-label="Next image">
            <MdChevronRight size={18}/>
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20 transition-opacity duration-200"
            style={{ opacity: hovered ? 1 : 0.5 }}>
            {images.map((_, i) => (
              <button key={i}
                onClick={e => { e.stopPropagation(); clearInterval(timerRef.current); setActive(i); }}
                className="rounded-full transition-all duration-300"
                style={{ width: active === i ? 18 : 6, height: 6, background: active === i ? "#DD2A7B" : "rgba(255,255,255,0.5)" }}
                aria-label={`Image ${i + 1}`}/>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Main ProductCard ── */
function ProductCard() {
  const context = useData();
  const [wishedIds, setWishedIds] = useState({});
  const [animatingIds, setAnimatingIds] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});

  const { product, searchkey, filterType, filterPrice, calcOffer } = context;
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart);
  const wishListitems = useSelector(state => state.wishlist);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSizeSelect = (productId, size) => setSelectedSizes(prev => ({ ...prev, [productId]: size }));

  const addCart = product => {
    const selectedSize = selectedSizes[product.id];
    if (!selectedSize) { toast.warning("Please select a size before adding to cart!"); return; }
    if (user) {
      const productWithSize = { ...product, selectedSize };
      const existing = cartItems.some(i => i.id === product.id && i.selectedSize === selectedSize);
      if (!existing) { dispatch(addToCart(productWithSize)); toast.success(`Item (${selectedSize}) added to cart`); }
      else { toast.warning(`Item (${selectedSize}) already added!`); }
    } else { toast.warning("Please login first!"); }
  };

  const addWishlist = item => {
    if (user) {
      const existing = wishListitems.some(w => w.id === item.id);
      setAnimatingIds(prev => ({ ...prev, [item.id]: true }));
      setTimeout(() => setAnimatingIds(prev => ({ ...prev, [item.id]: false })), 400);
      if (!existing) { dispatch(addToWishlist(item)); toast.success("Item added to wishlist"); setWishedIds(prev => ({ ...prev, [item.id]: true })); }
      else { toast.warning("Item already added!"); }
    } else { toast.warning("Please Login First!"); }
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    localStorage.setItem("wishlist", JSON.stringify(wishListitems));
  }, [cartItems, wishListitems]);

  return (
    <section style={{ background:"#000000" }}>
      <div className="container px-4 py-8 md:py-14 mx-auto">
        <div className="mb-8">
          <h1 className="sm:text-3xl text-2xl font-bold mb-2" style={{ color:"#FAFAFA" }}>
            Our Latest Products
          </h1>
          <div className="h-[3px] w-16 rounded-full" style={{ background:IG_BTN }}/>
        </div>

        <div className="flex flex-wrap -m-2">
          {product
            .filter(item =>
              item.title.toLowerCase().includes(searchkey.toLowerCase()) ||
              item.type.toLowerCase().includes(searchkey.toLowerCase())
            )
            .filter(item => item.category.replace(/\s+/g,"").toLowerCase().includes(filterType))
            .slice(0, 10)
            .filter(obj => obj.price.trim().includes(filterPrice))
            .map((item, index) => {
              const { title, price, id } = item;
              const selectedSize = selectedSizes[id] || null;
              const isWished = wishedIds[id] || wishListitems.some(w => w.id === id);

              return (
                <div key={index} className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
                  <div className="h-full flex flex-col rounded-2xl overflow-hidden"
                    style={{ background:"#1C1C1C", border:"1px solid rgba(255,255,255,0.08)", transition:"all 0.3s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(221,42,123,0.4)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.6)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}>

                    <CardImageSlider
                      item={item}
                      isWished={isWished}
                      animating={animatingIds[id]}
                      onWishlist={() => addWishlist(item)}
                      onNavigate={() => (window.location.href = `/productinfo/${id}`)}
                    />

                    <div className="flex flex-col flex-1 px-3 pt-3 pb-4 gap-2">
                      <div className="flex items-start justify-between gap-1">
                        <h2 className="text-sm font-bold leading-snug line-clamp-2 flex-1" style={{ color:"#FAFAFA" }}>
                          {title}
                        </h2>
                        <span className="flex-shrink-0 text-[12px] font-bold px-2 py-[3px] rounded-full text-white"
                          style={{ background:IG_BTN }}>
                          ₹{calcOffer(Number(price))}
                        </span>
                      </div>

                      <p className="text-[11px] line-through" style={{ color:"#737373" }}>₹{price}</p>

                      {item.sizes && item.sizes.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {item.sizes.map((size, idx) => (
                            <button key={idx} onClick={() => handleSizeSelect(id, size)}
                              className="px-2 py-[3px] text-[11px] font-medium rounded-full border transition"
                              style={{
                                background: selectedSize === size ? "rgba(221,42,123,0.25)" : "transparent",
                                borderColor: selectedSize === size ? "#DD2A7B" : "rgba(255,255,255,0.15)",
                                color: selectedSize === size ? "#FAFAFA" : "#A8A8A8",
                              }}>
                              {size}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex-1"/>

                      <button onClick={() => addCart(item)}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-semibold transition duration-300"
                        style={{ background:IG_BTN, color:"#fff" }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                        <FaCartShopping className="text-sm"/>
                        {selectedSize ? `Add ${selectedSize}` : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

export default ProductCard;
