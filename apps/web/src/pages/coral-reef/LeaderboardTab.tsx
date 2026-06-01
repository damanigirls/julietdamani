import { useEffect, useState } from "react";

type Entry = {
  name: string;
  score: number;
  date: string;
};

const MEDALS = ["🥇", "🥈", "🥉"];
const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

export default function LeaderboardTab() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("coral-leaderboard") || "[]");
    setEntries(stored.slice(0, 10));
  }, []);

  function clearLeaderboard() {
    localStorage.removeItem("coral-leaderboard");
    setEntries([]);
  }

  return (
    <div>
      <h2 className="rainbow-sparkle mb-2 text-center text-2xl font-bold sm:text-3xl">
        Leaderboard
      </h2>
      <p className="mb-8 text-center text-white/60">Top 10 coral reef quiz champions!</p>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="text-6xl">🏆</span>
          <p className="mt-4 text-lg text-white/60">No scores yet!</p>
          <p className="mt-1 text-sm text-white/40">
            Take the quiz to get on the leaderboard.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-purple-mid/30">
            {/* Header */}
            <div className="grid grid-cols-[60px_1fr_80px] gap-2 bg-purple-dark/20 px-4 py-3 text-sm font-semibold text-purple-light">
              <span>Rank</span>
              <span>Name</span>
              <span className="text-right">Score</span>
            </div>

            {/* Rows - always show 10 slots */}
            {Array.from({ length: 10 }).map((_, i) => {
              const entry = entries[i];
              const isTop3 = i < 3;
              return (
                <div
                  key={i}
                  className={`grid grid-cols-[60px_1fr_80px] gap-2 border-t border-white/5 px-4 py-3 ${
                    isTop3 ? "bg-gray-900/80" : "bg-gray-900/40"
                  }`}
                >
                  <span className="flex items-center gap-1 text-sm font-bold">
                    {i < 3 ? (
                      <span className="text-lg">{MEDALS[i]}</span>
                    ) : (
                      <span className="text-white/50">{ORDINALS[i]}</span>
                    )}
                  </span>
                  <span className={`text-sm ${entry ? "text-white" : "text-white/20"}`}>
                    {entry ? entry.name : "---"}
                  </span>
                  <span
                    className={`text-right text-sm font-bold ${
                      isTop3 && entry ? "text-yellow-400" : entry ? "text-white" : "text-white/20"
                    }`}
                  >
                    {entry ? `${entry.score}/10` : "-"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={clearLeaderboard}
              className="cursor-pointer text-sm text-white/30 hover:text-red-400"
            >
              Clear Leaderboard
            </button>
          </div>
        </>
      )}
    </div>
  );
}
