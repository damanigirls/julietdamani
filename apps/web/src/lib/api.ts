const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function submitRequest(data: {
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  date_needed: string;
  time_needed: string;
  num_kids: number;
  kids_ages: string;
  special_instructions: string;
}) {
  const res = await fetch(`${API_BASE}/api/babysitting/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit request");
  return res.json();
}

export async function getRequests(passphrase: string) {
  const res = await fetch(
    `${API_BASE}/api/babysitting/requests?passphrase=${encodeURIComponent(passphrase)}`,
  );
  if (res.status === 403) throw new Error("Invalid passphrase");
  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
}

export async function updateStatus(
  id: number,
  status: string,
  passphrase: string,
) {
  const res = await fetch(
    `${API_BASE}/api/babysitting/requests/${id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, passphrase }),
    },
  );
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export async function getRatingInfo(token: string) {
  const res = await fetch(
    `${API_BASE}/api/babysitting/requests/rate/${token}`,
  );
  if (!res.ok) return null;
  return res.json();
}

export async function submitRating(
  token: string,
  stars: number,
  comment: string,
) {
  const res = await fetch(
    `${API_BASE}/api/babysitting/requests/rate/${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stars, comment }),
    },
  );
  if (!res.ok) throw new Error("Failed to submit rating");
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_BASE}/api/babysitting/stats`, {
    cache: "no-store",
  });
  if (!res.ok) return { total_completed: 0, average_rating: 0, total_reviews: 0 };
  return res.json();
}
