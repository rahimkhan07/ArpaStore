import { Link } from "react-router-dom";
import { useState } from "react";
import { useData } from "../../context/data/MyState";
import { Instagram, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";

const PINK = "#E91E8C";

export default function Footer() {
  const { subscribeNewsletter, mode } = useData();
  const [email, setEmail] = useState("");

  const bg   = mode === "dark" ? "#120009" : "#1a0a14";
  const card = mode === "dark" ? "#2d1a26" : "#2d1a26";
  const border = "rgba(233,30,140,0.15)";
  const tm = "#c0a0b0";

  const links = {
    shop: [
      { to: "/allproducts?cat=scrunchies", label: "🪢 Scrunchies" },
      { to: "/allproducts?cat=bows",       label: "🎀 Hair Bows" },
      { to: "/allproducts?cat=clips",      label: "📎 Hair Clips" },
      { to: "/allproducts?cat=headbands",  label: "👑 Headbands" },
      { to: "/allproducts?cat=sets",       label: "🎁 Gift Sets" },
    ],
    info: [
      { to: "/order",       label: "Track My Order" },
      { to: "/cart",        label: "My Cart" },
      { to: "/wishlist",    label: "Wishlist" },
      { to: "/dashboard",   label: "Admin Panel" },
    ],
  };

  return (
    <footer style={{ background: bg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg"
                style={{ background: "linear-gradient(135deg,#E91E8C,#9C27B0)" }}>🎀</div>
              <span className="font-black text-xl text-white">ArpaStore</span>
            </div>
            <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: tm }}>
              Premium hair accessories — bows, scrunchies, clips & more. Crafted with love for every hair type.
            </p>

            {/* Newsletter */}
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#c0a0b0" }}>
              Get 10% off your first order
            </p>
            <div className="flex gap-2">
              <input type="email" placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && subscribeNewsletter(email).then(() => setEmail(""))}
                className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${border}`, color: "#fff" }} />
              <button onClick={() => subscribeNewsletter(email).then(ok => ok !== undefined && setEmail(""))}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: PINK }}>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: "#c0a0b0" }}>
              Shop By Category
            </h4>
            <ul className="space-y-2.5">
              {links.shop.map(item => (
                <li key={item.to}>
                  <Link to={item.to}
                    className="text-sm transition-all hover:translate-x-1 inline-block"
                    style={{ color: tm }}
                    onMouseEnter={e => e.currentTarget.style.color = "#FF9DD3"}
                    onMouseLeave={e => e.currentTarget.style.color = tm}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: "#c0a0b0" }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {links.info.map(item => (
                <li key={item.to}>
                  <Link to={item.to}
                    className="text-sm transition-all hover:translate-x-1 inline-block"
                    style={{ color: tm }}
                    onMouseEnter={e => e.currentTarget.style.color = "#FF9DD3"}
                    onMouseLeave={e => e.currentTarget.style.color = tm}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: "#c0a0b0" }}>
              Get In Touch
            </h4>
            <div className="space-y-3">
              {[
                { icon: <Mail size={14}/>,   text: "hello@arpastore.com" },
                { icon: <Phone size={14}/>,  text: "+91 98765 43210" },
                { icon: <MapPin size={14}/>, text: "Mumbai, India" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-sm" style={{ color: tm }}>
                  <span style={{ color: PINK }}>{c.icon}</span> {c.text}
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <a href="https://wa.me/919876543210?text=Hi! I have a question about ArpaStore 🎀"
              target="_blank" rel="noreferrer"
              className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white inline-flex transition hover:opacity-90"
              style={{ background: "#25D366" }}>
              <FaWhatsapp size={16} /> Chat on WhatsApp
            </a>

            {/* Socials */}
            <div className="flex gap-2 mt-4">
              {[
                { icon: <Instagram size={15}/>, color: PINK,      href: "#" },
                { icon: <FaTiktok size={13}/>,  color: "#FAFAFA", href: "#" },
                { icon: <Youtube size={15}/>,   color: "#FF0000", href: "#" },
              ].map((s, i) => (
                <a key={i} href={s.href}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition hover:scale-110"
                  style={{ background: card, color: s.color, border: `1px solid ${border}` }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: `1px solid ${border}` }}>
          <p className="text-xs" style={{ color: tm }}>
            © 2025 ArpaStore. All rights reserved. Made with 💕
          </p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms", "Returns"].map(t => (
              <span key={t} className="text-xs cursor-pointer transition-colors" style={{ color: tm }}
                onMouseEnter={e => e.currentTarget.style.color = "#FF9DD3"}
                onMouseLeave={e => e.currentTarget.style.color = tm}>{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
