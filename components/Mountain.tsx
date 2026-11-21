import Image from "next/image";

/** Logo: the supplied shield-and-dumbbell artwork, cut out and tinted to the site palette. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-v2.png"
      alt=""
      aria-hidden
      width={398}
      height={434}
      priority
      className={className}
    />
  );
}

/** Large, barely-there mountain range behind the chat. Decorative only. */
export function MountainScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice" aria-hidden className={className}>
      <defs>
        <linearGradient id="ms-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a86ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#4a86ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ms-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a95ff" stopOpacity="0.65" />
          <stop offset="1" stopColor="#3a6dff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ms-lit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8e8ff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ms-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b6fe0" stopOpacity="0.7" />
          <stop offset="1" stopColor="#1a3fa0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ms-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ab8ff" stopOpacity="0" />
          <stop offset="1" stopColor="#8ab8ff" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* far range */}
      <path
        d="M0 420 V290 L60 262 L120 276 L190 224 L250 258 L310 236 L380 282 L450 214 L520 258 L590 232 L650 268 L720 226 L790 262 L880 208 L950 250 L1030 222 L1100 266 L1160 240 L1200 258 V420Z"
        fill="url(#ms-far)"
      />

      {/* secondary peak, left */}
      <path d="M170 420 L250 300 L330 220 L372 170 L420 232 L470 296 L560 420Z" fill="url(#ms-mid)" />
      <path d="M372 170 L420 232 L470 296 L560 420 L400 420 L386 300 L396 230Z" fill="url(#ms-shade)" />
      <path d="M372 170 L346 206 L362 200 L372 218 L386 198 L402 210 L420 232 L398 190Z" fill="#fff" opacity="0.55" />

      {/* secondary peak, right */}
      <path d="M900 420 L980 300 L1050 230 L1096 182 L1140 240 L1200 300 V420Z" fill="url(#ms-mid)" />
      <path d="M1096 182 L1140 240 L1200 300 V420 L1090 420 L1080 310 L1090 240Z" fill="url(#ms-shade)" />
      <path d="M1096 182 L1072 214 L1088 208 L1098 226 L1112 206 L1128 218 L1140 240 L1118 198Z" fill="#fff" opacity="0.5" />

      {/* main peak: lit face, shaded face, ridge detail */}
      <path
        d="M760 70 L700 150 L668 190 L640 215 L590 250 L520 300 L420 420 L800 420 L770 300 L785 200Z"
        fill="url(#ms-lit)"
      />
      <path
        d="M760 70 L785 200 L770 300 L800 420 L1010 420 L930 290 L880 215 L830 160 L800 125Z"
        fill="url(#ms-shade)"
      />
      <g fill="none" stroke="#cfeaff" strokeWidth="1.2" strokeLinecap="round" opacity="0.35">
        <path d="M724 140 L706 214 L720 290 L702 380" />
        <path d="M672 190 L660 262 L676 340" />
        <path d="M840 170 L856 252 L840 330 L852 400" />
        <path d="M900 240 L910 310 L904 380" />
        <path d="M600 250 L612 320 L596 400" />
      </g>
      <path
        d="M760 70 L700 150 L722 140 L734 162 L752 138 L770 172 L788 140 L806 160 L820 148 L830 160 L800 125Z"
        fill="#fff"
        opacity="0.75"
      />

      {/* flag */}
      <path d="M760 70 V32" stroke="#dff1ff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M760 32 L794 43 L760 54Z" fill="#8fe0ff" />

      {/* mist */}
      <rect x="0" y="300" width="1200" height="120" fill="url(#ms-mist)" />
    </svg>
  );
}
