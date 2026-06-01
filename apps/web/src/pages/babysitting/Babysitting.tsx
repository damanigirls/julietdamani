import { useEffect, useState } from "react";
import Sparkles from "@/components/Sparkles";
import StatsBar from "@/components/StatsBar";
import BookingForm from "./BookingForm";
import { getStats } from "@/lib/api";
import type { BabysittingStats } from "@/lib/types";

export default function Babysitting() {
  const [stats, setStats] = useState<BabysittingStats>({
    total_completed: 0,
    average_rating: 0,
    total_reviews: 0,
  });

  useEffect(() => {
    getStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen">
      <Sparkles />
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-black px-6 py-20 text-center text-white">
        <span className="animate-float text-7xl">🍼</span>
        <h1 className="rainbow-sparkle mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
          Juliet's Babysitting Service
        </h1>
        <p className="rainbow-sparkle mt-4 max-w-lg text-lg sm:text-xl">
          Reliable, fun, and caring babysitting by Juliet Damani
        </p>
        <div className="mt-8">
          <StatsBar stats={stats} />
        </div>
      </section>

      {/* Booking Form */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <BookingForm />
      </section>

      {/* Footer */}
      <footer className="bg-black px-6 py-8 text-center text-white">
        <p className="rainbow-sparkle font-medium">Juliet's Babysitting Service 🍼</p>
        <p className="mt-1 text-sm text-white/50">
          Built by Juliet with vibe coding
        </p>
      </footer>
    </div>
  );
}
