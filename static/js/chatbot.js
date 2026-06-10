document.addEventListener("DOMContentLoaded", () => {
    const chatToggle = document.getElementById("chatToggle");
    const chatWindow = document.getElementById("chatWindow");
    const chatClose = document.getElementById("chatClose");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatMessages = document.getElementById("chatMessages");
    const chatSuggestions = document.querySelectorAll(".chat-suggestion-chip");

    if (!chatToggle || !chatWindow) return;

    // Toggle Chat Window
    chatToggle.addEventListener("click", () => {
        chatWindow.classList.add("active");
        chatToggle.classList.add("hidden");
        // Scroll to bottom on open
        scrollToBottom();
        // Hover ring effect helper
        const ring = document.getElementById("cursorRing");
        if (ring) ring.classList.remove("hovered");
    });

    chatClose.addEventListener("click", () => {
        chatWindow.classList.remove("active");
        chatToggle.classList.remove("hidden");
    });

    // Suggestions click
    chatSuggestions.forEach(chip => {
        chip.addEventListener("click", () => {
            const message = chip.dataset.message || chip.textContent.trim();
            sendUserMessage(message);
        });
    });

    // Handle Form Submit
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;
        
        chatInput.value = "";
        sendUserMessage(message);
    });

    function sendUserMessage(text) {
        // Append user message
        appendMessage(text, "user");
        
        // Show typing indicator
        showTypingIndicator();
        
        // Disable input while sending
        chatInput.disabled = true;
        
        fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        })
        .then(response => response.json())
        .then(data => {
            hideTypingIndicator();
            chatInput.disabled = false;
            chatInput.focus();
            
            if (data.reply) {
                appendMessage(data.reply, "bot");
            } else if (data.error) {
                appendMessage("Sorry, I encountered an error: " + data.error, "bot");
            } else {
                appendMessage("Sorry, I received an invalid response.", "bot");
            }
        })
        .catch(error => {
            console.error("Chat error:", error);
            hideTypingIndicator();
            chatInput.disabled = false;
            chatInput.focus();
            appendMessage("Unable to connect to the server. Please check your connection.", "bot");
        });
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("chat-message", sender);
        
        const bubble = document.createElement("div");
        bubble.classList.add("message-bubble");
        bubble.innerHTML = formatMessage(text);
        
        const time = document.createElement("div");
        time.classList.add("message-time");
        const now = new Date();
        time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        msgDiv.appendChild(bubble);
        msgDiv.appendChild(time);
        
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        if (document.getElementById("typingIndicator")) return;
        
        const indicator = document.createElement("div");
        indicator.id = "typingIndicator";
        indicator.classList.add("chat-message", "bot");
        
        indicator.innerHTML = `
            <div class="message-bubble typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        chatMessages.appendChild(indicator);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById("typingIndicator");
        if (indicator) {
            indicator.remove();
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatMessage(text) {
        // Basic Markdown Parser for safe formatting (bold, links, lists, code)
        let html = text;
        
        // Escape HTML tags to prevent XSS (but keep our markdown conversions safe)
        html = html
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Bold: **text**
        html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        
        // Lists: lines starting with "• " or "- "
        const lines = html.split("\n");
        let inList = false;
        const formattedLines = lines.map(line => {
            const cleanLine = line.trim();
            if (cleanLine.startsWith("•") || cleanLine.startsWith("-")) {
                let content = cleanLine.substring(1).trim();
                // strip leading bullet/hyphen mark
                let lineHtml = `<li>${content}</li>`;
                if (!inList) {
                    inList = true;
                    return `<ul>${lineHtml}`;
                }
                return lineHtml;
            } else {
                if (inList) {
                    inList = false;
                    return `</ul>${line}`;
                }
                return line;
            }
        });
        if (inList) {
            formattedLines.push("</ul>");
        }
        html = formattedLines.join("\n");

        // Paragraph linebreaks
        html = html.replace(/\n/g, "<br>");
        
        // Clean up redundant breaks around list tags
        html = html.replace(/<br><ul>/g, "<ul>")
                   .replace(/<\/ul><br>/g, "</ul>")
                   .replace(/<\/li><br>/g, "</li>");

        return html;
    }
});
