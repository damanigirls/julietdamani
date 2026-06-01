import { useState, useMemo } from "react";
import confetti from "canvas-confetti";
import { buildLessonsForLevel } from "./data";
import type { Lesson, SpellingWord, Grade } from "./data";
import type { useSpellingStore } from "./useSpellingStore";
import JourneyMap from "./JourneyMap";

type Store = ReturnType<typeof useSpellingStore>;

const DIFFICULTY_COLORS = {
  easy: "bg-green-900 text-green-400",
  medium: "bg-yellow-900 text-yellow-400",
  hard: "bg-red-900 text-red-400",
};
const DIFFICULTY_LABELS = {
  easy: "Review",
  medium: "Your Level",
  hard: "Challenge",
};

export default function LessonsTab({ store }: { store: Store }) {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const lessons = useMemo(
    () => buildLessonsForLevel(store.state.assessedLevel ?? 1),
    [store.state.assessedLevel]
  );

  // Check if all lessons at current level are done
  const allDone = lessons
    .filter((l) => l.difficulty === "hard")
    .every((l) => store.state.completedLessons.includes(l.id));

  const isLastLevel = (store.state.assessedLevel ?? 1) >= 6;

  // Level up prompt
  if (showLevelUp && !isLastLevel) {
    const nextGrade = ((store.state.assessedLevel ?? 1) + 1) as Grade;
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <span className="animate-bounce-in text-8xl">🎉</span>
        <h2 className="rainbow-sparkle mt-4 text-3xl font-bold">Amazing Job!</h2>
        <p className="mt-3 text-lg text-white/80">
          You finished all the lessons! Do you want to go to the next grade?
        </p>
        <p className="mt-1 text-2xl font-bold text-purple-light">
          Grade {nextGrade} awaits!
        </p>

        <div className="mt-8 flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={() => {
              store.completeQuiz(store.state.quizScore, nextGrade);
              setShowLevelUp(false);
              confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
            }}
            className="hover-bounce w-full cursor-pointer rounded-2xl bg-green-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-green-500"
          >
            ✅ Yes, I am ready for this next quest!
          </button>
          <button
            onClick={() => setShowLevelUp(false)}
            className="hover-bounce w-full cursor-pointer rounded-2xl bg-gray-700 px-6 py-4 text-lg font-bold text-white transition hover:bg-gray-600"
          >
            🔄 No, I need more practice
          </button>
        </div>
      </div>
    );
  }

  if (activeLesson) {
    return (
      <LessonFlow
        lesson={activeLesson}
        store={store}
        onBack={() => setActiveLesson(null)}
        onLevelUp={() => { setActiveLesson(null); setShowLevelUp(true); }}
        isLastLesson={lessons.indexOf(activeLesson) === lessons.length - 1}
      />
    );
  }

  const journeyType = store.state.journeyType ?? "rocket";

  return (
    <div>
      <h2 className="rainbow-sparkle mb-2 text-center text-2xl font-bold sm:text-3xl">
        {journeyType === "rocket" ? "Your Space Journey" : "Your Flower Garden"}
      </h2>
      <p className="mb-6 text-center text-white/60">
        Watch, learn the trick, then practice! Earn 5 stars per lesson.
      </p>

      {allDone && !isLastLevel && (
        <button
          onClick={() => setShowLevelUp(true)}
          className="hover-bounce mb-6 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4 text-center text-lg font-bold text-white transition hover:shadow-lg"
        >
          {journeyType === "rocket"
            ? "You explored all the planets! Ready for a new galaxy?"
            : "You visited all the flowers! Ready for a new garden?"}
        </button>
      )}

      <JourneyMap
        journeyType={journeyType}
        lessons={lessons}
        completedLessons={store.state.completedLessons}
        onSelectLesson={(lesson) => setActiveLesson(lesson)}
      />
    </div>
  );
}

// ── Lesson Flow (Video → Trick → Practice → Done) ────────────────

