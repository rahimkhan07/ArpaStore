import { Link } from "react-router-dom";
import { useData } from "../../context/data/MyState";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/CartSlice";
import { deleteFromWishlist } from "../../redux/WishlistSlice";
import { toast } from "react-toastify";
import { FaCartShopping, FaHeart } from "react-icons/fa6";
import { FiTrash2 } from "react-icons/fi";

const PINK = "#E91E8C";

export default function Wishlist() {
  const { mode, calcOffer } = useData();
  const dispatch  = useDispatch();
  const cartItems = useSelector(s => s.cart);
  const wishlist  = useSelector(s => s.wishlist);
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();

  const bg   = mode === "dark" ? "#1a0a14" : "#FFF5F7";
  const card = mode === "dark" ? "#2d1a26" : "#fff";
  const text = mode === "dark" ? "#FAFAFA" : "#2d2d2d";
  const muted= mode === "dark" ? "#c0a0b0" : "#888";

  const addCart = (item) => {
    if (!user) return toast.warning("Please login first!");
    const already = cartItems.some(c => c.id === item.id);
    if (already) return toast.info("Already in cart!");
    dispatch(addToCart(item));
    toast.success("Added to cart 🛒");
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: bg }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-black mb-6 flex items-center gap-2" style={{ color: text }}>
          <FaHeart style={{ color: PINK }} /> Wishlist
          <span className="text-lg font-normal" style={{ color: muted }}>({wishlist.length} items)</span>
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💕</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: text }}>Your wishlist is empty</h3>
            <p className="text-sm mb-6" style={{ color: muted }}>Save items you love here!</p>
            <Link to="/allproducts"
              className="inline-block px-8 py-3 rounded-full font-bold text-white"
              style={{ background: PINK }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {wishlist.map((item) => (
              <div key={item.id} className="rounded-2xl overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
                style={{ background: card, border: "1px solid #FFD6E7" }}>
                <Link to={`/productinfo/${item.id}`}>
                  <div style={{ paddingBottom: "100%", position: "relative" }}>
                    <img src={item.imageUrl} alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                </Link>
                <div className="p-3">
                  <p className="text-xs" style={{ color: muted }}>{item.category}</p>
                  <p className="font-semibold text-sm truncate mt-0.5" style={{ color: text }}>{item.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="font-bold text-sm" style={{ color: PINK }}>₹{calcOffer(item.price)}</span>
                      <span className="text-xs line-through ml-1" style={{ color: "#ccc" }}>₹{item.price}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => addCart(item)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white transition hover:scale-110"
                        style={{ background: PINK }}>
                        <FaCartShopping style={{ fontSize: 11 }} />
                      </button>
                        <button onClick={() => dispatch(deleteFromWishlist(item))}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition hover:scale-110"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                        <FiTrash2 style={{ fontSize: 11 }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
