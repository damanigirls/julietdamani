import { useState, useCallback } from "react";

type Category = "Coral" | "Fish" | "Threats";

type Item = { text: string; category: Category };

const ITEMS: Item[] = [
  { text: "Brain coral", category: "Coral" },
  { text: "Staghorn coral", category: "Coral" },
  { text: "Fan coral", category: "Coral" },
  { text: "Table coral", category: "Coral" },
  { text: "Clownfish", category: "Fish" },
  { text: "Parrotfish", category: "Fish" },
  { text: "Angelfish", category: "Fish" },
  { text: "Butterflyfish", category: "Fish" },
  { text: "Ocean warming", category: "Threats" },
  { text: "Pollution", category: "Threats" },
  { text: "Overfishing", category: "Threats" },
  { text: "Acid rain", category: "Threats" },
];

const CATEGORIES: Category[] = ["Coral", "Fish", "Threats"];
const CAT_EMOJI: Record<Category, string> = { Coral: "🪸", Fish: "🐠", Threats: "⚠️" };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SortGame() {
  const [remaining, setRemaining] = useState(() => shuffle(ITEMS));
  const [buckets, setBuckets] = useState<Record<Category, Item[]>>({
    Coral: [],
    Fish: [],
    Threats: [],
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const currentItem = remaining[0] ?? null;

  const handleSort = useCallback(
    (category: Category) => {
      if (!currentItem) return;
      const isCorrect = currentItem.category === category;

      if (isCorrect) {
        setCorrect((c) => c + 1);
        setFeedback("Correct!");
        setBuckets((b) => ({ ...b, [category]: [...b[category], currentItem] }));
      } else {
        setWrong((w) => w + 1);
        setFeedback(`Nope! "${currentItem.text}" belongs in ${currentItem.category}`);
        setBuckets((b) => ({
          ...b,
          [currentItem.category]: [...b[currentItem.category], currentItem],
        }));
      }

      const next = remaining.slice(1);
      setRemaining(next);
      if (next.length === 0) {
        setTimeout(() => setDone(true), 800);
      } else {
        setTimeout(() => setFeedback(null), 1200);
      }
    },
    [currentItem, remaining]
  );

  function handleRestart() {
    setRemaining(shuffle(ITEMS));
    setBuckets({ Coral: [], Fish: [], Threats: [] });
    setFeedback(null);
    setDone(false);
    setCorrect(0);
    setWrong(0);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="text-6xl">{correct >= 10 ? "🌟" : "👍"}</span>
        <h3 className="rainbow-sparkle mt-4 text-2xl font-bold">Sorting Complete!</h3>
        <p className="mt-2 text-white">
          You sorted <span className="font-bold text-green-400">{correct}</span> correctly and{" "}
          <span className="font-bold text-red-400">{wrong}</span> wrong out of {ITEMS.length}.
        </p>
        <button
          onClick={handleRestart}
          className="mt-4 cursor-pointer rounded-xl bg-purple-mid px-6 py-3 font-bold text-white transition hover:bg-purple-dark"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="rainbow-sparkle mb-2 text-center text-2xl font-bold">Sort</h3>
      <p className="mb-6 text-center text-sm text-white/60">
        Sort each item into the correct category!
      </p>

      {/* Progress */}
      <div className="mb-4 text-center text-sm text-white/50">
        {ITEMS.length - remaining.length} / {ITEMS.length} sorted
      </div>

      {/* Current item */}
      {currentItem && (
        <div className="mb-6 flex justify-center">
          <div className="animate-float rounded-2xl border-2 border-purple-mid bg-gray-900 px-8 py-4 text-center">
            <p className="text-lg font-bold text-white">{currentItem.text}</p>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <p
          className={`mb-4 text-center text-sm font-semibold ${
            feedback === "Correct!" ? "text-green-400" : "text-red-400"
          }`}
        >
          {feedback}
        </p>
      )}

      {/* Category buckets */}
      <div className="grid grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleSort(cat)}
            className="cursor-pointer rounded-xl border-2 border-purple-mid/30 bg-gray-900 p-4 text-center transition hover:border-purple-mid/60 hover:bg-gray-800"
          >
            <span className="text-3xl">{CAT_EMOJI[cat]}</span>
            <p className="mt-1 text-sm font-bold text-white">{cat}</p>
            <p className="mt-1 text-xs text-white/40">{buckets[cat].length} items</p>
          </button>
        ))}
      </div>
    </div>
  );
}
