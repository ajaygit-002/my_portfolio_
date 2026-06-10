"""
Portfolio Flask Application
A modern, premium personal portfolio website.
"""

import os
import json
import re
import urllib.request
from flask import (
    Flask, render_template, request, flash, redirect, url_for, jsonify
)
from dotenv import load_dotenv

load_dotenv()


def retrieve_context(app, query):
    """Simple keyword/token-based retrieval (RAG)."""
    kb_path = os.path.join(app.root_path, "knowledge_base.json")
    if not os.path.exists(kb_path):
        return "No information found about Ajay S.", "About", "Default fallback"
    
    try:
        with open(kb_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        return "Error loading profile data.", "About", "Error"
    
    query_tokens = [w.lower() for w in re.findall(r'\w+', query) if len(w) > 2]
    if not query_tokens:
        query_tokens = [query.lower()]
    
    sections = []
    
    # 1. About
    about_text = f"Ajay S's Bio: {data['about']['bio']}. Education: {data['about']['education']}. Location: {data['about']['location']}. Languages: {', '.join(data['about']['languages'])}. Focus area: {data['about']['focus']}."
    sections.append(("About & Bio", about_text))
    
    # 2. Skills
    skills_list = []
    for cat, list_skills in data["skills"].items():
        skills_list.append(f"{cat.capitalize()} skills: {', '.join(list_skills)}")
    skills_text = "Ajay's Skills: " + "; ".join(skills_list) + "."
    sections.append(("Skills & Technologies", skills_text))
    
    # 3. Projects
    projects_desc = []
    for p in data["projects"]:
        projects_desc.append(f"Project '{p['name']}' description: {p['description']} Technologies used: {', '.join(p['technologies'])}.")
    projects_text = "Ajay's Projects: " + " ".join(projects_desc)
    sections.append(("Projects & Portfolio", projects_text))
    
    # 4. Experience
    exp_desc = []
    for exp in data["experience"]:
        exp_desc.append(f"During {exp['period']}, worked as a {exp['role']} and did: {exp['details']}.")
    exp_text = "Ajay's Experience and Career Timeline: " + " ".join(exp_desc)
    sections.append(("Experience & Career Journey", exp_text))
    
    # 5. Contact
    contact_text = f"Contact info: Email is {data['contact']['email']}. Phone is {data['contact']['phone']}. Location is {data['contact']['location']}. Social profiles: GitHub: {data['contact']['socials']['github']}, LinkedIn: {data['contact']['socials']['linkedin']}, Twitter: {data['contact']['socials']['twitter']}."
    sections.append(("Contact & Socials", contact_text))
    
    scored_sections = []
    for sec_name, sec_text in sections:
        score = 0
        for token in query_tokens:
            matches = len(re.findall(r'\b' + re.escape(token) + r'\b', sec_text.lower()))
            score += matches * 2
            if token in sec_text.lower():
                score += 1
        scored_sections.append((score, sec_name, sec_text))
    
    scored_sections.sort(key=lambda x: x[0], reverse=True)
    
    if scored_sections[0][0] > 0:
        top_matches = [scored_sections[0], scored_sections[1]]
    else:
        top_matches = [(0, scored_sections[0][1], scored_sections[0][2]), (0, scored_sections[1][1], scored_sections[1][2])]
        
    context_str = "\n\n".join([f"--- Section: {name} ---\n{text}" for _, name, text in top_matches])
    best_sec_name = scored_sections[0][1]
    best_sec_text = scored_sections[0][2]
    
    return context_str, best_sec_name, best_sec_text


def call_gemini(api_key, context, query):
    """REST request to Gemini API."""
    prompt = (
        "You are '<Ajay.S/>', a friendly and highly capable AI assistant representing Ajay S on his personal portfolio website. "
        "Use the following verified context about Ajay to answer the user's question. If the information isn't present in the context, "
        "use your general knowledge to answer nicely while staying relevant, or gently suggest contacting Ajay via the contact form or email (ajay.s@example.com). "
        "Keep your response concise (under 3-4 sentences), professional, engaging, and in first or third person (representing Ajay's assistant).\n\n"
        f"Verified Context:\n{context}\n\n"
        f"User's Question: {query}\n\n"
        "Answer:"
    )
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "maxOutputTokens": 250,
            "temperature": 0.4
        }
    }
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode("utf-8"),
            headers=headers,
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            text = res_data["candidates"][0]["content"]["parts"][0]["text"]
            return text.strip()
    except Exception as e:
        print(f"Gemini API call failed: {e}")
        return None


