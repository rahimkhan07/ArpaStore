import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../context/data/MyState";
import Loader from "../../components/loader/Loader";

const PINK = "#E91E8C";

const STATUS_CONFIG = {
  confirmed: { label: "✅ Confirmed", bg: "#dcfce7", color: "#15803d" },
  pending:   { label: "⏳ Pending",   bg: "#FFF0F5", color: "#E91E8C" },
  shipped:   { label: "🚚 Shipped",   bg: "#dbeafe", color: "#1d4ed8" },
  delivered: { label: "📦 Delivered", bg: "#d1fae5", color: "#065f46" },
  cancelled: { label: "❌ Cancelled", bg: "#fee2e2", color: "#b91c1c" },
};

export default function Order() {
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();
  const { mode, loading, order, calcOffer } = useData();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const bg   = mode === "dark" ? "#1a0a14" : "#FFF5F7";
  const card = mode === "dark" ? "#2d1a26" : "#fff";
  const text = mode === "dark" ? "#FAFAFA" : "#2d2d2d";
  const muted= mode === "dark" ? "#c0a0b0" : "#888";

  const userOrders = user ? order.filter(o => o.userid === user.user.uid) : [];

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: bg }}>
      {loading && <Loader />}

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-black mb-6 text-center" style={{ color: text }}>My Orders 🎀</h1>

        {userOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: text }}>No orders yet</h3>
            <p className="text-sm mb-6" style={{ color: muted }}>Start shopping and your orders will appear here.</p>
            <Link to="/allproducts"
              className="inline-block px-8 py-3 rounded-full font-bold text-white"
              style={{ background: PINK }}>
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {[...userOrders].reverse().map((orderItem, idx) => {
              const status = orderItem.status || "pending";
              const { label, bg: sBg, color } = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

              return (
                <div key={idx} className="rounded-2xl overflow-hidden shadow-sm"
                  style={{ background: card, border: "1px solid #FFD6E7" }}>
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between px-5 py-4 gap-3"
                    style={{ background: mode === "dark" ? "#3d1a2e" : "#FFF0F5",
                      borderBottom: "1px solid #FFD6E7" }}>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: muted }}>Order ID</p>
                      <p className="font-bold text-sm" style={{ color: PINK }}>{orderItem.paymentId}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider" style={{ color: muted }}>Date</p>
                      <p className="font-semibold text-sm" style={{ color: text }}>{orderItem.date}</p>
                    </div>
                    <span className="text-xs font-bold px-4 py-1.5 rounded-full"
                      style={{ background: sBg, color }}>
                      {label}
                    </span>
                  </div>

                  {/* Cart Items */}
                  <div className="divide-y" style={{ borderColor: "#FFE4F0" }}>
                    {(orderItem.cartItems || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:opacity-80 transition"
                        onClick={() => (window.location.href = `/productinfo/${item.id}`)}>
                        <img src={item.imageUrl} alt={item.title}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate" style={{ color: text }}>{item.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: muted }}>{item.category}</p>
                          {item.selectedSize && (
                            <p className="text-xs mt-0.5" style={{ color: muted }}>Size: {item.selectedSize}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold" style={{ color: PINK }}>₹{calcOffer(item.price)}</p>
                          <p className="text-xs line-through" style={{ color: "#ccc" }}>₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Address */}
                  <div className="px-5 py-3 text-xs flex flex-wrap gap-4"
                    style={{ background: mode === "dark" ? "#3d1a2e" : "#FFF8FB",
                      borderTop: "1px solid #FFD6E7", color: muted }}>
                    <span>📍 {orderItem.addressInfo?.address}, {orderItem.addressInfo?.pincode}</span>
                    <span>📞 {orderItem.addressInfo?.phoneNumber}</span>
                    <span>👤 {orderItem.addressInfo?.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
