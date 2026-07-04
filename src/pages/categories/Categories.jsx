import { Link } from "react-router-dom";
import { useData } from "../../context/data/MyState";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  GiLipstick, GiRunningShoe, GiWeightLiftingUp,
  GiGamepad, GiPizzaSlice, GiPartyPopper,
} from "react-icons/gi";
import {
  MdOutlineFace, MdOutlineLaptopMac, MdOutlineFlight,
  MdOutlineSchool, MdOutlineAttachMoney, MdOutlineBusinessCenter,
  MdOutlineFavorite, MdOutlineChildCare, MdOutlineAutoAwesome,
} from "react-icons/md";

/* Map icon key → React icon component + gradient */
const ICON_MAP = {
  fashion:       { Icon: GiLipstick,              grad: "linear-gradient(135deg,#8B5CF6,#EC4899)" },
  beauty:        { Icon: MdOutlineFace,            grad: "linear-gradient(135deg,#F43F5E,#FB7185)" },
  technology:    { Icon: MdOutlineLaptopMac,       grad: "linear-gradient(135deg,#3B82F6,#60A5FA)" },
  gaming:        { Icon: GiGamepad,                grad: "linear-gradient(135deg,#F59E0B,#FCD34D)" },
  travel:        { Icon: MdOutlineFlight,          grad: "linear-gradient(135deg,#10B981,#6EE7B7)" },
  food:          { Icon: GiPizzaSlice,             grad: "linear-gradient(135deg,#EF4444,#FCA5A5)" },
  fitness:       { Icon: GiWeightLiftingUp,        grad: "linear-gradient(135deg,#F97316,#FED7AA)" },
  lifestyle:     { Icon: MdOutlineAutoAwesome,     grad: "linear-gradient(135deg,#DD2A7B,#F58529)" },
  education:     { Icon: MdOutlineSchool,          grad: "linear-gradient(135deg,#6366F1,#A5B4FC)" },
  finance:       { Icon: MdOutlineAttachMoney,     grad: "linear-gradient(135deg,#14B8A6,#99F6E4)" },
  business:      { Icon: MdOutlineBusinessCenter,  grad: "linear-gradient(135deg,#1D4ED8,#60A5FA)" },
  entertainment: { Icon: GiPartyPopper,            grad: "linear-gradient(135deg,#D946EF,#F0ABFC)" },
  health:        { Icon: MdOutlineFavorite,        grad: "linear-gradient(135deg,#E11D48,#FB7185)" },
  parenting:     { Icon: MdOutlineChildCare,       grad: "linear-gradient(135deg,#F59E0B,#FDE68A)" },
  shoes:         { Icon: GiRunningShoe,            grad: "linear-gradient(135deg,#0EA5E9,#7DD3FC)" },
};

const FALLBACK = { Icon: MdOutlineAutoAwesome, grad: "linear-gradient(135deg,#F58529,#DD2A7B)" };

export default function Categories() {
  const { categories } = useData();

  return (
    <div style={{ background:"#000", minHeight:"100vh" }}>

      {/* Header */}
      <div className="py-12 sm:py-16 text-center px-4"
        style={{ background:"radial-gradient(ellipse 70% 60% at 50% 0%,rgba(221,42,123,0.12) 0%,transparent 70%)" }}>
        <h1 className="text-3xl sm:text-4xl font-black mb-2" style={{ color:"#FAFAFA" }}>
          Browse <span className="gradient-text">Categories</span>
        </h1>
        <p className="text-sm" style={{ color:"#737373" }}>Find the perfect creator by niche</p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat, i) => {
            const { Icon, grad } = ICON_MAP[cat.icon] || ICON_MAP[cat.id] || FALLBACK;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity:0, y:20 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y:-4 }}
              >
                <Link
                  to={`/influencers?category=${cat.id}`}
                  className="group flex flex-col items-center p-5 sm:p-6 rounded-2xl transition-all cursor-pointer"
                  style={{
                    background: "#1C1C1C",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(221,42,123,0.35)"; e.currentTarget.style.background = "#222"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "#1C1C1C"; }}
                >
                  {/* Icon box */}
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200"
                    style={{ background: grad, boxShadow:"0 4px 16px rgba(0,0,0,0.4)" }}
                  >
                    <Icon size={28} color="#fff"/>
                  </div>

                  <h3 className="font-bold text-sm mb-1 text-center" style={{ color:"#FAFAFA" }}>
                    {cat.name}
                  </h3>
                  <p className="text-xs mb-3" style={{ color:"#737373" }}>
                    {cat.count} {cat.count === 1 ? "creator" : "creators"}
                  </p>
                  <span className="flex items-center gap-1 text-xs font-semibold"
                    style={{ background:"linear-gradient(45deg,#F58529,#DD2A7B)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                    Explore <ArrowRight size={11}/>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
