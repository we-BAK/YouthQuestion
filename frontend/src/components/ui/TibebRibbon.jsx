import React from "react";

/**
 * Traditional Ethiopian Tibeb (ጥበብ) Woven Geometric Ribbon
 * Inspired by classic illuminated Ge'ez manuscripts and ecclesiastical vestment borders.
 */
export default function TibebRibbon({ className = "h-1.5 w-full" }) {
  return (
    <div className={`overflow-hidden relative ${className}`} aria-hidden="true">
      <div
        className="w-full h-full"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            #881337,
            #881337 10px,
            #d97706 10px,
            #d97706 14px,
            #065f46 14px,
            #065f46 24px,
            #d97706 24px,
            #d97706 28px
          )`,
          opacity: 0.85,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
    </div>
  );
}
