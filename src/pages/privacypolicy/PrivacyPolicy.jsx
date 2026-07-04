import { useData } from "../../context/data/MyState";

const sections = [
  {
    icon: "📋",
    title: "Information We Collect",
    content: [
      "Personal details such as name, email address, phone number, and delivery address when you place an order.",
      "Account information when you register on our platform.",
      "Device and usage data including IP address, browser type, and pages visited.",
      "Payment-related information (we do not store card details).",
    ],
  },
  {
    icon: "🔍",
    title: "How We Use Your Information",
    content: [
      "To process and fulfill your orders.",
      "To send order confirmations and delivery updates.",
      "To respond to your queries and provide customer support.",
      "To improve our website and personalize your shopping experience.",
      "To send promotional offers (only if you opt in).",
    ],
  },
  {
    icon: "🔒",
    title: "How We Protect Your Data",
    content: [
      "We use industry-standard encryption (SSL) to protect data transmitted on our site.",
      "Your personal data is stored securely on Firebase servers.",
      "We never sell or rent your personal information to third parties.",
      "Access to your data is restricted to authorized personnel only.",
    ],
  },
  {
    icon: "🍪",
    title: "Cookies",
    content: [
      "We use cookies to enhance your browsing experience and remember your preferences.",
      "Cookies help us analyze site traffic and improve our services.",
      "You can disable cookies in your browser settings, though some features may not work properly.",
    ],
  },
  {
    icon: "🤝",
    title: "Third-Party Services",
    content: [
      "We use Firebase (Google) for authentication and data storage.",
      "We may use analytics tools to understand user behavior.",
      "These third parties have their own privacy policies and we encourage you to review them.",
    ],
  },
  {
    icon: "👤",
    title: "Your Rights",
    content: [
      "You can request access to the personal data we hold about you.",
      "You can request correction or deletion of your personal data.",
      "You can opt out of marketing communications at any time.",
      "To exercise these rights, contact us at arpastore97@gmail.com.",
    ],
  },
];

function PrivacyPolicy() {
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
          <span className="text-5xl">🔐</span>
          <h1 className="text-4xl font-bold mt-4 mb-3">Privacy Policy</h1>
          <p style={muted}>Last updated: March 2025</p>
          <p className="mt-3 text-sm max-w-xl mx-auto" style={muted}>
            At ARPA Collection, your privacy matters to us. This policy explains how we collect,
            use, and protect your personal information.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-5 mb-12">
          {sections.map((s, i) => (
            <div key={i} className="rounded-xl p-6 shadow-md" style={card}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>{s.icon}</span> {s.title}
              </h2>
              <ul className="space-y-2">
                {s.content.map((c, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={muted}>
                    <span className="text-[#F3D0D7] mt-0.5 font-bold">•</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Changes */}
        <div className="rounded-xl p-6 shadow-md mb-8" style={card}>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span>📝</span> Changes to This Policy
          </h2>
          <p className="text-sm" style={muted}>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page
            with an updated date. We encourage you to review this policy periodically.
          </p>
        </div>

        {/* Contact */}
        <div className="rounded-xl p-6 shadow-md text-center" style={card}>
          <p className="font-semibold text-lg mb-2">Questions about our Privacy Policy?</p>
          <p className="text-sm mb-4" style={muted}>
            If you have any questions or concerns, feel free to reach out to us.
          </p>
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

export default PrivacyPolicy;