def get_fallback_response(sec_name, sec_text, query):
    """Local offline matching fallback when Gemini API is not configured or fails."""
    q_lower = query.lower()
    
    if "skills" in q_lower or "technologies" in q_lower or "languages" in q_lower or "skills" in sec_name.lower():
        res = "Here is a quick summary of Ajay's technical skillset:\n\n"
        res += "• **Languages**: Python, JavaScript, SQL\n"
        res += "• **Backend Frameworks & Libs**: Flask, Django, Pandas, NumPy\n"
        res += "• **Frontend Technologies**: HTML5, CSS3, Bootstrap\n"
        res += "• **Tools & Platforms**: Git, GitHub, MySQL, SQLite\n\n"
        res += "Ajay is particularly focused on Full-Stack Web Development and automation workflows."
    elif "project" in q_lower or "portfolio" in q_lower or "work" in q_lower or "projects" in sec_name.lower():
        res = "Ajay has built several featured applications:\n\n"
        res += "1. **Task Management App**: Full-stack task coordinator with SQLite & Flask.\n"
        res += "2. **Data Analytics Dashboard**: Visualizer with Pandas, NumPy, and Chart.js.\n"
        res += "3. **E-Commerce Platform**: Multi-tier storefront using MySQL and JavaScript.\n"
        res += "4. **Sentiment Analyzer**: NLP categorizer built with Python and Scikit-learn.\n"
        res += "5. **Web Scraping Suite**: Scrapes dynamic sites using BeautifulSoup & Selenium.\n"
        res += "6. **Real-Time Chat App**: Multi-room chat layout using WebSockets & SocketIO.\n\n"
        res += "You can scroll up to the **Projects** section to view interactive templates for these!"
    elif "experience" in q_lower or "jobs" in q_lower or "career" in q_lower or "timeline" in q_lower or "experience" in sec_name.lower():
        res = "Here is Ajay's experience timeline:\n\n"
        res += "• **Freelance Full-Stack Developer** (2025–Present): Custom Flask designs and backend task automations.\n"
        res += "• **Web Development Intern** (2024–2025): Designed REST APIs and optimized MySQL query pathways.\n"
        res += "• **Python Training Program** (2023–2024): Structured education in DSA, advanced Flask, and Django architectures.\n"
        res += "• **Open Source Contributor**: Active helper fixing docs and features on GitHub."
    elif "contact" in q_lower or "email" in q_lower or "phone" in q_lower or "reach" in q_lower or "hire" in q_lower or "contact" in sec_name.lower():
        res = "You can reach Ajay using the form at the bottom of the page or directly through:\n\n"
        res += "📧 **Email**: ajay.s@example.com\n"
        res += "📞 **Phone**: +91 98765 43210\n"
        res += "📍 **Location**: India\n\n"
        res += "Feel free to check out his GitHub and LinkedIn handles located in the page footer!"
    else:
        res = "Here is some background information about Ajay S:\n\n"
        res += "Ajay is a passionate **Full-Stack Developer** based in India, specializing in Python web architectures. "
        res += "He holds a **B.Tech in Computer Science**, speaks English and Hindi, and spends his time building elegant "
        res += "applications and contributing to open-source portfolios. "
        res += "Feel free to ask about his skills, experience, or projects!"
    
    # Notice to add key
    res += "\n\n*(Note: Running in offline fallback mode. Set `GEMINI_API_KEY` in your `.env` file to activate generative AI conversations!)*"
    return res


def create_app():
    """Application factory."""
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-fallback-key")

    # ── Routes ──────────────────────────────────────────────

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/contact", methods=["POST"])
    def contact():
        name = request.form.get("full_name", "").strip()
        email = request.form.get("email", "").strip()
        subject = request.form.get("subject", "").strip()
        message = request.form.get("message", "").strip()

        # Validation
        errors = []
        if not name or len(name) < 2:
            errors.append("Please enter a valid name (at least 2 characters).")
        if not email or "@" not in email:
            errors.append("Please enter a valid email address.")
        if not subject or len(subject) < 3:
            errors.append("Please enter a subject (at least 3 characters).")
        if not message or len(message) < 10:
            errors.append("Message must be at least 10 characters long.")

        if errors:
            for err in errors:
                flash(err, "error")
            return redirect(url_for("index") + "#contact")

        flash("Thank you! Your message has been sent successfully.", "success")
        return redirect(url_for("index") + "#contact")

    @app.route("/api/chat", methods=["POST"])
    def api_chat():
        data = request.get_json() or {}
        user_message = data.get("message", "").strip()
        
        if not user_message:
            return jsonify({"error": "Message cannot be empty."}), 400
        
        # 1. Retrieve RAG Context
        context, best_sec_name, best_sec_text = retrieve_context(app, user_message)
        
        # 2. Get API key from environment
        api_key = os.environ.get("GEMINI_API_KEY")
        
        # 3. Choose path based on API key availability
        reply = None
        if api_key:
            reply = call_gemini(api_key, context, user_message)
            
        # 4. Fallback if no key or API failed
        if not reply:
            reply = get_fallback_response(best_sec_name, best_sec_text, user_message)
            
        return jsonify({"reply": reply})

    # ── Error handlers ──────────────────────────────────────

    @app.errorhandler(404)
    def page_not_found(e):
        return render_template("404.html"), 404

    @app.errorhandler(500)
    def internal_error(e):
        return render_template("500.html"), 500

    return app


if __name__ == "__main__":
    application = create_app()
    application.run(debug=True, port=5000)
