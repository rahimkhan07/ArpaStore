import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useData } from "../../../context/data/MyState.jsx";
import { addToCart } from "../../../redux/CartSlice.jsx";
import { addToWishlist } from "../../../redux/WishlistSlice.jsx";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa6";
import { motion } from "framer-motion";

function Textiles() {
  const context = useData();
  const {
    mode,
    product,
    searchkey,
    filterType,
    calcOffer,
  } = context;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const wishListitems = useSelector((state) => state.wishlist);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🆕 Track selected size per product
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const addCart = (product) => {
    const selectedSize = selectedSizes[product.id];

    if (!selectedSize) {
      toast.warning("Please select a size before adding to cart!");
      return;
    }

    if (user) {
      const productWithSize = { ...product, selectedSize };

      const existingItem = cartItems.some(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );

      if (!existingItem) {
        dispatch(addToCart(productWithSize));
        toast.success(`Item (${selectedSize}) added to cart`);
      } else {
        toast.warning(`Item (${selectedSize}) already added!`);
      }
    } else {
      toast.warning("Please login first!");
    }
  };

  const addWishlist = (product) => {
    if (user) {
      const existingItem = wishListitems.some((item) => item.id === product.id);
      if (!existingItem) {
        dispatch(addToWishlist(product));
        toast.success("Item added to wishlist");
      } else {
        toast.warning("Item already added!");
      }
    } else {
      toast.warning("Please Login First!");
    }
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    localStorage.setItem("wishlist", JSON.stringify(wishListitems));
    window.scrollTo(0, 0);
  }, [cartItems, wishListitems]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <section
        className="body-font"
        style={{ backgroundColor: mode === "dark" ? "#232F3E" : "#F6F5F2" }}
      >
        <div className="container px-5 py-8 md:py-16 mx-auto">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-10">
            <h1
              className="sm:text-3xl text-2xl font-medium title-font mb-2"
              style={{ color: mode === "dark" ? "#FFFFFF" : "#232F3E" }}
            >
              Textiles Collection
            </h1>
            <div
              className="h-1 w-20 rounded"
              style={{ backgroundColor: "#F3D0D7" }}
            ></div>
          </div>

          <div className="flex flex-wrap -m-2">
            {product
              .filter((obj) => obj.type.toLowerCase().includes("textiles"))
              .filter(
                (obj) =>
                  obj.title.toLowerCase().includes(searchkey) ||
                  obj.type.toLowerCase().includes(searchkey)
              )
              .filter((item) =>
                item.category.replace(/\s+/g, "").toLowerCase().includes(filterType)
              )
              .map((item, index) => {
                const { title, price, category, imageUrl, id } = item;
                const selectedSize = selectedSizes[id] || null;
                return (
                  <div key={index} className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
                    <div
                      className="h-full border rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 group"
                      style={{
                        backgroundColor: mode === "dark" ? "#232F3E" : "#FFFFFF",
                        color: mode === "dark" ? "#FFFFFF" : "#232F3E",
                        borderColor: mode === "dark" ? "#374151" : "#FFEFEF",
                      }}
                    >
                      <div className="flex justify-center items-center p-4">
                        <img
                          onClick={() => (window.location.href = `/productinfo/${id}`)}
                          className="h-36 sm:h-44 object-contain transition-transform rounded-md duration-300 hover:scale-110 cursor-pointer"
                          src={imageUrl}
                          alt={title}
                        />
                      </div>
                      <div className="px-4 pb-4 border-t border-gray-200">
                        <p
                          className="text-xs mt-2 mb-1"
                          style={{ color: mode === "dark" ? "#FFFFFF" : "#555" }}
                        >
                          {category}
                        </p>
                        <h2
                          className="text-sm font-semibold truncate"
                          style={{ color: "#F3D0D7" }}
                        >
                          {title}
                        </h2>
                        <div className="flex items-baseline gap-1">
                          <p
                            className="text-base font-bold mt-1"
                            style={{ color: "#FF9900" }}
                          >
                            ₹{calcOffer(Number(price))}
                          </p>
                          <p
                            className="text-sm font-semibold line-through"
                            style={{ color: "#F3D0D7" }}
                          >
                            ₹{price}
                          </p>
                        </div>

                        {/* 🔹 Sizes Section with selection */}
                        {item.sizes && item.sizes.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {item.sizes.map((size, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSizeSelect(item.id, size)}
                                className={`px-2 py-1 text-xs font-medium border rounded-md transition ${selectedSize === size
                                  ? "bg-[#F3D0D7] text-[#232F3E] border-[#F3D0D7]"
                                  : "hover:bg-pink-200"
                                  }`}
                                style={{
                                  borderColor: "#F3D0D7",
                                  color:
                                    selectedSize === size
                                      ? "#232F3E"
                                      : mode === "dark"
                                        ? "#FFF"
                                        : "#333",
                                }}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <button
                            onClick={() => addCart(item)}
                            className="flex-1 py-2 mr-2 text-sm font-semibold rounded-lg text-white bg-[#F3D0D7] hover:bg-[#FFEFEF] transition duration-300 cursor-pointer"
                          >
                            Add to Cart
                          </button>

                          <button
                            onClick={() => addWishlist(item)}
                            className="p-2 rounded-full bg-[#FFEFEF] hover:bg-[#F3D0D7] grid place-items-center transition cursor-pointer"
                          >
                            <FaHeart className="text-xl text-[#FF9900]" />
                          </button>
                        </div>
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

export default Textiles;
