/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO – Main JavaScript
   Particles · Typewriter · Counters · Filters · Animations
   ═══════════════════════════════════════════════════════════════ */

(function () {
    "use strict";

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);
    const isTouchDevice = () => "ontouchstart" in window;

    /* ── Loading Screen ────────────────────────────────────── */
    window.addEventListener("load", () => {
        const loader = $("#loader");
        if (loader) {
            setTimeout(() => loader.classList.add("hidden"), 600);
            setTimeout(() => (loader.style.display = "none"), 1200);
        }
        initAll();
    });

    function initAll() {
        initAOS();
        initParticles();
        initTypewriter();
        initNavbar();
        initThemeToggle();
        initCustomCursor();
        initBackToTop();
        initCounters();
        initSkillBars();
        initSkillTabs();
        initProjectFilter();
        initProjectSearch();
        initSmoothScroll();
        initTiltEffect();
    }

    /* ── AOS Init ──────────────────────────────────────────── */
    function initAOS() {
        if (typeof AOS !== "undefined") {
            AOS.init({ duration: 800, easing: "ease-out-cubic", once: true, offset: 80 });
        }
    }

    /* ── Particle Canvas ───────────────────────────────────── */
    function initParticles() {
        const canvas = $("#particleCanvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let particles = [];
        const mouse = { x: null, y: null };
        const COUNT = 60;
        const LINK_DIST = 120;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.r = Math.random() * 2 + 0.5;
                this.a = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                if (mouse.x !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    if (Math.hypot(dx, dy) < 100) {
                        this.x += dx * 0.01;
                        this.y += dy * 0.01;
                    }
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99,102,241,${this.a})`;
                ctx.fill();
            }
        }

        function init() {
            resize();
            particles = Array.from({ length: COUNT }, () => new Particle());
        }

        function drawLinks() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < LINK_DIST) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / LINK_DIST)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => { p.update(); p.draw(); });
            drawLinks();
            requestAnimationFrame(animate);
        }

        canvas.addEventListener("mousemove", (e) => {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        });
        canvas.addEventListener("mouseleave", () => { mouse.x = mouse.y = null; });
        window.addEventListener("resize", resize);

        init();
        animate();
    }

    /* ── Typewriter ────────────────────────────────────────── */
    function initTypewriter() {
        const el = $("#typewriter");
        if (!el) return;

        const words = [
            "Full-Stack Developer", "Python Enthusiast", "Flask Developer",
            "UI/UX Lover", "Open Source Contributor", "Problem Solver",
        ];
        let wordIdx = 0, charIdx = 0, deleting = false;

        function tick() {
            const word = words[wordIdx];
            charIdx += deleting ? -1 : 1;
            el.textContent = word.substring(0, charIdx);

            let delay = deleting ? 40 : 80;
            if (!deleting && charIdx === word.length) {
                delay = 2000;
                deleting = true;
            } else if (deleting && charIdx === 0) {
                deleting = false;
                wordIdx = (wordIdx + 1) % words.length;
                delay = 400;
            }
            setTimeout(tick, delay);
        }
        tick();
    }

    /* ── Navbar ────────────────────────────────────────────── */
    function initNavbar() {
        const navbar = $("#mainNavbar");
        const navLinks = $$(".nav-link");
        const sections = $$("section[id]");

        window.addEventListener("scroll", () => {
            if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);

            let current = "";
            sections.forEach((sec) => {
                if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
            });
            navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
            });
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                const collapse = $("#navbarContent");
                if (collapse?.classList.contains("show")) {
                    bootstrap.Collapse.getInstance(collapse)?.hide();
                }
            });
        });
    }

    /* ── Theme Toggle ──────────────────────────────────────── */
    function initThemeToggle() {
        const toggle = $("#themeToggle");
        if (!toggle) return;

        const saved = localStorage.getItem("portfolio-theme");
        if (saved) document.documentElement.setAttribute("data-theme", saved);

        toggle.addEventListener("click", () => {
            const next = (document.documentElement.getAttribute("data-theme") || "dark") === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("portfolio-theme", next);
        });
    }

    /* ── Custom Cursor ─────────────────────────────────────── */
    function initCustomCursor() {
        const dot = $("#cursorDot");
        const ring = $("#cursorRing");
        if (!dot || !ring || isTouchDevice()) {
            if (dot) dot.style.display = "none";
            if (ring) ring.style.display = "none";
            return;
        }

        let mx = 0, my = 0, rx = 0, ry = 0;

        document.addEventListener("mousemove", (e) => {
            mx = e.clientX; my = e.clientY;
            dot.style.left = mx + "px";
            dot.style.top = my + "px";
        });

        (function animateRing() {
            rx += (mx - rx) * 0.15;
            ry += (my - ry) * 0.15;
            ring.style.left = rx + "px";
            ring.style.top = ry + "px";
            requestAnimationFrame(animateRing);
        })();

        $$("a, button, input, textarea, .project-card, .skill-card, .stat-card").forEach((el) => {
            el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
            el.addEventListener("mouseleave", () => ring.classList.remove("hovered"));
        });
    }

    /* ── Back To Top ───────────────────────────────────────── */
    function initBackToTop() {
        const btn = $("#backToTop");
        if (!btn) return;
        window.addEventListener("scroll", () => btn.classList.toggle("visible", window.scrollY > 400));
        btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    /* ── Counter Animation ─────────────────────────────────── */
    function initCounters() {
        const counters = $$(".stat-number[data-target]");
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach((c) => observer.observe(c));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const start = performance.now();

        (function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor((1 - Math.pow(1 - progress, 3)) * target);
            if (progress < 1) requestAnimationFrame(step);
        })(start);
    }

    /* ── Skill Bars ────────────────────────────────────────── */
    function initSkillBars() {
        const bars = $$(".skill-fill[data-width]");
        if (!bars.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.setProperty("--w", entry.target.dataset.width + "%");
                    entry.target.classList.add("animated");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        bars.forEach((b) => observer.observe(b));
    }

    /* ── Skill Tabs ────────────────────────────────────────── */
    function initSkillTabs() {
        const tabs = $$(".skill-tab");
        const cards = $$(".skill-card[data-category]");
        if (!tabs.length) return;

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                tabs.forEach((t) => t.classList.remove("active"));
                tab.classList.add("active");
                const cat = tab.dataset.category;
                cards.forEach((card) => {
                    card.classList.toggle("hidden", cat !== "all" && card.dataset.category !== cat);
                });
            });
        });
    }

    /* ── Project Filter ────────────────────────────────────── */
    function initProjectFilter() {
        const tags = $$(".filter-tag");
        const cards = $$(".project-card[data-category]");
        if (!tags.length) return;

        tags.forEach((tag) => {
            tag.addEventListener("click", () => {
                tags.forEach((t) => t.classList.remove("active"));
                tag.classList.add("active");
                const filter = tag.dataset.filter;
                cards.forEach((card) => {
                    card.classList.toggle("hidden", filter !== "all" && !card.dataset.category.split(" ").includes(filter));
                });
            });
        });
    }

    /* ── Project Search ────────────────────────────────────── */
    function initProjectSearch() {
        const input = $("#projectSearch");
        if (!input) return;
        const cards = $$(".project-card");

        input.addEventListener("input", () => {
            const q = input.value.toLowerCase().trim();
            cards.forEach((card) => {
                card.classList.toggle("hidden", q !== "" && !card.textContent.toLowerCase().includes(q));
            });
        });
    }

    /* ── Smooth Scroll ─────────────────────────────────────── */
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                const href = this.getAttribute("href");
                if (href === "#") return;
                const target = $(href);
                if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
            });
        });
    }

    /* ── Tilt Effect on Project Cards ──────────────────────── */
    function initTiltEffect() {
        if (isTouchDevice()) return;

        $$(".project-card").forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                card.style.transform = `perspective(800px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
            });
            card.addEventListener("mouseleave", () => { card.style.transform = ""; });
        });
    }
})();
