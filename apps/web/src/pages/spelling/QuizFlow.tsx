import { useState } from "react";
import confetti from "canvas-confetti";
import Sparkles from "@/components/Sparkles";
import { QUIZ_WORDS, STARTER_AVATARS } from "./data";
import type { Grade, Gender, QuizWord, StarterAvatar } from "./data";
import type { useSpellingStore } from "./useSpellingStore";
import { canAddFamilyMember } from "./useSpellingStore";
import CuteCharacter from "./CuteCharacter";

type Store = ReturnType<typeof useSpellingStore>;
type Step = "welcome" | "profile" | "avatar" | "quiz" | "results" | "journey";

export default function QuizFlow({ store }: { store: Store }) {
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState<Grade | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<StarterAvatar | null>(null);
  const [error, setError] = useState("");

  // Quiz state
  const [quizWords, setQuizWords] = useState<QuizWord[]>([]);
  const [current, setCurrent] = useState(0);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [quizDone, setQuizDone] = useState(false);
  const [assessedLevel, setAssessedLevel] = useState<Grade | null>(null);

  // Letter clicking for quiz
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);

  // ── Welcome Screen ─────────────────────────────────────────────

  if (step === "welcome") {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <Sparkles />
        <span className="animate-float text-8xl">📝</span>
        <h1 className="rainbow-sparkle mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
          Spelling Adventure
        </h1>
        <p className="mt-4 max-w-md text-lg text-white/70">
          Learn to spell with fun lessons, cool games, and dress up your own character!
        </p>
        {!canAddFamilyMember() && (
          <p className="mt-4 rounded-xl bg-red-900/30 px-4 py-2 text-sm text-red-300">
            Your family already has 8 members! Ask someone to make room.
          </p>
        )}
        <button
          onClick={() => setStep("profile")}
          disabled={!canAddFamilyMember()}
          className={`mt-8 cursor-pointer rounded-2xl px-8 py-4 text-xl font-bold text-white transition hover:-translate-y-1 hover:shadow-xl ${
            canAddFamilyMember()
              ? "bg-purple-mid hover:bg-purple-dark"
              : "cursor-not-allowed bg-gray-700"
          }`}
        >
          Let's Go!
        </button>
      </div>
    );
  }

  // ── Profile Screen ─────────────────────────────────────────────

  if (step === "profile") {
    const canContinue = name.trim().length > 0 && age && grade && gender;

    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <Sparkles />
        <span className="text-6xl">👋</span>
        <h2 className="rainbow-sparkle mt-4 text-3xl font-bold">Tell us about you!</h2>
        <p className="mt-1 text-sm text-white/50">Fill out everything to continue!</p>

        <div className="mt-6 w-full max-w-sm space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-left text-sm font-semibold text-white/60">
              What's your first name?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Your first name..."
              className="w-full rounded-xl border-2 border-purple-mid/30 bg-gray-900 px-4 py-3 text-lg font-bold text-white outline-none transition focus:border-purple-mid"
              autoFocus
              maxLength={15}
            />
          </div>

          {/* Boy or Girl */}
          <div>
            <label className="mb-2 block text-left text-sm font-semibold text-white/60">
              Are you a...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setGender("girl"); setError(""); }}
                className={`hover-bounce cursor-pointer rounded-xl border-2 px-4 py-3 text-lg font-bold transition ${
                  gender === "girl"
                    ? "border-pink-400 bg-pink-900/30 text-pink-300"
                    : "border-purple-mid/30 bg-gray-900 text-white/60 hover:text-white"
                }`}
              >
                👧 Girl
              </button>
              <button
                onClick={() => { setGender("boy"); setError(""); }}
                className={`hover-bounce cursor-pointer rounded-xl border-2 px-4 py-3 text-lg font-bold transition ${
                  gender === "boy"
                    ? "border-blue-400 bg-blue-900/30 text-blue-300"
                    : "border-purple-mid/30 bg-gray-900 text-white/60 hover:text-white"
                }`}
              >
                👦 Boy
              </button>
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="mb-1 block text-left text-sm font-semibold text-white/60">
              How old are you?
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => { setAge(e.target.value); setError(""); }}
              placeholder="Your age..."
              min={4}
              max={15}
              className="w-full rounded-xl border-2 border-purple-mid/30 bg-gray-900 px-4 py-3 text-lg font-bold text-white outline-none transition focus:border-purple-mid"
            />
          </div>

          {/* Grade */}
          <div>
            <label className="mb-2 block text-left text-sm font-semibold text-white/60">
              What grade are you in?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {([1, 2, 3, 4, 5, 6] as Grade[]).map((g) => (
                <button
                  key={g}
                  onClick={() => { setGrade(g); setError(""); }}
                  className={`hover-bounce cursor-pointer rounded-xl border-2 px-4 py-3 text-lg font-bold transition ${
                    grade === g
                      ? "border-purple-mid bg-purple-mid/20 text-purple-light"
                      : "border-purple-mid/30 bg-gray-900 text-white/60 hover:text-white"
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="animate-bounce-in rounded-xl bg-red-900/30 px-4 py-2 text-sm font-bold text-red-300">
              {error}
            </p>
          )}

          {/* Continue */}
          <button
            onClick={() => {
              if (!name.trim()) { setError("Please enter your name!"); return; }
              if (!gender) { setError("Please pick girl or boy!"); return; }
              if (!age) { setError("Please enter your age!"); return; }
              if (!grade) { setError("Please pick your grade!"); return; }
              setStep("avatar");
            }}
            className={`w-full cursor-pointer rounded-xl px-6 py-4 text-lg font-bold text-white transition ${
              canContinue
                ? "bg-purple-mid hover:bg-purple-dark"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Next: Pick Your Character!
          </button>
        </div>
      </div>
    );
  }

  // ── Avatar Picker ──────────────────────────────────────────────

  if (step === "avatar") {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <Sparkles />
        <h2 className="rainbow-sparkle text-3xl font-bold">Pick Your Character!</h2>
        <p className="mt-2 text-white/60">Choose your cute animal friend!</p>

        <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-lg">
          {STARTER_AVATARS.map((av) => (
            <button
              key={av.id}
              onClick={() => setSelectedAvatar(av)}
              className={`hover-bounce cursor-pointer rounded-2xl border-3 p-4 text-center transition-all ${
                selectedAvatar?.id === av.id
                  ? "border-yellow-400 bg-gradient-to-b from-yellow-900/20 to-purple-900/30 shadow-lg shadow-yellow-400/20 -translate-y-2"
                  : "border-purple-mid/30 bg-gray-900 hover:border-purple-mid/60"
              }`}
            >
              {/* Show the actual cute SVG character! */}
              <div className="flex justify-center">
                <CuteCharacter
                  equippedItems={{ hat: av.hat, face: av.face, shirt: av.shirt, accessory: av.accessory }}
                  size="small"
                />
              </div>
              <p className="mt-2 text-sm font-bold text-white">{av.name}</p>
            </button>
          ))}
        </div>

        {!selectedAvatar && (
          <p className="mt-4 text-sm text-yellow-300/60">Tap one to pick!</p>
        )}

        <button
          onClick={() => {
            if (!selectedAvatar) return;
            store.setProfile(name.trim(), parseInt(age), grade!, gender!);
            store.setStarterAvatar(selectedAvatar.hat, selectedAvatar.face, selectedAvatar.shirt, selectedAvatar.accessory);
            const words = QUIZ_WORDS[grade!];
            setQuizWords(words);
            // Set up letter bank for first word
            setAvailableLetters(shuffleLetters(words[0].word));
            setStep("quiz");
          }}
          disabled={!selectedAvatar}
          className={`mt-6 cursor-pointer rounded-xl px-8 py-4 text-lg font-bold text-white transition ${
            selectedAvatar
              ? "bg-purple-mid hover:bg-purple-dark"
              : "cursor-not-allowed bg-gray-700"
          }`}
        >
          Start the Quiz!
        </button>
      </div>
    );
  }

  // ── Quiz Screen (click letters!) ───────────────────────────────

  if (step === "quiz" && !quizDone) {
    const word = quizWords[current];
    const total = quizWords.length;

    function handleLetterClick(letter: string, idx: number) {
      if (feedback) return;
      const newGuess = guess + letter;
      setGuess(newGuess);
      // Remove used letter
      const newAvail = [...availableLetters];
      newAvail.splice(idx, 1);
      setAvailableLetters(newAvail);

      // Auto-check when full
      if (newGuess.length === word.word.length) {
        if (newGuess.toUpperCase() === word.word) {
          setFeedback("correct");
          setScore((s) => s + 1);
          setTimeout(goNext, 1000);
        } else {
          setFeedback("wrong");
          setTimeout(goNext, 1500);
        }
      }
    }


    function goNext() {
      if (current < total - 1) {
        const nextWord = quizWords[current + 1];
        setCurrent((c) => c + 1);
        setGuess("");
        setFeedback(null);
        setAvailableLetters(shuffleLetters(nextWord.word));
      } else {
        const finalScore = score + (feedback === "correct" ? 1 : 0);
        const gradeNum = grade!;
        let level: Grade;
        if (finalScore >= 5) level = Math.min(6, gradeNum + 1) as Grade;
        else if (finalScore >= 3) level = gradeNum;
        else level = Math.max(1, gradeNum - 1) as Grade;
        setAssessedLevel(level);
        setQuizDone(true);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    }

    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <Sparkles />
        <h2 className="rainbow-sparkle mb-2 text-2xl font-bold">Spelling Quiz</h2>
        <p className="mb-6 text-white/60">
          Tap the letters to spell the word, {name}!
        </p>

        {/* Progress */}
        <div className="mb-4 flex w-full max-w-sm items-center justify-between text-sm text-white/50">
          <span>Word {current + 1} of {total}</span>
          <span>Score: {score}</span>
        </div>
        <div className="mb-6 h-2 w-full max-w-sm overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-mid to-blue-500 transition-all"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>

        {/* Spelling Rule badge */}
        <div className="mb-3 w-full max-w-sm text-center">
          <span className="inline-block rounded-full bg-purple-mid/20 border border-purple-mid/30 px-4 py-1 text-xs font-bold text-purple-light">
            Spelling Rule: {word.rule}
          </span>
        </div>

        {/* Hint + Sentence */}
        <div className="mb-4 w-full max-w-sm rounded-xl border border-purple-mid/20 bg-gray-900/80 p-4">
          <p className="text-sm text-blue-300">{word.hint}</p>
          <p className="mt-2 text-lg text-white/80">
            {word.sentence.replace("___", "_ ".repeat(word.word.length).trim())}
          </p>
        </div>

        {/* Answer tiles */}
        <div className="mb-4 flex justify-center">
          <div className="flex gap-2">
            {word.word.split("").map((letter, i) => {
              const typed = guess.toUpperCase()[i];
              const isCorrect = typed === letter;
              return (
                <span
                  key={i}
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-xl font-bold transition ${
                    typed
                      ? feedback === "correct"
                        ? "animate-pop border-green-500 bg-green-900/30 text-green-400"
                        : feedback === "wrong"
                          ? "border-red-500 bg-red-900/30 text-red-400"
                          : isCorrect
                            ? "border-green-500 bg-green-900/30 text-green-400"
                            : "border-purple-mid/50 bg-gray-900 text-purple-light"
                      : "border-purple-mid/30 bg-gray-900 text-white/20"
                  }`}
                >
                  {typed || "_"}
                </span>
              );
            })}
          </div>
        </div>

        {/* Click-to-spell letter buttons */}
        {!feedback && (
          <div className="mb-3 flex flex-wrap justify-center gap-2">
            {availableLetters.map((letter, i) => (
              <button
                key={`${letter}-${i}`}
                onClick={() => handleLetterClick(letter, i)}
                className="hover-bounce flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border-2 border-purple-mid/50 bg-gray-900 text-xl font-bold text-white transition hover:border-purple-mid hover:bg-purple-mid/20 hover:scale-110"
              >
                {letter}
              </button>
            ))}
          </div>
        )}


        {feedback === "correct" && (
          <p className="animate-bounce-in text-lg font-semibold text-green-400">✅ Correct!</p>
        )}
        {feedback === "wrong" && (
          <p className="animate-bounce-in text-lg font-semibold text-orange-400">
            The answer was: <span className="text-white">{word.word}</span>
          </p>
        )}
      </div>
    );
  }

  // ── Results Screen ─────────────────────────────────────────────
  if (step === "quiz" && quizDone) {
  const levelEmoji: Record<Grade, string> = {
    1: "🌱", 2: "🌿", 3: "🌳", 4: "🚀", 5: "⭐", 6: "🏆",
  };

  const level = assessedLevel ?? (grade ?? 1);
  const total = quizWords.length;

  // Don't show actual grade if below - just be encouraging
  let message: string;
  if (level > grade!) {
    message = `Wow ${name}, you're amazing! We've got some extra challenges for you!`;
  } else if (level < grade!) {
    message = `Great job ${name}! We've made a special course just for you to help you grow!`;
  } else {
    message = `Awesome ${name}! Your spelling is right on track. Let's keep building your skills!`;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <Sparkles />
      <span className="animate-bounce-in text-7xl">{levelEmoji[level as Grade]}</span>
      <h2 className="rainbow-sparkle mt-4 text-3xl font-bold">Quiz Complete!</h2>
      <p className="mt-3 text-lg text-white/80">
        You got <span className="font-bold text-green-400">{score}</span> out of {total} correct!
      </p>

      <div className="animate-slide-up mt-6 rounded-2xl border-2 border-purple-mid/40 bg-gray-900 p-6">
        <p className="text-sm text-white/60">Your spelling level</p>
        <p className="mt-1 text-2xl font-bold text-purple-light">
          {levelEmoji[level as Grade]} Ready to Learn!
        </p>
      </div>

      <p className="mt-4 max-w-md text-white/70">{message}</p>
      <p className="mt-2 text-yellow-300">🎁 You got 5 bonus stars to start!</p>

      <button
        onClick={() => {
          store.earnStars(5);
          store.addInventoryEntry({
            type: "quiz",
            title: "Placement Quiz",
            score,
            total: quizWords.length,
            starsEarned: 5,
            date: new Date().toISOString(),
          });
          setStep("journey");
        }}
        className="mt-8 hover-bounce cursor-pointer rounded-2xl bg-purple-mid px-8 py-4 text-xl font-bold text-white transition hover:-translate-y-1 hover:bg-purple-dark hover:shadow-xl"
      >
        Next: Pick Your Journey!
      </button>
    </div>
  );
  }

  // ── Journey Picker (Rocket or Bee) ─────────────────────────────


  if (step === "journey") {
    const level = assessedLevel ?? (grade ?? 1);

    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <Sparkles />
        <h2 className="rainbow-sparkle mb-2 text-3xl font-bold">Pick Your Journey!</h2>
        <p className="mb-8 max-w-md text-white/60">
          How do you want to travel through your spelling adventure?
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full max-w-lg">
          {/* Rocket option */}
          <button
            onClick={() => {
              store.setJourneyType("rocket");
              store.completeQuiz(score, level as Grade);
            }}
            className="hover-bounce group cursor-pointer rounded-3xl border-3 border-blue-500/30 bg-gradient-to-b from-blue-900/40 to-purple-900/40 p-8 text-center transition-all hover:border-blue-400 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/20"
          >
            {/* Rocket SVG */}
            <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto" fill="none">
              {/* Stars in background */}
              <circle cx="15" cy="20" r="2" fill="#ffd700" opacity="0.6" />
              <circle cx="100" cy="30" r="1.5" fill="#ffd700" opacity="0.5" />
              <circle cx="25" cy="90" r="1" fill="#ffd700" opacity="0.4" />
              <circle cx="95" cy="80" r="2" fill="#ffd700" opacity="0.5" />

              {/* Rocket body */}
              <ellipse cx="60" cy="50" rx="16" ry="32" fill="#e0e0e0" />
              <ellipse cx="60" cy="50" rx="12" ry="28" fill="#f5f5f5" />

              {/* Rocket nose */}
              <path d="M 48 22 Q 60 5 72 22" fill="#ef5350" />
              <path d="M 52 22 Q 60 10 68 22" fill="#ff7043" opacity="0.6" />

              {/* Window */}
              <circle cx="60" cy="42" r="8" fill="#42a5f5" />
              <circle cx="60" cy="42" r="6" fill="#90caf9" />
              <ellipse cx="57" cy="39" rx="2.5" ry="2" fill="white" opacity="0.6" />

              {/* Fins */}
              <path d="M 44 65 L 34 82 L 48 72 Z" fill="#ef5350" />
              <path d="M 76 65 L 86 82 L 72 72 Z" fill="#ef5350" />

              {/* Fire */}
              <ellipse cx="60" cy="85" rx="10" ry="14" fill="#ff9800" opacity="0.8" />
              <ellipse cx="60" cy="88" rx="6" ry="10" fill="#ffeb3b" opacity="0.8" />
              <ellipse cx="60" cy="90" rx="3" ry="6" fill="white" opacity="0.5" />

              {/* Planet */}
              <circle cx="95" cy="100" r="12" fill="#7e57c2" opacity="0.6" />
              <ellipse cx="95" cy="100" rx="16" ry="3" fill="#b39ddb" opacity="0.4" />
            </svg>

            <h3 className="mt-4 text-2xl font-bold text-blue-300 group-hover:text-blue-200">
              Rocket Ship
            </h3>
            <p className="mt-2 text-sm text-white/50">
              Blast off from planet to planet as you complete each lesson!
            </p>
          </button>

          {/* Bee option */}
          <button
            onClick={() => {
              store.setJourneyType("bee");
              store.completeQuiz(score, level as Grade);
            }}
            className="hover-bounce group cursor-pointer rounded-3xl border-3 border-yellow-500/30 bg-gradient-to-b from-yellow-900/30 to-green-900/30 p-8 text-center transition-all hover:border-yellow-400 hover:-translate-y-2 hover:shadow-xl hover:shadow-yellow-500/20"
          >
            {/* Bee SVG */}
            <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto" fill="none">
              {/* Flowers in background */}
              <circle cx="20" cy="100" r="8" fill="#f48fb1" opacity="0.4" />
              <circle cx="20" cy="100" r="4" fill="#fff176" opacity="0.5" />
              <circle cx="95" cy="95" r="10" fill="#ce93d8" opacity="0.4" />
              <circle cx="95" cy="95" r="5" fill="#fff176" opacity="0.5" />
              {/* Stems */}
              <line x1="20" y1="108" x2="20" y2="120" stroke="#66bb6a" strokeWidth="2" />
              <line x1="95" y1="105" x2="95" y2="120" stroke="#66bb6a" strokeWidth="2" />

              {/* Bee body */}
              <ellipse cx="60" cy="50" rx="22" ry="18" fill="#ffd54f" />
              {/* Stripes */}
              <rect x="48" y="44" width="24" height="4" rx="2" fill="#3e2723" />
              <rect x="46" y="52" width="28" height="4" rx="2" fill="#3e2723" />

              {/* Head */}
              <circle cx="60" cy="30" r="12" fill="#ffd54f" />

              {/* Eyes */}
              <circle cx="55" cy="28" r="4" fill="#1a0e05" />
              <circle cx="65" cy="28" r="4" fill="#1a0e05" />
              <circle cx="53.5" cy="26.5" r="1.5" fill="white" opacity="0.9" />
              <circle cx="63.5" cy="26.5" r="1.5" fill="white" opacity="0.9" />

              {/* Smile */}
              <path d="M 55 34 Q 60 38 65 34" stroke="#5d4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Blush */}
              <ellipse cx="50" cy="32" rx="3" ry="2" fill="#ff8a80" opacity="0.4" />
              <ellipse cx="70" cy="32" rx="3" ry="2" fill="#ff8a80" opacity="0.4" />

              {/* Wings */}
              <ellipse cx="42" cy="40" rx="14" ry="10" fill="#e3f2fd" opacity="0.7" transform="rotate(-20 42 40)" />
              <ellipse cx="78" cy="40" rx="14" ry="10" fill="#e3f2fd" opacity="0.7" transform="rotate(20 78 40)" />

              {/* Antennae */}
              <line x1="55" y1="20" x2="48" y2="10" stroke="#5d4037" strokeWidth="1.5" />
              <circle cx="48" cy="10" r="2.5" fill="#5d4037" />
              <line x1="65" y1="20" x2="72" y2="10" stroke="#5d4037" strokeWidth="1.5" />
              <circle cx="72" cy="10" r="2.5" fill="#5d4037" />

              {/* Stinger */}
              <path d="M 80 50 L 88 52 L 80 54" fill="#5d4037" />

              {/* Trail dots */}
              <circle cx="100" cy="45" r="2" fill="#ffd54f" opacity="0.3" />
              <circle cx="108" cy="40" r="1.5" fill="#ffd54f" opacity="0.2" />
            </svg>

            <h3 className="mt-4 text-2xl font-bold text-yellow-300 group-hover:text-yellow-200">
              Busy Bee
            </h3>
            <p className="mt-2 text-sm text-white/50">
              Fly from flower to flower as you complete each lesson!
            </p>
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// Helper to shuffle letters for click-to-spell
function shuffleLetters(word: string): string[] {
  const letters = word.split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters;
}
