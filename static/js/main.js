/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO – Main JS  |  Light Theme
   ═══════════════════════════════════════════════════════════════ */

(function () {
    "use strict";

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;

    /* ── Loading Screen ─────────────────────────────── */
    window.addEventListener("load", () => {
        const loader = $("#loader");
        if (loader) {
            setTimeout(() => loader.classList.add("hidden"), 600);
            setTimeout(() => (loader.style.display = "none"), 1200);
        }
        initAll();
    });

    function initAll() {
        initTypewriter();
        initNavbar();
        initBackToTop();
        initScrollReveal();
        initCounters();
        initSkillsMarquee();
        initProjectFilter();
        initProjectSearch();
        initSmoothNavScroll();
        initScrollProgress();
    }

    /* ── Lenis Smooth Scroll (disabled — using native scroll) ── */
    let lenis = null;

    /* ── Typewriter ──────────────────────────────── */
    function initTypewriter() {
        const el = $("#typewriter");
        if (!el) return;
        const words = [
            "Agentic AI Systems",
            "RAG Pipelines",
            "MCP Server Integrations",
            "Multi-Agent Orchestration",
            "AI-Native Applications",
            "Production ML Systems",
        ];
        let wordIdx = 0, charIdx = 0, deleting = false;
        function tick() {
            const word = words[wordIdx];
            charIdx += deleting ? -1 : 1;
            el.textContent = word.substring(0, charIdx);
            let delay = deleting ? 38 : 72;
            if (!deleting && charIdx === word.length) { delay = 2400; deleting = true; }
            else if (deleting && charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; delay = 450; }
            setTimeout(tick, delay);
        }
        tick();
    }

    /* ── Navbar ──────────────────────────────────── */
    function initNavbar() {
        const navbar     = $("#mainNavbar");
        const navLinks   = $$(".nav-link");
        const sections   = $$("section[id]");
        const navToggle  = $("#navToggle");
        const navMenu    = $("#navLinks");

        window.addEventListener("scroll", () => {
            if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
            let current = "";
            sections.forEach(sec => {
                if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
            });
            navLinks.forEach(link => {
                link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
            });
        }, { passive: true });

        if (navToggle && navMenu) {
            navToggle.addEventListener("click", () => navMenu.classList.toggle("open"));
            navLinks.forEach(link => link.addEventListener("click", () => navMenu.classList.remove("open")));
        }
    }

    /* ── Back To Top ─────────────────────────────── */
    function initBackToTop() {
        const btn = $("#backToTop");
        if (!btn) return;
        window.addEventListener("scroll", () => btn.classList.toggle("visible", window.scrollY > 500), { passive: true });
        btn.addEventListener("click", () => {
            if (lenis) lenis.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ── Scroll Reveal (Intersection Observer) ──── */
    function initScrollReveal() {
        const els = $$(".reveal-up, .reveal-left, .reveal-right, .reveal-scale");
        if (!els.length) return;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        els.forEach(el => observer.observe(el));
    }

    /* ── Animated Counters ───────────────────────────────────── */
    function initCounters() {
        const counters = $$("[data-target]");
        if (!counters.length) return;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const el     = e.target;
                const target = +el.getAttribute("data-target");
                // Preserve any suffix span (e.g. <span>K</span>, <span>+</span>)
                const suffix = el.querySelector("span");
                let current  = 0;
                const timer  = setInterval(() => {
                    current += Math.ceil(target / 90);
                    if (current >= target) { current = target; clearInterval(timer); }
                    // Update only the text node before the span
                    const firstChild = el.firstChild;
                    if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
                        firstChild.textContent = current;
                    } else {
                        el.insertBefore(document.createTextNode(current), suffix || null);
                    }
                }, 20);
                observer.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach(el => observer.observe(el));
    }

    /* ── Skills Marquee Interactive Flow ───────────── */
    function initSkillsMarquee() {
        const wrapper = $("#skillsMarqueeWrapper");
        const track = $("#skillsMarqueeTrack");
        const playBtn = $("#marqueePlay");
        const pauseBtn = $("#marqueePause");
        const cards = $$(".skill-card", track);

        if (!wrapper || !track || !playBtn || !pauseBtn) return;

        // Initialize skill progress fill properties
        const R = 22;
        const C = 2 * Math.PI * R; // ≈ 138.2
        const progressFills = $$(".skill-progress-fill", track);
        progressFills.forEach(fill => {
            fill.style.strokeDasharray = C;
            fill.style.strokeDashoffset = C;
        });

        // Function to animate a single card's progress ring
        function animateCardRing(card) {
            const fill = card.querySelector(".skill-progress-fill");
            if (!fill) return;
            const percent = +fill.getAttribute("data-percent") || 0;
            const offset = C - (percent / 100) * C;
            requestAnimationFrame(() => {
                fill.style.strokeDashoffset = offset;
            });
        }

        // Reset progress ring animation
        function resetCardRing(card) {
            const fill = card.querySelector(".skill-progress-fill");
            if (!fill) return;
            fill.style.strokeDashoffset = C;
        }

        // Animate all cards when paused/inspecting
        function animateAllRings() {
            cards.forEach(card => animateCardRing(card));
        }

        // Reset all rings
        function resetAllRings() {
            cards.forEach(card => resetCardRing(card));
        }

        // Flow control functions
        function startFlow() {
            track.classList.remove("paused");
            wrapper.classList.remove("inspect-mode");
            playBtn.classList.add("active");
            pauseBtn.classList.remove("active");
            
            // Remove active highlights
            cards.forEach(c => c.classList.remove("active"));
            resetAllRings();
        }

        function pauseFlow(inspectAll = false) {
            track.classList.add("paused");
            playBtn.classList.remove("active");
            pauseBtn.classList.add("active");

            if (inspectAll) {
                wrapper.classList.add("inspect-mode");
                animateAllRings();
            }
        }

        // Play/Pause button click events
        playBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            startFlow();
        });

        pauseBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            pauseFlow(true); // pause and inspect all
        });

        // Click a card to pause and inspect that specific card
        cards.forEach(card => {
            card.addEventListener("click", (e) => {
                e.stopPropagation();
                
                // If already paused and this card is active, resume flow
                if (track.classList.contains("paused") && card.classList.contains("active")) {
                    startFlow();
                } else {
                    // Pause the track
                    pauseFlow(false);
                    // Deactivate all cards first
                    cards.forEach(c => {
                        c.classList.remove("active");
                        resetCardRing(c);
                    });
                    // Activate this card (this will trigger expanding transition via CSS)
                    card.classList.add("active");
                    // Animate the clicked card's progress ring
                    animateCardRing(card);
                    
                    // Also trigger animation for duplicate card if they share the same skill name
                    const skillName = card.getAttribute("data-skill");
                    if (skillName) {
                        const isDup = skillName.endsWith("-dup");
                        const searchName = isDup ? skillName.replace("-dup", "") : skillName + "-dup";
                        const pairCard = cards.find(c => c.getAttribute("data-skill") === searchName);
                        if (pairCard) {
                            pairCard.classList.add("active");
                            animateCardRing(pairCard);
                        }
                    }
                }
            });
        });

        // Click outside wrapper to resume flow
        document.addEventListener("click", (e) => {
            if (!wrapper.contains(e.target) && !playBtn.contains(e.target) && !pauseBtn.contains(e.target)) {
                if (track.classList.contains("paused")) {
                    startFlow();
                }
            }
        });
    }

    /* ── Project Filter Buttons ───────────────────── */
    function initProjectFilter() {
        const tags  = $$(".filter-tag");
        const cards = $$(".project-card");
        if (!tags.length) return;
        tags.forEach(tag => {
            tag.addEventListener("click", () => {
                tags.forEach(t => t.classList.remove("active"));
                tag.classList.add("active");
                const filter = tag.getAttribute("data-filter");
                cards.forEach(card => {
                    const cats = card.getAttribute("data-category") || "";
                    card.classList.toggle("hidden", filter !== "all" && !cats.includes(filter));
                });
            });
        });
    }

    /* ── Project Search ──────────────────────────── */
    function initProjectSearch() {
        const input = $("#projectSearch");
        const cards = $$(".project-card");
        if (!input) return;
        input.addEventListener("input", () => {
            const q = input.value.toLowerCase().trim();
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.classList.toggle("hidden", q && !text.includes(q));
            });
        });
    }

    /* ── Smooth Nav Scroll ───────────────────────── */
    function initSmoothNavScroll() {
        $$('a[href^="#"]').forEach(link => {
            link.addEventListener("click", e => {
                const target = $(link.getAttribute("href"));
                if (!target) return;
                e.preventDefault();
                const top = target.offsetTop - 68;
                if (lenis) lenis.scrollTo(top);
                else window.scrollTo({ top, behavior: "smooth" });
            });
        });
    }

    /* ── Scroll Progress Bar ─────────────────────── */
    function initScrollProgress() {
        const bar = document.createElement("div");
        bar.id = "scrollProgress";
        Object.assign(bar.style, {
            position: "fixed", top: "0", left: "0",
            height: "3px", width: "0%", zIndex: "1001",
            background: "linear-gradient(90deg, #6C5CE7, #a29bfe, #fd79a8)",
            transition: "none", borderRadius: "0 2px 2px 0",
            pointerEvents: "none",
        });
        document.body.appendChild(bar);
        window.addEventListener("scroll", () => {
            const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            bar.style.width = Math.min(pct, 100) + "%";
        }, { passive: true });
    }

})();
