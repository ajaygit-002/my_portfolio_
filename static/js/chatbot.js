/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO – Chatbot Widget
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    const chatToggle = document.getElementById("chatToggle");
    const chatWindow = document.getElementById("chatWindow");
    const chatClose = document.getElementById("chatClose");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatMessages = document.getElementById("chatMessages");

    if (!chatToggle || !chatWindow) return;

    /* ── Toggle Chat Window ────────────────────────────────── */
    chatToggle.addEventListener("click", () => {
        chatWindow.classList.add("active");
        chatToggle.classList.add("hidden");
        scrollToBottom();
        document.getElementById("cursorRing")?.classList.remove("hovered");
    });

    chatClose.addEventListener("click", () => {
        chatWindow.classList.remove("active");
        chatToggle.classList.remove("hidden");
    });

    /* ── Suggestion Chips ──────────────────────────────────── */
    document.querySelectorAll(".chat-suggestion-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
            sendMessage(chip.dataset.message || chip.textContent.trim());
        });
    });

    /* ── Form Submit ───────────────────────────────────────── */
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;
        chatInput.value = "";
        sendMessage(msg);
    });

    /* ── Core Chat Logic ───────────────────────────────────── */
    function sendMessage(text) {
        appendMessage(text, "user");
        showTyping();
        chatInput.disabled = true;

        fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
        })
            .then((r) => r.json())
            .then((data) => {
                hideTyping();
                chatInput.disabled = false;
                chatInput.focus();
                appendMessage(data.reply || data.error || "Invalid response.", "bot");
            })
            .catch(() => {
                hideTyping();
                chatInput.disabled = false;
                chatInput.focus();
                appendMessage("Unable to connect. Please check your connection.", "bot");
            });
    }

    function appendMessage(text, sender) {
        const msg = document.createElement("div");
        msg.className = `chat-message ${sender}`;

        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        bubble.innerHTML = formatMarkdown(text);

        const time = document.createElement("div");
        time.className = "message-time";
        time.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        msg.append(bubble, time);
        chatMessages.appendChild(msg);
        scrollToBottom();
    }

    /* ── Typing Indicator ──────────────────────────────────── */
    function showTyping() {
        if (document.getElementById("typingIndicator")) return;
        const el = document.createElement("div");
        el.id = "typingIndicator";
        el.className = "chat-message bot";
        el.innerHTML = `<div class="message-bubble typing"><span></span><span></span><span></span></div>`;
        chatMessages.appendChild(el);
        scrollToBottom();
    }

    function hideTyping() {
        document.getElementById("typingIndicator")?.remove();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /* ── Markdown Formatter ────────────────────────────────── */
    function formatMarkdown(text) {
        // Escape HTML
        let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Bold: **text**
        html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Convert bullet lists (• or -)
        const lines = html.split("\n");
        let inList = false;
        const out = lines.map((line) => {
            const trimmed = line.trim();
            if (/^[•\-]/.test(trimmed)) {
                const content = trimmed.substring(1).trim();
                const li = `<li>${content}</li>`;
                if (!inList) { inList = true; return `<ul>${li}`; }
                return li;
            }
            if (inList) { inList = false; return `</ul>${line}`; }
            return line;
        });
        if (inList) out.push("</ul>");

        // Line breaks and cleanup
        html = out.join("\n")
            .replace(/\n/g, "<br>")
            .replace(/<br><ul>/g, "<ul>")
            .replace(/<\/ul><br>/g, "</ul>")
            .replace(/<\/li><br>/g, "</li>");

        return html;
    }
});
