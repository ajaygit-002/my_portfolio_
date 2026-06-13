"""Portfolio Flask Application – A modern personal portfolio website."""

import os
import json
import re
import urllib.request
from flask import Flask, render_template, request, flash, redirect, url_for, jsonify
from dotenv import load_dotenv

load_dotenv()

# ── Constants ────────────────────────────────────────────────
GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
SYSTEM_PROMPT = (
    "You are '<Ajay.S/>', a friendly AI assistant on Ajay S's portfolio. "
    "Ajay is an AI Engineer specializing in Agentic AI, RAG architectures, "
    "and MCP (Model Context Protocol) integrations. "
    "Use the verified context to answer. If info is missing, suggest contacting Ajay. "
    "Keep responses under 3-4 sentences, professional and engaging.\n\n"
)
FALLBACK_NOTE = "\n\n*(Running in offline mode. Set `GEMINI_API_KEY` in `.env` for AI conversations!)*"


def _load_knowledge_base(app):
    """Load and return knowledge base data, or None on failure."""
    kb_path = os.path.join(app.root_path, "knowledge_base.json")
    try:
        with open(kb_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def _build_sections(data):
    """Build searchable sections from knowledge base data."""
    about = data["about"]
    contact = data["contact"]

    sections = {
        "About & Bio": (
            f"Ajay S's Bio: {about['bio']}. Education: {about['education']}. "
            f"Location: {about['location']}. Languages: {', '.join(about['languages'])}. "
            f"Focus: {about['focus']}."
        ),
        "Skills & Technologies": "Ajay's Skills: " + "; ".join(
            f"{cat.replace('_', ' ').capitalize()}: {', '.join(skills)}"
            for cat, skills in data["skills"].items()
        ) + ".",
        "Projects & Portfolio": "Ajay's Projects: " + " ".join(
            f"'{p['name']}': {p['description']} Tech: {', '.join(p['technologies'])}."
            for p in data["projects"]
        ),
        "Experience & Career": "Ajay's Experience: " + " ".join(
            f"{e['period']} – {e['role']}: {e['details']}."
            for e in data["experience"]
        ),
        "Contact & Socials": (
            f"Email: {contact['email']}. Phone: {contact['phone']}. "
            f"Location: {contact['location']}. "
            f"GitHub: {contact['socials']['github']}, "
            f"LinkedIn: {contact['socials']['linkedin']}, "
            f"Twitter: {contact['socials']['twitter']}."
        ),
    }
    return sections


def retrieve_context(app, query):
    """Keyword-based RAG retrieval returning (context, best_section_name, best_section_text)."""
    data = _load_knowledge_base(app)
    if not data:
        return "No information found.", "About", ""

    sections = _build_sections(data)
    tokens = [w.lower() for w in re.findall(r'\w+', query) if len(w) > 2] or [query.lower()]

    # Score each section by token matches
    scored = []
    for name, text in sections.items():
        text_lower = text.lower()
        score = sum(
            len(re.findall(r'\b' + re.escape(t) + r'\b', text_lower)) * 2 + (t in text_lower)
            for t in tokens
        )
        scored.append((score, name, text))

    scored.sort(key=lambda x: x[0], reverse=True)

    context = "\n\n".join(f"--- {name} ---\n{text}" for _, name, text in scored[:2])
    return context, scored[0][1], scored[0][2]


def call_gemini(api_key, context, query):
    """Send query to Gemini API; returns response text or None."""
    prompt = f"{SYSTEM_PROMPT}Context:\n{context}\n\nQuestion: {query}\n\nAnswer:"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"maxOutputTokens": 250, "temperature": 0.4},
    }
    try:
        req = urllib.request.Request(
            f"{GEMINI_URL}?key={api_key}",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            return result["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        print(f"Gemini API error: {e}")
        return None


# Fallback response templates keyed by topic keywords
_FALLBACK_RESPONSES = {
    "skills": (
        "Here's Ajay's technical skillset:\n\n"
        "• **AI/ML**: LangChain, LlamaIndex, CrewAI, AutoGen, OpenAI API, Gemini, PyTorch, HuggingFace\n"
        "• **Backend**: Python, FastAPI, Flask, Django, Node.js\n"
        "• **Frontend**: React, Next.js, TypeScript, Tailwind CSS\n"
        "• **Databases**: PostgreSQL, MongoDB, Pinecone, ChromaDB, Redis\n"
        "• **DevOps**: Docker, AWS, GCP, GitHub Actions\n\n"
        "He specializes in Agentic AI, RAG architectures, and MCP development."
    ),
    "projects": (
        "Ajay's featured AI projects:\n\n"
        "1. **Multi-Agent AI System** – CrewAI & AutoGen agent orchestration\n"
        "2. **RAG Knowledge Engine** – LangChain + ChromaDB pipeline\n"
        "3. **MCP Server Toolkit** – Model Context Protocol integrations\n"
        "4. **AI Code Reviewer** – Gemini-powered code analysis\n"
        "5. **Conversational AI Dashboard** – Real-time agent analytics\n"
        "6. **Intelligent Document Processor** – Multi-modal understanding\n\n"
        "Scroll to **Projects** to explore them!"
    ),
    "experience": (
        "Ajay's experience:\n\n"
        "• **AI Engineer & Agentic AI Developer** (2025–Present)\n"
        "• **ML Engineer Intern** (2024–2025)\n"
        "• **AI/ML Training Program** (2023–2024)\n"
        "• **Full-Stack Developer** (2022–2023)"
    ),
    "contact": (
        "Reach Ajay via:\n\n"
        "📧 **Email**: ajay.w@example.com\n"
        "📞 **Phone**: +91 98765 43210\n"
        "📍 **Location**: India\n\n"
        "Also check his GitHub and LinkedIn in the footer!"
    ),
}

_FALLBACK_DEFAULT = (
    "Ajay is a passionate **AI Engineer** based in India, specializing in "
    "Agentic AI systems, RAG architectures, and MCP integrations. He designs "
    "autonomous multi-agent systems and production AI pipelines. "
    "Ask about his skills, experience, or projects!"
)

# Mapping: query keywords → fallback keys
_TOPIC_KEYWORDS = {
    "skills": ("skills", "technologies", "languages", "tech", "tools", "stack"),
    "projects": ("project", "portfolio", "work", "built", "agent", "rag", "mcp"),
    "experience": ("experience", "jobs", "career", "timeline", "intern", "role"),
    "contact": ("contact", "email", "phone", "reach", "hire"),
}


def get_fallback_response(sec_name, query):
    """Generate an offline fallback response based on keyword matching."""
    q_lower = query.lower()
    sec_lower = sec_name.lower()

    for topic, keywords in _TOPIC_KEYWORDS.items():
        if any(kw in q_lower or kw in sec_lower for kw in keywords):
            return _FALLBACK_RESPONSES[topic] + FALLBACK_NOTE

    return _FALLBACK_DEFAULT + FALLBACK_NOTE


# ── Application Factory ─────────────────────────────────────
def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-fallback-key")

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/contact", methods=["POST"])
    def contact():
        fields = {
            "full_name": ("name", 2, "Please enter a valid name (min 2 characters)."),
            "email": ("email", 0, "Please enter a valid email address."),
            "subject": ("subject", 3, "Please enter a subject (min 3 characters)."),
            "message": ("message", 10, "Message must be at least 10 characters."),
        }
        errors = []
        values = {}

        for field, (label, min_len, err_msg) in fields.items():
            val = request.form.get(field, "").strip()
            values[field] = val
            if not val or (min_len and len(val) < min_len):
                errors.append(err_msg)
            elif field == "email" and "@" not in val:
                errors.append(err_msg)

        if errors:
            for err in errors:
                flash(err, "error")
        else:
            flash("Thank you! Your message has been sent successfully.", "success")

        return redirect(url_for("index") + "#contact")

    @app.route("/api/chat", methods=["POST"])
    def api_chat():
        user_message = (request.get_json() or {}).get("message", "").strip()
        if not user_message:
            return jsonify({"error": "Message cannot be empty."}), 400

        context, best_name, _ = retrieve_context(app, user_message)

        api_key = os.environ.get("GEMINI_API_KEY")
        reply = call_gemini(api_key, context, user_message) if api_key else None

        if not reply:
            reply = get_fallback_response(best_name, user_message)

        return jsonify({"reply": reply})

    @app.errorhandler(404)
    def page_not_found(_):
        return render_template("404.html"), 404

    @app.errorhandler(500)
    def internal_error(_):
        return render_template("500.html"), 500

    return app


if __name__ == "__main__":
    create_app().run(debug=True, port=5000)
