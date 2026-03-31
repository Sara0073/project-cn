from flask import Flask, render_template, request, jsonify, redirect, url_for
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret-key")

# In-memory stores (replace with DB in real app)
users = {}  # key: email -> {name, disability, password_hash (optional)}
login_tokens = {}  # email -> token
user_mindmaps = {}  # user_id -> mindmap_json
transcripts_cache = {}  # lecture_id -> transcript_text
lectures = {
    "lecture1": {
        "title": "Introduction to Learning Platforms",
        "video_url": "/static/videos/placeholder.mp4",
        "transcript_path": None
    }
}
tests = {
    "test1": {
        "title": "Biology Assessment",
        "duration_m": 15,
        "extended_time_factor": 1.25,
        "questions": [
            {"id": "q1", "question_text": "Explain mitochondria function.", "type": "essay", "max_chars": 1000}
        ]
    }
}
# Simple per-user progress (in-memory)
user_progress = {}

# Helpers
def get_user_id():
    # In a real app, use session or auth token
    return "guest"

@app.route("/")
def index():
    return render_template("login.html")

@app.route("/send_login_link", methods=["POST"])
def send_login_link():
    data = request.get_json() or {}
    name = data.get("name", "Guest")
    email = data.get("email", "")
    disability = data.get("disability", "dyspraxia")

    if not email:
        return jsonify({"success": False, "message": "Email is required."}), 400

    token = f"token-{len(login_tokens) + 1}"
    login_tokens[email] = token
    print(f"Simulated send: magic link to {email} with token {token} (name={name}, disability={disability})")
    return jsonify({"success": True, "message": "Magic link sent."})

@app.route("/dashboard")
def dashboard():
    user_id = get_user_id()
    return render_template("dashboard.html", user_id=user_id)

# AI assistant: naive command processor (demo)
@app.route("/ai_command", methods=["POST"])
def ai_command():
    data = request.get_json() or {}
    command = (data.get("command") or "").lower()
    response = "I didn't understand that. Try asking for a lecture, notes, or tasks."

    if "open the lecture" in command:
        response = "Opening Lecture: Introduction to Learning Platforms."
    elif "start pomodoro" in command:
        response = "Starting a 25-minute Pomodoro session."
    elif "resume" in command or "continue" in command:
        response = "Resuming your last activity."
    elif "notes" in command:
        response = "Here are your notes from the last module."
    return jsonify({"response": response})

# Mindmap (simple in-memory store)
@app.route("/save_mindmap", methods=["POST"])
def save_mindmap():
    mindmap = request.get_json() or {}
    user_id = get_user_id()
    user_mindmaps[user_id] = mindmap
    return jsonify({"success": True})

@app.route("/load_mindmap", methods=["GET"])
def load_mindmap():
    user_id = get_user_id()
    mindmap = user_mindmaps.get(user_id, {})
    return jsonify({"mindmap_data": mindmap})

# Reverse planning (simple breakdown using AI-like behavior)
@app.route("/generate_reverse_plan", methods=["POST"])
def generate_reverse_plan():
    data = request.get_json() or {}
    goal = data.get("goal", "")
    target_date = data.get("target_date", datetime.now().strftime("%Y-%m-%d"))
    # Very simple fake plan for demo purposes
    plan = {
        "final_goal": goal,
        "target_date": target_date,
        "milestones": [
            {"name": "Milestone 1", "date": target_date, "tasks": ["Task A", "Task B"]},
            {"name": "Milestone 2", "date": target_date, "tasks": ["Task C", "Task D"]},
        ]
    }
    return jsonify({"success": True, "plan": plan})

# Breakdown a given goal into tasks (very naive placeholder)
@app.route("/breakdown_goal", methods=["POST"])
def breakdown_goal():
    data = request.get_json() or {}
    goal = data.get("goal", "")
    tasks = [f"Step {i+1} for: {goal}" for i in range(3)]
    return jsonify({"success": True, "tasks": tasks})

# Transcripts
@app.route("/lecture/<lecture_id>")
def lecture_view(lecture_id):
    lec = lectures.get(lecture_id, {})
    return render_template("lecture.html", lecture=lec)

@app.route("/get_transcript", methods=["POST"])
def get_transcript():
    data = request.get_json() or {}
    lecture_id = data.get("lecture_id")
    text = transcripts_cache.get(lecture_id, "Transcript not available.")
    return jsonify({"success": True, "transcript": text})

# Tests (depth over speed)
@app.route("/test/<test_id>")
def take_test(test_id):
    test = tests.get(test_id, {})
    return render_template("test.html", test=test)

@app.route("/submit_test", methods=["POST"])
def submit_test():
    payload = request.get_json() or {}
    # naive scoring
    score = 0
    total = 0
    for q in tests.get(payload.get("test_id"), {}).get("questions", []):
        total += 1
        if payload.get("answers", {}).get(q["id"]):
            score += 1
    return jsonify({"success": True, "score": f"{score}/{total}"})

# Code editor (dictation)
@app.route("/code_editor")
def code_editor():
    return render_template("code_editor.html")

@app.route("/process_code_dictation", methods=["POST"])
def process_code_dictation():
    data = request.get_json() or {}
    code = data.get("code", "")
    print("Dictated code received:\n", code)
    return jsonify({"success": True, "message": "Code received."})

if __name__ == "__main__":
    app.run(debug=True)