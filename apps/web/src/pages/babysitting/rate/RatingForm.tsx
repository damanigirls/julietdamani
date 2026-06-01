import { useState } from "react";
import confetti from "canvas-confetti";
import { submitRating } from "@/lib/api";
import StarRating from "@/components/StarRating";

export default function RatingForm({ token }: { token: string }) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stars === 0) {
      setError("Please select a star rating");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await submitRating(token, stars, comment);
      setSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#a855f7", "#7c3aed", "#f59e0b", "#ec4899"],
      });
    } catch {
      setError("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl bg-gray-900 p-8 text-center shadow-lg">
        <span className="text-6xl">💜</span>
        <h3 className="rainbow-sparkle mt-4 text-2xl font-bold">
          Thank You!
        </h3>
        <p className="mt-2 text-white/70">
          Your feedback means a lot to Juliet!
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-gray-900 p-8 shadow-lg"
    >
      <h3 className="rainbow-sparkle mb-2 text-xl font-bold">
        How was the babysitting?
      </h3>
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="flex justify-center py-4">
        <StarRating value={stars} onChange={setStars} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Leave a comment (optional)"
        className="w-full rounded-lg border-2 border-purple-mid bg-gray-800 px-4 py-2 text-white outline-none focus:border-purple-light"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-full bg-purple-mid py-3 font-bold text-white transition-colors hover:bg-purple-dark disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Rating ⭐"}
      </button>
    </form>
  );
}
