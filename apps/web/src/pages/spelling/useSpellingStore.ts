import { useState, useEffect, useRef } from "react";
import type { AvatarPart, Grade, Gender, InventoryEntry } from "./data";

export type JourneyType = "rocket" | "bee";

type SpellingState = {
  // Profile
  name: string;
  age: number | null;
  grade: Grade | null;
  gender: Gender | null;
  assessedLevel: Grade | null;
  quizCompleted: boolean;
  quizScore: number;
  levelsCompleted: number; // track levels for re-quiz every 3
  journeyType: JourneyType | null; // rocket or bee journey

  // Progress
  stars: number;
  totalStarsEarned: number;
  completedLessons: string[];
  lessonHighScores: Record<string, number>;
  gamesPlayed: number;
  bonusPoints: number;

  // Character
  ownedItems: string[];
  equippedItems: Record<AvatarPart, string | null>;
  characterName: string;

  // Inventory (history)
  inventory: InventoryEntry[];

  // Battle
  battleWins: number;
  battleLosses: number;

  // Time tracking
  spellingStartTime: number | null; // timestamp when started spelling
  minuteStarsEarned: number; // stars earned from time
};

// Dashboard entry for each family member
export type DashboardUser = {
  name: string;
  gender: Gender;
  grade: Grade;
  assessedLevel: Grade;
  totalStarsEarned: number;
  completedLessons: number;
  gamesPlayed: number;
  battleWins: number;
  equippedItems: Record<AvatarPart, string | null>;
  lastPlayed: string;
};

const STORAGE_KEY = "spelling-app-state";
const DASHBOARD_KEY = "spelling-app-family";
const MAX_FAMILY = 8;

const DEFAULT_STATE: SpellingState = {
  name: "",
  age: null,
  grade: null,
  gender: null,
  assessedLevel: null,
  quizCompleted: false,
  quizScore: 0,
  levelsCompleted: 0,
  journeyType: null,
  stars: 0,
  totalStarsEarned: 0,
  completedLessons: [],
  lessonHighScores: {},
  gamesPlayed: 0,
  bonusPoints: 0,
  ownedItems: [],
  equippedItems: { hat: null, face: null, shirt: null, accessory: null },
  characterName: "My Character",
  inventory: [],
  battleWins: 0,
  battleLosses: 0,
  spellingStartTime: null,
  minuteStarsEarned: 0,
};

function loadState(): SpellingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_STATE;
}

export function loadFamily(): DashboardUser[] {
  try {
    const raw = localStorage.getItem(DASHBOARD_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

// Save current profile by name so we can switch
export function saveProfileByName(name: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) localStorage.setItem(`spelling-profile-${name}`, raw);
  } catch { /* ignore */ }
}

// Load a saved profile by name
export function loadProfileByName(name: string): SpellingState | null {
  try {
    const raw = localStorage.getItem(`spelling-profile-${name}`);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return null;
}

// Switch to a different profile
export function switchProfile(fromName: string, toName: string) {
  // Save current profile
  if (fromName) saveProfileByName(fromName);
  // Load target profile
  const target = loadProfileByName(toName);
  if (target) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(target));
  } else {
    // New profile - clear state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
  }
}

export function canAddFamilyMember(): boolean {
  return loadFamily().length < MAX_FAMILY;
}

function saveToFamily(state: SpellingState) {
  if (!state.name || !state.assessedLevel || !state.grade || !state.gender) return;
  const users = loadFamily();
  const existing = users.findIndex((u) => u.name === state.name);
  const entry: DashboardUser = {
    name: state.name,
    gender: state.gender,
    grade: state.grade,
    assessedLevel: state.assessedLevel,
    totalStarsEarned: state.totalStarsEarned,
    completedLessons: state.completedLessons.length,
    gamesPlayed: state.gamesPlayed,
    battleWins: state.battleWins,
    equippedItems: state.equippedItems,
    lastPlayed: new Date().toISOString(),
  };
  if (existing >= 0) {
    users[existing] = entry;
  } else if (users.length < MAX_FAMILY) {
    users.push(entry);
  }
  localStorage.setItem(DASHBOARD_KEY, JSON.stringify(users));
}

