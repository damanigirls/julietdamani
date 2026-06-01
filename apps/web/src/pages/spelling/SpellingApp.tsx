import { useState } from "react";
import Sparkles from "@/components/Sparkles";
import { Link } from "react-router-dom";
import { useSpellingStore } from "./useSpellingStore";
import QuizFlow from "./QuizFlow";
import DashboardTab from "./DashboardTab";
import LessonsTab from "./LessonsTab";
import GamesTab from "./GamesTab";
import AvatarTab from "./AvatarTab";
import InventoryTab from "./InventoryTab";
import BattleTab from "./BattleTab";

const TABS = ["Dashboard", "Lessons", "Games", "Battle", "Inventory", "My Character"] as const;
type Tab = (typeof TABS)[number];

const TAB_EMOJI: Record<Tab, string> = {
  Dashboard: "📊",
  Lessons: "📚",
  Games: "🎮",
  Battle: "⚔️",
  Inventory: "📦",
  "My Character": "🧸",
};

export default function SpellingApp() {
  const [activeTab, setActiveTab] = useState<Tab>("Dashboard");
  const store = useSpellingStore();

  // Show quiz flow if they haven't completed it yet
  if (!store.state.quizCompleted) {
    return <QuizFlow store={store} />;
  }


  return (
    <div className="relative min-h-screen">
      <Sparkles />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-black px-6 pt-14 pb-8 text-center text-white">
        <Link to="/" className="absolute top-4 left-4 text-sm text-white/60 hover:text-white transition">
          &larr; Home
        </Link>
        <button
          onClick={() => store.resetProfile()}
          className="absolute top-4 right-4 cursor-pointer text-xs text-white/30 hover:text-white/60 transition"
        >
          Retake Quiz
        </button>
        <span className="animate-float text-6xl">📝</span>
        <h1 className="rainbow-sparkle mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
          Spelling Adventure
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Hey <span className="font-bold text-white">{store.state.name}</span>! {store.state.gender === "girl" ? "👧" : "👦"}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="animate-heart-beat inline-flex items-center gap-1 rounded-full bg-yellow-900/50 px-4 py-1.5 text-base font-bold text-yellow-300">
            ⭐ {store.state.stars}
          </span>
          {/* Prize Shop Button - goes to My Character tab */}
          <button
            onClick={() => setActiveTab("My Character")}
            className="hover-bounce cursor-pointer rounded-full bg-pink-600 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-pink-500"
          >
            🛍️ Shop
          </button>
        </div>
      </section>

      {/* Tabs - scrollable on mobile */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 cursor-pointer border-b-2 px-3 py-3 text-center text-xs font-semibold transition-all whitespace-nowrap sm:flex-1 sm:text-sm ${
                activeTab === tab
                  ? "border-purple-mid text-purple-light"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              {TAB_EMOJI[tab]} {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        {activeTab === "Dashboard" && <DashboardTab store={store} />}
        {activeTab === "Lessons" && <LessonsTab store={store} />}
        {activeTab === "Games" && <GamesTab store={store} />}
        {activeTab === "Battle" && <BattleTab store={store} />}
        {activeTab === "Inventory" && <InventoryTab store={store} />}
        {activeTab === "My Character" && <AvatarTab store={store} />}
      </div>

      {/* Footer */}
      <footer className="bg-black px-6 py-8 text-center text-white">
        <p className="rainbow-sparkle font-medium">Spelling Adventure 📝</p>
        <p className="mt-1 text-sm text-white/50">Built by Juliet with vibe coding</p>
      </footer>
    </div>
  );
}
