import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../context/data/MyState";
import { useAuth } from "../protector/AuthContext";
import { useSelector } from "react-redux";
import { auth } from "../../firebase/FirebaseConfig";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch, FiShoppingCart, FiHeart, FiChevronDown, FiLogOut,
  FiGrid, FiUser, FiPackage, FiSun, FiMoon,
} from "react-icons/fi";

const PINK   = "#E91E8C";
const ADMIN_EMAILS = ["i.raheem727@gmail.com", "asadalamaligg@gmail.com"];

const NAV_LINKS = [
  { to: "/",            label: "Home" },
  { to: "/allproducts", label: "Shop" },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { searchkey, setSearchkey, mode, toggleMode } = useData();
  const { user } = useAuth();
  const cartItems = useSelector(s => s.cart);
  const wishlist  = useSelector(s => s.wishlist);

  const [dropOpen,    setDropOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);

  const storedUser = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();
  const isAdmin = ADMIN_EMAILS.includes(storedUser?.user?.email);
  const userInitial = (storedUser?.user?.email?.[0] || "U").toUpperCase();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!dropOpen) return;
    const fn = () => setDropOpen(false);
    window.addEventListener("click", fn);
    return () => window.removeEventListener("click", fn);
  }, [dropOpen]);

  const handleLogout = () => {
    auth.signOut();
    localStorage.clear();
    toast.success("Signed out successfully.");
    navigate("/login");
    setDropOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

  const navBg = scrolled
    ? mode === "dark" ? "rgba(26,10,20,0.95)" : "rgba(255,255,255,0.97)"
    : mode === "dark" ? "rgba(26,10,20,0.85)" : "rgba(255,245,247,0.92)";

  const textColor = mode === "dark" ? "#FAFAFA" : "#2d2d2d";
  const mutedColor = mode === "dark" ? "#c0a0b0" : "#888";

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50" style={{
        background: navBg,
        backdropFilter: "blur(20px) saturate(1.8)",
        WebkitBackdropFilter: "blur(20px) saturate(1.8)",
        borderBottom: "1px solid rgba(233,30,140,0.15)",
        boxShadow: scrolled ? "0 1px 20px rgba(233,30,140,0.1)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px] gap-3">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-black"
                style={{ background: "linear-gradient(135deg,#E91E8C,#9C27B0)" }}>🎀</div>
              <span className="font-black text-lg hidden sm:block"
                style={{ color: PINK }}>ArpaStore</span>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link key={link.to} to={link.to}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ color: isActive(link.to) ? PINK : mutedColor }}>
                  {isActive(link.to) && (
                    <motion.div layoutId="arpa-nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "rgba(233,30,140,0.1)" }}
                      transition={{ type: "spring", duration: 0.4 }} />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* ── Search ── */}
            <div className="hidden md:flex flex-1 max-w-[280px]">
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ fontSize: 14, color: searchFocus ? PINK : mutedColor, transition: "color 0.2s" }} />
                <input type="text" placeholder="Search accessories…"
                  value={searchkey}
                  onChange={e => setSearchkey(e.target.value)}
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setSearchFocus(false)}
                  onKeyDown={e => e.key === "Enter" && navigate("/allproducts")}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
                  style={{
                    background: mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(233,30,140,0.05)",
                    border: `1.5px solid ${searchFocus ? PINK : "rgba(233,30,140,0.2)"}`,
                    color: textColor,
                    transition: "border-color 0.2s",
                  }} />
              </div>
            </div>

            {/* ── Right Icons ── */}
            <div className="flex items-center gap-1.5">

              {/* Dark mode toggle */}
              <button onClick={toggleMode}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition"
                style={{ color: mutedColor, background: mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(233,30,140,0.08)" }}>
                {mode === "dark" ? <FiSun style={{ fontSize: 16 }} /> : <FiMoon style={{ fontSize: 16 }} />}
              </button>

              {user ? (
                <>
                  {/* Wishlist */}
                  <Link to="/wishlist" className="relative w-9 h-9 rounded-xl hidden sm:flex items-center justify-center transition"
                    style={{ color: PINK, background: "rgba(233,30,140,0.08)" }}>
                    <FiHeart style={{ fontSize: 16 }} />
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                        style={{ background: PINK }}>{wishlist.length}</span>
                    )}
                  </Link>

                  {/* Cart */}
                  <Link to="/cart" className="relative w-9 h-9 rounded-xl flex items-center justify-center transition"
                    style={{ color: PINK, background: "rgba(233,30,140,0.08)" }}>
                    <FiShoppingCart style={{ fontSize: 16 }} />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                        style={{ background: PINK }}>{cartItems.length}</span>
                    )}
                  </Link>

                  {/* Avatar dropdown */}
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setDropOpen(p => !p)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all"
                      style={{
                        background: dropOpen ? "rgba(233,30,140,0.12)" : "rgba(233,30,140,0.07)",
                        border: `1.5px solid ${dropOpen ? "rgba(233,30,140,0.5)" : "rgba(233,30,140,0.2)"}`,
                      }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: "linear-gradient(135deg,#E91E8C,#9C27B0)" }}>
                        {userInitial}
                      </div>
                      <FiChevronDown style={{ fontSize: 13, color: mutedColor, transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                    </button>

                    <AnimatePresence>
                      {dropOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden z-50"
                          style={{
                            background: mode === "dark" ? "#2d1a26" : "#fff",
                            border: "1px solid rgba(233,30,140,0.15)",
                            boxShadow: "0 20px 48px rgba(233,30,140,0.15)",
                          }}>
                          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(233,30,140,0.1)" }}>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2"
                              style={{ background: "linear-gradient(135deg,#E91E8C,#9C27B0)" }}>
                              {userInitial}
                            </div>
                            <p className="text-xs font-semibold truncate" style={{ color: textColor }}>
                              {storedUser?.user?.email}
                            </p>
                          </div>

                          {[
                            { to: "/order",    icon: <FiPackage style={{ fontSize: 14 }}/>,         label: "My Orders" },
                            { to: "/wishlist", icon: <FiHeart style={{ fontSize: 14 }}/>,            label: "Wishlist" },
                          ].map(item => (
                            <Link key={item.to} to={item.to}
                              onClick={() => setDropOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                              style={{ color: mutedColor }}
                              onMouseEnter={e => { e.currentTarget.style.background = "rgba(233,30,140,0.07)"; e.currentTarget.style.color = PINK; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = mutedColor; }}>
                              <span style={{ color: PINK }}>{item.icon}</span>
                              {item.label}
                            </Link>
                          ))}

                          {isAdmin && (
                            <Link to="/dashboard"
                              onClick={() => setDropOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm transition-all font-semibold"
                              style={{ color: "#F59E0B" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(245,158,11,0.08)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                              <FiGrid style={{ fontSize: 14 }} /> Admin Dashboard
                            </Link>
                          )}

                          <div style={{ borderTop: "1px solid rgba(233,30,140,0.1)", margin: "4px 0" }} />

                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all mb-1"
                            style={{ color: "#EF4444" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <FiLogOut style={{ fontSize: 14 }} /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login"
                    className="px-4 py-1.5 rounded-xl text-sm font-semibold border transition hover:bg-pink-50"
                    style={{ color: PINK, borderColor: "rgba(233,30,140,0.3)" }}>
                    Sign In
                  </Link>
                  <Link to="/signup"
                    className="px-5 py-1.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                    style={{ background: "linear-gradient(135deg,#E91E8C,#9C27B0)" }}>
                    Join Free
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-[60px]" />
    </>
  );
}
