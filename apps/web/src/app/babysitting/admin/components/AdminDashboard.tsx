"use client";

import { useCallback, useEffect, useState } from "react";
import type { BabysittingRequest } from "@/lib/types";
import { getRequests } from "@/lib/api";
import RequestCard from "./RequestCard";

const TABS = ["all", "pending", "accepted", "completed", "declined"] as const;

export default function AdminDashboard() {
  const [passphrase, setPassphrase] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [requests, setRequests] = useState<BabysittingRequest[]>([]);
  const [tab, setTab] = useState<string>("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRequests(passphrase);
      setRequests(data);
      setLoggedIn(true);
    } catch {
      setError("Invalid passphrase");
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, [passphrase]);

  useEffect(() => {
    if (loggedIn) fetchRequests();
  }, [loggedIn, fetchRequests]);

  const filtered =
    tab === "all" ? requests : requests.filter((r) => r.status === tab);

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    completed: requests.filter((r) => r.status === "completed").length,
    declined: requests.filter((r) => r.status === "declined").length,
  };

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-2xl bg-gray-900 p-8 text-center shadow-lg">
          <span className="text-5xl">🔒</span>
          <h2 className="rainbow-sparkle mt-4 text-2xl font-bold">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Enter your passphrase to manage requests
          </p>
          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchRequests();
            }}
            className="mt-6"
          >
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Passphrase"
              className="w-full rounded-lg border-2 border-purple-mid bg-gray-800 px-4 py-2 text-center text-white outline-none focus:border-purple-light"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-purple-mid py-2 font-bold text-white hover:bg-purple-dark disabled:opacity-50"
            >
              {loading ? "Loading..." : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="rainbow-sparkle text-3xl font-bold">
        🍼 Babysitting Requests
      </h1>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "bg-purple-mid text-white"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="mt-6 grid gap-4">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-white/50">
            No {tab === "all" ? "" : tab} requests yet
          </p>
        ) : (
          filtered.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              passphrase={passphrase}
              onUpdate={fetchRequests}
            />
          ))
        )}
      </div>
    </div>
  );
}
