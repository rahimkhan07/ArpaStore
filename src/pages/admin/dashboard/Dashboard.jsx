import { useState } from "react";
import { motion } from "framer-motion";
import { useData } from "../../../context/data/MyState";
import AddProduct from "../page/AddProduct";
import UpdateProduct from "../page/UpdateProduct";
import ManageSlider from "../page/ManageSlider";
import jsPDF from "jspdf";
import {
  Package, ShoppingBag, Users, TrendingUp, Trash2, CheckCircle,
  XCircle, Edit, Bell, Tag, FileDown,
} from "lucide-react";

const PINK   = "#E91E8C";
const LILAC  = "#9C27B0";
const GOLD   = "#F59E0B";

function StatusBadge({ status }) {
  const MAP = {
    pending:   ["#E91E8C", "rgba(233,30,140,0.1)"],
    confirmed: ["#10B981", "rgba(16,185,129,0.1)"],
    shipped:   ["#3B82F6", "rgba(59,130,246,0.1)"],
    delivered: ["#065f46", "rgba(6,95,70,0.1)"],
    cancelled: ["#EF4444", "rgba(239,68,68,0.1)"],
  };
  const [c, bg] = MAP[status] || MAP.pending;
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
      style={{ color: c, background: bg }}>
      {status || "pending"}
    </span>
  );
}

