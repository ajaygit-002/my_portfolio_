"""
Portfolio Flask Application
A modern, premium personal portfolio website.
"""

import os
from flask import (
    Flask, render_template, request, flash, redirect, url_for
)
from dotenv import load_dotenv

load_dotenv()





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
