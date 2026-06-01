// Ultra-cute baby animal character with detailed SVG
// Fluffy fur texture, soft 3D shading, big sparkly eyes

import { SHOP_ITEMS, DEFAULT_AVATAR } from "./data";
import type { AvatarPart } from "./data";

const PALETTES: Record<string, { main: string; light: string; mid: string; dark: string; cheek: string; nose: string; furLight: string }> = {
  default:  { main: "#f5a0bc", light: "#fde8ef", mid: "#f0b8cc", dark: "#d87a9c", cheek: "#ff7eaa", nose: "#d4708a", furLight: "#fce4ec" },
  "🎀":     { main: "#f5a0bc", light: "#fde8ef", mid: "#f0b8cc", dark: "#d87a9c", cheek: "#ff7eaa", nose: "#d4708a", furLight: "#fce4ec" },
  "🌻":     { main: "#f5d88a", light: "#fef4d0", mid: "#f0e0a0", dark: "#d4ab4a", cheek: "#ffb06a", nose: "#c09050", furLight: "#fff8e1" },
  "🦋":     { main: "#bfa8e0", light: "#ece0f8", mid: "#cbb8e8", dark: "#8a70b8", cheek: "#d090d0", nose: "#9070a8", furLight: "#f3e8ff" },
  "🎩":     { main: "#a8b8c4", light: "#dce4ea", mid: "#b8c8d0", dark: "#7a909c", cheek: "#e89898", nose: "#8898a4", furLight: "#ecf0f4" },
  "👑":     { main: "#f0cc70", light: "#fcf0c0", mid: "#f0d890", dark: "#c49830", cheek: "#ffa080", nose: "#b88830", furLight: "#fff8dc" },
  "🎓":     { main: "#94a0d4", light: "#d0d4ec", mid: "#a8b0dc", dark: "#6878b4", cheek: "#e89898", nose: "#7080b0", furLight: "#e4e8f8" },
  "🧢":     { main: "#84bce8", light: "#cce4fc", mid: "#98c8f0", dark: "#5090c8", cheek: "#f088b0", nose: "#5088b8", furLight: "#e0f0ff" },
  "🪄":     { main: "#c488d4", light: "#ecd4f4", mid: "#d0a0dc", dark: "#9858b0", cheek: "#f088b0", nose: "#8850a0", furLight: "#f4e4fc" },
};

const EYE_TYPES: Record<string, string> = {
  default: "sparkle", "🥺": "sparkle", "😊": "happy", "🥰": "hearts", "🤩": "stars", "😇": "sparkle",
};

const PET_TYPES: Record<string, { main: string; light: string; dark: string; type: string }> = {
  default:  { main: "#fff0a0", light: "#fffcd8", dark: "#e0c060", type: "chick" },
  "🐣":     { main: "#fff0a0", light: "#fffcd8", dark: "#e0c060", type: "chick" },
  "🐰":     { main: "#f4b8d0", light: "#fce0ec", dark: "#d890b0", type: "bunny" },
  "🐱":     { main: "#f0d0a0", light: "#fce8cc", dark: "#d0a870", type: "kitten" },
  "🦄":     { main: "#d8b8ec", light: "#f0e0fc", dark: "#b088cc", type: "unicorn" },
  "🐶":     { main: "#ccb8a0", light: "#e8dcc8", dark: "#a89070", type: "puppy" },
};

