// kit.jsx — 뭉케어 디자인 시스템 (wireframe-kit 기반)

const { useState, useEffect, useRef } = React;

const S = {
  paper: '#faf6ef',
  ink: '#2a2724',
  inkSoft: 'rgba(42,39,36,0.58)',
  inkFaint: 'rgba(42,39,36,0.32)',
  inkVeryFaint: 'rgba(42,39,36,0.1)',
  peach: '#e8a087',
  peachSoft: '#f3cdb9',
  peachFaint: '#fdf0e8',
  sage: '#8aab78',
  sageSoft: '#d8e2cc',
  warn: '#e07b5b',
  hand: '"Gaegu", "Comic Sans MS", cursive',
  pen: '"Nanum Pen Script", "Caveat", cursive',
  body: '"Hi Melody", "Gaegu", cursive',
};

// ─── Phone frame ────────────────────────────────────────────────────────────
function Phone({ children, dark = false, bg }) {
  const bgColor = bg || (dark ? '#1a1714' : S.paper);
  const fg = dark ? 'rgba(255,255,255,0.9)' : S.ink;
  return (
    <div style={{
      position: 'relative',
      width: 320,
      height: 680,
      borderRadius: 46,
      overflow: 'hidden',
      background: bgColor,
      boxShadow: `0 24px 64px rgba(0,0,0,0.28), 0 0 0 2px ${S.ink}, 0 0 0 5px rgba(42,39,36,0.08)`,
      flexShrink: 0,
    }}>
      {/* Dynamic Island */}
      <div style={{
        position: 'absolute', top: 10, left: '50%',
        transform: 'translateX(-50%)',
        width: 96, height: 26, borderRadius: 14,
        background: dark ? '#000' : S.ink, zIndex: 50,
        pointerEvents: 'none',
      }} />
      {/* Status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 46,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        padding: '0 24px 7px', zIndex: 40, color: fg,
        fontFamily: S.hand, fontSize: 12, fontWeight: 700,
        pointerEvents: 'none',
      }}>
        <span>9:41</span>
        <span style={{ fontSize: 11, letterSpacing: 1 }}>●●● 📶 ▮</span>
      </div>
      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        paddingTop: 46, paddingBottom: 22,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {children}
      </div>
      {/* Home indicator */}
      <div style={{
        position: 'absolute', bottom: 7, left: '50%',
        transform: 'translateX(-50%)',
        width: 108, height: 5, borderRadius: 3,
        background: dark ? 'rgba(255,255,255,0.45)' : 'rgba(42,39,36,0.45)',
        zIndex: 40, pointerEvents: 'none',
      }} />
    </div>
  );
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────
function TabBar({ active, onNav }) {
  const tabs = [
    { id: 'home',      label: '홈'   },
    { id: 'archive',   label: '일기' },
    { id: 'dashboard', label: '분석' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 22, left: 0, right: 0, height: 62,
      borderTop: `1.5px solid ${S.inkVeryFaint}`,
      background: S.paper,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      paddingTop: 6, zIndex: 30,
    }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <div key={t.id} onClick={() => onNav(t.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 4, cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: isActive ? S.ink : 'transparent',
              border: `2px solid ${isActive ? S.ink : S.inkFaint}`,
              transition: 'all 0.2s',
            }} />
            <div style={{
              fontFamily: S.hand, fontSize: 13, fontWeight: 700,
              color: isActive ? S.ink : 'rgba(42,39,36,0.55)', transition: 'color 0.2s',
            }}>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Button ──────────────────────────────────────────────────────────────────
function Btn({ children, primary, sm, width, height, onClick, style, disabled }) {
  const h = height || (sm ? 32 : 40);
  return (
    <div onClick={disabled ? null : onClick} style={{
      width: width || 'fit-content',
      minWidth: sm ? 64 : 88,
      height: h,
      padding: `0 ${sm ? 12 : 18}px`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: primary ? S.ink : 'transparent',
      color: primary ? S.paper : S.ink,
      border: `1.5px solid ${disabled ? S.inkVeryFaint : S.ink}`,
      borderRadius: 999,
      fontFamily: S.hand, fontSize: sm ? 12 : 14, fontWeight: 700,
      boxShadow: primary && !disabled ? '2px 2px 0 rgba(42,39,36,0.25)' : 'none',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent',
      transition: 'opacity 0.15s',
      ...style,
    }}>{children}</div>
  );
}

// ─── Mascot ───────────────────────────────────────────────────────────────────
function Mascot({ size = 64, mood = 'happy', fill = '#fff', cheek = true }) {
  const blob = 'M30,8 C42,8 52,16 54,28 C62,30 62,42 54,46 C54,56 44,60 34,58 C26,62 14,58 12,50 C4,48 4,36 12,32 C12,20 20,8 30,8 Z';

  let eyes, mouth;
  switch (mood) {
    case 'sleepy':
      eyes = (<><path d="M22 30 q3 -3 6 0" fill="none" stroke={S.ink} strokeWidth="2" strokeLinecap="round"/><path d="M36 30 q3 -3 6 0" fill="none" stroke={S.ink} strokeWidth="2" strokeLinecap="round"/></>);
      mouth = <path d="M30 39 q2 1.5 4 0" fill="none" stroke={S.ink} strokeWidth="1.8" strokeLinecap="round"/>;
      break;
    case 'worried':
      eyes = (<><circle cx="25" cy="28" r="2.2" fill={S.ink}/><circle cx="39" cy="28" r="2.2" fill={S.ink}/></>);
      mouth = <path d="M28 42 q4 -4 8 0" fill="none" stroke={S.ink} strokeWidth="2" strokeLinecap="round"/>;
      break;
    case 'talking':
      eyes = (<><circle cx="25" cy="30" r="2.2" fill={S.ink}/><circle cx="39" cy="30" r="2.2" fill={S.ink}/></>);
      mouth = <ellipse cx="32" cy="39" rx="4" ry="3" fill={S.ink}/>;
      break;
    case 'excited':
      eyes = (<><circle cx="24" cy="28" r="2.8" fill={S.ink}/><circle cx="38" cy="28" r="2.8" fill={S.ink}/><circle cx="25" cy="27" r="1" fill="#fff"/><circle cx="39" cy="27" r="1" fill="#fff"/></>);
      mouth = <path d="M26 37 q6 7 12 0" fill="none" stroke={S.ink} strokeWidth="2.2" strokeLinecap="round"/>;
      break;
    default: // happy
      eyes = (<><circle cx="25" cy="30" r="2.2" fill={S.ink}/><circle cx="39" cy="30" r="2.2" fill={S.ink}/></>);
      mouth = <path d="M28 38 q4 5 8 0" fill="none" stroke={S.ink} strokeWidth="2.2" strokeLinecap="round"/>;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <path d={blob} fill={fill} stroke={S.ink} strokeWidth="1.8" strokeLinejoin="round"/>
      {cheek && <><circle cx="19" cy="37" r="2.4" fill={S.peachSoft}/><circle cx="45" cy="37" r="2.4" fill={S.peachSoft}/></>}
      {eyes}
      {mouth}
    </svg>
  );
}

// ─── Waveform ────────────────────────────────────────────────────────────────
function Waveform({ width = 200, height = 40, bars = 28, seed = 1, color = S.ink }) {
  const arr = [];
  for (let i = 0; i < bars; i++) {
    const v = Math.abs(Math.sin(seed + i * 1.7) * 0.7 + Math.sin(seed * 2 + i * 0.9) * 0.4);
    arr.push(Math.max(0.1, Math.min(1, v)));
  }
  const bw = (width / bars) - 1.5;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {arr.map((v, i) => {
        const bh = v * height * 0.88;
        return (
          <rect key={i}
            x={i * (bw + 1.5)} y={(height - bh) / 2}
            width={Math.max(1, bw)} height={bh}
            rx={Math.max(1, bw / 2)} fill={color}
          />
        );
      })}
    </svg>
  );
}

// ─── Animated waveform (live recording) ─────────────────────────────────────
function LiveWaveform({ width = 220, height = 44, color = S.ink }) {
  const bars = 32;
  const bw = (width / bars) - 1.5;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {Array.from({ length: bars }).map((_, i) => {
        const delay = (i / bars) * 0.9;
        const baseH = (Math.abs(Math.sin(i * 1.3)) * 0.55 + 0.15) * height;
        return (
          <rect key={i}
            x={i * (bw + 1.5)} y={(height - baseH) / 2}
            width={Math.max(1, bw)} height={baseH}
            rx={Math.max(1, bw / 2)} fill={color}
            style={{
              transformOrigin: `${i * (bw + 1.5) + bw / 2}px ${height / 2}px`,
              animation: `waveBar ${0.6 + Math.sin(i) * 0.3}s ${delay}s ease-in-out infinite`,
            }}
          />
        );
      })}
    </svg>
  );
}

// ─── Line chart ──────────────────────────────────────────────────────────────
function LineChart({ width = 200, height = 56, data, color = S.peach, fill }) {
  if (!data || data.length < 2) return null;
  const pts = data.map((y, i) => [
    (i / (data.length - 1)) * width,
    height - y * height * 0.85 - height * 0.05,
  ]);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = path + ` L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {fill && <path d={area} fill={fill} opacity="0.3"/>}
      <path d={path} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={color}/>)}
    </svg>
  );
}

// ─── Highlight text ──────────────────────────────────────────────────────────
function Hl({ children, color = S.peachSoft }) {
  return (
    <span style={{
      background: `linear-gradient(180deg, transparent 55%, ${color} 55%, ${color} 90%, transparent 90%)`,
      padding: '0 2px',
    }}>{children}</span>
  );
}

// ─── Card (sketchy border) ────────────────────────────────────────────────────
function Card({ children, fill = 'transparent', stroke = S.ink, radius = 14,
                shadow = false, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: '100%',
      background: fill,
      border: `1.5px solid ${stroke || 'transparent'}`,
      borderRadius: radius,
      boxShadow: shadow ? '2px 2px 0 rgba(42,39,36,0.14)' : 'none',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      WebkitTapHighlightColor: 'transparent',
      ...style,
    }}>{children}</div>
  );
}

// ─── Mood pill ────────────────────────────────────────────────────────────────
function MoodPill({ emoji, label, color = '#fff' }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '5px 12px',
      background: color, border: `1.5px solid ${S.ink}`, borderRadius: 999,
      fontFamily: S.hand, fontSize: 13,
    }}>
      <span>{emoji}</span><span>{label}</span>
    </div>
  );
}

Object.assign(window, {
  S, Phone, TabBar, Btn, Mascot, Waveform, LiveWaveform, LineChart, Hl, Card, MoodPill,
});
