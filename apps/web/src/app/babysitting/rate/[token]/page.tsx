import { getRatingInfo } from "@/lib/api";
import RatingForm from "./RatingForm";

export default async function RatePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const info = await getRatingInfo(token);

  return (
    <div className="min-h-screen">
      <section className="bg-black px-6 py-16 text-center text-white">
        <span className="text-5xl">⭐</span>
        <h1 className="rainbow-sparkle mt-4 text-3xl font-bold sm:text-4xl">
          Rate Your Experience
        </h1>
        <p className="rainbow-sparkle mt-2">
          Juliet&apos;s Babysitting Service
        </p>
      </section>

      <section className="mx-auto max-w-md px-6 py-12">
        {info ? (
          <>
            <p className="mb-6 text-center text-sm text-white/60">
              Babysitting for {info.parent_name} on {info.date_needed} (
              {info.time_needed})
            </p>
            <RatingForm token={token} />
          </>
        ) : (
          <div className="rounded-2xl bg-gray-900 p-8 text-center shadow-lg">
            <span className="text-5xl">🤔</span>
            <h3 className="rainbow-sparkle mt-4 text-xl font-bold">
              Oops!
            </h3>
            <p className="mt-2 text-white/70">
              This rating link is invalid, the service hasn&apos;t been
              completed yet, or it has already been rated.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
