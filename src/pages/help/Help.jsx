import { useState } from "react";
import { motion } from "framer-motion";
import { useData } from "../../context/data/MyState";
import { Mail, Phone, MapPin, MessageCircle, Clock, Zap } from "lucide-react";

const FAQ = [
  { q: "How do I get my profile verified?", a: "Submit your profile with accurate social media stats. Our team reviews within 2–3 business days. Premium subscribers get priority review." },
  { q: "How does the inquiry system work?", a: "Brands send inquiries directly to your profile. You'll see them in your dashboard and can reply via email or WhatsApp." },
  { q: "Can I change my pricing anytime?", a: "Yes. Go to your Influencer Dashboard → Services tab and update your pricing whenever you want." },
  { q: "What platforms are supported?", a: "Instagram, YouTube, TikTok, Facebook, and Twitter/X. More platforms coming soon." },
  { q: "How do I become a featured influencer?", a: "Upgrade to Premium plan and our admin team will feature your profile in the homepage showcase." },
  { q: "Is there a commission on deals?", a: "For Free plan users, a small commission applies on closed deals. Premium and Agency plans have zero commission." },
];

export default function Help() {
  const { mode, submitContactMessage, loading } = useData();
  const bg = "#F8F7FF";
  const cardBg = "#fff";
  const border = "rgba(15,32,68,0.06)";
  const textPrimary = "#0F2044";
  const textMuted = "#5A6882";

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return;
    }
    const ok = await submitContactMessage(form);
    if (ok) setForm({ name: "", email: "", subject: "", message: "" });
  };

  const inputSt = {
    background: "rgba(15,32,68,0.04)",
    border: `1px solid ${border}`,
    color: textPrimary,
  };

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      {/* Header */}
      <div className="py-16 text-center px-4" style={{ background: "linear-gradient(135deg,rgba(15,32,68,0.04),rgba(236,72,153,0.02))" }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "linear-gradient(135deg,#0F2044,#C9A84C)" }}>
          <MessageCircle size={26} className="text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: textPrimary }}>
          Help & <span className="gradient-text">Support</span>
        </h1>
        <p className="text-sm" style={{ color: textMuted }}>Get answers fast or reach out to our team</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-black mb-6" style={{ color: textPrimary }}>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: "name",    label: "Full Name *",       type: "text",  ph: "Your name" },
                { name: "email",   label: "Email Address *",   type: "email", ph: "your@email.com" },
                { name: "subject", label: "Subject",           type: "text",  ph: "How can we help?" },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textMuted }}>{f.label}</label>
                  <input type={f.type} name={f.name} placeholder={f.ph} value={form[f.name]} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputSt} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textMuted }}>Message *</label>
                <textarea name="message" placeholder="Tell us what you need help with..." value={form.message} onChange={handleChange}
                  rows={5} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inputSt} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all"
                style={{ background: "linear-gradient(135deg,#0F2044,#C9A84C)", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
              {[
                { icon: <Mail size={16} />, label: "Email", val: "hello@influenx.com", color: "#0F2044" },
                { icon: <Phone size={16} />, label: "Phone", val: "+91 98765 43210", color: "#C9A84C" },
                { icon: <Clock size={16} />, label: "Hours", val: "Mon–Fri 9am–6pm", color: "#2D4A7A" },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: cardBg, border: `1px solid ${border}` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${c.color}20`, color: c.color }}>{c.icon}</div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: textMuted }}>{c.label}</p>
                    <p className="text-xs font-semibold" style={{ color: textPrimary }}>{c.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-black mb-6" style={{ color: textPrimary }}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <motion.div key={i} className="rounded-2xl overflow-hidden cursor-pointer"
                  style={{ background: cardBg, border: `1px solid ${openFaq === i ? "#0F2044" : border}` }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div className="flex items-center justify-between p-4 gap-3">
                    <p className="font-semibold text-sm" style={{ color: textPrimary }}>{item.q}</p>
                    <span className="text-lg flex-shrink-0 transition-transform" style={{ transform: openFaq === i ? "rotate(45deg)" : "none", color: "#0F2044" }}>+</span>
                  </div>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="px-4 pb-4">
                      <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{item.a}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
