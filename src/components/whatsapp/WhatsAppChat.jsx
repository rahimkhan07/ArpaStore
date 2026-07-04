import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { X } from "lucide-react";

const WHATSAPP_NUMBER = "919876543210"; // Replace with real number

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-72 rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: "#fff", border: "1px solid rgba(233,30,140,0.15)" }}>

            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-3"
              style={{ background: "linear-gradient(135deg,#E91E8C,#9C27B0)" }}>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                🎀
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">ArpaStore Support</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                  <p className="text-white/80 text-xs">Usually replies instantly</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="rounded-2xl p-3 mb-4 text-sm"
                style={{ background: "#FFF5F7", color: "#2d2d2d" }}>
                👋 Hi! Welcome to <strong>ArpaStore</strong>!<br/>
                Need help finding the perfect accessory, or have a question about your order? We're here for you! 🎀
              </div>

              <div className="space-y-2 mb-4">
                {[
                  { label: "🛒 Track my order",           msg: "Hi! I'd like to track my order." },
                  { label: "🎀 Find the right product",   msg: "Hi! I need help finding a hair accessory." },
                  { label: "💌 Custom / bulk order",      msg: "Hi! I'm interested in a custom/bulk order." },
                ].map((item, i) => (
                  <a key={i}
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(item.msg)}`}
                    target="_blank" rel="noreferrer"
                    className="block text-xs font-medium px-3 py-2 rounded-xl transition hover:opacity-90"
                    style={{ background: "rgba(233,30,140,0.08)", color: "#E91E8C" }}>
                    {item.label}
                  </a>
                ))}
              </div>

              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I need help with ArpaStore 🎀")}`}
                target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: "#25D366" }}>
                <FaWhatsapp size={16} /> Start Chat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(p => !p)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition"
        style={{ background: "#25D366", boxShadow: "0 8px 25px rgba(37,211,102,0.4)" }}>
        {open ? <X size={22} className="text-white" /> : <FaWhatsapp size={26} className="text-white" />}
      </motion.button>
    </div>
  );
}