export default function Dashboard() {
  const {
    mode, product, order, users, subscribers, loading,
    deleteProduct, setProducts,
    updateOrderStatus, deleteOrder,
    deleteUser, updateUserRole,
    deleteSubscriber,
    getAnalytics,
  } = useData();

  const [tab, setTab] = useState("overview");
  const [editProduct, setEditProduct] = useState(null);

  const analytics = getAnalytics();

  const downloadOrdersPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pW = pdf.internal.pageSize.getWidth();
    const pH = pdf.internal.pageSize.getHeight();
    const mg = 14;
    let y = mg;

    const newPage = (need = 10) => {
      if (y + need > pH - mg) { pdf.addPage(); y = mg; }
    };

    pdf.setFontSize(18); pdf.setTextColor(233, 30, 140);
    pdf.text("ArpaStore — Order Report", pW / 2, y, { align: "center" });
    y += 6;
    pdf.setFontSize(9); pdf.setTextColor(150, 100, 120);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pW / 2, y, { align: "center" });
    y += 8;
    pdf.setDrawColor(255, 214, 231); pdf.setLineWidth(0.4);
    pdf.line(mg, y, pW - mg, y); y += 6;

    [...order].reverse().forEach((o) => {
      newPage(40);
      pdf.setFillColor(255, 245, 247);
      pdf.roundedRect(mg, y, pW - mg * 2, 20, 3, 3, "F");
      pdf.setFontSize(8); pdf.setTextColor(150, 100, 120);
      pdf.text("ORDER ID", mg + 3, y + 5);
      pdf.text("CUSTOMER", mg + 55, y + 5);
      pdf.text("PHONE", mg + 95, y + 5);
      pdf.text("DATE", mg + 130, y + 5);
      pdf.text("STATUS", mg + 165, y + 5);
      pdf.setFontSize(9); pdf.setTextColor(45, 45, 45);
      pdf.text(String(o.paymentId || ""), mg + 3, y + 13, { maxWidth: 48 });
      pdf.text(String(o.addressInfo?.name || ""), mg + 55, y + 13, { maxWidth: 36 });
      pdf.text(String(o.addressInfo?.phoneNumber || ""), mg + 95, y + 13);
      pdf.text(String(o.date || ""), mg + 130, y + 13, { maxWidth: 32 });
      const sc = { confirmed: [16, 185, 129], pending: [233, 30, 140], cancelled: [239, 68, 68], shipped: [59, 130, 246], delivered: [6, 95, 70] };
      const [r, g, b] = sc[o.status || "pending"] || sc.pending;
      pdf.setTextColor(r, g, b);
      pdf.text((o.status || "pending").toUpperCase(), mg + 165, y + 13);
      y += 24;

      (o.cartItems || []).forEach((item) => {
        newPage(10);
        pdf.setFillColor(249, 245, 250);
        pdf.roundedRect(mg + 2, y, pW - mg * 2 - 4, 9, 2, 2, "F");
        pdf.setFontSize(8); pdf.setTextColor(45, 45, 45);
        pdf.text(String(item.title || ""), mg + 5, y + 6, { maxWidth: 100 });
        pdf.setTextColor(233, 30, 140);
        pdf.text(`Rs.${item.price}`, pW - mg - 4, y + 6, { align: "right" });
        y += 11;
      });

      pdf.setDrawColor(255, 214, 231); pdf.setLineWidth(0.3);
      pdf.line(mg, y, pW - mg, y); y += 5;
    });

    pdf.save(`ArpaStore_Orders_${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}.pdf`);
  };

  const bg    = "#FFF5F7";
  const card  = "#fff";
  const border= "rgba(233,30,140,0.12)";
  const tp    = "#2d2d2d";
  const tm    = "#888";

  const STAT_CARDS = [
    { label: "Total Products",  val: analytics.totalProducts,   icon: <Package size={18}/>,    color: PINK  },
    { label: "Total Orders",    val: analytics.totalOrders,     icon: <ShoppingBag size={18}/>, color: LILAC },
    { label: "Pending Orders",  val: analytics.pendingOrders,   icon: <Bell size={18}/>,        color: GOLD  },
    { label: "Confirmed",       val: analytics.confirmedOrders, icon: <CheckCircle size={18}/>, color: "#10B981" },
    { label: "Revenue (est.)",  val: `₹${analytics.totalRevenue}`, icon: <TrendingUp size={18}/>, color: "#3B82F6" },
    { label: "Total Users",     val: analytics.totalUsers,      icon: <Users size={18}/>,       color: "#F97316" },
    { label: "Low Stock",       val: analytics.lowStockItems,   icon: <Tag size={18}/>,         color: "#EF4444" },
    { label: "Subscribers",     val: analytics.totalSubscribers,icon: <Bell size={18}/>,        color: "#8B5CF6" },
  ];

  const TABS = [
    { id: "overview",  label: "📊 Overview" },
    { id: "orders",    label: `📦 Orders (${order.length})` },
    { id: "products",  label: `🎀 Products (${product.length})` },
    { id: "add",       label: "➕ Add Product" },
    { id: "slider",    label: "🖼 Manage Slider" },
    { id: "users",     label: `👤 Users (${users.length})` },
    { id: "newsletter",label: `💌 Newsletter (${subscribers.length})` },
  ];

  const handleEditProduct = (item) => {
    setProducts({ ...item });
    setTab("edit");
  };

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-black mb-1" style={{ color: tp }}>🎀 Arpa Store — Admin</h1>
          <p className="text-sm" style={{ color: tm }}>Manage your hair accessories business</p>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {STAT_CARDS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-3 rounded-2xl text-center"
              style={{ background: card, border: `1px solid ${border}` }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
              <div className="text-xl font-black" style={{ color: s.color }}>{s.val}</div>
              <div className="text-[10px] mt-0.5 leading-tight" style={{ color: tm }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto scrollbar-hide"
          style={{ background: "rgba(233,30,140,0.05)" }}>
          {[...TABS, { id: "edit", label: "✏️ Edit Product" }]
            .filter(t => t.id !== "edit" || tab === "edit")
            .map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
                style={{
                  background: tab === t.id ? "linear-gradient(135deg,#E91E8C,#9C27B0)" : "transparent",
                  color: tab === t.id ? "#fff" : tm,
                }}>
                {t.label}
              </button>
            ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Order Status",
                rows: [
                  { l: "Pending",   v: analytics.pendingOrders,   c: PINK },
                  { l: "Confirmed", v: analytics.confirmedOrders, c: "#10B981" },
                  { l: "Cancelled", v: analytics.cancelledOrders, c: "#EF4444" },
                ],
              },
              {
                title: "Inventory",
                rows: [
                  { l: "Total Products",   v: analytics.totalProducts,                         c: LILAC },
                  { l: "Low Stock (≤5)",   v: analytics.lowStockItems,                         c: "#F59E0B" },
                  { l: "Out of Stock",     v: product.filter(p => Number(p.stock) === 0).length, c: "#EF4444" },
                ],
              },
              {
                title: "Community",
                rows: [
                  { l: "Total Users",    v: analytics.totalUsers,         c: "#3B82F6" },
                  { l: "Subscribers",   v: analytics.totalSubscribers,   c: "#8B5CF6" },
                  { l: "Est. Revenue",  v: `₹${analytics.totalRevenue}`,  c: "#10B981" },
                ],
              },
            ].map(c => (
              <div key={c.title} className="p-5 rounded-2xl" style={{ background: card, border: `1px solid ${border}` }}>
                <h3 className="font-bold mb-3 text-sm" style={{ color: tp }}>{c.title}</h3>
                {c.rows.map(r => (
                  <div key={r.l} className="flex justify-between py-2 text-sm"
                    style={{ borderBottom: `1px solid ${border}` }}>
                    <span style={{ color: tm }}>{r.l}</span>
                    <span className="font-bold" style={{ color: r.c }}>{r.v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === "orders" && (
          <div className="overflow-x-auto rounded-2xl" style={{ background: card, border: `1px solid ${border}` }}>
            {order.length === 0 ? (
              <div className="text-center py-16 text-4xl">📦
                <p className="text-sm mt-3" style={{ color: tm }}>No orders yet</p>
              </div>
            ) : (
              <>
                <div className="p-4 flex justify-end" style={{ borderBottom: `1px solid ${border}` }}>
                  <button
                    onClick={downloadOrdersPDF}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                    style={{ background: "linear-gradient(135deg,#E91E8C,#9C27B0)" }}>
                    <FileDown size={14} /> Download PDF
                  </button>
                </div>
                <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    {["#", "Order ID", "Customer", "Items", "Date", "Status", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
                        style={{ color: tm }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...order].reverse().map((o, i) => (
                    <tr key={o.id} style={{ borderBottom: `1px solid ${border}` }}>
                      <td className="px-4 py-3 text-xs" style={{ color: tm }}>{i + 1}</td>
                      <td className="px-4 py-3 text-xs font-bold" style={{ color: PINK }}>{o.paymentId}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold" style={{ color: tp }}>{o.addressInfo?.name}</p>
                          <p className="text-[10px]" style={{ color: tm }}>{o.email}</p>
                          <p className="text-[10px]" style={{ color: tm }}>📞 {o.addressInfo?.phoneNumber}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap max-w-[120px]">
                          {(o.cartItems || []).slice(0, 2).map((item, ci) => (
                            <img key={ci} src={item.imageUrl} alt={item.title}
                              className="w-7 h-7 rounded-lg object-cover" />
                          ))}
                          {(o.cartItems || []).length > 2 && (
                            <span className="text-[10px]" style={{ color: tm }}>+{o.cartItems.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: tm }}>{o.date}</td>
                      <td className="px-4 py-3">
                        <select value={o.status || "pending"}
                          onChange={e => updateOrderStatus(o.id, e.target.value)}
                          className="px-2 py-1 rounded-lg text-xs outline-none"
                          style={{ background: "rgba(233,30,140,0.06)", border: `1px solid ${border}`, color: tp }}>
                          {["pending","confirmed","shipped","delivered","cancelled"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteOrder(o.id)}
                          className="p-1.5 rounded-lg"
                          style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </>
            )}
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === "products" && (
          <div className="overflow-x-auto rounded-2xl" style={{ background: card, border: `1px solid ${border}` }}>
            {product.length === 0 ? (
              <div className="text-center py-16 text-4xl">🎀
                <p className="text-sm mt-3" style={{ color: tm }}>No products yet — add your first one!</p>
              </div>
            ) : (
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    {["Image", "Title", "Category", "Price", "Stock", "Featured", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
                        style={{ color: tm }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {product.map((item, i) => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${border}` }}>
                      <td className="px-4 py-3">
                        <img src={item.imageUrl} alt={item.title}
                          className="w-10 h-10 rounded-xl object-cover" />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-xs max-w-[160px] truncate" style={{ color: tp }}>{item.title}</p>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: tm }}>{item.category}</td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-xs" style={{ color: PINK }}>₹{item.price}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${Number(item.stock) === 0 ? "text-red-600 bg-red-50" : Number(item.stock) <= 5 ? "text-yellow-600 bg-yellow-50" : "text-green-600 bg-green-50"}`}>
                          {item.stock ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.featured ? "text-pink-600 bg-pink-50" : "text-gray-400 bg-gray-50"}`}>
                          {item.featured ? "⭐ Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => handleEditProduct(item)}
                            className="p-1.5 rounded-lg"
                            style={{ background: "rgba(233,30,140,0.1)", color: PINK }}>
                            <Edit size={13} />
                          </button>
                          <button onClick={() => deleteProduct(item.id)}
                            className="p-1.5 rounded-lg"
                            style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── ADD PRODUCT ── */}
        {tab === "add" && (
          <div className="rounded-2xl overflow-hidden" style={{ background: card, border: `1px solid ${border}` }}>
            <AddProduct />
          </div>
        )}

        {/* ── EDIT PRODUCT ── */}
        {tab === "edit" && (
          <div className="rounded-2xl overflow-hidden" style={{ background: card, border: `1px solid ${border}` }}>
            <UpdateProduct />
          </div>
        )}

        {/* ── MANAGE SLIDER ── */}
        {tab === "slider" && (
          <div className="rounded-2xl overflow-hidden" style={{ background: card, border: `1px solid ${border}` }}>
            <ManageSlider />
          </div>
        )}

        {/* ── USERS ── */}
        {tab === "users" && (
          <div className="overflow-x-auto rounded-2xl" style={{ background: card, border: `1px solid ${border}` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${border}` }}>
                  {["#", "User", "Email", "Role", "Joined", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
                      style={{ color: tm }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.docId || i} style={{ borderBottom: `1px solid ${border}` }}>
                    <td className="px-4 py-3 text-xs" style={{ color: tm }}>{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: "linear-gradient(135deg,#E91E8C,#9C27B0)" }}>
                          {(u.name?.[0] || "U").toUpperCase()}
                        </div>
                        <p className="font-semibold text-xs" style={{ color: tp }}>{u.name || "—"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs truncate max-w-[160px]" style={{ color: tm }}>{u.email}</td>
                    <td className="px-4 py-3">
                      <select value={u.role || "customer"}
                        onChange={e => updateUserRole(u.docId, e.target.value)}
                        className="px-2 py-1 rounded-lg text-xs outline-none"
                        style={{ background: "rgba(233,30,140,0.06)", border: `1px solid ${border}`, color: tp }}>
                        {["customer", "admin"].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: tm }}>
                      {u.signedupAt ? u.signedupAt.slice(0, 10) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteUser(u.docId)}
                        className="p-1.5 rounded-lg"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── NEWSLETTER ── */}
        {tab === "newsletter" && (
          <div className="overflow-x-auto rounded-2xl" style={{ background: card, border: `1px solid ${border}` }}>
            <div className="p-4" style={{ borderBottom: `1px solid ${border}` }}>
              <h3 className="font-bold text-sm" style={{ color: tp }}>Newsletter Subscribers ({subscribers.length})</h3>
            </div>
            {subscribers.length === 0 ? (
              <div className="text-center py-16 text-3xl">💌
                <p className="text-sm mt-3" style={{ color: tm }}>No subscribers yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    {["#", "Email", "Date", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
                        style={{ color: tm }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub, i) => (
                    <tr key={sub.id} style={{ borderBottom: `1px solid ${border}` }}>
                      <td className="px-4 py-3 text-xs" style={{ color: tm }}>{i + 1}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: tp }}>{sub.email}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: tm }}>{sub.date}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteSubscriber(sub.id)}
                          className="p-1.5 rounded-lg"
                          style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
