import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";
import { useData } from "../../context/data/MyState";

const PINK = "#E91E8C";

export default function NoPage() {
  const { mode } = useData();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: mode === "dark" ? "#1a0a14" : "#FFF5F7" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-7xl mb-6">🎀</div>
        <h1 className="text-6xl font-black mb-3" style={{ color: PINK }}>404</h1>
        <p className="text-lg font-semibold mb-2" style={{ color: mode === "dark" ? "#FAFAFA" : "#2d2d2d" }}>
          Page Not Found
        </p>
        <p className="text-sm mb-8" style={{ color: mode === "dark" ? "#c0a0b0" : "#888" }}>
          Oops! This page seems to have gotten lost in a scrunchie pile.
        </p>
        <Link to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#E91E8C,#9C27B0)" }}>
          <FiHome style={{ fontSize: 16 }} /> Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}
