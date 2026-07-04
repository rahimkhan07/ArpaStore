import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/data/MyState";
import { useDispatch, useSelector } from "react-redux";
import { deleteFromCart } from "../../redux/CartSlice";
import { toast } from "react-toastify";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { firebaseDB } from "../../firebase/FirebaseConfig";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { ShoppingCart, MapPin, Phone, User, Tag } from "lucide-react";
import Loader from "../../components/loader/Loader";

const PINK = "#E91E8C";

export default function Cart() {
  const { mode, calcOffer, setLoading, loading } = useData();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const cartItems = useSelector(s => s.cart);
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();

  const [name,        setName]        = useState("");
  const [address,     setAddress]     = useState("");
  const [pincode,     setPincode]     = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + parseFloat(calcOffer(item.price)), 0);
    setTotalAmount(total);
  }, [cartItems]);

  const bg   = mode === "dark" ? "#1a0a14" : "#FFF5F7";
  const card = mode === "dark" ? "#2d1a26" : "#fff";
  const text = mode === "dark" ? "#FAFAFA" : "#2d2d2d";
  const muted= mode === "dark" ? "#c0a0b0" : "#888";

  const GST        = (totalAmount * 0.18).toFixed(2);
  const shipping   = cartItems.length > 0 ? (totalAmount >= 499 ? 0 : 99) : 0;
  const beforeDisc = totalAmount + Number(GST) + shipping;
  const discount   = beforeDisc * 0.1;
  const grandTotal = (beforeDisc - discount).toFixed(2);

  const placeOrder = async () => {
    if (!name || !address || !pincode || !phoneNumber)
      return toast.error("All address fields are required.");
    if (phoneNumber.length !== 10) return toast.error("Enter a valid 10-digit phone number.");
    if (cartItems.length === 0) return toast.error("Your cart is empty.");

    const orderInfo = {
      cartItems,
      addressInfo: { name, address, pincode, phoneNumber },
      date: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      email:     user?.user?.email,
      userid:    user?.user?.uid,
      paymentId: "ARPA" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      time:      Timestamp.now(),
      status:    "pending",
    };

    try {
      setLoading(true);
      await addDoc(collection(firebaseDB, "orders"), orderInfo);
      cartItems.forEach(item => dispatch(deleteFromCart(item)));
      toast.success("Order placed successfully! 🎀");
      navigate("/order-success");
    } catch (e) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: bg }}>
      {loading && <Loader />}

      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-black mb-6 flex items-center gap-2" style={{ color: text }}>
          <ShoppingCart style={{ color: PINK }} /> Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: text }}>Your cart is empty</h3>
            <p className="text-sm mb-6" style={{ color: muted }}>Add some gorgeous accessories!</p>
            <button onClick={() => navigate("/allproducts")}
              className="px-8 py-3 rounded-full font-bold text-white"
              style={{ background: PINK }}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Cart Items ── */}
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl"
                  style={{ background: card, border: "1px solid #FFD6E7" }}>
                  <img src={item.imageUrl} alt={item.title}
                    onClick={() => navigate(`/productinfo/${item.id}`)}
                    className="w-20 h-20 rounded-xl object-cover cursor-pointer flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate" style={{ color: text }}>{item.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: muted }}>{item.category}</p>
                    {item.selectedSize && (
                      <p className="text-xs mt-0.5 font-medium" style={{ color: muted }}>
                        Size: {item.selectedSize}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="font-bold" style={{ color: PINK }}>₹{calcOffer(item.price)}</span>
                        <span className="text-xs line-through ml-1" style={{ color: "#ccc" }}>₹{item.price}</span>
                      </div>
                      <button onClick={() => { dispatch(deleteFromCart(item)); toast.warning("Removed from cart"); }}
                        className="p-1.5 rounded-lg transition hover:bg-red-50"
                        style={{ color: "#EF4444" }}>
                        <RiDeleteBin6Fill size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order Summary + Address ── */}
            <div className="space-y-4">
              {/* Summary */}
              <div className="p-5 rounded-2xl" style={{ background: card, border: "1px solid #FFD6E7" }}>
                <h2 className="font-black mb-4" style={{ color: text }}>Order Summary</h2>
                {[
                  { label: "Subtotal",         val: totalAmount.toFixed(2) },
                  { label: "GST (18%)",         val: GST },
                  { label: `Shipping ${shipping === 0 ? "(Free!)" : ""}`, val: shipping.toFixed(2) },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm py-1.5"
                    style={{ borderBottom: "1px solid #FFE4F0" }}>
                    <span style={{ color: muted }}>{r.label}</span>
                    <span style={{ color: text }}>₹{r.val}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm py-1.5"
                  style={{ borderBottom: "1px solid #FFE4F0" }}>
                  <span className="flex items-center gap-1" style={{ color: "#10B981" }}>
                    <Tag size={12} /> Discount (10%)
                  </span>
                  <span style={{ color: "#10B981" }}>–₹{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-lg pt-3">
                  <span style={{ color: text }}>Total</span>
                  <span style={{ color: PINK }}>₹{grandTotal}</span>
                </div>
                {totalAmount < 499 && (
                  <p className="text-xs mt-2 text-center" style={{ color: muted }}>
                    Add ₹{(499 - totalAmount).toFixed(0)} more for free shipping!
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="p-5 rounded-2xl" style={{ background: card, border: "1px solid #FFD6E7" }}>
                <h2 className="font-black mb-4" style={{ color: text }}>Delivery Address</h2>
                <div className="space-y-3">
                  {[
                    { icon: <User size={14}/>,   placeholder: "Full Name",    value: name,        setter: setName },
                    { icon: <MapPin size={14}/>,  placeholder: "Full Address", value: address,     setter: setAddress },
                    { icon: <Tag size={14}/>,     placeholder: "Pincode",      value: pincode,     setter: setPincode },
                    { icon: <Phone size={14}/>,   placeholder: "Phone Number", value: phoneNumber, setter: setPhoneNumber },
                  ].map((f, i) => (
                    <div key={i} className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: PINK }}>{f.icon}</span>
                      <input
                        type="text"
                        placeholder={f.placeholder}
                        value={f.value}
                        onChange={e => f.setter(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl outline-none text-sm"
                        style={{ background: mode === "dark" ? "#3d1a2e" : "#FFF0F5",
                          border: "1.5px solid #FFD6E7", color: text }}
                      />
                    </div>
                  ))}
                </div>

                <button onClick={placeOrder} disabled={loading}
                  className="w-full mt-4 py-3.5 rounded-2xl font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #E91E8C, #9C27B0)" }}>
                  {loading ? "Placing Order…" : "🎀 Place Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