export default function CuteCharacter({
  equippedItems, size = "large",
}: {
  equippedItems: Record<AvatarPart, string | null>;
  size?: "large" | "small" | "tiny";
}) {
  function getEmoji(part: AvatarPart): string {
    const id = equippedItems[part];
    if (id) {
      if (!id.startsWith("hat-") && !id.startsWith("face-") && !id.startsWith("shirt-") && !id.startsWith("acc-")) return id;
      const item = SHOP_ITEMS.find((i) => i.id === id);
      if (item) return item.emoji;
    }
    return DEFAULT_AVATAR[part];
  }

  const hatEmoji = getEmoji("hat");
  const faceEmoji = getEmoji("face");
  const accEmoji = getEmoji("accessory");
  const p = PALETTES[hatEmoji] ?? PALETTES.default;
  const eyeType = EYE_TYPES[faceEmoji] ?? "sparkle";
  const pet = PET_TYPES[accEmoji] ?? PET_TYPES.default;

  const w = size === "large" ? 240 : size === "small" ? 130 : 65;
  const h = size === "large" ? 260 : size === "small" ? 140 : 70;

  return (
    <svg width={w} height={h} viewBox="0 0 240 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Main body - soft fluffy gradient */}
        <radialGradient id={`bg${hatEmoji}`} cx="48%" cy="38%" r="52%">
          <stop offset="0%" stopColor={p.furLight} />
          <stop offset="35%" stopColor={p.light} />
          <stop offset="65%" stopColor={p.main} />
          <stop offset="90%" stopColor={p.dark} />
          <stop offset="100%" stopColor={p.dark} stopOpacity="0.8" />
        </radialGradient>
        {/* Belly - super soft inner glow */}
        <radialGradient id={`belly${hatEmoji}`} cx="50%" cy="42%" r="48%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="40%" stopColor={p.furLight} stopOpacity="0.8" />
          <stop offset="100%" stopColor={p.light} stopOpacity="0.3" />
        </radialGradient>
        {/* Eye gradient - deep and glossy */}
        <radialGradient id="eyeDeep" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#3d2010" />
          <stop offset="60%" stopColor="#1a0a02" />
          <stop offset="100%" stopColor="#0a0400" />
        </radialGradient>
        {/* Ear inner glow */}
        <radialGradient id={`earIn${hatEmoji}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.cheek} stopOpacity="0.5" />
          <stop offset="100%" stopColor={p.main} stopOpacity="0.1" />
        </radialGradient>
        {/* Fur texture overlay */}
        <filter id="furSoft">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Pet gradient */}
        <radialGradient id={`pet${accEmoji}`} cx="45%" cy="38%" r="55%">
          <stop offset="0%" stopColor={pet.light} />
          <stop offset="70%" stopColor={pet.main} />
          <stop offset="100%" stopColor={pet.dark} stopOpacity="0.6" />
        </radialGradient>
      </defs>

      <g transform="translate(10, 8)">
        {/* ══════ EARS ══════ */}
        {/* Left ear - outer */}
        <ellipse cx="50" cy="32" rx="26" ry="38" fill={p.main} transform="rotate(-12 50 32)" />
        {/* Left ear - fur highlight */}
        <ellipse cx="50" cy="28" rx="20" ry="30" fill={p.mid} transform="rotate(-12 50 28)" opacity="0.6" />
        {/* Left ear - inner pink */}
        <ellipse cx="50" cy="32" rx="14" ry="24" fill={`url(#earIn${hatEmoji})`} transform="rotate(-12 50 32)" />

        {/* Right ear - outer */}
        <ellipse cx="170" cy="32" rx="26" ry="38" fill={p.main} transform="rotate(12 170 32)" />
        <ellipse cx="170" cy="28" rx="20" ry="30" fill={p.mid} transform="rotate(12 170 28)" opacity="0.6" />
        <ellipse cx="170" cy="32" rx="14" ry="24" fill={`url(#earIn${hatEmoji})`} transform="rotate(12 170 32)" />

        {/* ══════ MAIN BODY ══════ */}
        {/* Shadow underneath */}
        <ellipse cx="110" cy="215" rx="60" ry="8" fill="black" opacity="0.15" />

        {/* Body - big fluffy round shape */}
        <ellipse cx="110" cy="125" rx="90" ry="95" fill={`url(#bg${hatEmoji})`} />

        {/* Fur texture - lots of soft overlapping tufts for fluffy look */}
        <ellipse cx="90" cy="75" rx="48" ry="38" fill={p.furLight} opacity="0.25" />
        <ellipse cx="130" cy="85" rx="38" ry="28" fill={p.furLight} opacity="0.18" />
        <ellipse cx="70" cy="108" rx="28" ry="22" fill={p.light} opacity="0.22" />
        <ellipse cx="150" cy="100" rx="24" ry="20" fill={p.light} opacity="0.18" />
        {/* Extra fur wisps around edges */}
        <ellipse cx="35" cy="95" rx="12" ry="8" fill={p.mid} opacity="0.3" transform="rotate(-25 35 95)" />
        <ellipse cx="185" cy="95" rx="12" ry="8" fill={p.mid} opacity="0.3" transform="rotate(25 185 95)" />
        <ellipse cx="40" cy="140" rx="10" ry="7" fill={p.mid} opacity="0.25" transform="rotate(-15 40 140)" />
        <ellipse cx="180" cy="140" rx="10" ry="7" fill={p.mid} opacity="0.25" transform="rotate(15 180 140)" />
        <ellipse cx="50" cy="175" rx="9" ry="6" fill={p.mid} opacity="0.2" transform="rotate(-10 50 175)" />
        <ellipse cx="170" cy="175" rx="9" ry="6" fill={p.mid} opacity="0.2" transform="rotate(10 170 175)" />
        {/* Top head fluff */}
        <ellipse cx="80" cy="45" rx="14" ry="8" fill={p.light} opacity="0.3" transform="rotate(-10 80 45)" />
        <ellipse cx="140" cy="45" rx="14" ry="8" fill={p.light} opacity="0.3" transform="rotate(10 140 45)" />
        <ellipse cx="110" cy="38" rx="18" ry="8" fill={p.furLight} opacity="0.25" />
        {/* Chest fur tuft */}
        <ellipse cx="95" cy="155" rx="10" ry="8" fill={p.furLight} opacity="0.2" transform="rotate(-8 95 155)" />
        <ellipse cx="125" cy="155" rx="10" ry="8" fill={p.furLight} opacity="0.2" transform="rotate(8 125 155)" />
        <ellipse cx="110" cy="160" rx="12" ry="7" fill="white" opacity="0.1" />

        {/* Belly - soft fluffy center */}
        <ellipse cx="110" cy="148" rx="58" ry="55" fill={`url(#belly${hatEmoji})`} />

        {/* Extra belly fluff highlight */}
        <ellipse cx="105" cy="135" rx="35" ry="28" fill="white" opacity="0.12" />

        {/* ══════ EYES ══════ */}
        {eyeType === "happy" ? (
          <>
            <path d="M 68 108 Q 80 96 92 108" stroke="#1a0a02" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 128 108 Q 140 96 152 108" stroke="#1a0a02" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Left eye - big glossy */}
            <ellipse cx="82" cy="105" rx="16" ry="17" fill="url(#eyeDeep)" />
            {/* Primary shine - big */}
            <ellipse cx="76" cy="98" rx="6" ry="6.5" fill="white" opacity="0.95" />
            {/* Secondary shine */}
            <ellipse cx="88" cy="108" rx="3" ry="3" fill="white" opacity="0.6" />
            {/* Tiny tertiary shine */}
            <ellipse cx="78" cy="104" rx="1.5" ry="1.5" fill="white" opacity="0.4" />
            {/* Bottom eye reflection */}
            <ellipse cx="82" cy="115" rx="8" ry="2.5" fill={p.furLight} opacity="0.15" />

            {/* Right eye - big glossy */}
            <ellipse cx="138" cy="105" rx="16" ry="17" fill="url(#eyeDeep)" />
            <ellipse cx="132" cy="98" rx="6" ry="6.5" fill="white" opacity="0.95" />
            <ellipse cx="144" cy="108" rx="3" ry="3" fill="white" opacity="0.6" />
            <ellipse cx="134" cy="104" rx="1.5" ry="1.5" fill="white" opacity="0.4" />
            <ellipse cx="138" cy="115" rx="8" ry="2.5" fill={p.furLight} opacity="0.15" />

            {/* Heart/star overlays */}
            {eyeType === "hearts" && (
              <>
                <text x="73" y="112" fontSize="20" fill="#e91e63" opacity="0.7">&#9829;</text>
                <text x="129" y="112" fontSize="20" fill="#e91e63" opacity="0.7">&#9829;</text>
              </>
            )}
            {eyeType === "stars" && (
              <>
                <text x="72" y="113" fontSize="22" fill="#ffc107" opacity="0.7">&#9733;</text>
                <text x="128" y="113" fontSize="22" fill="#ffc107" opacity="0.7">&#9733;</text>
              </>
            )}
          </>
        )}

        {/* Soft eyebrow arches */}
        <path d="M 68 86 Q 80 80 92 86" stroke={p.dark} strokeWidth="2" fill="none" opacity="0.15" strokeLinecap="round" />
        <path d="M 128 86 Q 140 80 152 86" stroke={p.dark} strokeWidth="2" fill="none" opacity="0.15" strokeLinecap="round" />

        {/* ══════ BLUSH CHEEKS ══════ */}
        {/* Multiple layered for soft airbrushed look */}
        <ellipse cx="55" cy="124" rx="18" ry="12" fill={p.cheek} opacity="0.2" />
        <ellipse cx="55" cy="124" rx="13" ry="8" fill={p.cheek} opacity="0.2" />
        <ellipse cx="165" cy="124" rx="18" ry="12" fill={p.cheek} opacity="0.2" />
        <ellipse cx="165" cy="124" rx="13" ry="8" fill={p.cheek} opacity="0.2" />

        {/* ══════ NOSE ══════ */}
        <ellipse cx="110" cy="126" rx="5.5" ry="4" fill={p.nose} />
        <ellipse cx="108" cy="124.5" rx="2.5" ry="1.8" fill="white" opacity="0.45" />

        {/* ══════ MOUTH ══════ */}
        <path d="M 101 133 Q 105 138 110 135 Q 115 138 119 133" stroke={p.dark} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.6" />

        {/* ══════ PAWS ══════ */}
        {/* Front paws */}
        <ellipse cx="65" cy="200" rx="22" ry="14" fill={p.main} />
        <ellipse cx="65" cy="202" rx="12" ry="7" fill={p.light} opacity="0.4" />
        {/* Toe beans! */}
        <circle cx="58" cy="198" r="3" fill={p.light} opacity="0.3" />
        <circle cx="66" cy="196" r="3" fill={p.light} opacity="0.3" />
        <circle cx="74" cy="198" r="3" fill={p.light} opacity="0.3" />

        <ellipse cx="155" cy="200" rx="22" ry="14" fill={p.main} />
        <ellipse cx="155" cy="202" rx="12" ry="7" fill={p.light} opacity="0.4" />
        <circle cx="148" cy="198" r="3" fill={p.light} opacity="0.3" />
        <circle cx="156" cy="196" r="3" fill={p.light} opacity="0.3" />
        <circle cx="164" cy="198" r="3" fill={p.light} opacity="0.3" />

        {/* Side arms - soft fluffy */}
        <ellipse cx="26" cy="150" rx="16" ry="22" fill={p.main} transform="rotate(-15 26 150)" />
        <ellipse cx="26" cy="148" rx="10" ry="16" fill={p.mid} transform="rotate(-15 26 148)" opacity="0.4" />
        <ellipse cx="194" cy="150" rx="16" ry="22" fill={p.main} transform="rotate(15 194 150)" />
        <ellipse cx="194" cy="148" rx="10" ry="16" fill={p.mid} transform="rotate(15 194 148)" opacity="0.4" />

        {/* ══════ FLUFFY FUR EDGE TUFTS ══════ */}
        {/* Many tiny wisps sticking out for super fluffy look */}
        <ellipse cx="25" cy="110" rx="8" ry="5" fill={p.mid} opacity="0.35" transform="rotate(-35 25 110)" />
        <ellipse cx="28" cy="130" rx="7" ry="4" fill={p.mid} opacity="0.3" transform="rotate(-25 28 130)" />
        <ellipse cx="32" cy="155" rx="6" ry="4" fill={p.mid} opacity="0.25" transform="rotate(-20 32 155)" />
        <ellipse cx="38" cy="180" rx="5" ry="3" fill={p.mid} opacity="0.2" transform="rotate(-15 38 180)" />
        <ellipse cx="195" cy="110" rx="8" ry="5" fill={p.mid} opacity="0.35" transform="rotate(35 195 110)" />
        <ellipse cx="192" cy="130" rx="7" ry="4" fill={p.mid} opacity="0.3" transform="rotate(25 192 130)" />
        <ellipse cx="188" cy="155" rx="6" ry="4" fill={p.mid} opacity="0.25" transform="rotate(20 188 155)" />
        <ellipse cx="182" cy="180" rx="5" ry="3" fill={p.mid} opacity="0.2" transform="rotate(15 182 180)" />
        {/* Top head fur tufts */}
        <ellipse cx="60" cy="42" rx="7" ry="5" fill={p.light} opacity="0.3" transform="rotate(-20 60 42)" />
        <ellipse cx="160" cy="42" rx="7" ry="5" fill={p.light} opacity="0.3" transform="rotate(20 160 42)" />
        <ellipse cx="85" cy="35" rx="6" ry="4" fill={p.furLight} opacity="0.25" transform="rotate(-10 85 35)" />
        <ellipse cx="135" cy="35" rx="6" ry="4" fill={p.furLight} opacity="0.25" transform="rotate(10 135 35)" />
        {/* Bottom tummy fluff */}
        <ellipse cx="80" cy="195" rx="8" ry="4" fill={p.light} opacity="0.2" transform="rotate(-5 80 195)" />
        <ellipse cx="140" cy="195" rx="8" ry="4" fill={p.light} opacity="0.2" transform="rotate(5 140 195)" />
        <ellipse cx="110" cy="200" rx="10" ry="4" fill={p.furLight} opacity="0.15" />
      </g>

      {/* ══════ PET COMPANION ══════ */}
      <g transform="translate(170, 178)">
        {/* Pet shadow */}
        <ellipse cx="25" cy="48" rx="18" ry="4" fill="black" opacity="0.1" />

        {/* Ears/features by type */}
        {pet.type === "bunny" && (
          <>
            <ellipse cx="15" cy="2" rx="6" ry="16" fill={pet.main} />
            <ellipse cx="15" cy="2" rx="3.5" ry="11" fill={pet.light} opacity="0.6" />
            <ellipse cx="35" cy="2" rx="6" ry="16" fill={pet.main} />
            <ellipse cx="35" cy="2" rx="3.5" ry="11" fill={pet.light} opacity="0.6" />
          </>
        )}
        {pet.type === "kitten" && (
          <>
            <polygon points="10,14 5,0 22,10" fill={pet.main} />
            <polygon points="12,12 8,2 20,10" fill={pet.light} opacity="0.4" />
            <polygon points="40,14 45,0 28,10" fill={pet.main} />
            <polygon points="38,12 42,2 30,10" fill={pet.light} opacity="0.4" />
          </>
        )}
        {pet.type === "unicorn" && (
          <>
            <ellipse cx="15" cy="10" rx="5" ry="11" fill={pet.main} />
            <ellipse cx="35" cy="10" rx="5" ry="11" fill={pet.main} />
            <polygon points="25,-2 21,14 29,14" fill="url(#hornGrad)" />
            <linearGradient id="hornGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff176" />
              <stop offset="50%" stopColor="#ffb74d" />
              <stop offset="100%" stopColor="#ff8a65" />
            </linearGradient>
            <polygon points="25,-2 22,10 28,10" fill="#ffe082" opacity="0.5" />
          </>
        )}
        {pet.type === "puppy" && (
          <>
            <ellipse cx="8" cy="16" rx="10" ry="12" fill={pet.dark} transform="rotate(-25 8 16)" />
            <ellipse cx="42" cy="16" rx="10" ry="12" fill={pet.dark} transform="rotate(25 42 16)" />
          </>
        )}
        {pet.type === "chick" && (
          <>
            <ellipse cx="5" cy="30" rx="7" ry="9" fill={pet.main} />
            <ellipse cx="45" cy="30" rx="7" ry="9" fill={pet.main} />
          </>
        )}

        {/* Pet body */}
        <ellipse cx="25" cy="28" rx="24" ry="22" fill={`url(#pet${accEmoji})`} />
        <ellipse cx="25" cy="32" rx="14" ry="12" fill={pet.light} opacity="0.4" />

        {/* Pet eyes */}
        <circle cx="18" cy="24" r="4" fill="#1a0a02" />
        <circle cx="32" cy="24" r="4" fill="#1a0a02" />
        <circle cx="16" cy="22" r="2" fill="white" opacity="0.9" />
        <circle cx="30" cy="22" r="2" fill="white" opacity="0.9" />
        <circle cx="19" cy="25" r="0.8" fill="white" opacity="0.4" />
        <circle cx="33" cy="25" r="0.8" fill="white" opacity="0.4" />

        {/* Pet blush */}
        <ellipse cx="11" cy="30" rx="5" ry="3" fill="#ff8fab" opacity="0.3" />
        <ellipse cx="39" cy="30" rx="5" ry="3" fill="#ff8fab" opacity="0.3" />

        {/* Pet nose */}
        <ellipse cx="25" cy="29" rx="2.5" ry="1.8" fill="#e08080" />
        <ellipse cx="24" cy="28.5" rx="1" ry="0.7" fill="white" opacity="0.3" />

        {/* Pet smile */}
        <path d="M 21 33 Q 25 36 29 33" stroke="#c07070" strokeWidth="1.2" fill="none" strokeLinecap="round" />

        {/* Floating heart */}
        <g filter="url(#softGlow)">
          <text x="40" y="-4" fontSize="14" fill="#ff6090" opacity="0.8">&#9829;</text>
        </g>
      </g>

      {/* ══════ SPARKLE EFFECTS ══════ */}
      <g opacity="0.4">
        <text x="12" y="25" fontSize="11" fill="#ffd700">&#10022;</text>
        <text x="205" y="55" fontSize="9" fill="#ff90b0">&#10022;</text>
        <text x="5" y="190" fontSize="8" fill="#90d0ff">&#9733;</text>
        <text x="215" y="200" fontSize="7" fill="#ffd700">&#10022;</text>
      </g>
    </svg>
  );
}
