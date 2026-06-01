import type { useSpellingStore } from "./useSpellingStore";

type Store = ReturnType<typeof useSpellingStore>;

const TYPE_EMOJI: Record<string, string> = {
  lesson: "📚",
  game: "🎮",
  quiz: "📝",
  battle: "⚔️",
};

const TYPE_COLORS: Record<string, string> = {
  lesson: "bg-green-900/30 border-green-500/30 text-green-400",
  game: "bg-blue-900/30 border-blue-500/30 text-blue-400",
  quiz: "bg-purple-900/30 border-purple-500/30 text-purple-400",
  battle: "bg-red-900/30 border-red-500/30 text-red-400",
};

export default function InventoryTab({ store }: { store: Store }) {
  const { inventory } = store.state;

  return (
    <div>
      <h2 className="rainbow-sparkle mb-2 text-center text-2xl font-bold sm:text-3xl">
        Inventory
      </h2>
      <p className="mb-6 text-center text-white/60">
        Everything you've done in Spelling Adventure!
      </p>

      {/* Summary stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat emoji="⭐" value={store.state.totalStarsEarned} label="Total Stars" />
        <MiniStat emoji="📚" value={store.state.completedLessons.length} label="Lessons" />
        <MiniStat emoji="🎮" value={store.state.gamesPlayed} label="Games" />
        <MiniStat emoji="⚔️" value={store.state.battleWins} label="Battle Wins" />
      </div>

      {/* Bonus points */}
      {store.state.bonusPoints > 0 && (
        <div className="mb-6 text-center">
          <span className="animate-heart-beat inline-flex items-center gap-2 rounded-full bg-pink-900/30 px-5 py-2 text-sm font-bold text-pink-300">
            🎁 {store.state.bonusPoints} Bonus Points Earned!
          </span>
        </div>
      )}

      {/* History */}
      {inventory.length > 0 ? (
        <div className="space-y-3">
          {inventory.map((entry, i) => {
            const dateStr = new Date(entry.date).toLocaleDateString();
            return (
              <div
                key={i}
                className={`animate-slide-up flex items-center gap-4 rounded-2xl border p-4 ${TYPE_COLORS[entry.type]}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="text-3xl">{TYPE_EMOJI[entry.type]}</span>
                <div className="flex-1">
                  <p className="font-bold text-white">{entry.title}</p>
                  <p className="text-sm text-white/50">
                    Score: {entry.score}/{entry.total} · {dateStr}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-300">+{entry.starsEarned} ⭐</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center">
          <span className="text-6xl">📦</span>
          <p className="mt-4 text-lg text-white/60">
            Your inventory is empty! Complete a lesson or game to see it here.
          </p>
        </div>
      )}
    </div>
  );
}

function MiniStat({ emoji, value, label }: { emoji: string; value: number; label: string }) {
  return (
    <div className="hover-bounce rounded-xl bg-gray-900/60 border border-purple-mid/20 p-3 text-center cursor-default">
      <span className="text-2xl">{emoji}</span>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/50">{label}</p>
    </div>
  );
}
