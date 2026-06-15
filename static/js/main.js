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
        initLenis();
        initTypewriter();
        initNavbar();
        initBackToTop();
        initScrollReveal();
        initCounters();
        initSkillRings();
        initSkillTabs();
        initProjectFilter();
        initProjectSearch();
        initSmoothNavScroll();
        initScrollProgress();
    }

    /* ── Lenis Smooth Scroll ──────────────────────── */
    let lenis;
    function initLenis() {
        if (typeof Lenis === "undefined") return;
        try {
            lenis = new Lenis({
                duration: 1.15,
                easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
            });
            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);
        } catch (e) { /* ignore */ }
    }

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

    /* ── Skill Progress Rings ─────────────────────── */
    function initSkillRings() {
        const fills = $$(".skill-progress-fill");
        if (!fills.length) return;
        const R = 22;
        const C = 2 * Math.PI * R; // ≈ 138.2
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const fill    = e.target;
                const percent = +fill.getAttribute("data-percent");
                const offset  = C - (percent / 100) * C;
                fill.style.strokeDashoffset = offset;
                observer.unobserve(fill);
            });
        }, { threshold: 0.4 });
        fills.forEach(f => observer.observe(f));
    }

    /* ── Skill Tab Filtering ─────────────────────── */
    function initSkillTabs() {
        const tabs  = $$(".skill-tab");
        const cards = $$(".skill-card");
        if (!tabs.length) return;
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                tabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                const cat = tab.getAttribute("data-category");
                cards.forEach(card => {
                    const cardCat = card.getAttribute("data-category");
                    const show    = cat === "all" || cardCat === cat;
                    card.classList.toggle("hidden", !show);
                });
            });
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
