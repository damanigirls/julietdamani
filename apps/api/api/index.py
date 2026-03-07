import os
import sqlite3
import uuid
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ADMIN_PASS = os.environ.get("BABYSITTING_ADMIN_PASS", "juliet123")
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "babysitting.db")


def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS babysitting_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            parent_name TEXT NOT NULL,
            parent_email TEXT NOT NULL,
            parent_phone TEXT NOT NULL,
            date_needed TEXT NOT NULL,
            time_needed TEXT NOT NULL,
            num_kids INTEGER NOT NULL,
            kids_names TEXT DEFAULT '',
            kids_ages TEXT NOT NULL,
            special_instructions TEXT DEFAULT '',
            status TEXT DEFAULT 'pending',
            rating_token TEXT UNIQUE NOT NULL,
            rating_stars INTEGER DEFAULT NULL,
            rating_comment TEXT DEFAULT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)
    # Add kids_names column if missing (existing DBs)
    try:
        conn.execute("ALTER TABLE babysitting_requests ADD COLUMN kids_names TEXT DEFAULT ''")
        conn.commit()
    except sqlite3.OperationalError:
        pass  # column already exists
    conn.commit()
    conn.close()


init_db()


# --- Pydantic models ---

class BabysittingRequestCreate(BaseModel):
    parent_name: str
    parent_email: str
    parent_phone: str
    date_needed: str
    time_needed: str
    num_kids: int
    kids_names: str = ""
    kids_ages: str
    special_instructions: str = ""


class StatusUpdate(BaseModel):
    status: str
    passphrase: str


class RatingSubmit(BaseModel):
    stars: int
    comment: str = ""


# --- Existing endpoints ---

@app.get("/api")
def root():
    return {"message": "Hello from Juliet's API!"}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/about")
def about():
    return {
        "name": "Juliet Damani",
        "grade": "4th",
        "tagline": "I vibe code apps for fun!",
        "favoriteColor": "purple",
        "funFacts": [
            {"emoji": "4th", "text": "I'm in 4th grade"},
            {"emoji": "💻", "text": "I host my apps on this site"},
            {"emoji": "✨", "text": "Coding is my superpower"},
            {"emoji": "🎓", "text": "I want to teach kids to be smart when I grow up"},
            {"emoji": "🐠", "text": "I built a coral reef website to help protect ocean life"},
            {"emoji": "📋", "text": "I am super hardworking"},
            {"emoji": "💕", "text": "I am kind and useful"},
            {"emoji": "🍼", "text": "I have a babysitting service"},
            {"emoji": "🌍", "text": "I care about the environment and how we can help it"},
        ],
    }


@app.get("/api/projects")
def projects():
    return {
        "projects": [
            {
                "title": "Robotics for Kids",
                "description": "A guide to help kids learn robotics and have fun building cool stuff",
                "emoji": "🤖",
                "status": "live",
            },
            {
                "title": "Babysitting Service",
                "description": "Parents can book babysitting and rate the service",
                "emoji": "🍼",
                "status": "live",
            },
            {
                "title": "This Website",
                "description": "My personal intro site built with Next.js and Python",
                "emoji": "🌐",
                "status": "live",
            },
            {
                "title": "Coming Soon",
                "description": "More vibe coded apps on the way!",
                "emoji": "🔮",
                "status": "soon",
            },
        ]
    }


# --- Babysitting endpoints ---

@app.post("/api/babysitting/requests", status_code=201)
def create_request(req: BabysittingRequestCreate):
    now = datetime.now().isoformat()
    token = str(uuid.uuid4())
    conn = get_db()
    try:
        cursor = conn.execute(
            """INSERT INTO babysitting_requests
            (parent_name, parent_email, parent_phone, date_needed, time_needed,
             num_kids, kids_names, kids_ages, special_instructions, status, rating_token,
             created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)""",
            (req.parent_name, req.parent_email, req.parent_phone,
             req.date_needed, req.time_needed, req.num_kids, req.kids_names,
             req.kids_ages, req.special_instructions, token, now, now),
        )
        conn.commit()
        request_id = cursor.lastrowid
        row = conn.execute(
            "SELECT * FROM babysitting_requests WHERE id = ?", (request_id,)
        ).fetchone()
        return dict(row)
    finally:
        conn.close()


