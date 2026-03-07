"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { submitRequest } from "@/lib/api";

export default function BookingForm() {
  const [form, setForm] = useState({
    parent_name: "",
    parent_email: "",
    parent_phone: "",
    date_needed: "",
    time_needed: "",
    num_kids: 1,
    kids_names: "",
    kids_ages: "",
    special_instructions: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await submitRequest(form);
      setSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#a855f7", "#7c3aed", "#3b82f6", "#ec4899"],
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
        <span className="text-6xl">🎉</span>
        <h3 className="rainbow-sparkle mt-4 text-2xl font-bold">
          Request Submitted!
        </h3>
        <p className="mt-2 text-white/70">
          Thanks! Juliet will review your request and get back to you soon.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setForm({
              parent_name: "",
              parent_email: "",
              parent_phone: "",
              date_needed: "",
              time_needed: "",
              num_kids: 1,
              kids_names: "",
              kids_ages: "",
              special_instructions: "",
            });
          }}
          className="mt-6 rounded-full bg-purple-mid px-6 py-2 font-medium text-white transition-colors hover:bg-purple-dark"
        >
          Book Again
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-gray-900 p-8 shadow-lg"
    >
      <h3 className="rainbow-sparkle mb-6 text-2xl font-bold">
        Book Babysitting
      </h3>
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-white">
            Your Name *
          </label>
          <input
            required
            type="text"
            value={form.parent_name}
            onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
            className="w-full rounded-lg border-2 border-purple-mid bg-gray-800 px-4 py-2 text-white outline-none focus:border-purple-mid"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white">
            Email *
          </label>
          <input
            required
            type="email"
            value={form.parent_email}
            onChange={(e) => setForm({ ...form, parent_email: e.target.value })}
            className="w-full rounded-lg border-2 border-purple-mid bg-gray-800 px-4 py-2 text-white outline-none focus:border-purple-mid"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white">
            Phone *
          </label>
          <input
            required
            type="tel"
            value={form.parent_phone}
            onChange={(e) => setForm({ ...form, parent_phone: e.target.value })}
            className="w-full rounded-lg border-2 border-purple-mid bg-gray-800 px-4 py-2 text-white outline-none focus:border-purple-mid"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white">
            Date Needed *
          </label>
          <input
            required
            type="date"
            value={form.date_needed}
            onChange={(e) => setForm({ ...form, date_needed: e.target.value })}
            className="w-full rounded-lg border-2 border-purple-mid bg-gray-800 px-4 py-2 text-white outline-none focus:border-purple-mid"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white">
            Time *
          </label>
          <input
            required
            type="text"
            placeholder="e.g. 6:00 PM - 9:00 PM"
            value={form.time_needed}
            onChange={(e) => setForm({ ...form, time_needed: e.target.value })}
            className="w-full rounded-lg border-2 border-purple-mid bg-gray-800 px-4 py-2 text-white outline-none focus:border-purple-mid"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white">
            Number of Kids *
          </label>
          <input
            required
            type="number"
            min={1}
            value={form.num_kids}
            onChange={(e) =>
              setForm({ ...form, num_kids: parseInt(e.target.value) || 1 })
            }
            className="w-full rounded-lg border-2 border-purple-mid bg-gray-800 px-4 py-2 text-white outline-none focus:border-purple-mid"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white">
            Kids&apos; Names *
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Emma, Liam"
            value={form.kids_names}
            onChange={(e) => setForm({ ...form, kids_names: e.target.value })}
            className="w-full rounded-lg border-2 border-purple-mid bg-gray-800 px-4 py-2 text-white outline-none focus:border-purple-mid"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white">
            Kids&apos; Ages *
          </label>
          <input
            required
            type="text"
            placeholder="e.g. 3, 5, 7"
            value={form.kids_ages}
            onChange={(e) => setForm({ ...form, kids_ages: e.target.value })}
            className="w-full rounded-lg border-2 border-purple-mid bg-gray-800 px-4 py-2 text-white outline-none focus:border-purple-mid"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-white">
          Special Instructions
        </label>
        <textarea
          value={form.special_instructions}
          onChange={(e) =>
            setForm({ ...form, special_instructions: e.target.value })
          }
          rows={3}
          placeholder="Allergies, bedtime routines, etc."
          className="w-full rounded-lg border-2 border-purple-mid bg-gray-800 px-4 py-2 text-white outline-none focus:border-purple-mid"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-purple-mid py-3 font-bold text-white transition-colors hover:bg-purple-dark disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Request Babysitting 🍼"}
      </button>
    </form>
  );
}
