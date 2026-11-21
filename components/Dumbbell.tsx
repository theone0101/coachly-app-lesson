type Props = {
  /** Rank index, 0 (Rookie) to 5 (Legend). Higher ranks get a bigger dumbbell. */
  level: number;
  /** Lit in blue (reached) or dimmed (locked). */
  lit?: boolean;
  className?: string;
};

export default function Dumbbell({ level, lit = true, className }: Props) {
  const plates = Math.min(1 + Math.floor(level / 2), 3);
  const fill = lit ? "url(#db-fill)" : "#2a3652";
  const grip = lit ? "#cfe9ff" : "#3a4766";

  const rects: { x: number; w: number; h: number }[] = [];
  let offset = 0;
  for (let i = 0; i < plates; i++) {
    const w = i === 0 ? 9 : 7;
    const h = Math.max(14, 16 + level * 6.5 - i * 7);
    rects.push({ x: offset, w, h });
    offset += w + 2;
  }

  return (
    <svg viewBox="0 0 120 64" aria-hidden className={className}>
      <defs>
        <linearGradient id="db-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fe0ff" />
          <stop offset="1" stopColor="#1d6dff" />
        </linearGradient>
      </defs>
      <rect x="30" y="29" width="60" height="6" rx="3" fill={grip} opacity={lit ? 0.95 : 0.8} />
      {rects.map((r, i) => (
        <g key={i}>
          <rect x={30 - 2 - r.x - r.w} y={32 - r.h / 2} width={r.w} height={r.h} rx="3" fill={fill} />
          <rect x={90 + 2 + r.x} y={32 - r.h / 2} width={r.w} height={r.h} rx="3" fill={fill} />
        </g>
      ))}
    </svg>
  );
}
