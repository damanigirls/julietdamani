import { useState } from "react";
import Sparkles from "@/components/Sparkles";
import QuizTab from "./QuizTab";
import LearningTab from "./LearningTab";
import LeaderboardTab from "./LeaderboardTab";
import { Link } from "react-router-dom";

const TABS = ["Quizzes & Trivia", "Learning Station", "Leaderboard"] as const;
type Tab = (typeof TABS)[number];

export default function CoralReef() {
  const [activeTab, setActiveTab] = useState<Tab>("Quizzes & Trivia");

  return (
    <div className="relative min-h-screen">
      <Sparkles />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-black px-6 pt-16 pb-10 text-center text-white">
        <Link to="/" className="absolute top-4 left-4 text-sm text-white/60 hover:text-white">
          &larr; Home
        </Link>
        <span className="animate-float text-7xl">🪸</span>
        <h1 className="rainbow-sparkle mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
          Coral Reef Quiz
        </h1>
        <p className="rainbow-sparkle mt-3 max-w-lg text-lg sm:text-xl">
          Learn about coral reefs, test your knowledge, and climb the leaderboard!
        </p>
      </section>

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 cursor-pointer border-b-2 px-4 py-3 text-center text-sm font-semibold transition-colors sm:text-base ${
                activeTab === tab
                  ? "border-purple-mid text-purple-light"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              {tab === "Quizzes & Trivia" && "🧠 "}
              {tab === "Learning Station" && "📚 "}
              {tab === "Leaderboard" && "🏆 "}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-3xl px-4 py-10">
        {activeTab === "Quizzes & Trivia" && <QuizTab />}
        {activeTab === "Learning Station" && <LearningTab />}
        {activeTab === "Leaderboard" && <LeaderboardTab />}
      </div>

      {/* Footer */}
      <footer className="bg-black px-6 py-8 text-center text-white">
        <p className="rainbow-sparkle font-medium">Coral Reef Quiz 🪸</p>
        <p className="mt-1 text-sm text-white/50">Built by Juliet with vibe coding</p>
      </footer>
    </div>
  );
}
