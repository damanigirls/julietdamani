import { useState } from "react";
import SortGame from "./games/SortGame";
import UnscrambleGame from "./games/UnscrambleGame";
import MatchingGame from "./games/MatchingGame";

const GAMES = [
  { id: "sort", name: "Sort", emoji: "🔀", desc: "Sort coral reef facts into the right categories" },
  { id: "unscramble", name: "Unscramble", emoji: "🔤", desc: "Unscramble coral reef words" },
  { id: "matching", name: "Matching", emoji: "🃏", desc: "Match coral reef pairs together" },
] as const;

type GameId = (typeof GAMES)[number]["id"] | null;

export default function LearningTab() {
  const [activeGame, setActiveGame] = useState<GameId>(null);

  if (activeGame === "sort") return <GameWrapper onBack={() => setActiveGame(null)}><SortGame /></GameWrapper>;
  if (activeGame === "unscramble") return <GameWrapper onBack={() => setActiveGame(null)}><UnscrambleGame /></GameWrapper>;
  if (activeGame === "matching") return <GameWrapper onBack={() => setActiveGame(null)}><MatchingGame /></GameWrapper>;

  return (
    <div>
      <h2 className="rainbow-sparkle mb-2 text-center text-2xl font-bold sm:text-3xl">
        Learning Station
      </h2>
      <p className="mb-8 text-center text-white/60">
        Pick a learning tool to explore coral reefs!
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

function GameWrapper({ children, onBack }: { children: React.ReactNode; onBack: () => void }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 cursor-pointer text-sm text-white/60 hover:text-white"
      >
        &larr; Back to Learning Station
      </button>
      {children}
    </div>
  );
}
