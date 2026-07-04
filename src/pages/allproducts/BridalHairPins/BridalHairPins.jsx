import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useData } from "../../../context/data/MyState.jsx";
import { addToCart } from "../../../redux/CartSlice.jsx";
import { addToWishlist } from "../../../redux/WishlistSlice.jsx";
import { toast } from "react-toastify";
import { FaHeart, FaCartShopping } from "react-icons/fa6";
import { motion } from "framer-motion";

function BridalHairPins() {
  const context = useData();
  const { mode, product, searchkey, filterType, calcOffer } = context;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const wishListitems = useSelector((state) => state.wishlist);
  const user = JSON.parse(localStorage.getItem("user"));

  const [selectedSizes, setSelectedSizes] = useState({});
  const [wishedIds, setWishedIds] = useState({});
  const [animatingIds, setAnimatingIds] = useState({});

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const addCart = (product) => {
    const selectedSize = selectedSizes[product.id];
    if (!selectedSize) { toast.warning("Please select a size before adding to cart!"); return; }
    if (user) {
      const productWithSize = { ...product, selectedSize };
      const existingItem = cartItems.some((item) => item.id === product.id && item.selectedSize === selectedSize);
      if (!existingItem) { dispatch(addToCart(productWithSize)); toast.success(`Item (${selectedSize}) added to cart`); }
      else { toast.warning(`Item (${selectedSize}) already added!`); }
    } else { toast.warning("Please login first!"); }
  };

  const addWishlist = (product) => {
    if (user) {
      const existingItem = wishListitems.some((item) => item.id === product.id);
      setAnimatingIds((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => setAnimatingIds((prev) => ({ ...prev, [product.id]: false })), 400);
      if (!existingItem) {
        dispatch(addToWishlist(product));
        toast.success("Item added to wishlist");
        setWishedIds((prev) => ({ ...prev, [product.id]: true }));
      } else { toast.warning("Item already added!"); }
    } else { toast.warning("Please Login First!"); }
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    localStorage.setItem("wishlist", JSON.stringify(wishListitems));
    window.scrollTo(0, 0);
  }, [cartItems, wishListitems]);

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
      <section style={{ backgroundColor: mode === "dark" ? "#0f172a" : "#f8f4f0" }}>
        <div className="container px-4 py-8 md:py-14 mx-auto">
          <div className="mb-8">
            <h1 className="sm:text-3xl text-2xl font-bold mb-2" style={{ color: mode === "dark" ? "#f1f5f9" : "#1e293b" }}>
              Bridal Hair Pins
            </h1>
            <div className="h-1 w-16 rounded-full" style={{ backgroundColor: "#e63946" }} />
          </div>

          <div className="flex flex-wrap -m-2">
            {product
              .filter((obj) => obj.type.replace(/\s+/g, "").toLowerCase().includes("bridalhairpins"))
              .filter((obj) => obj.title.toLowerCase().includes(searchkey) || obj.type.toLowerCase().includes(searchkey))
              .filter((item) => item.category.replace(/\s+/g, "").toLowerCase().includes(filterType))
              .map((item, index) => {
                const { title, price, category, imageUrl, id } = item;
                const selectedSize = selectedSizes[id] || null;
                const isWished = wishedIds[id] || wishListitems.some(w => w.id === id);

                return (
                  <div key={index} className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
                    <div
                      className="h-full flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                      style={{ backgroundColor: mode === "dark" ? "#1e293b" : "#ffffff" }}
                    >
                      <div className="relative overflow-hidden">
                        <span className="absolute top-2 left-3 z-10 text-[10px] font-semibold px-2 py-[2px] rounded-full shadow-sm"
                          style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#555" }}>
                          {category}
                        </span>
                        <button onClick={() => addWishlist(item)}
                          className="absolute bottom-2 right-2 z-10 p-[6px] rounded-full shadow transition"
                          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
                          <FaHeart
                            className={`text-sm transition-transform duration-300 ${animatingIds[id] ? "scale-150" : "scale-100"}`}
                            style={{ color: isWished ? "#e63946" : "#ccc" }} />
                        </button>
                        <img
                          onClick={() => (window.location.href = `/productinfo/${id}`)}
                          className="w-full h-44 sm:h-52 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                          src={imageUrl} alt={title} />
                      </div>

                      <div className="flex flex-col flex-1 px-3 pt-3 pb-4 gap-2">
                        <div className="flex items-start justify-between gap-1">
                          <h2 className="text-sm font-bold leading-snug line-clamp-2 flex-1"
                            style={{ color: mode === "dark" ? "#f1f5f9" : "#1e293b" }}>
                            {title}
                          </h2>
                          <span className="flex-shrink-0 text-[12px] font-bold px-2 py-[3px] rounded-full text-white"
                            style={{ backgroundColor: "#e63946" }}>
                            ₹{calcOffer(Number(price))}
                          </span>
                        </div>

                        <p className="text-[11px] line-through" style={{ color: "#aaa" }}>₹{price}</p>

                        {item.sizes && item.sizes.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {item.sizes.map((size, idx) => (
                              <button key={idx} onClick={() => handleSizeSelect(item.id, size)}
                                className="px-2 py-[3px] text-[11px] font-medium rounded-full border transition"
                                style={{
                                  backgroundColor: selectedSize === size ? "#F3D0D7" : "transparent",
                                  borderColor: "#F3D0D7",
                                  color: selectedSize === size ? "#1e293b" : mode === "dark" ? "#fff" : "#555",
                                }}>
                                {size}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="flex-1" />

                        <button onClick={() => addCart(item)}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-semibold transition duration-300 hover:opacity-90"
                          style={{ backgroundColor: "#F3D0D7", color: "#1e293b" }}>
                          <FaCartShopping className="text-sm" />
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
    </motion.div>
  );
}

export default BridalHairPins;
