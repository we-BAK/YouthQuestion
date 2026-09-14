import React from "react";

/**
 * Authentic Ethiopian Orthodox Tewahedo Church (EOTC) Cross Component
 * Features traditional woven lattice / Lalibela & Axumite architectural cross motifs.
 */
export default function EthiopianCross({
  size = 32,
  className = "",
  variant = "gold", // 'gold' | 'burgundy' | 'white' | 'currentColor'
}) {
  const getGradientId = () => `eotc-cross-grad-${variant}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block transition-transform duration-300 hover:scale-105 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="eotc-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="eotc-burgundy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="50%" stopColor="#be123c" />
          <stop offset="100%" stopColor="#4c0519" />
        </linearGradient>
      </defs>

      {/* Outer subtle glow/halo ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke={
          variant === "gold"
            ? "url(#eotc-gold-grad)"
            : variant === "burgundy"
            ? "url(#eotc-burgundy-grad)"
            : variant === "white"
            ? "#ffffff"
            : "currentColor"
        }
        strokeWidth="1.2"
        strokeDasharray="2 4"
        opacity="0.6"
      />

      {/* Main Cross Central Structure */}
      {/* Vertical Shaft */}
      <rect
        x="45"
        y="12"
        width="10"
        height="76"
        rx="3"
        fill={
          variant === "gold"
            ? "url(#eotc-gold-grad)"
            : variant === "burgundy"
            ? "url(#eotc-burgundy-grad)"
            : variant === "white"
            ? "#ffffff"
            : "currentColor"
        }
      />
      {/* Horizontal Beam */}
      <rect
        x="18"
        y="32"
        width="64"
        height="10"
        rx="3"
        fill={
          variant === "gold"
            ? "url(#eotc-gold-grad)"
            : variant === "burgundy"
            ? "url(#eotc-burgundy-grad)"
            : variant === "white"
            ? "#ffffff"
            : "currentColor"
        }
      />

      {/* Lalibela / Axumite Woven Lattice Finials */}
      {/* Top Cross Piece */}
      <path
        d="M38 18 L50 6 L62 18 L50 24 Z"
        fill={
          variant === "gold"
            ? "url(#eotc-gold-grad)"
            : variant === "burgundy"
            ? "url(#eotc-burgundy-grad)"
            : variant === "white"
            ? "#ffffff"
            : "currentColor"
        }
      />
      <circle cx="50" cy="15" r="2.5" fill="#ffffff" opacity="0.8" />

      {/* Left Finial */}
      <path
        d="M24 24 L10 37 L24 50 L28 37 Z"
        fill={
          variant === "gold"
            ? "url(#eotc-gold-grad)"
            : variant === "burgundy"
            ? "url(#eotc-burgundy-grad)"
            : variant === "white"
            ? "#ffffff"
            : "currentColor"
        }
      />
      <circle cx="21" cy="37" r="2" fill="#ffffff" opacity="0.8" />

      {/* Right Finial */}
      <path
        d="M76 24 L90 37 L76 50 L72 37 Z"
        fill={
          variant === "gold"
            ? "url(#eotc-gold-grad)"
            : variant === "burgundy"
            ? "url(#eotc-burgundy-grad)"
            : variant === "white"
            ? "#ffffff"
            : "currentColor"
        }
      />
      <circle cx="79" cy="37" r="2" fill="#ffffff" opacity="0.8" />

      {/* Bottom Base (St. Lalibela Handle Base) */}
      <path
        d="M40 82 L50 94 L60 82 L50 78 Z"
        fill={
          variant === "gold"
            ? "url(#eotc-gold-grad)"
            : variant === "burgundy"
            ? "url(#eotc-burgundy-grad)"
            : variant === "white"
            ? "#ffffff"
            : "currentColor"
        }
      />
      <circle cx="50" cy="85" r="2.5" fill="#ffffff" opacity="0.8" />

      {/* Central Diamond Medallion */}
      <rect
        x="42"
        y="29"
        width="16"
        height="16"
        rx="2"
        transform="rotate(45 50 37)"
        fill="#ffffff"
        opacity="0.9"
      />
      <circle cx="50" cy="37" r="3.5" fill="#b45309" />

      {/* Ethiopian Cross Weave Wings */}
      <path
        d="M32 25 C32 20 40 18 45 22"
        stroke={variant === "gold" ? "#fde68a" : "#ffffff"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M68 25 C68 20 60 18 55 22"
        stroke={variant === "gold" ? "#fde68a" : "#ffffff"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M32 49 C32 54 40 56 45 52"
        stroke={variant === "gold" ? "#fde68a" : "#ffffff"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M68 49 C68 54 60 56 55 52"
        stroke={variant === "gold" ? "#fde68a" : "#ffffff"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
