import { useState } from "react";
import { useData } from "../../context/data/MyState";
import { toast } from "react-toastify";

function SellWithUs() {
  const { mode, submitSellerRequest } = useData();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    productCategory: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.businessName || !form.productCategory) {
      return toast.warning("Please fill all required fields");
    }
    const success = await submitSellerRequest(form);
    if (success) {
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", businessName: "", productCategory: "", message: "" });
    }
  };

  const card = { backgroundColor: mode === "dark" ? "#374151" : "white" };
  const muted = { color: mode === "dark" ? "#ccc" : "#555" };
  const inputCls = `w-full px-4 py-3 rounded-lg outline-none border text-sm transition focus:border-[#F3D0D7] ${
    mode === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-gray-50 border-gray-200 text-gray-800"
  }`;

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: mode === "dark" ? "#232F3E" : "#F0EBE3", color: mode === "dark" ? "white" : "#232F3E" }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-12">
          <span className="text-5xl">💰</span>
          <h1 className="text-4xl font-bold mt-4 mb-3">Sell With ARPA</h1>
          <p className="text-lg max-w-xl mx-auto" style={muted}>
            Partner with us and reach thousands of customers across India. Grow your business with ARPA Collection.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {[
            { icon: "🌍", title: "Wide Reach", desc: "Access thousands of customers across India through our platform." },
            { icon: "📦", title: "Easy Listing", desc: "List your products quickly and start selling within days." },
            { icon: "💸", title: "Great Earnings", desc: "Competitive commission rates and timely payouts." },
          ].map((b, i) => (
            <div key={i} className="rounded-xl p-6 shadow-md text-center" style={card}>
              <div className="text-4xl mb-3">{b.icon}</div>
              <p className="font-bold mb-2">{b.title}</p>
              <p className="text-sm" style={muted}>{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        {submitted ? (
          <div className="rounded-2xl p-10 shadow-md text-center" style={card}>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-3">Application Submitted!</h2>
            <p style={muted} className="mb-6">
              Thank you for your interest in selling with ARPA Collection. Our team will review your application and get back to you within 2–3 business days.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-[#F3D0D7] text-[#232F3E] font-semibold px-6 py-3 rounded-lg hover:bg-[#FFEFEF] transition"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <div className="rounded-2xl p-8 shadow-md" style={card}>
            <h2 className="text-2xl font-bold mb-6">Seller Application Form</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name <span className="text-red-400">*</span></label>
                  <input name="name" value={form.name} onChange={handle} placeholder="Your full name" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address <span className="text-red-400">*</span></label>
                  <input name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number <span className="text-red-400">*</span></label>
                  <input name="phone" value={form.phone} onChange={handle} placeholder="+91 XXXXXXXXXX" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Business / Brand Name <span className="text-red-400">*</span></label>
                  <input name="businessName" value={form.businessName} onChange={handle} placeholder="Your business name" className={inputCls} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Product Category <span className="text-red-400">*</span></label>
                <select name="productCategory" value={form.productCategory} onChange={handle} className={inputCls}>
                  <option value="">Select a category</option>
                  <option>Scrunchies & Hair Accessories</option>
                  <option>Bridal Jewelry & Hair Pins</option>
                  <option>Textiles & Fabrics</option>
                  <option>Fashion Accessories</option>
                  <option>Home & Kitchen</option>
                  <option>Footwear</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Tell us about your products</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handle}
                  rows={4}
                  placeholder="Describe your products, experience, and why you want to sell with ARPA..."
                  className={inputCls}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#F3D0D7] hover:bg-[#FFEFEF] text-[#232F3E] font-bold py-4 rounded-xl transition text-lg"
              >
                Submit Application 🚀
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellWithUs;
