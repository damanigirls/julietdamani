import { getStats } from "@/lib/api";
import BookingForm from "./components/BookingForm";
import StatsBar from "./components/StatsBar";
import Sparkles from "../Sparkles";

export default async function BabysittingHome() {
  const stats = await getStats();

  return (
    <div className="relative min-h-screen">
      <Sparkles />
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-black px-6 py-20 text-center text-white">
        <span className="animate-float text-7xl">🍼</span>
        <h1 className="rainbow-sparkle mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
          Juliet&apos;s Babysitting Service
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
        <p className="rainbow-sparkle font-medium">Juliet&apos;s Babysitting Service 🍼</p>
        <p className="mt-1 text-sm text-white/50">
          Built by Juliet with vibe coding
        </p>
      </footer>
    </div>
  );
}
