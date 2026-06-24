// Decorative floral SVG components — celeste pastel, delicate watercolor feel.
// All inline SVG, no external assets. Reusable.

type Props = { className?: string; style?: React.CSSProperties };

/**
 * BlueFlowerAccent — a small cluster: 1 main bloom + 2 buds + leaves.
 * Use as corner accent or near titles.
 */
export function BlueFlowerAccent({ className = "", style }: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={style}
      aria-hidden
      fill="none"
    >
      <defs>
        <radialGradient id="petalBlue" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F4F8FC" />
          <stop offset="55%" stopColor="#CFE0EE" />
          <stop offset="100%" stopColor="#9FBCD4" />
        </radialGradient>
        <radialGradient id="petalSoft" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DCE9F2" />
        </radialGradient>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9D9C9" />
          <stop offset="100%" stopColor="#94B0A6" />
        </linearGradient>
      </defs>

      {/* leaves */}
      <g opacity="0.75">
        <path
          d="M20 78 Q 40 58 70 70 Q 50 82 20 78 Z"
          fill="url(#leafGrad)"
        />
        <path
          d="M90 92 Q 78 70 60 68 Q 70 92 90 92 Z"
          fill="url(#leafGrad)"
          opacity="0.8"
        />
      </g>

      {/* main 5-petal flower */}
      <g transform="translate(60 55)">
        {[0, 72, 144, 216, 288].map((a, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-16"
            rx="11"
            ry="17"
            fill="url(#petalBlue)"
            transform={`rotate(${a})`}
            opacity="0.92"
          />
        ))}
        <circle r="5" fill="#E8D3A0" opacity="0.9" />
        <circle r="2" fill="#C9A96B" />
      </g>

      {/* small bud */}
      <g transform="translate(28 42)">
        {[0, 72, 144, 216, 288].map((a, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-7"
            rx="5"
            ry="8"
            fill="url(#petalSoft)"
            transform={`rotate(${a})`}
            opacity="0.85"
          />
        ))}
        <circle r="2.2" fill="#C9A96B" opacity="0.7" />
      </g>

      {/* tiny bud */}
      <g transform="translate(96 36)">
        {[0, 72, 144, 216, 288].map((a, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-5"
            rx="3.5"
            ry="6"
            fill="url(#petalBlue)"
            transform={`rotate(${a})`}
            opacity="0.8"
          />
        ))}
        <circle r="1.6" fill="#C9A96B" opacity="0.7" />
      </g>
    </svg>
  );
}

/**
 * FloralCorner — same accent, oriented for a corner. Use position+rotation
 * via `style` or extra classes.
 */
export function FloralCorner({ className = "", style }: Props) {
  return <BlueFlowerAccent className={className} style={style} />;
}

/**
 * FloralDivider — fine horizontal line with a small flower in the center.
 */
export function FloralDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${className}`}
      aria-hidden
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold/40 to-sky/50" />
      <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none">
        <defs>
          <radialGradient id="divPetal" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#BFD3E4" />
          </radialGradient>
        </defs>
        <g transform="translate(16 16)">
          {[0, 60, 120, 180, 240, 300].map((a, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-6"
              rx="3"
              ry="6"
              fill="url(#divPetal)"
              transform={`rotate(${a})`}
              opacity="0.9"
            />
          ))}
          <circle r="1.8" fill="#C9A96B" opacity="0.8" />
        </g>
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent via-gold/40 to-sky/50" />
    </div>
  );
}
