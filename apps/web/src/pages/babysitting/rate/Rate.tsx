import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRatingInfo } from "@/lib/api";
import type { RatingInfo } from "@/lib/types";
import RatingForm from "./RatingForm";

export default function Rate() {
  const { token } = useParams<{ token: string }>();
  const [info, setInfo] = useState<RatingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getRatingInfo(token)
      .then((data: RatingInfo | null) => setInfo(data))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="rainbow-sparkle text-2xl font-bold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-black px-6 py-16 text-center text-white">
        <span className="text-5xl">⭐</span>
        <h1 className="rainbow-sparkle mt-4 text-3xl font-bold sm:text-4xl">
          Rate Your Experience
        </h1>
        <p className="rainbow-sparkle mt-2">
          Juliet's Babysitting Service
        </p>
      </section>

      <section className="mx-auto max-w-md px-6 py-12">
        {info ? (
          <>
            <p className="mb-6 text-center text-sm text-white/60">
              Babysitting for {info.parent_name} on {info.date_needed} (
              {info.time_needed})
            </p>
            <RatingForm token={token!} />
          </>
        ) : (
          <div className="rounded-2xl bg-gray-900 p-8 text-center shadow-lg">
            <span className="text-5xl">🤔</span>
            <h3 className="rainbow-sparkle mt-4 text-xl font-bold">
              Oops!
            </h3>
            <p className="mt-2 text-white/70">
              This rating link is invalid, the service hasn't been
              completed yet, or it has already been rated.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
