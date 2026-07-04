/**
 * Logo component — used across Navbar, Footer, Login, Signup, BottomNav.
 *
 * Props:
 *   size   — "sm" | "md" | "lg"  (default "md")
 *   variant — "full" | "icon"    (default "full")  icon = icon only, full = icon + wordmark
 */

const IG_GRAD = "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)";

/* Inline SVG — custom "IX" monogram that reads as an influencer-marketing mark */
function IXMark({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left diagonal bar of X */}
      <line x1="7" y1="7" x2="25" y2="25" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Right diagonal bar of X */}
      <line x1="25" y1="7" x2="7" y2="25" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Vertical bar of I — overlapping center */}
      <line x1="16" y1="5" x2="16" y2="27" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

const SIZES = {
  sm: { box: 28, icon: 15, text: "0.9rem"  },
  md: { box: 34, icon: 18, text: "1.05rem" },
  lg: { box: 56, icon: 28, text: "1.6rem"  },
};

export default function Logo({ size = "md", variant = "full", className = "" }) {
  const s = SIZES[size] || SIZES.md;

  return (
    <span
      className={`inline-flex items-center gap-2 select-none ${className}`}
      aria-label="InfluenX"
    >
      {/* Gradient icon box */}
      <span
        className="flex items-center justify-center flex-shrink-0 rounded-xl"
        style={{
          width:  s.box,
          height: s.box,
          background: IG_GRAD,
          boxShadow: "0 4px 14px rgba(221,42,123,0.4)",
        }}
      >
        <IXMark size={s.icon} />
      </span>

      {/* Wordmark */}
      {variant === "full" && (
        <span
          className="font-black tracking-tight leading-none"
          style={{ fontSize: s.text, color: "#FAFAFA" }}
        >
          Influen
          <span
            style={{
              background: IG_GRAD,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            X
          </span>
        </span>
      )}
    </span>
  );
}
