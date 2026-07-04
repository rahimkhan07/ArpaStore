import { useData } from "../../context/data/MyState";

const steps = [
  { icon: "📦", title: "Initiate Return", desc: "Email us at arpastore97@gmail.com within 7 days of delivery with your order details and reason for return." },
  { icon: "✅", title: "Get Approval", desc: "Our team will review your request and send a confirmation within 24–48 hours." },
  { icon: "🚚", title: "Ship the Item", desc: "Pack the item securely in its original packaging and ship it to our address in Lucknow." },
  { icon: "💰", title: "Receive Refund", desc: "Once we receive and inspect the item, your refund will be processed within 5–7 business days." },
];

const eligible = [
  "Item received is damaged or defective",
  "Wrong item was delivered",
  "Item is significantly different from the description",
  "Item is unused and in original packaging",
];

const notEligible = [
  "Items returned after 7 days of delivery",
  "Used, washed, or altered items",
  "Items without original tags or packaging",
  "Sale or discounted items",
  "Custom or personalized orders",
];

function Returns() {
  const { mode } = useData();

  const card = { backgroundColor: mode === "dark" ? "#374151" : "white" };
  const muted = { color: mode === "dark" ? "#ccc" : "#555" };

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: mode === "dark" ? "#232F3E" : "#F0EBE3", color: mode === "dark" ? "white" : "#232F3E" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-5xl">🔄</span>
          <h1 className="text-4xl font-bold mt-4 mb-3">Returns & Refunds</h1>
          <p style={muted}>Easy returns within 7 days of delivery.</p>
        </div>

        {/* Steps */}
        <h2 className="text-2xl font-bold mb-6">How to Return</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {steps.map((s, i) => (
            <div key={i} className="rounded-xl p-6 shadow-md" style={card}>
              <div className="text-3xl mb-3">{s.icon}</div>
              <p className="font-bold mb-1">
                <span className="text-[#F3D0D7] mr-2">Step {i + 1}.</span>{s.title}
              </p>
              <p className="text-sm" style={muted}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Eligible / Not Eligible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <div className="rounded-xl p-6 shadow-md" style={card}>
            <h3 className="font-bold text-lg mb-4 text-green-500">✅ Eligible for Return</h3>
            <ul className="space-y-2">
              {eligible.map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={muted}>
                  <span className="text-green-400 mt-0.5">•</span>{e}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl p-6 shadow-md" style={card}>
            <h3 className="font-bold text-lg mb-4 text-red-400">❌ Not Eligible for Return</h3>
            <ul className="space-y-2">
              {notEligible.map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={muted}>
                  <span className="text-red-400 mt-0.5">•</span>{e}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-xl p-6 shadow-md text-center" style={card}>
          <p className="font-semibold text-lg mb-2">Need help with a return?</p>
          <p style={muted} className="text-sm mb-4">Contact our support team and we'll get back to you within 24 hours.</p>
          <a
            href="mailto:arpastore97@gmail.com"
            className="inline-block bg-[#F3D0D7] text-[#232F3E] font-semibold px-6 py-3 rounded-lg hover:bg-[#FFEFEF] transition"
          >
            📧 arpastore97@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}

export default Returns;
