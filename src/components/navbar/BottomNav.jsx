import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ShoppingBag, ShoppingCart, Heart, User } from "lucide-react";
import { useSelector } from "react-redux";
import { useAuth } from "../protector/AuthContext";

const PINK = "#E91E8C";

const NAV_ITEMS = [
  { to: "/",            icon: Home,         label: "Home" },
  { to: "/allproducts", icon: ShoppingBag,  label: "Shop" },
  { to: "/cart",        icon: ShoppingCart, label: "Cart" },
  { to: "/wishlist",    icon: Heart,        label: "Wishlist" },
  { to: "/order",       icon: User,         label: "Orders" },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const cartItems = useSelector(s => s.cart);
  const wishlist  = useSelector(s => s.wishlist);

  if (!user) return null;

  const isActive = (to) => to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 lg:hidden safe-bottom"
      style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px) saturate(1.8)",
        WebkitBackdropFilter: "blur(20px) saturate(1.8)",
        borderTop: "1px solid rgba(233,30,140,0.15)",
        boxShadow: "0 -4px 20px rgba(233,30,140,0.08)",
      }}>
      <div className="flex items-center justify-around px-2 h-[60px]">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = isActive(to);
          const isCart = to === "/cart";
          const isWish = to === "/wishlist";

          return (
            <Link key={to} to={to}
              className="relative flex flex-col items-center justify-center gap-[3px] flex-1 h-full py-1 group"
              aria-label={label}>

              {/* Active dot */}
              <AnimatePresence>
                {active && (
                  <motion.span
                    layoutId="arpa-bottom-dot"
                    className="absolute top-1 w-5 h-1 rounded-full"
                    style={{ background: PINK }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              <motion.div animate={{ scale: active ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative">
                <Icon size={22} strokeWidth={active ? 2.5 : 1.75}
                  style={{
                    color: active ? PINK : "#bbb",
                    fill: active && isWish ? PINK : "none",
                    transition: "color 0.2s",
                  }} />

                {/* Badges */}
                {isCart && cartItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                    style={{ background: PINK }}>{cartItems.length}</span>
                )}
                {isWish && wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                    style={{ background: PINK }}>{wishlist.length}</span>
                )}
              </motion.div>

              <span className="text-[10px] font-medium leading-none"
                style={{ color: active ? PINK : "#bbb", transition: "color 0.2s" }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