type LessonStep = "video" | "trick" | "practice" | "done";

function shuffleLetters(word: string): string[] {
  const letters = word.split("");
  // Add 2 distractors
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < 2; i++) letters.push(alphabet[Math.floor(Math.random() * 26)]);
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters;
}

function LessonFlow({
  lesson, store, onBack, onLevelUp, isLastLesson,
}: {
  lesson: Lesson; store: Store; onBack: () => void;
  onLevelUp: () => void; isLastLesson: boolean;
}) {
  const [step, setStep] = useState<LessonStep>("video");
  const [current, setCurrent] = useState(0);
  const [guess, setGuess] = useState("");
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "reveal" | null>(null);
  const [score, setScore] = useState(0);

  const word: SpellingWord = lesson.words[current];
  const total = lesson.words.length;

  // ── Step 1: Video/Explanation ──────────────────────────────────

  if (step === "video") {
    return (
      <div>
        <button onClick={onBack} className="mb-4 cursor-pointer text-sm text-white/60 hover:text-white">← Back</button>
        <div className="animate-bounce-in flex flex-col items-center text-center">
          <span className="text-8xl">{lesson.videoEmoji}</span>
          <h3 className="rainbow-sparkle mt-4 text-2xl font-bold">{lesson.emoji} {lesson.title}</h3>
          <div className="mt-2 inline-block rounded-full bg-blue-900/30 px-4 py-1 text-sm font-bold text-blue-300">
            📖 {lesson.concept}
          </div>

          <div className="mt-6 w-full max-w-md rounded-2xl border-2 border-purple-mid/30 bg-gradient-to-b from-blue-900/20 to-purple-900/20 p-6 text-left">
            <h4 className="mb-3 text-center text-lg font-bold text-white">🎬 Learn This!</h4>
            <p className="text-base leading-relaxed text-white/80">{lesson.explanation}</p>

            <div className="mt-4">
              <p className="text-sm font-bold text-white/60">Examples:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {lesson.examples.map((ex) => (
                  <span key={ex} className="animate-slide-up rounded-lg bg-purple-mid/20 px-3 py-1 text-sm font-bold text-purple-light">
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep("trick")}
            className="hover-bounce mt-6 cursor-pointer rounded-xl bg-purple-mid px-8 py-3 text-lg font-bold text-white transition hover:bg-purple-dark"
          >
            Next: Learn the Trick! 💡
          </button>
        </div>
      </div>
    );
  }

  // ── Step 2: Spelling Trick ─────────────────────────────────────

  if (step === "trick") {
    return (
      <div>
        <button onClick={() => setStep("video")} className="mb-4 cursor-pointer text-sm text-white/60 hover:text-white">← Back to Lesson</button>
        <div className="animate-bounce-in flex flex-col items-center text-center">
          <span className="text-7xl">💡</span>
          <h3 className="rainbow-sparkle mt-4 text-2xl font-bold">Spelling Trick!</h3>

          <div className="mt-6 w-full max-w-md rounded-2xl border-2 border-yellow-500/30 bg-gradient-to-b from-yellow-900/20 to-orange-900/20 p-6">
            <p className="text-xl leading-relaxed text-white">{lesson.trick}</p>
          </div>

          <p className="mt-4 text-sm text-white/50">Remember this trick when you practice!</p>

          <button
            onClick={() => {
              setStep("practice");
              setAvailableLetters(shuffleLetters(lesson.words[0].word));
            }}
            className="hover-bounce mt-6 cursor-pointer rounded-xl bg-green-600 px-8 py-3 text-lg font-bold text-white transition hover:bg-green-500"
          >
            Start Practice! ✏️
          </button>
        </div>
      </div>
    );
  }

  // ── Step 3: Practice (click letters) ───────────────────────────

  if (step === "practice") {
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
          if (attempts === 0) { setScore((s) => s + 1); store.earnStars(1); }
          setTimeout(goNext, 1200);
        } else {
          if (attempts >= 1) {
            setFeedback("reveal");
            setTimeout(goNext, 2000);
          } else {
            setFeedback("wrong");
            setAttempts(1);
            setTimeout(() => {
              setFeedback(null);
              setGuess("");
              setAvailableLetters(shuffleLetters(word.word));
            }, 1000);
          }
        }
      }
    }


    function goNext() {
      if (current < total - 1) {
        setCurrent((c) => c + 1);
        setGuess(""); setAttempts(0); setFeedback(null);
        setAvailableLetters(shuffleLetters(lesson.words[current + 1].word));
      } else {
        const finalScore = score + (feedback === "correct" && attempts === 0 ? 1 : 0);
        store.earnStars(5); // Always 5 stars for completing a lesson
        store.completeLesson(lesson.id, finalScore);
        store.addInventoryEntry({
          type: "lesson", title: lesson.title,
          score: finalScore, total, starsEarned: finalScore + 5,
          date: new Date().toISOString(),
        });
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setStep("done");
      }
    }

    return (
      <div>
        <button onClick={() => setStep("trick")} className="mb-4 cursor-pointer text-sm text-white/60 hover:text-white">← Back to Trick</button>
        <h3 className="rainbow-sparkle mb-1 text-center text-2xl font-bold">{lesson.emoji} Practice Time!</h3>
        <p className="mb-4 text-center text-xs text-blue-300">💡 Remember: {lesson.trick.split("!")[0]}!</p>

        {/* Progress */}
        <div className="mb-3 flex items-center justify-between text-sm text-white/50">
          <span>Word {current + 1} of {total}</span>
          <span>⭐ {score}</span>
        </div>
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-800">
          <div className="h-full rounded-full bg-gradient-to-r from-purple-mid to-blue-500 transition-all"
            style={{ width: `${((current + 1) / total) * 100}%` }} />
        </div>

        {/* Sentence */}
        <div className="mb-4 rounded-xl border border-purple-mid/20 bg-gray-900/80 p-4 text-center">
          <p className="text-sm text-blue-300">Hint: {word.hint}</p>
          <p className="mt-2 text-lg text-white/80">
            {word.sentence.replace("___", "_ ".repeat(word.word.length).trim())}
          </p>
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
                      : feedback === "wrong" || feedback === "reveal" ? "border-red-500 bg-red-900/30 text-red-400"
                      : "border-purple-mid/50 bg-gray-900 text-purple-light"
                      : "border-purple-mid/30 bg-gray-900 text-white/20"
                  }`}>
                  {feedback === "reveal" ? letter : (typed || "_")}
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
        {feedback === "reveal" && <p className="animate-bounce-in text-center text-lg font-bold text-orange-400">The answer was shown above!</p>}
      </div>
    );
  }

  // ── Step 4: Done ───────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center text-center">
      <span className="animate-bounce-in text-7xl">🎉</span>
      <h3 className="rainbow-sparkle mt-4 text-3xl font-bold">Lesson Complete!</h3>
      <p className="mt-2 text-lg text-white">
        You got <span className="font-bold text-green-400">{score}</span> out of {total} on your first try!
      </p>
      <p className="mt-1 text-xl font-bold text-yellow-300">+{score + 5} ⭐ earned!</p>

      <div className="mt-6 flex flex-col gap-3 w-full max-w-sm">
        {isLastLesson && !((store.state.assessedLevel ?? 1) >= 6) ? (
          <button onClick={onLevelUp}
            className="hover-bounce w-full cursor-pointer rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-500">
            🎉 Ready for the next grade?
          </button>
        ) : null}
        <button onClick={onBack}
          className="hover-bounce w-full cursor-pointer rounded-xl bg-purple-mid px-6 py-3 font-bold text-white transition hover:bg-purple-dark">
          Back to Lessons
        </button>
      </div>
    </div>
  );
}
