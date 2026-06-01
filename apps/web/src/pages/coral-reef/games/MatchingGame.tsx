import { useState, useEffect } from "react";

type Card = {
  id: number;
  text: string;
  pairId: number;
};

const PAIRS = [
  { a: "Clownfish", b: "Sea Anemone" },
  { a: "Coral Polyp", b: "Calcium Skeleton" },
  { a: "Zooxanthellae", b: "Algae" },
  { a: "Great Barrier", b: "Reef" },
  { a: "Parrotfish", b: "Eats Coral" },
  { a: "Bleaching", b: "Warm Water" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards(): Card[] {
  const cards: Card[] = [];
  PAIRS.forEach((pair, i) => {
    cards.push({ id: i * 2, text: pair.a, pairId: i });
    cards.push({ id: i * 2 + 1, text: pair.b, pairId: i });
  });
  return shuffle(cards);
}

export default function MatchingGame() {
  const [cards, setCards] = useState<Card[]>(() => buildCards());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (flipped.length === 2) {
      setAttempts((a) => a + 1);
      const [first, second] = flipped;
      const card1 = cards.find((c) => c.id === first)!;
      const card2 = cards.find((c) => c.id === second)!;

      if (card1.pairId === card2.pairId) {
        const newMatched = new Set(matched);
        newMatched.add(card1.pairId);
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.size === PAIRS.length) {
          setDone(true);
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }, [flipped, cards, matched]);

  function handleFlip(id: number) {
    if (flipped.length >= 2) return;
    if (flipped.includes(id)) return;
    const card = cards.find((c) => c.id === id)!;
    if (matched.has(card.pairId)) return;
    setFlipped((f) => [...f, id]);
  }

  function handleRestart() {
    setCards(buildCards());
    setFlipped([]);
    setMatched(new Set());
    setAttempts(0);
    setDone(false);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="text-6xl">🎉</span>
        <h3 className="rainbow-sparkle mt-4 text-2xl font-bold">All Matched!</h3>
        <p className="mt-2 text-white">
          You found all {PAIRS.length} pairs in{" "}
          <span className="font-bold text-purple-light">{attempts}</span> attempts!
        </p>
        <p className="mt-1 text-sm text-white/50">
          {attempts <= PAIRS.length + 2
            ? "Amazing memory!"
            : attempts <= PAIRS.length + 5
              ? "Great job!"
              : "Keep practicing!"}
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
      <h3 className="rainbow-sparkle mb-2 text-center text-2xl font-bold">Matching</h3>
      <p className="mb-2 text-center text-sm text-white/60">
        Flip cards to find matching coral reef pairs!
      </p>
      <p className="mb-6 text-center text-xs text-white/40">
        Attempts: {attempts} &middot; Matched: {matched.size}/{PAIRS.length}
      </p>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.has(card.pairId);

          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className={`flex h-24 cursor-pointer items-center justify-center rounded-xl border-2 p-2 text-center text-sm font-semibold transition-all sm:h-28 ${
                isMatched
                  ? "border-green-500/50 bg-green-900/20 text-green-300"
                  : isFlipped
                    ? "border-purple-mid bg-purple-dark/30 text-white"
                    : "border-purple-mid/30 bg-gray-900 text-transparent hover:border-purple-mid/60"
              }`}
            >
              {isFlipped || isMatched ? card.text : "🪸"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
