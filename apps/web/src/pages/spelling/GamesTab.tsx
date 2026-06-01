import { useState, useMemo } from "react";
import { getWordsForLevel, buildLessonsForLevel } from "./data";
import type { SpellingWord } from "./data";
import type { useSpellingStore } from "./useSpellingStore";
import SpellItOut from "./games/SpellItOut";
import WordScramble from "./games/WordScramble";
import MissingLetters from "./games/MissingLetters";

type Store = ReturnType<typeof useSpellingStore>;

export type GameLevel = 1 | 2 | 3;

const GAMES = [
  { id: "spell", name: "Spell It Out", emoji: "🔤", desc: "See the hint, spell the word!" },
  { id: "scramble", name: "Word Scramble", emoji: "🔀", desc: "Unscramble the mixed-up letters!" },
  { id: "missing", name: "Missing Letters", emoji: "✏️", desc: "Fill in the blanks!" },
] as const;

type GameId = (typeof GAMES)[number]["id"] | null;

const LEVEL_INFO: Record<GameLevel, { label: string; emoji: string; wordCount: number; desc: string }> = {
  1: { label: "Level 1", emoji: "🌱", wordCount: 4, desc: "Easy start - 4 words" },
  2: { label: "Level 2", emoji: "🌟", wordCount: 6, desc: "Getting harder - 6 words" },
  3: { label: "Level 3", emoji: "🔥", wordCount: 8, desc: "Super challenge - 8 words" },
};

export default function GamesTab({ store }: { store: Store }) {
  const [activeGame, setActiveGame] = useState<GameId>(null);
  const [gameLevel, setGameLevel] = useState<GameLevel | null>(null);

  // Pull words from completed lessons first, fall back to all words for their level
  const gameWords: SpellingWord[] = useMemo(() => {
    const level = store.state.assessedLevel ?? 1;
    const lessons = buildLessonsForLevel(level);
    const completed = lessons.filter((l) =>
      store.state.completedLessons.includes(l.id)
    );
    if (completed.length > 0) {
      return completed.flatMap((l) => l.words);
    }
    return getWordsForLevel(level);
  }, [store.state.completedLessons, store.state.assessedLevel]);

  // If a game is selected but no level yet, show level picker
  if (activeGame && !gameLevel) {
    return (
      <GameWrapper onBack={() => { setActiveGame(null); setGameLevel(null); }}>
        <LevelPicker
          gameName={GAMES.find((g) => g.id === activeGame)!.name}
          gameEmoji={GAMES.find((g) => g.id === activeGame)!.emoji}
          onPickLevel={setGameLevel}
        />
      </GameWrapper>
    );
  }

  const wordCount = gameLevel ? LEVEL_INFO[gameLevel].wordCount : 8;

  if (activeGame === "spell" && gameLevel)
    return (
      <GameWrapper onBack={() => { setActiveGame(null); setGameLevel(null); }}>
        <SpellItOut words={gameWords} store={store} wordCount={wordCount} level={gameLevel} />
      </GameWrapper>
    );
  if (activeGame === "scramble" && gameLevel)
    return (
      <GameWrapper onBack={() => { setActiveGame(null); setGameLevel(null); }}>
        <WordScramble words={gameWords} store={store} wordCount={wordCount} level={gameLevel} />
      </GameWrapper>
    );
  if (activeGame === "missing" && gameLevel)
    return (
      <GameWrapper onBack={() => { setActiveGame(null); setGameLevel(null); }}>
        <MissingLetters words={gameWords} store={store} wordCount={wordCount} level={gameLevel} />
      </GameWrapper>
    );

  return (
    <div>
      <h2 className="rainbow-sparkle mb-2 text-center text-2xl font-bold sm:text-3xl">
        Spelling Games
      </h2>
      <p className="mb-8 text-center text-white/60">
        Practice your Grade {store.state.assessedLevel} words with fun games!
      </p>
      <div className="grid gap-5 sm:grid-cols-3">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className="cursor-pointer rounded-2xl border-2 border-purple-mid/30 bg-gray-900 p-6 text-center transition-all hover:-translate-y-1 hover:border-purple-mid/60 hover:shadow-xl"
          >
            <span className="text-5xl">{game.emoji}</span>
            <h3 className="mt-3 text-lg font-bold text-white">{game.name}</h3>
            <p className="mt-1 text-sm text-white/60">{game.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Level Picker ─────────────────────────────────────────────────

function LevelPicker({
  gameName,
  gameEmoji,
  onPickLevel,
}: {
  gameName: string;
  gameEmoji: string;
  onPickLevel: (level: GameLevel) => void;
}) {
  return (
    <div>
      <h3 className="rainbow-sparkle mb-2 text-center text-2xl font-bold">
        {gameEmoji} {gameName}
      </h3>
      <p className="mb-8 text-center text-white/60">Pick your level!</p>

      <div className="grid gap-4 sm:grid-cols-3">
        {([1, 2, 3] as GameLevel[]).map((level) => {
          const info = LEVEL_INFO[level];
          return (
            <button
              key={level}
              onClick={() => onPickLevel(level)}
              className="cursor-pointer rounded-2xl border-2 border-purple-mid/30 bg-gray-900 p-6 text-center transition-all hover:-translate-y-1 hover:border-purple-mid/60 hover:shadow-xl"
            >
              <span className="text-5xl">{info.emoji}</span>
              <h4 className="mt-3 text-lg font-bold text-white">{info.label}</h4>
              <p className="mt-1 text-sm text-white/60">{info.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Game Wrapper ─────────────────────────────────────────────────

function GameWrapper({
  children,
  onBack,
}: {
  children: React.ReactNode;
  onBack: () => void;
}) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 cursor-pointer text-sm text-white/60 hover:text-white"
      >
        &larr; Back to Games
      </button>
      {children}
    </div>
  );
}
