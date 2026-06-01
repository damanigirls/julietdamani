// Journey Map - realistic planets and detailed flowers
import type { JourneyType } from "./useSpellingStore";
import type { Lesson } from "./data";

const PLANETS = [
  { name: "Start", body: "#8ec0e8", ring: "", atmo: "#a8d8f0", spots: "#6aa8d0", size: 22 },
  { name: "Mercury", body: "#b0a090", ring: "", atmo: "#c8b8a8", spots: "#8a7a68", size: 18 },
  { name: "Venus", body: "#e8c878", ring: "", atmo: "#f0d890", spots: "#d0a840", size: 22 },
  { name: "Earth", body: "#4ca86c", ring: "", atmo: "#78c898", spots: "#3888b8", size: 24 },
  { name: "Mars", body: "#d06040", ring: "", atmo: "#e08060", spots: "#b04828", size: 20 },
  { name: "Jupiter", body: "#e0a868", ring: "", atmo: "#f0c088", spots: "#c88040", size: 30 },
  { name: "Saturn", body: "#e8cc78", ring: "#d4b860", atmo: "#f0dc98", spots: "#c8a848", size: 24 },
  { name: "Neptune", body: "#5888d0", ring: "", atmo: "#78a8e8", spots: "#4070b8", size: 26 },
  { name: "Galaxy", body: "#a870c8", ring: "#c898e0", atmo: "#c090e0", spots: "#8850a8", size: 30 },
];

const FLOWERS = [
  { name: "Sprout", petals: "#a5d6a7", center: "#fff176", stem: "#66bb6a", petalCount: 0 },
  { name: "Daisy", petals: "#ffffff", center: "#ffd54f", stem: "#66bb6a", petalCount: 8 },
  { name: "Rose", petals: "#f48fb1", center: "#e91e63", stem: "#4caf50", petalCount: 12 },
  { name: "Tulip", petals: "#ef5350", center: "#ffeb3b", stem: "#43a047", petalCount: 6 },
  { name: "Lily", petals: "#fff9c4", center: "#ff8f00", stem: "#388e3c", petalCount: 6 },
  { name: "Sunflower", petals: "#ffc107", center: "#5d4037", stem: "#2e7d32", petalCount: 14 },
  { name: "Lavender", petals: "#b39ddb", center: "#7e57c2", stem: "#558b2f", petalCount: 8 },
  { name: "Orchid", petals: "#ce93d8", center: "#f06292", stem: "#689f38", petalCount: 5 },
  { name: "Rainbow", petals: "#ff80ab", center: "#ffeb3b", stem: "#66bb6a", petalCount: 10 },
];

export default function JourneyMap({
  journeyType, lessons, completedLessons, onSelectLesson,
}: {
  journeyType: JourneyType; lessons: Lesson[]; completedLessons: string[];
  onSelectLesson: (lesson: Lesson) => void;
}) {
  if (journeyType === "rocket") {
    return <RocketJourney lessons={lessons} completedLessons={completedLessons} onSelect={onSelectLesson} />;
  }
  return <BeeJourney lessons={lessons} completedLessons={completedLessons} onSelect={onSelectLesson} />;
}

// ── Realistic Planet SVG ─────────────────────────────────────────

