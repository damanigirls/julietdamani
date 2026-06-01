import { useState } from "react";

type Question = {
  question: string;
  options: string[];
  answer: number;
  fact: string;
};

const QUESTIONS: Question[] = [
  {
    question: "What are coral reefs mainly made of?",
    options: ["Rocks", "Tiny animal skeletons", "Seaweed", "Sand"],
    answer: 1,
    fact: "Coral reefs are built by tiny animals called coral polyps that create hard skeletons made of calcium carbonate!",
  },
  {
    question: "What percentage of ocean life depends on coral reefs?",
    options: ["5%", "10%", "25%", "50%"],
    answer: 2,
    fact: "About 25% of all marine species depend on coral reefs, even though reefs cover less than 1% of the ocean floor!",
  },
  {
    question: "What is coral bleaching?",
    options: [
      "When coral turns white from stress",
      "When coral gets painted",
      "When coral grows too fast",
      "When coral is cleaned by fish",
    ],
    answer: 0,
    fact: "Coral bleaching happens when warm water stresses coral and it expels the colorful algae living inside it, turning white.",
  },
  {
    question: "Where is the largest coral reef in the world?",
    options: ["Caribbean Sea", "Red Sea", "Australia", "Hawaii"],
    answer: 2,
    fact: "The Great Barrier Reef in Australia is the largest coral reef system, stretching over 1,400 miles!",
  },
  {
    question: "What gives coral its bright colors?",
    options: ["Paint", "Tiny algae called zooxanthellae", "Minerals", "The sun"],
    answer: 1,
    fact: "Tiny algae called zooxanthellae live inside coral and give it beautiful colors while also providing food through photosynthesis!",
  },
  {
    question: "How old can coral reefs be?",
    options: ["100 years", "1,000 years", "Millions of years", "10 years"],
    answer: 2,
    fact: "Some coral reef systems are millions of years old! The Great Barrier Reef started forming about 500,000 years ago.",
  },
  {
    question: "Which fish is famous for living in coral reefs?",
    options: ["Salmon", "Clownfish", "Tuna", "Goldfish"],
    answer: 1,
    fact: "Clownfish live among sea anemones on coral reefs. They are immune to the anemone's sting!",
  },
  {
    question: "What is the biggest threat to coral reefs today?",
    options: ["Sharks", "Climate change", "Tides", "Whales"],
    answer: 1,
    fact: "Climate change causes ocean warming and acidification, which are the biggest threats to coral reefs worldwide.",
  },
  {
    question: "What type of ecosystem is a coral reef?",
    options: ["Desert", "Forest", "Marine", "Freshwater"],
    answer: 2,
    fact: "Coral reefs are marine ecosystems found in warm, shallow ocean waters, often called the 'rainforests of the sea'!",
  },
  {
    question: "How do coral polyps catch food?",
    options: [
      "With tiny tentacles",
      "By swimming",
      "They don't eat",
      "With their roots",
    ],
    answer: 0,
    fact: "Coral polyps use tiny tentacles to catch small organisms called plankton that float by in the water!",
  },
];

export default function QuizTab() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const q = QUESTIONS[current];

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.answer) setScore((s) => s + 1);
  }

  function handleNext() {
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setShowResult(true);
      // Save score to leaderboard
      const name = localStorage.getItem("coral-quiz-name") || "Player";
      const leaderboard = JSON.parse(localStorage.getItem("coral-leaderboard") || "[]");
      leaderboard.push({ name, score: answered && selected === q.answer ? score : score, date: new Date().toISOString() });
      leaderboard.sort((a: { score: number }, b: { score: number }) => b.score - a.score);
      localStorage.setItem("coral-leaderboard", JSON.stringify(leaderboard.slice(0, 10)));
    }
  }

  function handleRestart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="text-7xl">
          {score >= 8 ? "🏆" : score >= 5 ? "⭐" : "🌊"}
        </span>
        <h2 className="rainbow-sparkle mt-4 text-3xl font-bold">Quiz Complete!</h2>
        <p className="mt-3 text-xl text-white">
          You got <span className="font-bold text-purple-light">{score}</span> out of{" "}
          <span className="font-bold">{QUESTIONS.length}</span> correct!
        </p>
        <p className="mt-2 text-white/60">
          {score >= 8
            ? "Amazing! You're a coral reef expert!"
            : score >= 5
              ? "Great job! You know a lot about coral reefs!"
              : "Keep learning! Coral reefs are fascinating!"}
        </p>
        <button
          onClick={handleRestart}
          className="mt-6 cursor-pointer rounded-xl bg-purple-mid px-6 py-3 font-bold text-white transition hover:bg-purple-dark"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Name input */}
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm text-white/60">Your Name:</label>
        <input
          type="text"
          defaultValue={localStorage.getItem("coral-quiz-name") || ""}
          onChange={(e) => localStorage.setItem("coral-quiz-name", e.target.value)}
          placeholder="Enter your name"
          className="rounded-lg border border-purple-mid/30 bg-gray-900 px-3 py-1.5 text-sm text-white outline-none focus:border-purple-mid"
        />
      </div>

      {/* Progress */}
      <div className="mb-4 flex items-center justify-between text-sm text-white/60">
        <span>
          Question {current + 1} of {QUESTIONS.length}
        </span>
        <span>Score: {score}</span>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-mid to-blue-500 transition-all"
          style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <h3 className="mb-6 text-xl font-bold text-white sm:text-2xl">{q.question}</h3>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {q.options.map((opt, idx) => {
          let style = "border-purple-mid/30 bg-gray-900 hover:border-purple-mid/60";
          if (answered) {
            if (idx === q.answer) style = "border-green-500 bg-green-900/30";
            else if (idx === selected) style = "border-red-500 bg-red-900/30";
          } else if (idx === selected) {
            style = "border-purple-mid bg-purple-dark/20";
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`cursor-pointer rounded-xl border-2 px-5 py-3 text-left font-medium text-white transition ${style}`}
            >
              <span className="mr-2 text-white/40">
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Fact + Next */}
      {answered && (
        <div className="mt-6">
          <div className="rounded-xl border border-blue-500/30 bg-blue-900/20 p-4">
            <p className="text-sm font-semibold text-blue-300">Did you know?</p>
            <p className="mt-1 text-sm text-white/80">{q.fact}</p>
          </div>
          <button
            onClick={handleNext}
            className="mt-4 cursor-pointer rounded-xl bg-purple-mid px-6 py-3 font-bold text-white transition hover:bg-purple-dark"
          >
            {current < QUESTIONS.length - 1 ? "Next Question" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}
