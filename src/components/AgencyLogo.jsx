import React, { useState } from 'react';

/**
 * Authentic, high-polish circular agency emblem component matching native government app designs.
 * Supports authentic circular crests for:
 * - RRB (Indian Railways)
 * - NIA (National Investigation Agency)
 * - CRPF (Central Reserve Police Force)
 * - APPSC (Andhra Pradesh Public Service Commission)
 * - ISRO (Indian Space Research Organisation)
 * - DSSSB / "dssss" (Delhi Subordinate Services Selection Board)
 * - TGPSC / TSPSC (Telangana State Public Service Commission)
 * - SSC (Staff Selection Commission)
 * - UPSC (Union Public Service Commission)
 * - IBPS & Banking
 * - DRDO (Defence Research & Development Organisation)
 */
function getOrgString(val) {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val.en || val.te || Object.values(val)[0] || '';
  }
  return String(val);
}

export default function AgencyLogo({ org = '', size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false);
  const orgName = getOrgString(org) || 'GOVT';
  const normalized = orgName.toLowerCase();

  const sizeClasses = {
    sm: 'w-8 h-8 text-[9px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-14 h-14 text-base'
  }[size] || 'w-10 h-10 text-xs';

  // 1. RRB / Indian Railways (Authentic circular red crest with locomotive wheel & laurels)
  if (normalized.includes('railway') || normalized.includes('rrb') || normalized.includes('ntpc')) {
    if (!imgError) {
      return (
        <div className={`${sizeClasses} shrink-0 rounded-full overflow-hidden shadow-xs border border-[#FCA5A5]/60 bg-[#991B1B] ${className}`}>
          <img
            src="/assets/aistudio/image_cbd93505.png"
            alt="Railway Recruitment Board"
            className="w-full h-full object-cover rounded-full"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </div>
      );
    }
    return (
      <div
        className={`${sizeClasses} rounded-full bg-[#991B1B] text-white flex items-center justify-center shrink-0 shadow-xs border border-[#FCA5A5]/60 overflow-hidden relative ${className}`}
        title="Railway Recruitment Board (RRB)"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="48" fill="#991B1B" stroke="#FDE047" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="43" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 2" />
          {/* Indian Railways Train Face */}
          <circle cx="50" cy="50" r="34" fill="#7F1D1D" stroke="#FDE047" strokeWidth="1.5" />
          <path d="M30 40 Q50 30 70 40 L68 62 Q50 67 32 62 Z" fill="#FFFFFF" />
          <rect x="36" y="43" width="11" height="8" rx="2" fill="#1E293B" />
          <rect x="53" y="43" width="11" height="8" rx="2" fill="#1E293B" />
          <circle cx="41" cy="55" r="2.5" fill="#DC2626" />
          <circle cx="59" cy="55" r="2.5" fill="#DC2626" />
          <circle cx="50" cy="58" r="2" fill="#FDE047" />
          <path d="M35 68 L65 68 M40 73 L60 73" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
          <text x="50" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" letterSpacing="1">RRB</text>
        </svg>
        <span className="sr-only">RRB</span>
      </div>
    );
  }

  // 2. NIA (National Investigation Agency)
  if (normalized.includes('nia') || normalized.includes('investigation')) {
    if (!imgError) {
      return (
        <div className={`${sizeClasses} shrink-0 rounded-full overflow-hidden shadow-xs border border-[#F59E0B]/60 bg-[#0B1F3A] ${className}`}>
          <img
            src="/assets/aistudio/logo_nia_clean.png"
            alt="National Investigation Agency"
            className="w-full h-full object-cover rounded-full"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </div>
      );
    }
    return (
      <div
        className={`${sizeClasses} rounded-full bg-[#0B1F3A] text-[#FDE047] flex items-center justify-center shrink-0 shadow-xs border border-[#F59E0B]/60 overflow-hidden relative ${className}`}
        title="National Investigation Agency (NIA)"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="48" fill="#0B1F3A" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 2" />
          <path d="M50 22 L75 32 V54 C75 68 50 78 50 78 C50 78 25 68 25 54 V32 Z" fill="#1E3A8A" stroke="#F59E0B" strokeWidth="2" />
          <text x="50" y="58" textAnchor="middle" fill="#FDE047" fontSize="15" fontWeight="900" fontFamily="sans-serif">NIA</text>
        </svg>
        <span className="sr-only">NIA</span>
      </div>
    );
  }

  // 3. CRPF / Police (Golden Crest with Crossed Rifles & Shield)
  if (normalized.includes('crpf') || normalized.includes('police') || normalized.includes('constable') || normalized.includes('bsf') || normalized.includes('cisf') || normalized.includes('itbp')) {
    if (!imgError) {
      return (
        <div className={`${sizeClasses} shrink-0 rounded-full overflow-hidden shadow-xs border border-[#F59E0B]/60 bg-[#FEF3C7] ${className}`}>
          <img
            src="/assets/aistudio/logo_crpf_clean.png"
            alt="Central Reserve Police Force"
            className="w-full h-full object-cover rounded-full"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </div>
      );
    }
    return (
      <div
        className={`${sizeClasses} rounded-full bg-[#FFFBEB] text-[#B45309] flex items-center justify-center shrink-0 shadow-xs border border-[#F59E0B] overflow-hidden relative ${className}`}
        title="Central Reserve Police Force (CRPF)"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="48" fill="#FFFBEB" stroke="#D97706" strokeWidth="2.5" />
          <path d="M50 20 L76 30 V56 C76 72 50 82 50 82 C50 82 24 72 24 56 V30 Z" fill="#FEF3C7" stroke="#B45309" strokeWidth="2" />
          <circle cx="50" cy="48" r="14" fill="#1E3A8A" stroke="#D97706" strokeWidth="1.5" />
          <path d="M50 38 V58 M40 48 H60" stroke="#FDE047" strokeWidth="1.5" />
          <circle cx="50" cy="48" r="4" fill="#FDE047" />
          <text x="50" y="74" textAnchor="middle" fill="#92400E" fontSize="9" fontWeight="900">CRPF</text>
        </svg>
        <span className="sr-only">CRPF</span>
      </div>
    );
  }

  // 4. ISRO (Indian Space Research Organisation - Iconic Rocket Vector & Solar Panels)
  if (normalized.includes('isro') || normalized.includes('space research') || normalized.includes('icrb')) {
    return (
      <div
        className={`${sizeClasses} rounded-full bg-white text-[#EA580C] flex items-center justify-center shrink-0 shadow-xs border-2 border-[#EA580C]/40 overflow-hidden relative p-1 ${className}`}
        title="Indian Space Research Organisation (ISRO)"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          {/* Deep Space Outer Ring */}
          <circle cx="50" cy="50" r="48" fill="#0B132B" stroke="#EA580C" strokeWidth="2" />
          {/* Satellite Orbit Line */}
          <ellipse cx="50" cy="50" rx="38" ry="18" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 2" transform="rotate(-25 50 50)" />
          {/* Orange Rocket Launch Chevron */}
          <path d="M42 72 L48 24 L54 72 L48 64 Z" fill="#F97316" stroke="#EA580C" strokeWidth="1" />
          <path d="M48 24 L52 14 L56 24 Z" fill="#FB923C" />
          {/* Blue Solar Panels Wing */}
          <rect x="56" y="38" width="18" height="14" rx="2" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
          <line x1="65" y1="38" x2="65" y2="52" stroke="#BAE6FD" strokeWidth="1" />
          <line x1="56" y1="45" x2="74" y2="45" stroke="#BAE6FD" strokeWidth="1" />
          {/* Propulsion Jet Flame */}
          <path d="M46 72 Q48 84 50 72 Z" fill="#FDE047" />
          {/* ISRO Typography */}
          <text x="34" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900" fontFamily="sans-serif">isro</text>
        </svg>
        <span className="sr-only">ISRO</span>
      </div>
    );
  }

  // 5. APPSC (Andhra Pradesh Public Service Commission - Official Emblem)
  if (normalized.includes('appsc') || normalized.includes('andhra pradesh') || normalized.includes('andhra')) {
    if (!imgError) {
      return (
        <div
          className={`${sizeClasses} shrink-0 rounded-full overflow-hidden shadow-xs border border-emerald-600/40 bg-white ${className}`}
          title="Andhra Pradesh Public Service Commission (APPSC)"
        >
          <img
            src="/assets/aistudio/image_3b1d93b9.png"
            alt="Andhra Pradesh Public Service Commission (APPSC)"
            className="w-full h-full object-contain rounded-full"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </div>
      );
    }
    return (
      <div
        className={`${sizeClasses} rounded-full bg-[#064E3B] text-[#FDE047] flex items-center justify-center shrink-0 shadow-xs border-2 border-[#F59E0B] overflow-hidden relative ${className}`}
        title="Andhra Pradesh Public Service Commission (APPSC)"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          {/* Outer Emerald Green & Gold Circle */}
          <circle cx="50" cy="50" r="48" fill="#064E3B" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="42" fill="#047857" stroke="#FEF08A" strokeWidth="1" />
          {/* Radiating Sun Rays in Center */}
          <circle cx="50" cy="46" r="16" fill="#FDE047" opacity="0.3" />
          {/* Golden Poornakumbham Kalash Vase */}
          <path d="M38 58 Q34 68 42 74 H58 Q66 68 62 58 Z" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1.5" />
          <ellipse cx="50" cy="58" rx="12" ry="3" fill="#D97706" />
          {/* Sacred Coconut & Mango Leaves */}
          <path d="M44 58 Q50 42 50 40 Q50 42 56 58 Z" fill="#84CC16" />
          <circle cx="50" cy="42" r="5" fill="#78350F" stroke="#FEF08A" strokeWidth="1" />
          <path d="M38 54 Q44 48 48 54 M62 54 Q56 48 52 54" stroke="#65A30D" strokeWidth="2" strokeLinecap="round" />
          {/* Ashoka Wheel Base */}
          <circle cx="50" cy="80" r="5" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          {/* Text APPSC */}
          <text x="50" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="900" letterSpacing="1">APPSC</text>
        </svg>
        <span className="sr-only">APPSC</span>
      </div>
    );
  }

  // 6. DSSSB / "dssss" (Delhi Subordinate Services Selection Board)
  if (normalized.includes('dsssb') || normalized.includes('dssss') || normalized.includes('delhi subordinate') || normalized.includes('delhi')) {
    return (
      <div
        className={`${sizeClasses} rounded-full bg-[#0A2540] text-[#FDE047] flex items-center justify-center shrink-0 shadow-xs border-2 border-[#F59E0B] overflow-hidden relative ${className}`}
        title="Delhi Subordinate Services Selection Board (DSSSB)"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          {/* Delhi Govt Royal Navy & Gold Seal */}
          <circle cx="50" cy="50" r="48" fill="#0A2540" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="42" fill="#0F365D" stroke="#FEF08A" strokeWidth="1" strokeDasharray="3 1.5" />
          {/* Ashoka Lion Silhouette / Pillar Top */}
          <path d="M44 26 H56 V36 H44 Z" fill="#F59E0B" />
          <circle cx="50" cy="24" r="5" fill="#FDE047" />
          <path d="M42 36 L58 36 L55 42 L45 42 Z" fill="#D97706" />
          {/* Balance Scales of Merit & Justice */}
          <line x1="32" y1="48" x2="68" y2="48" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="42" x2="50" y2="68" stroke="#FDE047" strokeWidth="2" />
          {/* Left Pan */}
          <path d="M30 56 Q36 62 42 56 Z" fill="#F59E0B" />
          <line x1="32" y1="48" x2="36" y2="56" stroke="#FEF08A" strokeWidth="1" />
          {/* Right Pan */}
          <path d="M58 56 Q64 62 70 56 Z" fill="#F59E0B" />
          <line x1="68" y1="48" x2="64" y2="56" stroke="#FEF08A" strokeWidth="1" />
          {/* Bold DSSSB lettering */}
          <text x="50" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" letterSpacing="1">DSSSB</text>
        </svg>
        <span className="sr-only">DSSSB</span>
      </div>
    );
  }

  // 7. TGPSC / TSPSC (Telangana State Public Service Commission - Kakatiya Arch)
  if (normalized.includes('tgpsc') || normalized.includes('tspsc') || normalized.includes('telangana')) {
    return (
      <div
        className={`${sizeClasses} rounded-full bg-[#134E4A] text-[#FDE047] flex items-center justify-center shrink-0 shadow-xs border-2 border-[#14B8A6] overflow-hidden relative ${className}`}
        title="Telangana Public Service Commission (TGPSC)"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="48" fill="#134E4A" stroke="#2DD4BF" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="42" fill="#115E59" stroke="#FEF08A" strokeWidth="1" />
          {/* Kakatiya Kala Thoranam Arch */}
          <path d="M30 70 V42 Q50 30 70 42 V70" fill="none" stroke="#FDE047" strokeWidth="3" />
          <path d="M38 70 V46 Q50 38 62 46 V70" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
          {/* Charminar / Ashoka Center */}
          <rect x="46" y="52" width="8" height="18" fill="#FEF08A" />
          <path d="M44 52 L50 44 L56 52 Z" fill="#F59E0B" />
          <text x="50" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900" letterSpacing="0.8">TGPSC</text>
        </svg>
        <span className="sr-only">TGPSC</span>
      </div>
    );
  }

  // 8. SSC (Staff Selection Commission)
  if (normalized.includes('ssc') || normalized.includes('staff selection')) {
    if (!imgError) {
      return (
        <div className={`${sizeClasses} shrink-0 rounded-full overflow-hidden shadow-xs border border-amber-300/80 bg-white ${className}`}>
          <img
            src="/assets/aistudio/image_445d7a66.png"
            alt="Staff Selection Commission"
            className="w-full h-full object-contain rounded-full"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </div>
      );
    }
    return (
      <div
        className={`${sizeClasses} rounded-full bg-[#0B1F3A] text-white flex items-center justify-center shrink-0 shadow-xs border-2 border-[#38BDF8] overflow-hidden relative ${className}`}
        title="Staff Selection Commission (SSC)"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="48" fill="#0B1F3A" stroke="#38BDF8" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="42" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 1.5" />
          {/* Gold Wreath / Emblem */}
          <path d="M26 50 C26 66 38 76 50 76 C62 76 74 66 74 50" fill="none" stroke="#FDE047" strokeWidth="2" strokeDasharray="2 1" />
          <path d="M46 26 H54 V34 H46 Z" fill="#FDE047" />
          <text x="50" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" letterSpacing="1.2" fontFamily="sans-serif">SSC</text>
        </svg>
        <span className="sr-only">SSC</span>
      </div>
    );
  }

  // 9. UPSC (Union Public Service Commission)
  if (normalized.includes('upsc') || normalized.includes('civil service') || normalized.includes('ias')) {
    return (
      <div
        className={`${sizeClasses} rounded-full bg-[#831843] text-[#FDE047] flex items-center justify-center shrink-0 shadow-xs border-2 border-[#FDE047] overflow-hidden relative ${className}`}
        title="Union Public Service Commission (UPSC)"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="48" fill="#831843" stroke="#FDE047" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="42" fill="#9D174D" stroke="#FEF08A" strokeWidth="1" />
          {/* Ashoka Star */}
          <circle cx="50" cy="30" r="6" fill="#FDE047" />
          <text x="50" y="58" textAnchor="middle" fill="#FDE047" fontSize="15" fontWeight="900" letterSpacing="1" fontFamily="sans-serif">UPSC</text>
        </svg>
        <span className="sr-only">UPSC</span>
      </div>
    );
  }

  // 10. IBPS & Banking (SBI, RBI, Bank PO)
  if (normalized.includes('ibps') || normalized.includes('bank') || normalized.includes('sbi') || normalized.includes('rbi')) {
    return (
      <div
        className={`${sizeClasses} rounded-full bg-[#065F46] text-[#6EE7B7] flex items-center justify-center shrink-0 shadow-xs border-2 border-[#34D399] overflow-hidden relative ${className}`}
        title="Banking & IBPS"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="48" fill="#065F46" stroke="#34D399" strokeWidth="2.5" />
          {/* Bank Columns */}
          <path d="M25 40 L50 24 L75 40 H25 Z" fill="#6EE7B7" />
          <rect x="30" y="44" width="6" height="24" fill="#A7F3D0" />
          <rect x="42" y="44" width="6" height="24" fill="#A7F3D0" />
          <rect x="52" y="44" width="6" height="24" fill="#A7F3D0" />
          <rect x="64" y="44" width="6" height="24" fill="#A7F3D0" />
          <rect x="24" y="70" width="52" height="6" fill="#6EE7B7" />
          <text x="50" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900" letterSpacing="1">IBPS</text>
        </svg>
        <span className="sr-only">IBPS</span>
      </div>
    );
  }

  // 11. DRDO (Defence Research & Development Organisation)
  if (normalized.includes('drdo') || normalized.includes('defence research')) {
    return (
      <div
        className={`${sizeClasses} rounded-full bg-[#1E3A8A] text-[#FDE047] flex items-center justify-center shrink-0 shadow-xs border-2 border-[#60A5FA] overflow-hidden relative ${className}`}
        title="Defence Research & Development Organisation (DRDO)"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="48" fill="#1E3A8A" stroke="#93C5FD" strokeWidth="2.5" />
          {/* Eagle Wings Silhouette */}
          <path d="M22 46 Q36 34 50 42 Q64 34 78 46 Q64 54 50 46 Q36 54 22 46 Z" fill="#FDE047" />
          {/* Supersonic Missile */}
          <path d="M48 24 L52 24 L52 64 L48 64 Z" fill="#FFFFFF" />
          <path d="M48 24 L50 16 L52 24 Z" fill="#EF4444" />
          <text x="50" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" letterSpacing="1">DRDO</text>
        </svg>
        <span className="sr-only">DRDO</span>
      </div>
    );
  }

  // Default / Generic Government Emblem
  const initials = orgName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() || 'EQH';

  return (
    <div
      className={`${sizeClasses} rounded-full bg-[#12345A] text-white flex items-center justify-center font-extrabold shrink-0 shadow-xs border-2 border-[#2468B4]/40 ${className}`}
      title={orgName}
    >
      <span className="tracking-tight">{initials}</span>
    </div>
  );
}
