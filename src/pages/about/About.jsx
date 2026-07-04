import { useData } from "../../context/data/MyState";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const values = [
  { icon: "🎀", title: "Handpicked Quality", desc: "Every product is carefully selected to ensure premium quality and style." },
  { icon: "💖", title: "Made with Love", desc: "Our bridal and fashion accessories are crafted with passion and attention to detail." },
  { icon: "🚚", title: "Fast Delivery", desc: "We deliver across India with care, ensuring your order arrives safely and on time." },
  { icon: "🌸", title: "Customer First", desc: "Your satisfaction is our priority. We're available 24/7 to assist you." },
];

const team = [
  { name: "Arpa", role: "Founder & Designer", initial: "A" },
  { name: "Support Team", role: "Customer Care", initial: "S" },
];

function About() {
  const { mode } = useData();

  const card = { backgroundColor: mode === "dark" ? "#374151" : "white" };
  const muted = { color: mode === "dark" ? "#ccc" : "#555" };

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: mode === "dark" ? "#232F3E" : "#F0EBE3", color: mode === "dark" ? "white" : "#232F3E" }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-14">
          <img src={logo} alt="ARPA" className="h-24 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">About ARPA Collection</h1>
          <p className="text-lg max-w-2xl mx-auto" style={muted}>
            ARPA Collection is a boutique fashion store based in Lucknow, India, specializing in
            handcrafted scrunchies, bridal hair pins, textiles, and premium fashion accessories.
          </p>
        </div>

        {/* Story */}
        <div className="rounded-2xl p-8 shadow-md mb-10" style={card}>
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-sm leading-relaxed mb-4" style={muted}>
            Born out of a love for fashion and handcrafted accessories, ARPA Collection started as a
            small passion project in Lucknow. We noticed a gap in the market for high-quality, affordable
            hair accessories and bridal jewelry — and we set out to fill it.
          </p>
          <p className="text-sm leading-relaxed" style={muted}>
            Today, we serve customers across India with a curated collection of scrunchies, bridal hair pins,
            textiles, and home essentials. Every product we offer is handpicked with love and care, ensuring
            you always receive the best.
          </p>
        </div>

        {/* Values */}
        <h2 className="text-2xl font-bold mb-6">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {values.map((v, i) => (
            <div key={i} className="rounded-xl p-6 shadow-md flex gap-4 items-start" style={card}>
              <span className="text-3xl">{v.icon}</span>
              <div>
                <p className="font-bold mb-1">{v.title}</p>
                <p className="text-sm" style={muted}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Team */}
        <h2 className="text-2xl font-bold mb-6">Meet the Team</h2>
        <div className="flex flex-wrap gap-5 mb-12">
          {team.map((t, i) => (
            <div key={i} className="rounded-xl p-6 shadow-md text-center flex-1 min-w-[140px]" style={card}>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3"
                style={{ backgroundColor: "#F3D0D7", color: "#232F3E" }}
              >
                {t.initial}
              </div>
              <p className="font-bold">{t.name}</p>
              <p className="text-xs mt-1" style={muted}>{t.role}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-8 text-center shadow-md" style={card}>
          <h3 className="text-xl font-bold mb-3">Ready to Shop?</h3>
          <p className="text-sm mb-5" style={muted}>Explore our latest collection of scrunchies, bridal accessories, and more.</p>
          <Link
            to="/"
            className="inline-block bg-[#F3D0D7] text-[#232F3E] font-semibold px-8 py-3 rounded-lg hover:bg-[#FFEFEF] transition"
          >
            Shop Now 🎀
          </Link>
        </div>

      </div>
    </div>
  );
}

export default About;
