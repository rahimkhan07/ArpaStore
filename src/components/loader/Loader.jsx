import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "rgba(15,15,26,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)" }}>
          <Zap size={28} className="text-white" />
        </motion.div>
        <p className="text-sm font-semibold" style={{ color: "#A78BFA" }}>Loading…</p>
      </div>
    </div>
  );
}
