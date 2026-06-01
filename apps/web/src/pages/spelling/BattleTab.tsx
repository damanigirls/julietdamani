import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { getWordsForLevel } from "./data";
import type { SpellingWord, Grade } from "./data";
import type { useSpellingStore } from "./useSpellingStore";
import CuteCharacter from "./CuteCharacter";

type Store = ReturnType<typeof useSpellingStore>;
type BattleState = "menu" | "searching" | "pick-level" | "playing" | "result";
type GameLevel = 1 | 2 | 3;

const LEVEL_INFO: Record<GameLevel, { label: string; words: number; desc: string }> = {
  1: { label: "Level 1", words: 3, desc: "Quick match - 3 words" },
  2: { label: "Level 2", words: 5, desc: "Standard - 5 words" },
  3: { label: "Level 3", words: 7, desc: "Epic battle - 7 words" },
};

// Random names for worldwide opponents
const WORLD_NAMES = [
  "Mia", "Noah", "Olivia", "Liam", "Emma", "Aiden", "Sophia", "Lucas",
  "Isabella", "Ethan", "Ava", "James", "Luna", "Benjamin", "Chloe",
  "Leo", "Aria", "Jack", "Ella", "Henry", "Zoe", "Owen", "Lily",
  "Alexander", "Grace", "Sebastian", "Nora", "Mateo", "Riley", "Daniel",
  "Layla", "Harper", "Elijah", "Amelia", "Jackson", "Penelope", "Logan",
  "Camila", "Kai", "Sakura", "Yuki", "Ravi", "Priya", "Chen", "Mei",
  "Omar", "Fatima", "Pablo", "Sofia", "Luca", "Emilia", "Finn", "Isla",
];

const WORLD_COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "Japan",
  "France", "Germany", "Brazil", "India", "Mexico", "South Korea",
  "Spain", "Italy", "Nigeria", "Kenya", "Egypt", "New Zealand",
  "Sweden", "Norway", "Ireland", "Philippines", "Colombia", "Argentina",
];

type WorldOpponent = {
  name: string;
  country: string;
  grade: Grade;
  wins: number;
  hatColor: string;
};

function generateOpponent(myGrade: Grade): WorldOpponent {
  const name = WORLD_NAMES[Math.floor(Math.random() * WORLD_NAMES.length)];
  const country = WORLD_COUNTRIES[Math.floor(Math.random() * WORLD_COUNTRIES.length)];
  const wins = Math.floor(Math.random() * 20);
  const hats = ["🎀", "🌻", "🦋", "🧢", "👑", "🪄"];
  const hatColor = hats[Math.floor(Math.random() * hats.length)];
  return { name, country, grade: myGrade, wins, hatColor };
}

function shuffleLetters(word: string): string[] {
  const letters = word.split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters;
}

