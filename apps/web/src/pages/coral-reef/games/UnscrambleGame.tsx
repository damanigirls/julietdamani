import { useState, useEffect } from "react";

type Word = { word: string; hint: string };

const WORDS: Word[] = [
  { word: "CORAL", hint: "Tiny animals that build reefs" },
  { word: "POLYP", hint: "A single coral animal" },
  { word: "REEF", hint: "An underwater structure made by living organisms" },
  { word: "ALGAE", hint: "Tiny plants that give coral its color" },
  { word: "OCEAN", hint: "The large body of salt water" },
  { word: "FISH", hint: "Animals with fins and gills" },
  { word: "PLANKTON", hint: "Tiny organisms that float in water" },
  { word: "TENTACLE", hint: "Coral polyps use these to catch food" },
  { word: "BLEACHING", hint: "When coral turns white from stress" },
  { word: "MARINE", hint: "Related to the sea" },
];

function scramble(word: string): string {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join("");
  return result === word ? scramble(word) : result;
}

export default function UnscrambleGame() {
  const [current, setCurrent] = useState(0);
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(0);

  const word = WORDS[current];

  useEffect(() => {
    setScrambled(scramble(word.word));
    setGuess("");
    setFeedback(null);
  }, [current, word.word]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (guess.toUpperCase().trim() === word.word) {
      setFeedback("correct");
      setScore((s) => s + 1);
      setTimeout(goNext, 1000);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 1000);
    }
  }

  function handleSkip() {
    setSkipped((s) => s + 1);
    goNext();
  }

  function goNext() {
    if (current < WORDS.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setDone(true);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setScore(0);
    setSkipped(0);
    setDone(false);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="text-6xl">{score >= 8 ? "🧠" : "📚"}</span>
        <h3 className="rainbow-sparkle mt-4 text-2xl font-bold">Unscramble Complete!</h3>
        <p className="mt-2 text-white">
          You got <span className="font-bold text-green-400">{score}</span> out of{" "}
          {WORDS.length} correct!
        </p>
        {skipped > 0 && (
          <p className="mt-1 text-sm text-white/50">Skipped: {skipped}</p>
        )}
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
      <h3 className="rainbow-sparkle mb-2 text-center text-2xl font-bold">Unscramble</h3>
      <p className="mb-6 text-center text-sm text-white/60">
        Unscramble the coral reef word!
      </p>

      {/* Progress */}
      <div className="mb-4 flex items-center justify-between text-sm text-white/50">
        <span>Word {current + 1} of {WORDS.length}</span>
        <span>Score: {score}</span>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-mid to-blue-500 transition-all"
          style={{ width: `${((current + 1) / WORDS.length) * 100}%` }}
        />
      </div>

      {/* Scrambled word */}
      <div className="mb-4 flex justify-center">
        <div className="flex gap-2">
          {scrambled.split("").map((letter, i) => (
            <span
              key={i}
              className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-purple-mid/50 bg-gray-900 text-xl font-bold text-purple-light"
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Hint */}
      <p className="mb-6 text-center text-sm text-blue-300">
        Hint: {word.hint}
      </p>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type your answer..."
          className={`w-full max-w-xs rounded-xl border-2 bg-gray-900 px-4 py-3 text-center text-lg font-bold text-white outline-none transition ${
            feedback === "correct"
              ? "border-green-500"
              : feedback === "wrong"
                ? "border-red-500"
                : "border-purple-mid/30 focus:border-purple-mid"
          }`}
          autoFocus
        />
        {feedback === "correct" && (
          <p className="text-sm font-semibold text-green-400">Correct!</p>
        )}
        {feedback === "wrong" && (
          <p className="text-sm font-semibold text-red-400">Try again!</p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-purple-mid px-6 py-2 font-bold text-white transition hover:bg-purple-dark"
          >
            Check
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="cursor-pointer rounded-xl border border-white/20 px-6 py-2 font-bold text-white/60 transition hover:text-white"
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  );
}