@app.get("/api/babysitting/requests")
def list_requests(passphrase: str = Query(...)):
    if passphrase != ADMIN_PASS:
        raise HTTPException(status_code=403, detail="Invalid passphrase")
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT * FROM babysitting_requests ORDER BY created_at DESC"
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


@app.patch("/api/babysitting/requests/{request_id}/status")
def update_status(request_id: int, update: StatusUpdate):
    if update.passphrase != ADMIN_PASS:
        raise HTTPException(status_code=403, detail="Invalid passphrase")

    valid_transitions = {
        "pending": ["accepted", "declined"],
        "accepted": ["completed"],
    }

    conn = get_db()
    try:
        row = conn.execute(
            "SELECT * FROM babysitting_requests WHERE id = ?", (request_id,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Request not found")

        current = row["status"]
        if update.status not in valid_transitions.get(current, []):
            raise HTTPException(
                status_code=400,
                detail=f"Cannot change from '{current}' to '{update.status}'",
            )

        now = datetime.now().isoformat()
        conn.execute(
            "UPDATE babysitting_requests SET status = ?, updated_at = ? WHERE id = ?",
            (update.status, now, request_id),
        )
        conn.commit()
        updated = conn.execute(
            "SELECT * FROM babysitting_requests WHERE id = ?", (request_id,)
        ).fetchone()
        return dict(updated)
    finally:
        conn.close()


@app.get("/api/babysitting/requests/rate/{token}")
def get_rating_info(token: str):
    conn = get_db()
    try:
        row = conn.execute(
            "SELECT * FROM babysitting_requests WHERE rating_token = ?", (token,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Request not found")
        if row["status"] != "completed":
            raise HTTPException(status_code=400, detail="Service not yet completed")
        if row["rating_stars"] is not None:
            raise HTTPException(status_code=400, detail="Already rated")
        return {
            "id": row["id"],
            "parent_name": row["parent_name"],
            "date_needed": row["date_needed"],
            "time_needed": row["time_needed"],
            "status": row["status"],
        }
    finally:
        conn.close()


@app.post("/api/babysitting/requests/rate/{token}")
def submit_rating(token: str, rating: RatingSubmit):
    if not 1 <= rating.stars <= 5:
        raise HTTPException(status_code=400, detail="Stars must be 1-5")

    conn = get_db()
    try:
        row = conn.execute(
            "SELECT * FROM babysitting_requests WHERE rating_token = ?", (token,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Request not found")
        if row["status"] != "completed":
            raise HTTPException(status_code=400, detail="Service not yet completed")
        if row["rating_stars"] is not None:
            raise HTTPException(status_code=400, detail="Already rated")

        now = datetime.now().isoformat()
        conn.execute(
            """UPDATE babysitting_requests
            SET rating_stars = ?, rating_comment = ?, updated_at = ?
            WHERE rating_token = ?""",
            (rating.stars, rating.comment, now, token),
        )
        conn.commit()
        return {"message": "Thank you for your rating!"}
    finally:
        conn.close()


@app.get("/api/babysitting/stats")
def babysitting_stats():
    conn = get_db()
    try:
        row = conn.execute("""
            SELECT
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as total_completed,
                AVG(CASE WHEN rating_stars IS NOT NULL THEN rating_stars END) as average_rating,
                COUNT(CASE WHEN rating_stars IS NOT NULL THEN 1 END) as total_reviews
            FROM babysitting_requests
        """).fetchone()
        return {
            "total_completed": row["total_completed"] or 0,
            "average_rating": round(row["average_rating"], 1) if row["average_rating"] else 0,
            "total_reviews": row["total_reviews"] or 0,
        }
    finally:
        conn.close()
