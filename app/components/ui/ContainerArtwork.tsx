import type { ProductCategory } from '../../data/apexData';

interface ContainerArtworkProps {
  product: ProductCategory;
  active: boolean;
}

export function ContainerArtwork({ product, active }: ContainerArtworkProps) {
  const isDrum = product.containerStyle === 'drum-steel' || product.containerStyle === 'drum-charcoal';
  const isPail = product.containerStyle === 'pail-graphite';

  const bodyColors: Record<ProductCategory['containerStyle'], { main: string; highlight: string; cap: string; stripe: string }> = {
    'bottle-gold': { main: '#252B32', highlight: '#252B32', cap: '#F28C28', stripe: '#F28C28' },
    'bottle-silver': { main: '#252B32', highlight: '#252B32', cap: '#F4F4F4', stripe: '#F4F4F4' },
    'bottle-red': { main: '#252B32', highlight: '#252B32', cap: '#F28C28', stripe: '#F28C28' },
    'bottle-amber': { main: '#252B32', highlight: '#252B32', cap: '#F28C28', stripe: '#F28C28' },
    'drum-steel': { main: '#252B32', highlight: '#252B32', cap: '#F4F4F4', stripe: '#F4F4F4' },
    'drum-charcoal': { main: '#252B32', highlight: '#252B32', cap: '#F28C28', stripe: '#F28C28' },
    'pail-graphite': { main: '#252B32', highlight: '#252B32', cap: '#F28C28', stripe: '#F28C28' },
    'canister-slate': { main: '#252B32', highlight: '#252B32', cap: '#F28C28', stripe: '#F28C28' },
  };

  const palette = bodyColors[product.containerStyle];

  return (
    <div
      className={`relative flex h-52 w-full items-center justify-center transition-transform duration-500 ease-out ${
        active ? 'scale-105' : 'group-hover:scale-105'
      }`}
    >
      {/* Grounded radial studio reflection beneath packaging */}
      <div
        className="pointer-events-none absolute bottom-2 h-6 w-40 rounded-full blur-md"
        style={{ background: `radial-gradient(circle, ${product.ambientGlow} 0%, rgba(0,0,0,0) 72%)` }}
      />

      {isDrum ? (
        <svg viewBox="0 0 220 260" className="h-48 w-40 drop-shadow-2xl" aria-hidden="true">
          <defs>
            <linearGradient id={`drum-${product.id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#252B32" />
              <stop offset="28%" stopColor={palette.highlight} />
              <stop offset="65%" stopColor={palette.main} />
              <stop offset="100%" stopColor="#252B32" />
            </linearGradient>
          </defs>
          {/* 208L Industrial Steel Drum */}
          <rect x="46" y="34" width="128" height="196" rx="10" fill={`url(#drum-${product.id})`} stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />
          <ellipse cx="110" cy="34" rx="64" ry="11" fill="#252B32" stroke="rgba(244,244,244,0.22)" strokeWidth="1.5" />
          <rect x="64" y="22" width="16" height="8" rx="2" fill={palette.cap} />
          <rect x="142" y="23" width="12" height="7" rx="2" fill="#F4F4F4" />
          {/* Rolling hoops */}
          <rect x="42" y="88" width="136" height="9" rx="4" fill="#252B32" stroke="rgba(244,244,244,0.18)" />
          <rect x="42" y="166" width="136" height="9" rx="4" fill="#252B32" stroke="rgba(244,244,244,0.18)" />
          {/* Center Brand Band */}
          <rect x="47" y="106" width="126" height="50" fill="#252B32" />
          <rect x="47" y="106" width="126" height="4" fill={palette.stripe} />
          <text x="110" y="129" textAnchor="middle" fill="#F4F4F4" fontSize="15" fontWeight="800" fontFamily="Barlow Condensed, sans-serif" letterSpacing="2">
            APEX LUBES
          </text>
          <text x="110" y="145" textAnchor="middle" fill={palette.stripe} fontSize="8.5" fontWeight="600" fontFamily="JetBrains Mono, monospace">
            {product.viscosityGrades[0]}
          </text>
        </svg>
      ) : isPail ? (
        <svg viewBox="0 0 220 260" className="h-48 w-40 drop-shadow-2xl" aria-hidden="true">
          <defs>
            <linearGradient id={`pail-${product.id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#252B32" />
              <stop offset="32%" stopColor={palette.highlight} />
              <stop offset="100%" stopColor="#252B32" />
            </linearGradient>
          </defs>
          {/* Heavy-Duty Grease Pail */}
          <path d="M50 74 L170 74 L160 224 L60 224 Z" fill={`url(#pail-${product.id})`} stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />
          <rect x="44" y="60" width="132" height="16" rx="4" fill={palette.cap} />
          <path d="M52 72 C52 38, 168 38, 168 72" fill="none" stroke="#F4F4F4" strokeWidth="3.5" />
          <rect x="64" y="110" width="92" height="72" rx="4" fill="#252B32" stroke="rgba(244,244,244,0.12)" />
          <rect x="64" y="110" width="92" height="5" fill="#F28C28" />
          <text x="110" y="138" textAnchor="middle" fill="#F4F4F4" fontSize="14" fontWeight="800" fontFamily="Barlow Condensed, sans-serif" letterSpacing="1.5">
            APEX GREASE
          </text>
          <text x="110" y="156" textAnchor="middle" fill="#F28C28" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono, monospace">
            {product.viscosityGrades.slice(0, 2).join(' · ')}
          </text>
        </svg>
      ) : (
        <svg viewBox="0 0 220 260" className="h-48 w-40 drop-shadow-2xl" aria-hidden="true">
          <defs>
            <linearGradient id={`jug-${product.id}`} x1="0" y1="0" x2="1" y2="0.4">
              <stop offset="0%" stopColor="#252B32" />
              <stop offset="30%" stopColor={palette.highlight} />
              <stop offset="70%" stopColor={palette.main} />
              <stop offset="100%" stopColor="#252B32" />
            </linearGradient>
          </defs>
          {/* Ergonomic 4L / 5L Lubricant Bottle Silhouette */}
          <path
            d="M72 48 L108 48 L120 68 C148 76 168 96 170 124 L170 220 C170 228 164 234 156 234 L64 234 C56 234 50 228 50 220 L50 112 C50 86 60 66 72 48 Z"
            fill={`url(#jug-${product.id})`}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.5"
          />
          {/* Handle Cutout */}
          <path
            d="M132 92 L150 104 C154 108 156 114 156 122 L156 154 C156 158 152 160 148 160 L134 160 C130 160 128 156 128 152 L128 96 C128 92 130 90 132 92 Z"
            fill="#252B32"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
          />
          {/* Knurled Cap & Tamper Ring */}
          <rect x="74" y="24" width="32" height="18" rx="3" fill={palette.cap} />
          <rect x="72" y="42" width="36" height="6" rx="2" fill="#F28C28" />
          {/* Sight Level Window */}
          <rect x="54" y="120" width="5" height="86" rx="2.5" fill="#F28C28" opacity="0.85" />
          {/* Front Label */}
          <rect x="68" y="106" width="54" height="106" rx="3" fill="#252B32" stroke="rgba(244,244,244,0.14)" />
          <path d="M68 118 L122 110 L122 120 L68 128 Z" fill="#F28C28" />
          <rect x="68" y="131" width="54" height="2.5" fill={palette.stripe} />
          <text x="95" y="152" textAnchor="middle" fill="#F4F4F4" fontSize="13" fontWeight="800" fontFamily="Barlow Condensed, sans-serif" letterSpacing="1.2">
            APEX
          </text>
          <text x="95" y="172" textAnchor="middle" fill={palette.stripe} fontSize="11" fontWeight="700" fontFamily="Barlow Condensed, sans-serif">
            {product.viscosityGrades[0]}
          </text>
          <text x="95" y="192" textAnchor="middle" fill="#F4F4F4" fontSize="6.5" fontFamily="JetBrains Mono, monospace">
            UAE BLENDED
          </text>
        </svg>
      )}
    </div>
  );
}
