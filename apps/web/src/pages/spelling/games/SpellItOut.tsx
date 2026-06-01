import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import type { SpellingWord } from "../data";
import type { useSpellingStore } from "../useSpellingStore";
import type { GameLevel } from "../GamesTab";

type Store = ReturnType<typeof useSpellingStore>;

function shuffleLetters(word: string): string[] {
  // Add 2 extra random letters as distractors
  const letters = word.split("");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < 2; i++) {
    letters.push(alphabet[Math.floor(Math.random() * 26)]);
  }
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters;
}

export default function SpellItOut({
  words, store, wordCount, level,
}: {
  words: SpellingWord[]; store: Store; wordCount: number; level: GameLevel;
}) {
  const [gameWords, setGameWords] = useState<SpellingWord[]>([]);
  const [current, setCurrent] = useState(0);
  const [guess, setGuess] = useState("");
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [bonusCount, setBonusCount] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, wordCount);
    setGameWords(picked);
    if (picked.length > 0) setAvailableLetters(shuffleLetters(picked[0].word));
  }, [words, wordCount]);

  if (gameWords.length === 0) return null;
  const word = gameWords[current];
  const total = gameWords.length;

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
        setScore((s) => s + 1);
        store.earnStars(1);
        setTimeout(goNext, 1000);
      } else {
        setFeedback("wrong");
        // Check if it's a real word (bonus!)
        if (newGuess.length >= 3) {
          setBonusCount((b) => b + 1);
          store.addBonusPoints(1);
        }
        setTimeout(() => { setFeedback(null); resetWord(); }, 1500);
      }
    }
  }

  function resetWord() {
    setGuess("");
    setAvailableLetters(shuffleLetters(word.word));
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
      setGuess("");
      setFeedback(null);
      setHintShown(false);
      setAvailableLetters(shuffleLetters(gameWords[current + 1].word));
    } else {
      const finalScore = score + 1; // +1 for the last correct
      const allCorrect = finalScore === total;
      if (allCorrect) store.earnStars(5); // bonus for all correct
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      store.addGamePlayed();
      store.addInventoryEntry({
        type: "game", title: `Spell It Out Lv${level}`,
        score: finalScore, total, starsEarned: finalScore + (allCorrect ? 5 : 0),
        date: new Date().toISOString(),
      });
      setDone(true);
    }
  }

  function handleRestart() {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, wordCount);
    setGameWords(picked);
    setCurrent(0); setScore(0); setGuess(""); setFeedback(null);
    setHintShown(false); setDone(false); setBonusCount(0);
    if (picked.length > 0) setAvailableLetters(shuffleLetters(picked[0].word));
  }

  if (done) {
    const allCorrect = score === total;
    return (
      <div className="flex flex-col items-center text-center">
        <span className="animate-bounce-in text-6xl">{allCorrect ? "🏆" : score >= total / 2 ? "🌟" : "📝"}</span>
        <h3 className="rainbow-sparkle mt-4 text-2xl font-bold">Spell It Out Complete!</h3>
        <p className="mt-2 text-white">
          <span className="font-bold text-green-400">{score}</span> out of {total} correct!
        </p>
        {allCorrect && <p className="mt-1 animate-bounce-in text-yellow-300 font-bold">🎉 Perfect! +5 bonus ⭐!</p>}
        <p className="mt-1 text-yellow-300">+{score + (allCorrect ? 5 : 0)} ⭐ earned!</p>
        {bonusCount > 0 && <p className="mt-1 text-pink-300 text-sm">🎁 {bonusCount} bonus points!</p>}
        <button onClick={handleRestart}
          className="hover-bounce mt-4 cursor-pointer rounded-xl bg-purple-mid px-6 py-3 font-bold text-white transition hover:bg-purple-dark">
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="rainbow-sparkle mb-1 text-center text-2xl font-bold">Spell It Out</h3>
      <p className="mb-4 text-center text-sm text-white/50">
        {level === 1 ? "🌱" : level === 2 ? "🌟" : "🔥"} Level {level} · Tap letters to spell!
      </p>

      {/* Bonus corner */}
      {bonusCount > 0 && (
        <div className="absolute right-4 top-4 animate-bounce-in rounded-full bg-pink-900/50 px-3 py-1 text-xs font-bold text-pink-300">
          🎁 Bonus: {bonusCount}
        </div>
      )}

      {/* Progress */}
      <div className="mb-3 flex items-center justify-between text-sm text-white/50">
        <span>Word {current + 1} of {total}</span>
        <span>Score: {score}</span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-800">
        <div className="h-full rounded-full bg-gradient-to-r from-purple-mid to-blue-500 transition-all"
          style={{ width: `${((current + 1) / total) * 100}%` }} />
      </div>

      {/* Sentence + hint */}
      <div className="mb-4 rounded-xl border border-purple-mid/20 bg-gray-900/80 p-4 text-center">
        <p className="text-lg text-white/80">
          {word.sentence.replace("___", "_ ".repeat(word.word.length).trim())}
        </p>
        {hintShown ? (
          <p className="mt-2 text-sm text-blue-300">💡 {word.hint}</p>
        ) : (
          <button onClick={buyHint} disabled={store.state.stars < 1}
            className={`mt-2 cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition ${
              store.state.stars >= 1 ? "bg-yellow-900/50 text-yellow-300 hover:bg-yellow-900" : "cursor-not-allowed bg-gray-800 text-gray-500"
            }`}>
            💡 Hint (1 ⭐)
          </button>
        )}
      </div>

      {/* Answer tiles */}
      <div className="mb-4 flex justify-center">
        <div className="flex flex-wrap justify-center gap-2">
          {word.word.split("").map((letter, i) => {
            const typed = guess.toUpperCase()[i];
            return (
              <span key={i}
                className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-xl font-bold transition ${
                  typed
                    ? feedback === "correct" ? "animate-pop border-green-500 bg-green-900/30 text-green-400"
                    : feedback === "wrong" ? "border-red-500 bg-red-900/30 text-red-400"
                    : "border-purple-mid/50 bg-gray-900 text-purple-light"
                    : "border-purple-mid/30 bg-gray-900 text-white/20"
                }`}>
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
            <button key={`${letter}-${i}`} onClick={() => handleLetterClick(letter, i)}
              className="hover-bounce flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border-2 border-purple-mid/50 bg-gray-900 text-xl font-bold text-white transition hover:border-purple-mid hover:bg-purple-mid/20 hover:scale-110">
              {letter}
            </button>
          ))}
        </div>
      )}


      {feedback === "correct" && <p className="animate-bounce-in text-center text-lg font-bold text-green-400">✅ Correct! +1 ⭐</p>}
      {feedback === "wrong" && <p className="animate-bounce-in text-center text-lg font-bold text-red-400">Try again!</p>}
    </div>
  );
}
