import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../context/data/MyState";

const PINK = "#E91E8C";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { mode } = useData();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { navigate("/order"); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  const bg   = mode === "dark" ? "#1a0a14" : "#FFF5F7";
  const card = mode === "dark" ? "#2d1a26" : "#fff";
  const text = mode === "dark" ? "#FAFAFA" : "#2d2d2d";

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: bg }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-10 rounded-3xl shadow-2xl max-w-md w-full"
        style={{ background: card, border: "1px solid #FFD6E7" }}>

        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-7xl mb-6">
          🎀
        </motion.div>

        <h1 className="text-3xl font-black mb-3" style={{ color: PINK }}>Order Placed!</h1>
        <p className="text-sm mb-8" style={{ color: mode === "dark" ? "#c0a0b0" : "#888" }}>
          Thank you for shopping with ArpaStore! Your lovely accessories are on their way 💕
        </p>

        <div className="space-y-3">
          <button onClick={() => navigate("/order")}
            className="w-full py-3.5 rounded-2xl font-bold text-white transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#E91E8C,#9C27B0)" }}>
            📦 Track My Order
          </button>
          <button onClick={() => navigate("/allproducts")}
            className="w-full py-3.5 rounded-2xl font-semibold transition hover:opacity-80"
            style={{ background: mode === "dark" ? "#3d1a2e" : "#FFF0F5", color: PINK }}>
            🛍 Continue Shopping
          </button>
        </div>

        <p className="text-xs mt-6" style={{ color: mode === "dark" ? "#c0a0b0" : "#bbb" }}>
          Redirecting to orders in {countdown}s…
        </p>
      </motion.div>
    </div>
  );
}
