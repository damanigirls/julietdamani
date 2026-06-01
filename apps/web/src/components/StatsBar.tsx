import type { BabysittingStats } from "@/lib/types";

export default function StatsBar({ stats }: { stats: BabysittingStats }) {
  if (stats.total_completed === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-6 rounded-2xl bg-gray-900/80 px-8 py-4 text-white shadow-sm">
      <div className="text-center">
        <p className="text-2xl font-bold">{stats.total_completed}</p>
        <p className="text-sm">Happy Families</p>
      </div>
      {stats.total_reviews > 0 && (
        <>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.average_rating} ★</p>
            <p className="text-sm">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.total_reviews}</p>
            <p className="text-sm">Reviews</p>
          </div>
        </>
      )}
    </div>
  );
}