export default function BattleTab({ store }: { store: Store }) {
  const [battleState, setBattleState] = useState<BattleState>("menu");
  const [opponent, setOpponent] = useState<WorldOpponent | null>(null);
  const [level, setLevel] = useState<GameLevel | null>(null);
  const [battleWords, setBattleWords] = useState<SpellingWord[]>([]);
  const [current, setCurrent] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const [searchDots, setSearchDots] = useState("");

  // Searching animation
  useEffect(() => {
    if (battleState !== "searching") return;
    const interval = setInterval(() => {
      setSearchDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    // Find opponent after 2 seconds
    const timeout = setTimeout(() => {
      const opp = generateOpponent(store.state.assessedLevel ?? (1 as Grade));
      setOpponent(opp);
      setBattleState("pick-level");
    }, 2000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [battleState, store.state.assessedLevel]);

  // ── Menu ───────────────────────────────────────────────────────

  if (battleState === "menu") {
    return (
      <div>
        <h2 className="rainbow-sparkle mb-2 text-center text-2xl font-bold sm:text-3xl">
          Battle Mode
        </h2>
        <p className="mb-6 text-center text-white/60">
          Battle spellers from around the world!
        </p>

        {/* Battle record */}
        <div className="mb-8 flex justify-center gap-4">
          <div className="rounded-2xl bg-green-900/20 border border-green-500/30 px-5 py-3 text-center">
            <p className="text-2xl font-bold text-green-400">{store.state.battleWins}</p>
            <p className="text-xs text-green-400/60">Wins</p>
          </div>
          <div className="rounded-2xl bg-red-900/20 border border-red-500/30 px-5 py-3 text-center">
            <p className="text-2xl font-bold text-red-400">{store.state.battleLosses}</p>
            <p className="text-xs text-red-400/60">Losses</p>
          </div>
        </div>

        {/* Your character */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl border-2 border-purple-mid/30 bg-gray-900/60 p-6 text-center">
            <CuteCharacter equippedItems={store.state.equippedItems} size="small" />
            <p className="mt-2 font-bold text-white">{store.state.name}</p>
            <p className="text-xs text-white/50">Grade {store.state.assessedLevel}</p>
          </div>
        </div>

        {/* Find opponent button */}
        <div className="text-center">
          <button
            onClick={() => setBattleState("searching")}
            className="hover-bounce cursor-pointer rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-10 py-4 text-xl font-bold text-white shadow-lg shadow-red-500/20 transition hover:shadow-xl hover:shadow-red-500/30"
          >
            Find Opponent!
          </button>
          <p className="mt-3 text-xs text-white/40">
            You'll be matched with someone at your spelling level
          </p>
        </div>
      </div>
    );
  }

  // ── Searching ──────────────────────────────────────────────────

  if (battleState === "searching") {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="animate-float mb-6">
          <CuteCharacter equippedItems={store.state.equippedItems} size="small" />
        </div>
        <h3 className="rainbow-sparkle text-2xl font-bold">
          Searching for opponent{searchDots}
        </h3>
        <p className="mt-2 text-white/60">
          Looking for a Grade {store.state.assessedLevel} speller...
        </p>
        <div className="mt-6 h-2 w-48 overflow-hidden rounded-full bg-gray-800">
          <div className="h-full animate-pulse rounded-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: "60%" }} />
        </div>
      </div>
    );
  }

  // ── Pick Level ─────────────────────────────────────────────────

  if (battleState === "pick-level" && opponent) {
    return (
      <div>
        <button onClick={() => { setBattleState("menu"); setOpponent(null); }}
          className="mb-4 cursor-pointer text-sm text-white/60 hover:text-white">
          ← Back
        </button>

        <h3 className="rainbow-sparkle mb-2 text-center text-2xl font-bold">Opponent Found!</h3>

        {/* VS display */}
        <div className="mb-8 flex items-center justify-center gap-6">
          {/* You */}
          <div className="text-center">
            <CuteCharacter equippedItems={store.state.equippedItems} size="small" />
            <p className="mt-1 font-bold text-white">{store.state.name}</p>
            <p className="text-xs text-white/50">You</p>
          </div>

          <div className="text-3xl font-black text-red-400">VS</div>

          {/* Opponent */}
          <div className="text-center">
            <CuteCharacter
              equippedItems={{ hat: opponent.hatColor, face: "😊", shirt: null, accessory: null }}
              size="small"
            />
            <p className="mt-1 font-bold text-white">{opponent.name}</p>
            <p className="text-xs text-white/50">{opponent.country}</p>
          </div>
        </div>

        <p className="mb-6 text-center text-white/60">Pick the battle level!</p>

        <div className="grid gap-4 sm:grid-cols-3">
          {([1, 2, 3] as GameLevel[]).map((lv) => {
            const info = LEVEL_INFO[lv];
            return (
              <button
                key={lv}
                onClick={() => {
                  setLevel(lv);
                  const allWords = getWordsForLevel(store.state.assessedLevel ?? (1 as Grade));
                  const shuffled = [...allWords].sort(() => Math.random() - 0.5);
                  const words = shuffled.slice(0, info.words);
                  setBattleWords(words);
                  setAvailableLetters(shuffleLetters(words[0].word));
                  setBattleState("playing");
                }}
                className="hover-bounce cursor-pointer rounded-2xl border-2 border-red-500/30 bg-gray-900 p-6 text-center transition-all hover:-translate-y-1 hover:border-red-500/60"
              >
                <p className="text-2xl font-black text-white">{info.label}</p>
                <p className="mt-1 text-sm text-white/60">{info.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Battle Playing ─────────────────────────────────────────────

  if (battleState === "playing" && opponent) {
    const word = battleWords[current];
    const total = battleWords.length;

    function handleLetterClick(letter: string, idx: number) {
      if (feedback) return;
      const newGuess = guess + letter;
      setGuess(newGuess);
      const newAvail = [...availableLetters];
      newAvail.splice(idx, 1);
      setAvailableLetters(newAvail);

      if (newGuess.length === word.word.length) {
        if (newGuess.toUpperCase() === word.word) {
          setFeedback("correct");
          setMyScore((s) => s + 1);
          setTimeout(goNextBattle, 1000);
        } else {
          setFeedback("wrong");
          setTimeout(goNextBattle, 1500);
        }
      }
    }


    function goNextBattle() {
      if (current < total - 1) {
        const nextWord = battleWords[current + 1];
        setCurrent((c) => c + 1);
        setGuess("");
        setFeedback(null);
        setAvailableLetters(shuffleLetters(nextWord.word));
      } else {
        // Battle over! Simulate opponent score based on level
        const difficulty = level === 1 ? 0.5 : level === 2 ? 0.6 : 0.7;
        const oppScore = battleWords.filter(() => Math.random() < difficulty).length;
        setOpponentScore(oppScore);
        const finalMyScore = myScore + (feedback === "correct" ? 1 : 0);
        const iWon = finalMyScore > oppScore || (finalMyScore === oppScore && Math.random() > 0.5);
        setWon(iWon);
        store.recordBattle(iWon);
        if (iWon) {
          store.earnStars(3);
          confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
        }
        store.addInventoryEntry({
          type: "battle",
          title: `Battle vs ${opponent.name} (${opponent.country})`,
          score: finalMyScore,
          total,
          starsEarned: iWon ? 3 : 0,
          date: new Date().toISOString(),
        });
        store.addGamePlayed();
        setBattleState("result");
      }
    }

    return (
      <div>
        {/* VS header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-center">
            <p className="text-sm font-bold text-white">{store.state.name}</p>
            <p className="text-lg font-black text-green-400">{myScore}</p>
          </div>
          <div className="text-xl font-black text-red-400">VS</div>
          <div className="text-center">
            <p className="text-sm font-bold text-white">{opponent.name}</p>
            <p className="text-lg font-black text-white/50">?</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3 flex items-center justify-between text-sm text-white/50">
          <span>Word {current + 1} of {total}</span>
          <span>Level {level}</span>
        </div>
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>

        {/* Sentence */}
        <div className="mb-4 rounded-xl border border-red-500/20 bg-gray-900/80 p-4 text-center">
          <p className="text-lg text-white/80">
            {word.sentence.replace("___", "_ ".repeat(word.word.length).trim())}
          </p>
        </div>

        {/* Answer tiles */}
        <div className="mb-4 flex justify-center">
          <div className="flex flex-wrap justify-center gap-2">
            {word.word.split("").map((letter, i) => {
              const typed = guess.toUpperCase()[i];
              return (
                <span
                  key={i}
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-xl font-bold transition ${
                    typed
                      ? feedback === "correct"
                        ? "animate-pop border-green-500 bg-green-900/30 text-green-400"
                        : feedback === "wrong"
                          ? "border-red-500 bg-red-900/30 text-red-400"
                          : "border-orange-500 bg-orange-900/20 text-orange-300"
                      : "border-red-500/30 bg-gray-900 text-white/20"
                  }`}
                >
                  {typed || "_"}
                </span>
              );
            })}
          </div>
        </div>

        {/* Letter buttons */}
        {!feedback && (
          <div className="mb-3 flex flex-wrap justify-center gap-2">
            {availableLetters.map((letter, i) => (
              <button
                key={`${letter}-${i}`}
                onClick={() => handleLetterClick(letter, i)}
                className="hover-bounce flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border-2 border-red-500/40 bg-gray-900 text-xl font-bold text-white transition hover:border-red-500 hover:bg-red-900/20 hover:scale-110"
              >
                {letter}
              </button>
            ))}
          </div>
        )}


        {feedback === "correct" && (
          <p className="animate-bounce-in text-center text-lg font-bold text-green-400">Got it!</p>
        )}
        {feedback === "wrong" && (
          <p className="animate-bounce-in text-center text-lg font-bold text-orange-400">
            It was: <span className="text-white">{word.word}</span>
          </p>
        )}
      </div>
    );
  }

  // ── Result ─────────────────────────────────────────────────────

  function resetBattle() {
    setBattleState("menu");
    setOpponent(null);
    setLevel(null);
    setCurrent(0);
    setMyScore(0);
    setOpponentScore(0);
    setGuess("");
    setFeedback(null);
    setWon(null);
  }

  return (
    <div className="flex flex-col items-center py-8 text-center">
      {won ? (
        <>
          <div className="animate-bounce-in mb-4">
            <CuteCharacter equippedItems={store.state.equippedItems} size="small" />
          </div>
          <h3 className="rainbow-sparkle text-3xl font-bold">You Win!</h3>
          <p className="mt-2 text-lg text-white">
            You beat <span className="font-bold">{opponent?.name}</span> from {opponent?.country}!
          </p>
          <p className="mt-1 text-white/60">
            {myScore} - {opponentScore}
          </p>
          <p className="mt-2 text-xl font-bold text-yellow-300">+3 stars earned!</p>
        </>
      ) : (
        <>
          <div className="animate-bounce-in mb-4">
            <CuteCharacter equippedItems={store.state.equippedItems} size="small" />
          </div>
          <h3 className="mt-4 text-3xl font-bold text-white">Maybe Next Time!</h3>
          <p className="mt-2 text-lg text-white/70">
            {opponent?.name} from {opponent?.country} won this round.
          </p>
          <p className="mt-1 text-white/60">
            {myScore} - {opponentScore}
          </p>
          <p className="mt-2 text-white/50">Keep practicing and try again!</p>
        </>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => {
            // Rematch - find new opponent
            setBattleState("searching");
            setCurrent(0); setMyScore(0); setOpponentScore(0);
            setGuess(""); setFeedback(null); setWon(null);
          }}
          className="hover-bounce cursor-pointer rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-bold text-white transition hover:shadow-lg"
        >
          Find New Opponent
        </button>
        <button
          onClick={resetBattle}
          className="hover-bounce cursor-pointer rounded-xl bg-gray-700 px-6 py-3 font-bold text-white transition hover:bg-gray-600"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}