function PlanetSVG({ planet, completed, locked }: { planet: typeof PLANETS[0]; completed: boolean; locked: boolean }) {
  const r = planet.size;
  const cx = 28;
  const cy = 28;
  const col = locked ? "#333" : planet.body;
  const spotCol = locked ? "#444" : planet.spots;
  const atmoCol = locked ? "#222" : planet.atmo;

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <defs>
        <radialGradient id={`pl-${planet.name}`} cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor={locked ? "#555" : planet.atmo} />
          <stop offset="50%" stopColor={col} />
          <stop offset="100%" stopColor={locked ? "#1a1a1a" : planet.spots} />
        </radialGradient>
        <clipPath id={`clip-${planet.name}`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* Atmosphere glow */}
      {!locked && <circle cx={cx} cy={cy} r={r + 4} fill={atmoCol} opacity="0.15" />}

      {/* Planet body */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#pl-${planet.name})`} />

      {/* Surface details */}
      <g clipPath={`url(#clip-${planet.name})`}>
        {/* Craters/spots */}
        <circle cx={cx - 5} cy={cy - 4} r={r * 0.2} fill={spotCol} opacity="0.3" />
        <circle cx={cx + 7} cy={cy + 5} r={r * 0.15} fill={spotCol} opacity="0.25" />
        <circle cx={cx - 8} cy={cy + 8} r={r * 0.12} fill={spotCol} opacity="0.2" />
        {/* Cloud/band */}
        <ellipse cx={cx + 2} cy={cy - 2} rx={r * 0.6} ry={r * 0.12} fill="white" opacity="0.1" transform={`rotate(-10 ${cx + 2} ${cy - 2})`} />
      </g>

      {/* Shine highlight */}
      <ellipse cx={cx - r * 0.25} cy={cy - r * 0.3} rx={r * 0.25} ry={r * 0.2} fill="white" opacity={locked ? 0.05 : 0.25} />

      {/* Ring (Saturn-style) */}
      {planet.ring && !locked && (
        <ellipse cx={cx} cy={cy} rx={r + 8} ry={r * 0.25} fill="none" stroke={planet.ring} strokeWidth="2.5" opacity="0.5" transform={`rotate(-15 ${cx} ${cy})`} />
      )}

      {/* Checkmark */}
      {completed && (
        <>
          <circle cx={cx} cy={cy} r={r * 0.45} fill="#22c55e" opacity="0.8" />
          <path d={`M ${cx - 5} ${cy} L ${cx - 1} ${cy + 4} L ${cx + 6} ${cy - 4}`} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

// ── Realistic Flower SVG ─────────────────────────────────────────

function FlowerSVG({ flower, completed, locked }: { flower: typeof FLOWERS[0]; completed: boolean; locked: boolean }) {
  const cx = 28;
  const cy = 24;
  const petalR = 9;
  const centerR = 6;
  const n = flower.petalCount;
  const petalCol = locked ? "#444" : flower.petals;
  const centerCol = locked ? "#333" : flower.center;
  const stemCol = locked ? "#2a2a2a" : flower.stem;

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <defs>
        <radialGradient id={`fc-${flower.name}`} cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor={locked ? "#555" : "#fff8e1"} stopOpacity="0.6" />
          <stop offset="100%" stopColor={centerCol} />
        </radialGradient>
      </defs>

      {/* Stem */}
      <path d={`M ${cx} ${cy + centerR} Q ${cx - 4} ${cy + 16} ${cx - 2} ${55}`} stroke={stemCol} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Leaf */}
      {!locked && (
        <ellipse cx={cx + 6} cy={cy + 16} rx="6" ry="3" fill={stemCol} opacity="0.7" transform={`rotate(30 ${cx + 6} ${cy + 16})`} />
      )}

      {/* Petals */}
      {n > 0 && Array.from({ length: n }).map((_, i) => {
        const angle = (360 / n) * i;
        const rad = (angle * Math.PI) / 180;
        const px = cx + Math.cos(rad) * (petalR + 2);
        const py = cy + Math.sin(rad) * (petalR + 2);
        return (
          <g key={i}>
            <ellipse
              cx={px} cy={py}
              rx={n > 10 ? 5 : 6} ry={n > 10 ? 8 : 10}
              fill={petalCol}
              opacity={locked ? 0.3 : 0.85}
              transform={`rotate(${angle + 90} ${px} ${py})`}
            />
            {/* Petal vein */}
            {!locked && (
              <line
                x1={cx + Math.cos(rad) * 4} y1={cy + Math.sin(rad) * 4}
                x2={px} y2={py}
                stroke={centerCol} strokeWidth="0.5" opacity="0.15"
              />
            )}
          </g>
        );
      })}

      {/* Sprout (for start) */}
      {n === 0 && (
        <>
          <ellipse cx={cx - 5} cy={cy - 4} rx="6" ry="4" fill={petalCol} transform={`rotate(-30 ${cx - 5} ${cy - 4})`} />
          <ellipse cx={cx + 5} cy={cy - 4} rx="6" ry="4" fill={petalCol} transform={`rotate(30 ${cx + 5} ${cy - 4})`} />
        </>
      )}

      {/* Center */}
      <circle cx={cx} cy={cy} r={centerR} fill={`url(#fc-${flower.name})`} />
      {/* Center texture dots */}
      {!locked && n > 0 && (
        <>
          <circle cx={cx - 2} cy={cy - 2} r="1" fill="black" opacity="0.1" />
          <circle cx={cx + 2} cy={cy + 1} r="1" fill="black" opacity="0.1" />
          <circle cx={cx} cy={cy + 2} r="0.8" fill="black" opacity="0.08" />
        </>
      )}
      {/* Center shine */}
      <ellipse cx={cx - 1.5} cy={cy - 2} rx="2" ry="1.5" fill="white" opacity={locked ? 0.05 : 0.25} />

      {/* Checkmark */}
      {completed && (
        <>
          <circle cx={cx} cy={cy} r={centerR - 1} fill="#22c55e" opacity="0.85" />
          <path d={`M ${cx - 3} ${cy} L ${cx - 0.5} ${cy + 3} L ${cx + 4} ${cy - 3}`} stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

// ── Rocket Journey ───────────────────────────────────────────────

function RocketJourney({
  lessons, completedLessons, onSelect,
}: {
  lessons: Lesson[]; completedLessons: string[]; onSelect: (l: Lesson) => void;
}) {
  const currentIdx = lessons.findIndex((l) => !completedLessons.includes(l.id));
  const rocketAt = currentIdx === -1 ? lessons.length : currentIdx;

  return (
    <div className="relative mx-auto max-w-sm">
      <div className="mb-4 text-center">
        <p className="text-sm text-blue-300">Blast off from planet to planet!</p>
      </div>

      <div className="relative space-y-1">
        {lessons.map((lesson, i) => {
          const completed = completedLessons.includes(lesson.id);
          const isCurrent = i === rocketAt;
          const locked = i > rocketAt;
          const planet = PLANETS[i % PLANETS.length];

          return (
            <div key={lesson.id} className="relative flex items-center gap-3">
              {/* Connecting starfield line */}
              {i < lessons.length - 1 && (
                <div className="absolute left-[27px] top-[52px] flex flex-col items-center gap-1.5 z-0">
                  <div className={`h-1.5 w-1.5 rounded-full ${completed ? "bg-blue-400" : "bg-gray-700"}`} />
                  <div className={`h-1 w-1 rounded-full ${completed ? "bg-blue-300" : "bg-gray-800"}`} />
                  <div className={`h-1.5 w-1.5 rounded-full ${completed ? "bg-blue-400" : "bg-gray-700"}`} />
                </div>
              )}

              {/* Planet */}
              <button
                onClick={() => !locked && onSelect(lesson)}
                disabled={locked}
                className={`relative z-10 flex-shrink-0 cursor-pointer transition-all ${
                  locked ? "cursor-not-allowed" : "hover:scale-110"
                }`}
              >
                <PlanetSVG planet={planet} completed={completed} locked={locked} />

                {/* Rocket on current planet */}
                {isCurrent && (
                  <div className="absolute -top-5 -right-3 animate-float">
                    <svg width="30" height="36" viewBox="0 0 30 36">
                      {/* Rocket body */}
                      <path d="M 11 8 Q 15 0 19 8 L 21 22 L 9 22 Z" fill="#e8e8e8" />
                      <path d="M 12 8 Q 15 2 18 8 L 19 20 L 11 20 Z" fill="#f8f8f8" />
                      {/* Nose cone */}
                      <path d="M 11 8 Q 15 1 19 8" fill="#ef5350" />
                      {/* Window */}
                      <circle cx="15" cy="13" r="3.5" fill="#1565c0" />
                      <circle cx="15" cy="13" r="2.5" fill="#42a5f5" />
                      <ellipse cx="13.5" cy="11.5" rx="1" ry="0.8" fill="white" opacity="0.6" />
                      {/* Fins */}
                      <path d="M 9 18 L 4 25 L 10 22 Z" fill="#ef5350" />
                      <path d="M 21 18 L 26 25 L 20 22 Z" fill="#ef5350" />
                      {/* Fire */}
                      <ellipse cx="15" cy="27" rx="5" ry="7" fill="#ff9800" opacity="0.9" />
                      <ellipse cx="15" cy="28" rx="3" ry="5" fill="#ffeb3b" opacity="0.9" />
                      <ellipse cx="15" cy="29" rx="1.5" ry="3" fill="white" opacity="0.6" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Lesson info */}
              <button
                onClick={() => !locked && onSelect(lesson)}
                disabled={locked}
                className={`flex-1 rounded-xl border p-3 text-left transition-all ${
                  isCurrent
                    ? "animate-slide-up border-blue-400/50 bg-blue-900/20 hover:bg-blue-900/30"
                    : completed
                      ? "border-green-500/30 bg-green-900/10 hover:bg-green-900/20"
                      : locked
                        ? "cursor-not-allowed border-gray-800 bg-gray-900/30"
                        : "border-purple-mid/30 bg-gray-900 hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold text-sm ${locked ? "text-gray-600" : "text-white"}`}>
                      {lesson.title}
                    </p>
                    <p className={`text-xs ${locked ? "text-gray-700" : "text-white/40"}`}>
                      {lesson.concept}
                    </p>
                  </div>
                  {completed && <span className="text-green-400 text-xs font-bold">Done!</span>}
                  {isCurrent && <span className="text-blue-400 text-xs font-bold animate-pulse">GO!</span>}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Bee Journey ──────────────────────────────────────────────────

function BeeJourney({
  lessons, completedLessons, onSelect,
}: {
  lessons: Lesson[]; completedLessons: string[]; onSelect: (l: Lesson) => void;
}) {
  const currentIdx = lessons.findIndex((l) => !completedLessons.includes(l.id));
  const beeAt = currentIdx === -1 ? lessons.length : currentIdx;

  return (
    <div className="relative mx-auto max-w-sm">
      <div className="mb-4 text-center">
        <p className="text-sm text-yellow-300">Buzz from flower to flower!</p>
      </div>

      <div className="relative space-y-1">
        {lessons.map((lesson, i) => {
          const completed = completedLessons.includes(lesson.id);
          const isCurrent = i === beeAt;
          const locked = i > beeAt;
          const flower = FLOWERS[i % FLOWERS.length];

          return (
            <div key={lesson.id} className="relative flex items-center gap-3">
              {/* Connecting vine/path */}
              {i < lessons.length - 1 && (
                <div className="absolute left-[27px] top-[52px] z-0">
                  <svg width="6" height="20" viewBox="0 0 6 20">
                    <path d={`M 3 0 Q 0 7 3 10 Q 6 13 3 20`} stroke={completed ? "#66bb6a" : "#333"} strokeWidth="2" fill="none" />
                    {/* Tiny leaves on vine */}
                    {completed && (
                      <ellipse cx="5" cy="8" rx="3" ry="1.5" fill="#81c784" opacity="0.6" transform="rotate(30 5 8)" />
                    )}
                  </svg>
                </div>
              )}

              {/* Flower */}
              <button
                onClick={() => !locked && onSelect(lesson)}
                disabled={locked}
                className={`relative z-10 flex-shrink-0 cursor-pointer transition-all ${
                  locked ? "cursor-not-allowed" : "hover:scale-110"
                }`}
              >
                <FlowerSVG flower={flower} completed={completed} locked={locked} />

                {/* Bee on current flower */}
                {isCurrent && (
                  <div className="absolute -top-4 -right-4 animate-float">
                    <svg width="32" height="30" viewBox="0 0 32 30">
                      {/* Wings - translucent */}
                      <ellipse cx="8" cy="10" rx="8" ry="6" fill="#e3f2fd" opacity="0.6" />
                      <ellipse cx="8" cy="10" rx="6" ry="4" fill="#bbdefb" opacity="0.3" />
                      <ellipse cx="24" cy="10" rx="8" ry="6" fill="#e3f2fd" opacity="0.6" />
                      <ellipse cx="24" cy="10" rx="6" ry="4" fill="#bbdefb" opacity="0.3" />
                      {/* Body */}
                      <ellipse cx="16" cy="17" rx="8" ry="7" fill="#ffd54f" />
                      <ellipse cx="16" cy="17" rx="6" ry="5" fill="#ffe082" opacity="0.4" />
                      {/* Stripes */}
                      <rect x="10" y="14" width="12" height="2.5" rx="1" fill="#3e2723" opacity="0.8" />
                      <rect x="9" y="19" width="14" height="2.5" rx="1" fill="#3e2723" opacity="0.8" />
                      {/* Head */}
                      <circle cx="16" cy="8" r="6" fill="#ffd54f" />
                      <circle cx="16" cy="8" r="4.5" fill="#ffe082" opacity="0.3" />
                      {/* Eyes */}
                      <circle cx="13" cy="7" r="2" fill="#1a0e05" />
                      <circle cx="19" cy="7" r="2" fill="#1a0e05" />
                      <circle cx="12.5" cy="6" r="0.8" fill="white" opacity="0.9" />
                      <circle cx="18.5" cy="6" r="0.8" fill="white" opacity="0.9" />
                      {/* Smile */}
                      <path d="M 13 10 Q 16 13 19 10" stroke="#5d4037" strokeWidth="1" fill="none" strokeLinecap="round" />
                      {/* Blush */}
                      <ellipse cx="10" cy="9" rx="2" ry="1" fill="#ff8a80" opacity="0.3" />
                      <ellipse cx="22" cy="9" rx="2" ry="1" fill="#ff8a80" opacity="0.3" />
                      {/* Antennae */}
                      <line x1="13" y1="3" x2="9" y2="0" stroke="#5d4037" strokeWidth="1.2" />
                      <circle cx="9" cy="0" r="1.5" fill="#5d4037" />
                      <line x1="19" y1="3" x2="23" y2="0" stroke="#5d4037" strokeWidth="1.2" />
                      <circle cx="23" cy="0" r="1.5" fill="#5d4037" />
                      {/* Stinger */}
                      <path d="M 23 18 L 28 19 L 23 20" fill="#5d4037" opacity="0.6" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Lesson info */}
              <button
                onClick={() => !locked && onSelect(lesson)}
                disabled={locked}
                className={`flex-1 rounded-xl border p-3 text-left transition-all ${
                  isCurrent
                    ? "animate-slide-up border-yellow-400/50 bg-yellow-900/20 hover:bg-yellow-900/30"
                    : completed
                      ? "border-green-500/30 bg-green-900/10 hover:bg-green-900/20"
                      : locked
                        ? "cursor-not-allowed border-gray-800 bg-gray-900/30"
                        : "border-purple-mid/30 bg-gray-900 hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold text-sm ${locked ? "text-gray-600" : "text-white"}`}>
                      {lesson.title}
                    </p>
                    <p className={`text-xs ${locked ? "text-gray-700" : "text-white/40"}`}>
                      {lesson.concept}
                    </p>
                  </div>
                  {completed && <span className="text-green-400 text-xs font-bold">Done!</span>}
                  {isCurrent && <span className="text-yellow-400 text-xs font-bold animate-pulse">Buzz!</span>}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
