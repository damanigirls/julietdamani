import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env, BabysittingRequestCreate, StatusUpdate, RatingSubmit } from "./types";

const app = new Hono<{ Bindings: Env }>();

app.use("/api/*", cors());

app.onError((err, c) => {
  return c.json({ error: err.message }, 500);
});

// --- Info endpoints ---

app.get("/api", (c) => {
  return c.json({ message: "Hello from Juliet's API!" });
});

app.get("/api/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/api/grade", (c) => {
  return c.json({
    question: "Which grade are you in?",
    answer: "I'm in 5th grade",
    grade: "5th",
  });
});

app.get("/api/about", (c) => {
  return c.json({
    name: "Juliet Damani",
    grade: "5th",
    tagline: "I vibe code apps for fun!",
    favoriteColor: "purple",
    funFacts: [
      { emoji: "5th", text: "I'm in 5th grade" },
      { emoji: "💻", text: "I host my apps on this site" },
      { emoji: "✨", text: "Coding is my superpower" },
      { emoji: "🎓", text: "I want to teach kids to be smart when I grow up" },
      { emoji: "🐠", text: "I built a coral reef website to help protect ocean life" },
      { emoji: "📋", text: "I am super hardworking" },
      { emoji: "💕", text: "I am kind and useful" },
      { emoji: "🍼", text: "I have a babysitting service" },
      { emoji: "🌍", text: "I care about the environment and how we can help it" },
    ],
  });
});

app.get("/api/projects", (c) => {
  return c.json({
    projects: [
      {
        title: "Robotics for Kids",
        description: "A guide to help kids learn robotics and have fun building cool stuff",
        emoji: "🤖",
        status: "live",
      },
      {
        title: "Babysitting Service",
        description: "Parents can book babysitting and rate the service",
        emoji: "🍼",
        status: "live",
      },
      {
        title: "Coral Reef Quiz",
        description: "Learn about coral reefs with quizzes, games, and a leaderboard",
        emoji: "🪸",
        status: "live",
      },
      {
        title: "This Website",
        description: "My personal intro site built with Next.js and Python",
        emoji: "🌐",
        status: "live",
      },
      {
        title: "Coming Soon",
        description: "More vibe coded apps on the way!",
        emoji: "🔮",
        status: "soon",
      },
    ],
  });
});

// --- Babysitting endpoints ---

app.post("/api/babysitting/requests", async (c) => {
  const body = await c.req.json<BabysittingRequestCreate>();
  const now = new Date().toISOString();
  const token = crypto.randomUUID();

  await c.env.DB.prepare(
    `INSERT INTO babysitting_requests
    (parent_name, parent_email, parent_phone, date_needed, time_needed,
     num_kids, kids_names, kids_ages, special_instructions, status,
     rating_token, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`
  )
    .bind(
      body.parent_name,
      body.parent_email,
      body.parent_phone,
      body.date_needed,
      body.time_needed,
      body.num_kids,
      body.kids_names || "",
      body.kids_ages,
      body.special_instructions || "",
      token,
      now,
      now
    )
    .run();

  const row = await c.env.DB.prepare(
    "SELECT * FROM babysitting_requests WHERE rating_token = ?"
  )
    .bind(token)
    .first();

  return c.json(row, 201);
});

app.get("/api/babysitting/requests", async (c) => {
  const passphrase = c.req.query("passphrase");
  const adminPass = c.env.BABYSITTING_ADMIN_PASS || "juliet123";

  if (passphrase !== adminPass) {
    return c.json({ detail: "Invalid passphrase" }, 403);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM babysitting_requests ORDER BY created_at DESC"
  ).all();

  return c.json(results);
});

app.patch("/api/babysitting/requests/:id/status", async (c) => {
  const id = parseInt(c.req.param("id"));
  const body = await c.req.json<StatusUpdate>();
  const adminPass = c.env.BABYSITTING_ADMIN_PASS || "juliet123";

  if (body.passphrase !== adminPass) {
    return c.json({ detail: "Invalid passphrase" }, 403);
  }

  const validTransitions: Record<string, string[]> = {
    pending: ["accepted", "declined"],
    accepted: ["completed"],
  };

  const row = await c.env.DB.prepare(
    "SELECT * FROM babysitting_requests WHERE id = ?"
  )
    .bind(id)
    .first();

  if (!row) return c.json({ detail: "Request not found" }, 404);

  const current = row.status as string;
  if (!validTransitions[current]?.includes(body.status)) {
    return c.json(
      { detail: `Cannot change from '${current}' to '${body.status}'` },
      400
    );
  }

  const now = new Date().toISOString();
  await c.env.DB.prepare(
    "UPDATE babysitting_requests SET status = ?, updated_at = ? WHERE id = ?"
  )
    .bind(body.status, now, id)
    .run();

  const updated = await c.env.DB.prepare(
    "SELECT * FROM babysitting_requests WHERE id = ?"
  )
    .bind(id)
    .first();

  return c.json(updated);
});

app.get("/api/babysitting/requests/rate/:token", async (c) => {
  const token = c.req.param("token");

  const row = await c.env.DB.prepare(
    "SELECT * FROM babysitting_requests WHERE rating_token = ?"
  )
    .bind(token)
    .first();

  if (!row) return c.json({ detail: "Request not found" }, 404);
  if (row.status !== "completed") {
    return c.json({ detail: "Service not yet completed" }, 400);
  }
  if (row.rating_stars !== null) {
    return c.json({ detail: "Already rated" }, 400);
  }

  return c.json({
    id: row.id,
    parent_name: row.parent_name,
    date_needed: row.date_needed,
    time_needed: row.time_needed,
    status: row.status,
  });
});

app.post("/api/babysitting/requests/rate/:token", async (c) => {
  const token = c.req.param("token");
  const body = await c.req.json<RatingSubmit>();

  if (body.stars < 1 || body.stars > 5) {
    return c.json({ detail: "Stars must be 1-5" }, 400);
  }

  const row = await c.env.DB.prepare(
    "SELECT * FROM babysitting_requests WHERE rating_token = ?"
  )
    .bind(token)
    .first();

  if (!row) return c.json({ detail: "Request not found" }, 404);
  if (row.status !== "completed") {
    return c.json({ detail: "Service not yet completed" }, 400);
  }
  if (row.rating_stars !== null) {
    return c.json({ detail: "Already rated" }, 400);
  }

  const now = new Date().toISOString();
  await c.env.DB.prepare(
    `UPDATE babysitting_requests
    SET rating_stars = ?, rating_comment = ?, updated_at = ?
    WHERE rating_token = ?`
  )
    .bind(body.stars, body.comment || "", now, token)
    .run();

  return c.json({ message: "Thank you for your rating!" });
});

app.get("/api/babysitting/stats", async (c) => {
  const row = await c.env.DB.prepare(
    `SELECT
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as total_completed,
      AVG(CASE WHEN rating_stars IS NOT NULL THEN rating_stars END) as average_rating,
      COUNT(CASE WHEN rating_stars IS NOT NULL THEN 1 END) as total_reviews
    FROM babysitting_requests`
  ).first();

  if (!row) {
    return c.json({ total_completed: 0, average_rating: 0, total_reviews: 0 });
  }

  const avg = row.average_rating as number | null;
  return c.json({
    total_completed: row.total_completed || 0,
    average_rating: avg ? Math.round(avg * 10) / 10 : 0,
    total_reviews: row.total_reviews || 0,
  });
});

export default app;
