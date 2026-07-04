import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(26,10,20,0.75)", backdropFilter: "blur(8px)" }}>
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="text-5xl select-none">
          🎀
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="text-sm font-semibold"
          style={{ color: "#FFB3D9" }}>
          Loading…
        </motion.p>
      </div>
    </div>
  );
}
