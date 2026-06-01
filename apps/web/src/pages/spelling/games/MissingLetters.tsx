import { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import type { SpellingWord } from "../data";
import type { useSpellingStore } from "../useSpellingStore";
import type { GameLevel } from "../GamesTab";

type Store = ReturnType<typeof useSpellingStore>;

function pickMissingIndices(word: string): number[] {
  const len = word.length;
  const count = len <= 4 ? 1 : len <= 6 ? 2 : 3;
  const indices: number[] = [];
  const available = Array.from({ length: len }, (_, i) => i);
  for (let i = 0; i < count; i++) {
    const pick = Math.floor(Math.random() * available.length);
    indices.push(available[pick]);
    available.splice(pick, 1);
  }
  return indices.sort((a, b) => a - b);
}

function getDistractors(correctLetters: string[]): string[] {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const distractors = new Set<string>();
  while (distractors.size < 6 - correctLetters.length) {
    const letter = alphabet[Math.floor(Math.random() * 26)];
    if (!correctLetters.includes(letter)) {
      distractors.add(letter);
    }
  }
  return [...correctLetters, ...distractors].sort(() => Math.random() - 0.5);
}

export default function MissingLetters({
  words,
  store,
  wordCount,
  level,
}: {
  words: SpellingWord[];
  store: Store;
  wordCount: number;
  level: GameLevel;
}) {
  const [gameWords, setGameWords] = useState<SpellingWord[]>([]);
  const [current, setCurrent] = useState(0);
  const [missingIndices, setMissingIndices] = useState<number[]>([]);
  const [filledLetters, setFilledLetters] = useState<(string | null)[]>([]);
  const [usedButtons, setUsedButtons] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setGameWords(shuffled.slice(0, wordCount));
  }, [words, wordCount]);

  const word = gameWords[current];
  const total = gameWords.length;

  useEffect(() => {
    if (word) {
      const indices = pickMissingIndices(word.word);
      setMissingIndices(indices);
      setFilledLetters(new Array(indices.length).fill(null));
      setUsedButtons(new Set());
      setFeedback(null);
      setHintShown(false);
    }
  }, [current, word]);

  const choices = useMemo(() => {
    if (!word || missingIndices.length === 0) return [];
    const correctLetters = missingIndices.map((i) => word.word[i]);
    return getDistractors(correctLetters);
  }, [word, missingIndices]);

  if (gameWords.length === 0 || !word) return null;

  const nextBlankIdx = filledLetters.findIndex((l) => l === null);

  function handleChoice(letter: string, buttonIdx: number) {
    if (feedback || nextBlankIdx === -1) return;

    const correctLetter = word.word[missingIndices[nextBlankIdx]];

    if (letter === correctLetter) {
      const newFilled = [...filledLetters];
      newFilled[nextBlankIdx] = letter;
      setFilledLetters(newFilled);
      setUsedButtons((s) => new Set(s).add(buttonIdx));

      if (newFilled.every((l) => l !== null)) {
        setFeedback("correct");
        setScore((s) => s + 1);
        store.earnStars(1);
        setTimeout(goNext, 1200);
      }
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 800);
    }
  }

  function buyHint() {
    if (store.state.stars >= 1) {
      store.spendStars(1);
      setHintShown(true);
    }
  }

  function goNext() {
    if (current < total - 1) {
      setCurrent((c) => c + 1);
    } else {
      const finalScore = score + 1;
      const allCorrect = finalScore === total;
      if (allCorrect) store.earnStars(5);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      store.addGamePlayed();
      store.addInventoryEntry({
        type: "game", title: `Missing Letters Lv${level}`,
        score: finalScore, total, starsEarned: finalScore + (allCorrect ? 5 : 0),
        date: new Date().toISOString(),
      });
      setDone(true);
    }
  }

  function handleRestart() {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setGameWords(shuffled.slice(0, wordCount));
    setCurrent(0);
    setScore(0);
    setDone(false);
  }

  if (done) {
    const levelEmoji = level === 1 ? "🌱" : level === 2 ? "🌟" : "🔥";
    return (
      <div className="flex flex-col items-center text-center">
        <span className="text-6xl">{score >= total - 1 ? "🏆" : score >= total / 2 ? "✨" : "✏️"}</span>
        <h3 className="rainbow-sparkle mt-4 text-2xl font-bold">Missing Letters Complete!</h3>
        <p className="mt-1 text-sm text-white/50">{levelEmoji} Level {level}</p>
        <p className="mt-2 text-white">
          You got <span className="font-bold text-green-400">{score}</span> out of {total} correct!
        </p>
        <p className="mt-1 text-yellow-300">+{score} ⭐ earned!</p>
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
      <h3 className="rainbow-sparkle mb-1 text-center text-2xl font-bold">Missing Letters</h3>
      <p className="mb-6 text-center text-sm text-white/50">
        {level === 1 ? "🌱" : level === 2 ? "🌟" : "🔥"} Level {level}
      </p>

      {/* Progress */}
      <div className="mb-4 flex items-center justify-between text-sm text-white/50">
        <span>Word {current + 1} of {total}</span>
        <span>Score: {score}</span>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-mid to-blue-500 transition-all"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* Sentence + Hint */}
      <div className="mb-4 rounded-xl border border-purple-mid/20 bg-gray-900/80 p-4 text-center">
        <p className="text-lg text-white/80">{word.sentence.replace("___", "???")}</p>

        {/* Hint - costs 1 star */}
        {hintShown ? (
          <p className="mt-3 text-sm text-blue-300">Hint: {word.hint}</p>
        ) : (
          <button
            onClick={buyHint}
            disabled={store.state.stars < 1}
            className={`mt-3 cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition ${
              store.state.stars >= 1
                ? "bg-yellow-900/50 text-yellow-300 hover:bg-yellow-900"
                : "cursor-not-allowed bg-gray-800 text-gray-500"
            }`}
          >
            💡 Use Hint (1 ⭐)
          </button>
        )}
      </div>

      {/* Word with blanks */}
      <div className="mb-6 flex justify-center">
        <div className="flex flex-wrap justify-center gap-2">
          {word.word.split("").map((letter, i) => {
            const blankIdx = missingIndices.indexOf(i);
            const isMissing = blankIdx !== -1;
            const filled = isMissing ? filledLetters[blankIdx] : null;

            return (
              <span
                key={i}
                className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-xl font-bold transition ${
                  isMissing
                    ? filled
                      ? "border-green-500 bg-green-900/30 text-green-400"
                      : blankIdx === nextBlankIdx
                        ? "animate-pulse border-yellow-500 bg-yellow-900/20 text-yellow-300"
                        : "border-orange-500/50 bg-gray-900 text-white/20"
                    : "border-purple-mid/30 bg-gray-900 text-purple-light"
                }`}
              >
                {isMissing ? (filled || "?") : letter}
              </span>
            );
          })}
        </div>
      </div>

      {/* Letter choices */}
      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {choices.map((letter, i) => (
          <button
            key={i}
            onClick={() => handleChoice(letter, i)}
            disabled={usedButtons.has(i)}
            className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border-2 text-lg font-bold transition ${
              usedButtons.has(i)
                ? "cursor-not-allowed border-gray-700 bg-gray-800 text-gray-600"
                : "border-purple-mid/50 bg-gray-900 text-white hover:border-purple-mid hover:bg-purple-mid/20"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Feedback */}
      <div className="text-center">
        {feedback === "correct" && <p className="text-sm font-semibold text-green-400">Correct! +1 ⭐</p>}
        {feedback === "wrong" && <p className="text-sm font-semibold text-red-400">Wrong letter, try another!</p>}
      </div>
    </div>
  );
}
