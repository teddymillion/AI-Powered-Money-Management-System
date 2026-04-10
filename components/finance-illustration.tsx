export function FinanceIllustration() {
  return (
    <svg
      viewBox="0 0 520 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-h-[420px]"
      aria-hidden="true"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="cardGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
        </linearGradient>
        <linearGradient id="cardGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
        </linearGradient>
        <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="barBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="barAmber" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0" />
          <stop offset="30%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="coinGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="coinSilver" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(0,0,0,0.25)" />
        </filter>
        <clipPath id="cardClip">
          <rect x="60" y="80" width="400" height="320" rx="20" />
        </clipPath>
      </defs>

      {/* ── Background particles ── */}
      {[
        [30,60,3],[480,100,2],[500,380,2.5],[20,350,2],[260,30,1.5],[450,450,2],
        [100,430,1.5],[380,20,2],[140,200,1],[420,260,1.5],
      ].map(([cx,cy,r],i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.25)">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${2.5+i*0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* ── Main dashboard card ── */}
      <g filter="url(#softShadow)">
        <rect x="60" y="80" width="400" height="320" rx="20" fill="url(#cardGrad1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      </g>

      {/* Card header bar */}
      <rect x="60" y="80" width="400" height="52" rx="20" fill="rgba(255,255,255,0.08)" />
      <rect x="60" y="112" width="400" height="20" fill="rgba(255,255,255,0.08)" />

      {/* Traffic-light dots */}
      <circle cx="88" cy="106" r="5" fill="rgba(255,255,255,0.5)" />
      <circle cx="104" cy="106" r="5" fill="rgba(255,255,255,0.35)" />
      <circle cx="120" cy="106" r="5" fill="rgba(255,255,255,0.2)" />

      {/* Header title */}
      <rect x="148" y="100" width="80" height="7" rx="3.5" fill="rgba(255,255,255,0.6)" />
      <rect x="148" y="112" width="50" height="5" rx="2.5" fill="rgba(255,255,255,0.3)" />

      {/* Header right — avatar */}
      <circle cx="432" cy="106" r="14" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <rect x="426" y="101" width="12" height="5" rx="2.5" fill="rgba(255,255,255,0.5)" />
      <rect x="428" y="108" width="8" height="4" rx="2" fill="rgba(255,255,255,0.35)" />

      {/* ── KPI mini-cards row ── */}
      {[
        { x: 76,  label: 'Income',   val: '24,500', color: '#6ee7b7' },
        { x: 196, label: 'Expenses', val: '11,200', color: '#fca5a5' },
        { x: 316, label: 'Savings',  val: '13,300', color: '#93c5fd' },
      ].map(({ x, label, val, color }) => (
        <g key={label}>
          <rect x={x} y="148" width="108" height="56" rx="12" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <rect x={x+10} y="158" width="28" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
          <rect x={x+10} y="167" width="50" height="7" rx="3.5" fill={color} opacity="0.9" />
          <circle cx={x+88} cy="162" r="8" fill={color} opacity="0.2" />
          <circle cx={x+88} cy="162" r="4" fill={color} opacity="0.7" />
        </g>
      ))}

      {/* ── Area / Line chart ── */}
      <g clipPath="url(#cardClip)">
        {/* Area fill */}
        <path
          d="M76 330 C110 310 140 280 175 265 C210 250 230 270 265 245 C300 220 320 200 355 185 C380 175 400 180 444 165 L444 330 Z"
          fill="url(#areaGrad)"
        />
        {/* Line */}
        <path
          d="M76 330 C110 310 140 280 175 265 C210 250 230 270 265 245 C300 220 320 200 355 185 C380 175 400 180 444 165"
          stroke="url(#lineGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#glow)"
        />
        {/* Data points */}
        {[[175,265],[265,245],[355,185],[444,165]].map(([cx,cy],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="5" fill="#10b981" opacity="0.3" />
            <circle cx={cx} cy={cy} r="3" fill="#10b981" />
            <circle cx={cx} cy={cy} r="3" fill="white" opacity="0.6" />
          </g>
        ))}
        {/* Animated pulse on last point */}
        <circle cx="444" cy="165" r="8" fill="#10b981" opacity="0.2">
          <animate attributeName="r" values="5;12;5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="444" cy="165" r="4" fill="#10b981" />
      </g>

      {/* X-axis labels */}
      {['Jan','Feb','Mar','Apr'].map((m, i) => (
        <text key={m} x={130 + i * 90} y="358" fontSize="9" fill="rgba(255,255,255,0.45)" textAnchor="middle" fontFamily="system-ui">{m}</text>
      ))}

      {/* ── Bar chart (mini, bottom-right) ── */}
      <g>
        <rect x="310" y="220" width="140" height="100" rx="10" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <text x="320" y="234" fontSize="7" fill="rgba(255,255,255,0.5)" fontFamily="system-ui">Monthly</text>
        {[
          { x: 325, h: 45, grad: 'barGreen' },
          { x: 349, h: 30, grad: 'barBlue'  },
          { x: 373, h: 55, grad: 'barGreen' },
          { x: 397, h: 38, grad: 'barAmber' },
          { x: 421, h: 62, grad: 'barGreen' },
        ].map(({ x, h, grad }, i) => (
          <g key={i}>
            <rect x={x} y={305 - h} width="16" height={h} rx="4" fill={`url(#${grad})`} opacity="0.85">
              <animate attributeName="height" from="0" to={h} dur={`${0.6 + i * 0.1}s`} fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
              <animate attributeName="y" from="305" to={305 - h} dur={`${0.6 + i * 0.1}s`} fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
            </rect>
          </g>
        ))}
      </g>

      {/* ── Floating coins ── */}
      {/* Gold coin 1 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-10;0,0" dur="3.5s" repeatCount="indefinite" additive="sum" />
        <ellipse cx="90" cy="230" rx="18" ry="18" fill="url(#coinGold)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" filter="url(#softShadow)" />
        <ellipse cx="90" cy="230" rx="13" ry="13" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <text x="90" y="234" fontSize="11" fill="rgba(255,255,255,0.8)" textAnchor="middle" fontFamily="system-ui" fontWeight="bold">$</text>
      </g>

      {/* Silver coin */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-7;0,0" dur="4.2s" repeatCount="indefinite" additive="sum" />
        <ellipse cx="450" cy="300" rx="14" ry="14" fill="url(#coinSilver)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" filter="url(#softShadow)" />
        <ellipse cx="450" cy="300" rx="10" ry="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
        <text x="450" y="304" fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle" fontFamily="system-ui" fontWeight="bold">€</text>
      </g>

      {/* Small gold coin */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-12;0,0" dur="5s" repeatCount="indefinite" additive="sum" />
        <ellipse cx="480" cy="160" rx="11" ry="11" fill="url(#coinGold)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <text x="480" y="164" fontSize="8" fill="rgba(255,255,255,0.7)" textAnchor="middle" fontFamily="system-ui" fontWeight="bold">₿</text>
      </g>

      {/* ── Floating AI insight badge ── */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;4,-6;0,0" dur="4s" repeatCount="indefinite" additive="sum" />
        <rect x="320" y="60" width="130" height="36" rx="18" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" filter="url(#softShadow)" />
        <circle cx="342" cy="78" r="8" fill="rgba(110,231,183,0.3)" />
        <circle cx="342" cy="78" r="4" fill="#6ee7b7">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        </circle>
        <rect x="356" y="72" width="55" height="5" rx="2.5" fill="rgba(255,255,255,0.7)" />
        <rect x="356" y="81" width="38" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
        <text x="430" y="82" fontSize="14" fill="rgba(255,255,255,0.6)" fontFamily="system-ui">✦</text>
      </g>

      {/* ── Floating savings card ── */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;-5,5;0,0" dur="5.5s" repeatCount="indefinite" additive="sum" />
        <rect x="30" y="160" width="110" height="60" rx="14" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" filter="url(#softShadow)" />
        <rect x="44" y="174" width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.4)" />
        <rect x="44" y="184" width="60" height="7" rx="3.5" fill="rgba(110,231,183,0.8)" />
        <rect x="44" y="196" width="30" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
        {/* Mini sparkline */}
        <polyline points="100,200 108,193 116,196 124,188 132,182" stroke="#6ee7b7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>

      {/* ── Percentage ring (donut) ── */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;3,-4;0,0" dur="6s" repeatCount="indefinite" additive="sum" />
        <circle cx="470" cy="230" r="28" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* Track */}
        <circle cx="470" cy="230" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        {/* Progress arc — 72% */}
        <circle cx="470" cy="230" r="20" fill="none" stroke="#10b981" strokeWidth="6"
          strokeDasharray="90.5 125.7" strokeDashoffset="31.4" strokeLinecap="round"
          transform="rotate(-90 470 230)" filter="url(#glow)" />
        <text x="470" y="234" fontSize="8" fill="rgba(255,255,255,0.8)" textAnchor="middle" fontFamily="system-ui" fontWeight="bold">72%</text>
      </g>

      {/* ── Upward trend arrow ── */}
      <g opacity="0.6">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="3s" repeatCount="indefinite" additive="sum" />
        <path d="M40 420 L55 400 L70 410 L85 390 L100 395 L115 375" stroke="#6ee7b7" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="115,368 122,380 108,380" fill="#6ee7b7" />
      </g>

      {/* ── Decorative grid lines ── */}
      {[240, 270, 300, 330].map((y, i) => (
        <line key={i} x1="76" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 6" />
      ))}
    </svg>
  );
}