export function useSpellingStore() {
  const [state, setState] = useState<SpellingState>(loadState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (state.quizCompleted) {
      saveToFamily(state);
      if (state.name) saveProfileByName(state.name);
    }
  }, [state]);

  // 10-minute spelling timer
  useEffect(() => {
    if (state.spellingStartTime && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setState((s) => {
          if (!s.spellingStartTime) return s;
          const elapsed = Date.now() - s.spellingStartTime;
          const minutesOfStars = Math.floor(elapsed / (10 * 60 * 1000));
          if (minutesOfStars > s.minuteStarsEarned) {
            return {
              ...s,
              stars: s.stars + 1,
              totalStarsEarned: s.totalStarsEarned + 1,
              minuteStarsEarned: minutesOfStars,
            };
          }
          return s;
        });
      }, 30000); // check every 30 seconds
    }
    return () => {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };
  }, [state.spellingStartTime]);

  // ── Profile ──────────────────────────────────────────────────────

  function setProfile(name: string, age: number, grade: Grade, gender: Gender) {
    setState((s) => ({
      ...s, name, age, grade, gender, characterName: name,
      spellingStartTime: Date.now(),
    }));
  }

  function setStarterAvatar(hat: string, face: string, shirt: string, accessory: string) {
    setState((s) => ({
      ...s,
      equippedItems: { hat, face, shirt, accessory },
    }));
  }

  function setJourneyType(type: JourneyType) {
    setState((s) => ({ ...s, journeyType: type }));
  }

  function completeQuiz(score: number, assessedLevel: Grade) {
    setState((s) => ({
      ...s, quizCompleted: true, quizScore: score, assessedLevel,
    }));
  }

  function resetProfile() {
    setState(DEFAULT_STATE);
  }

  // ── Stars ────────────────────────────────────────────────────────

  function earnStars(n: number) {
    setState((s) => ({
      ...s, stars: s.stars + n, totalStarsEarned: s.totalStarsEarned + n,
    }));
  }

  function spendStars(n: number): boolean {
    if (state.stars < n) return false;
    setState((s) => ({ ...s, stars: s.stars - n }));
    return true;
  }

  function addBonusPoints(n: number) {
    setState((s) => ({ ...s, bonusPoints: s.bonusPoints + n }));
  }

  // ── Lessons ──────────────────────────────────────────────────────

  function completeLesson(lessonId: string, score: number) {
    setState((s) => {
      const isNew = !s.completedLessons.includes(lessonId);
      const completed = isNew ? [...s.completedLessons, lessonId] : s.completedLessons;
      const highScores = {
        ...s.lessonHighScores,
        [lessonId]: Math.max(s.lessonHighScores[lessonId] ?? 0, score),
      };
      return {
        ...s,
        completedLessons: completed,
        lessonHighScores: highScores,
        levelsCompleted: isNew ? s.levelsCompleted + 1 : s.levelsCompleted,
      };
    });
  }

  // ── Games ────────────────────────────────────────────────────────

  function addGamePlayed() {
    setState((s) => ({ ...s, gamesPlayed: s.gamesPlayed + 1 }));
  }

  // ── Inventory ────────────────────────────────────────────────────

  function addInventoryEntry(entry: InventoryEntry) {
    setState((s) => ({
      ...s,
      inventory: [entry, ...s.inventory].slice(0, 50), // keep last 50
    }));
  }

  // ── Battle ───────────────────────────────────────────────────────

  function recordBattle(won: boolean) {
    setState((s) => ({
      ...s,
      battleWins: won ? s.battleWins + 1 : s.battleWins,
      battleLosses: won ? s.battleLosses : s.battleLosses + 1,
    }));
  }

  // ── Shop / Avatar ────────────────────────────────────────────────

  function buyItem(itemId: string, price: number): boolean {
    if (state.stars < price || state.ownedItems.includes(itemId)) return false;
    setState((s) => ({
      ...s, stars: s.stars - price, ownedItems: [...s.ownedItems, itemId],
    }));
    return true;
  }

  function returnItem(itemId: string, price: number): boolean {
    if (!state.ownedItems.includes(itemId)) return false;
    setState((s) => {
      // Unequip if currently wearing
      const newEquipped = { ...s.equippedItems };
      for (const part of Object.keys(newEquipped) as AvatarPart[]) {
        if (newEquipped[part] === itemId) newEquipped[part] = null;
      }
      return {
        ...s,
        stars: s.stars + price,
        ownedItems: s.ownedItems.filter((id) => id !== itemId),
        equippedItems: newEquipped,
      };
    });
    return true;
  }

  function equipItem(part: AvatarPart, itemId: string | null) {
    setState((s) => ({
      ...s, equippedItems: { ...s.equippedItems, [part]: itemId },
    }));
  }

  function setCharacterName(name: string) {
    setState((s) => ({ ...s, characterName: name }));
  }

  // ── Re-quiz check ───────────────────────────────────────────────

  function needsReQuiz(): boolean {
    return state.levelsCompleted > 0 && state.levelsCompleted % 3 === 0;
  }

  return {
    state,
    setProfile,
    setStarterAvatar,
    setJourneyType,
    completeQuiz,
    resetProfile,
    earnStars,
    spendStars,
    addBonusPoints,
    completeLesson,
    addGamePlayed,
    addInventoryEntry,
    recordBattle,
    buyItem,
    returnItem,
    equipItem,
    setCharacterName,
    needsReQuiz,
  };
}
