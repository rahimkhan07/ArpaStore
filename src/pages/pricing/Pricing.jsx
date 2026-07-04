import { Link } from "react-router-dom";
import { useData } from "../../context/data/MyState";
import { motion } from "framer-motion";
import { CheckCircle, Zap } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    color: "#5A6882",
    gradient: "linear-gradient(135deg, #6B7280, #9CA3AF)",
    features: ["Basic Influencer Profile", "Limited Portfolio (3 items)", "Standard Search Listing", "Email Support"],
    missing: ["Verified Badge", "Featured Placement", "Analytics Dashboard", "Priority Support"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Premium",
    price: "₹999",
    period: "/month",
    color: "#0F2044",
    gradient: "linear-gradient(135deg, #0F2044, #C9A84C)",
    features: ["Verified Badge ✓", "Featured Placement", "Unlimited Portfolio", "Analytics Dashboard", "Priority Support", "Direct Messaging", "Campaign Tracking"],
    missing: ["Multiple Profiles", "Dedicated Account Manager"],
    cta: "Upgrade to Premium",
    popular: true,
  },
  {
    name: "Agency",
    price: "₹2,999",
    period: "/month",
    color: "#2D4A7A",
    gradient: "linear-gradient(135deg, #2D4A7A, #0F2044)",
    features: ["Everything in Premium", "Up to 10 Influencer Profiles", "Advanced Analytics", "Campaign Management", "Dedicated Account Manager", "Custom Integrations", "Revenue Reporting"],
    missing: [],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  const { mode } = useData();
  const bg = "#F8F7FF";
  const cardBg = "#fff";
  const border = "rgba(15,32,68,0.06)";
  const textPrimary = "#0F2044";
  const textMuted = "#5A6882";

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <div className="py-20 text-center px-4" style={{ background: "linear-gradient(135deg, rgba(15,32,68,0.04), rgba(236,72,153,0.02))" }}>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
          style={{ background: "rgba(15,32,68,0.08)", border: "1px solid rgba(15,32,68,0.14)", color: "#C9A84C" }}>
          <Zap size={14} /> Simple, Transparent Pricing
        </span>
        <h1 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: textPrimary }}>
          Choose Your <span className="gradient-text">Plan</span>
        </h1>
        <p className="text-sm max-w-md mx-auto" style={{ color: textMuted }}>
          Start free and scale as you grow. No hidden fees.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="relative p-8 rounded-3xl"
              style={{ background: cardBg, border: `2px solid ${plan.popular ? "#0F2044" : border}`, boxShadow: plan.popular ? "0 20px 60px rgba(15,32,68,0.12)" : "none" }}>
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #0F2044, #C9A84C)" }}>
                  ⭐ Most Popular
                </span>
              )}
              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: plan.gradient }}>
                  <Zap size={22} className="text-white" />
                </div>
                <h2 className="text-xl font-black mb-2" style={{ color: textPrimary }}>{plan.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black" style={{ color: plan.color }}>{plan.price}</span>
                  <span className="text-sm" style={{ color: textMuted }}>{plan.period}</span>
                </div>
              </div>
              <div className="mb-6 space-y-2.5">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm" style={{ color: textPrimary }}>
                    <CheckCircle size={14} style={{ color: plan.color, flexShrink: 0 }} /> {f}
                  </div>
                ))}
                {plan.missing.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm opacity-40" style={{ color: textMuted }}>
                    <span className="w-3.5 h-3.5 rounded-full border flex-shrink-0" style={{ borderColor: textMuted }} /> {f}
                  </div>
                ))}
              </div>
              <Link to="/signup"
                className="block w-full py-3.5 rounded-xl text-sm font-bold text-center transition-all"
                style={{ background: plan.popular ? plan.gradient : "transparent", color: plan.popular ? "#fff" : plan.color, border: `2px solid ${plan.color}` }}>
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Revenue sources */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-black mb-8" style={{ color: textPrimary }}>Revenue Sources on InfluenX</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Subscription Fees", icon: "💳" },
              { label: "Featured Listings", icon: "⭐" },
              { label: "Verification Fees", icon: "✅" },
              { label: "Premium Memberships", icon: "👑" },
              { label: "Ad Placements", icon: "📢" },
              { label: "Commission on Deals", icon: "🤝" },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-2xl text-center" style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-xs font-semibold" style={{ color: textPrimary }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
