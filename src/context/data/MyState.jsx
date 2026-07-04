import { useCallback, useContext, useEffect, useState } from "react";
import MyContext from "./MyContext.jsx";
import {
  addDoc, collection, deleteDoc, doc, getDocs,
  onSnapshot, orderBy, query, Timestamp,
  updateDoc, where,
} from "firebase/firestore";
import { firebaseDB } from "../../firebase/FirebaseConfig.jsx";
import { toast } from "react-toastify";

/* ─── Hair Accessory Categories ─── */
const HAIR_CATEGORIES = [
  { id: "all",        label: "All Products",    emoji: "✨" },
  { id: "scrunchies", label: "Scrunchies",       emoji: "🪢" },
  { id: "bows",       label: "Hair Bows",        emoji: "🎀" },
  { id: "clips",      label: "Hair Clips",       emoji: "📎" },
  { id: "pins",       label: "Hair Pins",        emoji: "📍" },
  { id: "headbands",  label: "Headbands",        emoji: "👑" },
  { id: "ties",       label: "Hair Ties",        emoji: "🧶" },
  { id: "sets",       label: "Gift Sets",        emoji: "🎁" },
];

function MyState({ children }) {

  /* ─────────── THEME ─────────── */
  const [mode, setMode] = useState(() => localStorage.getItem("arpa_theme") || "light");
  const toggleMode = () => {
    setMode(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("arpa_theme", next);
      return next;
    });
  };

  useEffect(() => {
    document.body.style.backgroundColor = mode === "dark" ? "#1a0a14" : "#FFF5F7";
  }, [mode]);

  /* ─────────── LOADING ─────────── */
  const [loading, setLoading] = useState(false);

  /* ═══════════════════════════════════════════
     PRODUCTS  (Firestore real-time)
  ═══════════════════════════════════════════ */
  const [product, setProduct] = useState([]);

  // Form state for add/update
  const [products, setProducts] = useState({
    title: "", price: "", imageUrl: "", imageUrl2: "", imageUrl3: "", imageUrl4: "",
    category: "scrunchies", type: "", description: "", sizes: [], stock: "",
    featured: false,
  });

  useEffect(() => {
    setLoading(true);
    const q = query(collection(firebaseDB, "products"), orderBy("time"));
    const unsub = onSnapshot(q,
      snap => {
        console.log("✅ Products loaded:", snap.docs.length);
        setProduct(snap.docs.map(d => ({ ...d.data(), id: d.id })));
        setLoading(false);
      },
      err => {
        console.error("❌ products snapshot error:", err.code, err.message);
        // Fallback: try getDocs without orderBy (works even if index missing)
        getDocs(collection(firebaseDB, "products")).then(snap => {
          console.log("✅ Products fallback loaded:", snap.docs.length);
          setProduct(snap.docs.map(d => ({ ...d.data(), id: d.id })));
        }).catch(e => {
          console.error("❌ products getDocs fallback error:", e.code, e.message);
        }).finally(() => setLoading(false));
      }
    );
    return unsub;
  }, []);

  const addProduct = async () => {
    const { title, price, imageUrl, category } = products;
    if (!title || !price || !imageUrl || !category)
      return toast.error("Title, price, image and category are required.");
    setLoading(true);
    try {
      await addDoc(collection(firebaseDB, "products"), {
        ...products,
        stock: Number(products.stock) || 0,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      });
      toast.success("Product added!");
      setProducts({ title:"", price:"", imageUrl:"", imageUrl2:"", imageUrl3:"", imageUrl4:"",
        category:"scrunchies", type:"", description:"", sizes:[], stock:"", featured:false });
    } catch (e) {
      toast.error("Failed to add product.");
    } finally { setLoading(false); }
  };

  const updateProduct = async () => {
    if (!products.id) return toast.error("No product selected.");
    setLoading(true);
    try {
      const { id, ...data } = products;
      await updateDoc(doc(firebaseDB, "products", id), {
        ...data,
        stock: Number(data.stock) || 0,
      });
      toast.success("Product updated!");
    } catch (e) {
      toast.error("Update failed.");
    } finally { setLoading(false); }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(firebaseDB, "products", id));
      toast.warning("Product deleted.");
    } catch (e) { toast.error("Delete failed."); }
  };

  /* ═══════════════════════════════════════════
     ORDERS  (Firestore real-time)
  ═══════════════════════════════════════════ */
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const q = query(collection(firebaseDB, "orders"), orderBy("time"));
    const unsub = onSnapshot(q,
      snap => setOrder(snap.docs.map(d => ({ ...d.data(), id: d.id }))),
      err => {
        getDocs(q).then(snap => setOrder(snap.docs.map(d => ({ ...d.data(), id: d.id }))));
      }
    );
    return unsub;
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      await updateDoc(doc(firebaseDB, "orders", id), { status });
      toast.success(`Order marked as ${status}`);
    } catch (e) { toast.error("Update failed."); }
  };

  const deleteOrder = async (id) => {
    try {
      await deleteDoc(doc(firebaseDB, "orders", id));
      toast.warning("Order removed.");
    } catch (e) { toast.error("Delete failed."); }
  };

  /* ═══════════════════════════════════════════
     USERS
  ═══════════════════════════════════════════ */
  const [users, setUsers] = useState([]);

  const getUserData = useCallback(async () => {
    try {
      const snap = await getDocs(collection(firebaseDB, "users"));
      setUsers(snap.docs.map(d => ({ ...d.data(), docId: d.id })));
    } catch (e) { console.error("getUserData:", e); }
  }, []);

  useEffect(() => { getUserData(); }, []);

  const updateUserRole = async (docId, role) => {
    try {
      await updateDoc(doc(firebaseDB, "users", docId), { role });
      toast.success("Role updated!");
      getUserData();
    } catch (e) { toast.error("Update failed."); }
  };

  const deleteUser = async (docId) => {
    try {
      await deleteDoc(doc(firebaseDB, "users", docId));
      toast.warning("User removed.");
      getUserData();
    } catch (e) { toast.error("Delete failed."); }
  };

  /* ═══════════════════════════════════════════
     SLIDER IMAGES
  ═══════════════════════════════════════════ */
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(firebaseDB, "sliderImages"),
      snap => setSliderImages(snap.docs.map(d => ({ ...d.data(), id: d.id }))),
      err => console.error("sliderImages:", err)
    );
    return unsub;
  }, []);

  const addSliderImage = async (imageUrl) => {
    if (!imageUrl) return toast.error("Please provide an image URL.");
    setLoading(true);
    try {
      await addDoc(collection(firebaseDB, "sliderImages"), { imageUrl, time: Timestamp.now() });
      toast.success("Slider image added!");
    } catch (e) { toast.error("Failed to add image."); }
    finally { setLoading(false); }
  };

  const deleteSliderImage = async (id) => {
    try {
      await deleteDoc(doc(firebaseDB, "sliderImages", id));
      toast.warning("Image removed.");
    } catch (e) { toast.error("Delete failed."); }
  };

  /* ═══════════════════════════════════════════
     NEWSLETTER
  ═══════════════════════════════════════════ */
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(firebaseDB, "newsletter"),
      snap => setSubscribers(snap.docs.map(d => ({ ...d.data(), id: d.id }))),
      err => console.error("newsletter:", err)
    );
    return unsub;
  }, []);

  const subscribeNewsletter = async (email) => {
    if (!email || !email.includes("@")) return toast.warning("Enter a valid email.");
    try {
      const snap = await getDocs(
        query(collection(firebaseDB, "newsletter"), where("email", "==", email))
      );
      if (!snap.empty) return toast.info("You're already subscribed!");
      await addDoc(collection(firebaseDB, "newsletter"), {
        email, time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      });
      toast.success("Subscribed! 🎉");
    } catch (e) { toast.error("Subscription failed."); }
  };

  const deleteSubscriber = async (id) => {
    try {
      await deleteDoc(doc(firebaseDB, "newsletter", id));
      toast.warning("Subscriber removed.");
    } catch (e) { toast.error("Delete failed."); }
  };

  /* ═══════════════════════════════════════════
     SEARCH & FILTERS
  ═══════════════════════════════════════════ */
  const [searchkey, setSearchkey] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  const resetFilter = () => {
    setSearchkey("");
    setFilterType("");
    setFilterPrice("");
  };

  /* ═══════════════════════════════════════════
     DISCOUNT / OFFER  (10% off)
  ═══════════════════════════════════════════ */
  const calcOffer = (price) => {
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return (num * 0.9).toFixed(0);
  };

  /* ═══════════════════════════════════════════
     ANALYTICS  (derived)
  ═══════════════════════════════════════════ */
  const getAnalytics = useCallback(() => {
    const totalRevenue = order.reduce((sum, o) => {
      if (o.status !== "cancelled") {
        return sum + (o.cartItems || []).reduce((s, i) => s + parseFloat(calcOffer(i.price)), 0);
      }
      return sum;
    }, 0);

    const pendingOrders   = order.filter(o => (o.status || "pending") === "pending").length;
    const confirmedOrders = order.filter(o => o.status === "confirmed").length;
    const cancelledOrders = order.filter(o => o.status === "cancelled").length;

    const lowStock = product.filter(p => (Number(p.stock) || 0) <= 5).length;

    return {
      totalProducts:  product.length,
      totalOrders:    order.length,
      pendingOrders,
      confirmedOrders,
      cancelledOrders,
      totalUsers:     users.length,
      totalRevenue:   totalRevenue.toFixed(0),
      lowStockItems:  lowStock,
      totalSubscribers: subscribers.length,
    };
  }, [product, order, users, subscribers]);

  /* ═══════════════════════════════════════════
     CONTEXT VALUE
  ═══════════════════════════════════════════ */
  return (
    <MyContext.Provider value={{
      /* Theme */
      mode, toggleMode,

      /* Loading */
      loading, setLoading,

      /* Products */
      product,
      products, setProducts,
      addProduct, updateProduct, deleteProduct,

      /* Orders */
      order,
      updateOrderStatus, deleteOrder,

      /* Users */
      users, getUserData, updateUserRole, deleteUser,

      /* Slider */
      sliderImages, addSliderImage, deleteSliderImage,

      /* Newsletter */
      subscribers, subscribeNewsletter, deleteSubscriber,

      /* Search & Filters */
      searchkey, setSearchkey,
      filterType, setFilterType,
      filterPrice, setFilterPrice,
      resetFilter,

      /* Utilities */
      calcOffer,

      /* Categories */
      hairCategories: HAIR_CATEGORIES,

      /* Analytics */
      getAnalytics,
    }}>
      {children}
    </MyContext.Provider>
  );
}

export function useData() {
  return useContext(MyContext);
}

export default MyState;
