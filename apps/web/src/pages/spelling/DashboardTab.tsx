import { useState, useEffect } from "react";
import { loadFamily, switchProfile, type DashboardUser } from "./useSpellingStore";
import type { useSpellingStore } from "./useSpellingStore";
import CuteCharacter from "./CuteCharacter";

type Store = ReturnType<typeof useSpellingStore>;

export default function DashboardTab({ store }: { store: Store }) {
  const [family, setFamily] = useState<DashboardUser[]>([]);
  const [showProfilePicker, setShowProfilePicker] = useState(false);

  useEffect(() => {
    setFamily(loadFamily());
  }, []);

  const sorted = [...family].sort((a, b) => b.totalStarsEarned - a.totalStarsEarned);

  // ── Profile Picker ─────────────────────────────────────────────

  if (showProfilePicker) {
    return (
      <div>
        <button onClick={() => setShowProfilePicker(false)} className="mb-4 cursor-pointer text-sm text-white/60 hover:text-white">
          ← Back to Dashboard
        </button>
        <h2 className="rainbow-sparkle mb-2 text-center text-2xl font-bold">Change Profile</h2>
        <p className="mb-6 text-center text-white/60">Pick who's playing!</p>

        <div className="space-y-3">
          {family.map((user) => {
            const isMe = user.name === store.state.name;
            return (
              <button
                key={user.name}
                onClick={() => {
                  if (isMe) { setShowProfilePicker(false); return; }
                  switchProfile(store.state.name, user.name);
                  window.location.reload();
                }}
                className={`hover-bounce w-full cursor-pointer rounded-2xl border-2 p-4 text-left transition ${
                  isMe
                    ? "border-yellow-500/50 bg-yellow-900/10"
                    : "border-purple-mid/30 bg-gray-900 hover:border-purple-mid"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{user.gender === "girl" ? "👧" : "👦"}</span>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-white">
                      {user.name}
                      {isMe && <span className="ml-2 text-xs text-yellow-300">(Playing now)</span>}
                    </p>
                    <p className="text-sm text-white/50">
                      Grade {user.assessedLevel} · ⭐ {user.totalStarsEarned} stars
                    </p>
                  </div>
                  {!isMe && <span className="text-purple-light text-sm font-bold">Switch →</span>}
                </div>
              </button>
            );
          })}

          {/* Add new profile */}
          {family.length < 8 && (
            <button
              onClick={() => {
                switchProfile(store.state.name, "");
                window.location.reload();
              }}
              className="hover-bounce w-full cursor-pointer rounded-2xl border-2 border-dashed border-purple-mid/30 bg-gray-900/50 p-4 text-center transition hover:border-purple-mid"
            >
              <span className="text-3xl">➕</span>
              <p className="mt-1 font-bold text-white/60">Add New Family Member</p>
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Main Dashboard ─────────────────────────────────────────────

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="rainbow-sparkle text-2xl font-bold sm:text-3xl">Family Dashboard</h2>
        <div className="flex gap-2">
          {family.length < 8 && (
            <button
              onClick={() => {
                switchProfile(store.state.name, "");
                window.location.reload();
              }}
              className="hover-bounce cursor-pointer rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-500"
            >
              + Add Member
            </button>
          )}
          <button
            onClick={() => setShowProfilePicker(true)}
            className="hover-bounce cursor-pointer rounded-full bg-purple-mid px-4 py-2 text-sm font-bold text-white transition hover:bg-purple-dark"
          >
            👥 Change Profile
          </button>
        </div>
      </div>
      <p className="mb-6 text-center text-white/60">
        Your family's spelling superstars! ({family.length}/8 members)
      </p>

      {/* Current player stats */}
      <div className="animate-slide-up mb-8 rounded-2xl border-2 border-purple-mid/40 bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-5">
        <div className="mb-3 flex items-center justify-center gap-3">
          <div className="flex-shrink-0">
            <CuteCharacter equippedItems={store.state.equippedItems} size="tiny" />
          </div>
          <h3 className="text-lg font-bold text-purple-light">{store.state.name}'s Stats</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard emoji="⭐" label="Stars" value={store.state.totalStarsEarned} />
          <StatCard emoji="📚" label="Lessons" value={store.state.completedLessons.length} />
          <StatCard emoji="🎮" label="Games" value={store.state.gamesPlayed} />
          <StatCard emoji="⚔️" label="Battles Won" value={store.state.battleWins} />
        </div>
        {store.state.bonusPoints > 0 && (
          <div className="mt-3 text-center">
            <span className="rounded-full bg-pink-900/30 px-3 py-1 text-xs font-bold text-pink-300">
              🎁 {store.state.bonusPoints} Bonus Points
            </span>
          </div>
        )}
      </div>

      {/* Family Leaderboard */}
      {sorted.length > 0 && (
        <div className="space-y-3">
          <h3 className="mb-4 text-center text-lg font-bold text-white">🏅 Family Leaderboard</h3>
          {sorted.map((user, i) => {
            const isMe = user.name === store.state.name;
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
            return (
              <div
                key={user.name}
                className={`animate-slide-up flex items-center gap-4 rounded-2xl border-2 p-4 transition hover:-translate-y-0.5 ${
                  isMe ? "border-yellow-500/50 bg-yellow-900/10" : "border-purple-mid/20 bg-gray-900"
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-8 text-center text-xl font-bold">
                  {typeof medal === "string" && medal.startsWith("#") ? (
                    <span className="text-white/40 text-sm">{medal}</span>
                  ) : <span>{medal}</span>}
                </div>
                <div className="flex-shrink-0">
                  <CuteCharacter equippedItems={user.equippedItems} size="tiny" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">
                    {user.name}
                    {isMe && <span className="ml-2 text-xs text-yellow-300">(You!)</span>}
                  </p>
                  <p className="text-sm text-white/50">
                    {user.completedLessons} lessons · {user.gamesPlayed} games · {user.battleWins} wins
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-300">⭐ {user.totalStarsEarned}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ emoji, label, value }: { emoji: string; label: string; value: number }) {
  return (
    <div className="hover-bounce cursor-default rounded-xl bg-gray-900/60 border border-purple-mid/20 p-3 text-center">
      <span className="text-2xl">{emoji}</span>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/50">{label}</p>
    </div>
  );
}
