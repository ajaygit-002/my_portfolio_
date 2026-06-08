/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO – Main JavaScript
   Particles · Typewriter · Counters · Filters · Animations
   ═══════════════════════════════════════════════════════════════ */

(function () {
    "use strict";

    /* ── Loading Screen ────────────────────────────────────── */
    window.addEventListener("load", () => {
        const loader = document.getElementById("loader");
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
            AOS.init({
                duration: 800,
                easing: "ease-out-cubic",
                once: true,
                offset: 80,
            });
        }
    }

    /* ── Particle Canvas ───────────────────────────────────── */
    function initParticles() {
        const canvas = document.getElementById("particleCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let particles = [];
        let mouse = { x: null, y: null };
        const PARTICLE_COUNT = 60;
        const CONNECT_DIST = 120;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 0.5;
                this.alpha = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Subtle mouse repel
                if (mouse.x !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        this.x += dx * 0.01;
                        this.y += dy * 0.01;
                    }
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`;
                ctx.fill();
            }
        }

        function init() {
            resize();
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99, 102, 241, ${
                            0.08 * (1 - dist / CONNECT_DIST)
                        })`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animate);
        }

        canvas.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvas.addEventListener("mouseleave", () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener("resize", () => {
            resize();
        });

        init();
        animate();
    }

    /* ── Typewriter ────────────────────────────────────────── */
    function initTypewriter() {
        const el = document.getElementById("typewriter");
        if (!el) return;

        const words = [
            "Full-Stack Developer",
            "Python Enthusiast",
            "Flask Developer",
            "UI/UX Lover",
            "Open Source Contributor",
            "Problem Solver",
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const current = words[wordIndex];
            if (isDeleting) {
                el.textContent = current.substring(0, charIndex - 1);
                charIndex--;
            } else {
                el.textContent = current.substring(0, charIndex + 1);
                charIndex++;
            }

            let delay = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === current.length) {
                delay = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 400;
            }

            setTimeout(type, delay);
        }

        type();
    }

    /* ── Navbar ────────────────────────────────────────────── */
    function initNavbar() {
        const navbar = document.getElementById("mainNavbar");
        const navLinks = document.querySelectorAll(".nav-link");
        const sections = document.querySelectorAll("section[id]");

        // Scroll class
        window.addEventListener("scroll", () => {
            if (navbar) {
                navbar.classList.toggle("scrolled", window.scrollY > 50);
            }
            // Active link on scroll
            let current = "";
            sections.forEach((section) => {
                const top = section.offsetTop - 100;
                if (window.scrollY >= top) {
                    current = section.getAttribute("id");
                }
            });
            navLinks.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${current}`) {
                    link.classList.add("active");
                }
            });
        });

        // Close mobile menu on click
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                const collapse = document.getElementById("navbarContent");
                if (collapse && collapse.classList.contains("show")) {
                    const bsCollapse = bootstrap.Collapse.getInstance(collapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            });
        });
    }

    /* ── Theme Toggle ──────────────────────────────────────── */
    function initThemeToggle() {
        const toggle = document.getElementById("themeToggle");
        if (!toggle) return;

        const saved = localStorage.getItem("portfolio-theme");
        if (saved) {
            document.documentElement.setAttribute("data-theme", saved);
        }

        toggle.addEventListener("click", () => {
            const current =
                document.documentElement.getAttribute("data-theme") || "dark";
            const next = current === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("portfolio-theme", next);
        });
    }

    /* ── Custom Cursor ─────────────────────────────────────── */
    function initCustomCursor() {
        const dot = document.getElementById("cursorDot");
        const ring = document.getElementById("cursorRing");
        if (!dot || !ring) return;

        // Hide on touch devices
        if ("ontouchstart" in window) {
            dot.style.display = "none";
            ring.style.display = "none";
            return;
        }

        let mx = 0,
            my = 0,
            rx = 0,
            ry = 0;

        document.addEventListener("mousemove", (e) => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx + "px";
            dot.style.top = my + "px";
        });

        function animateRing() {
            rx += (mx - rx) * 0.15;
            ry += (my - ry) * 0.15;
            ring.style.left = rx + "px";
            ring.style.top = ry + "px";
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effect on interactive elements
        const interactives = document.querySelectorAll(
            "a, button, input, textarea, .project-card, .skill-card, .stat-card"
        );
        interactives.forEach((el) => {
            el.addEventListener("mouseenter", () =>
                ring.classList.add("hovered")
            );
            el.addEventListener("mouseleave", () =>
                ring.classList.remove("hovered")
            );
        });
    }

    /* ── Back To Top ───────────────────────────────────────── */
    function initBackToTop() {
        const btn = document.getElementById("backToTop");
        if (!btn) return;

        window.addEventListener("scroll", () => {
            btn.classList.toggle("visible", window.scrollY > 400);
        });

        btn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ── Counter Animation ─────────────────────────────────── */
    function initCounters() {
        const counters = document.querySelectorAll(".stat-number[data-target]");
        if (!counters.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach((c) => observer.observe(c));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    /* ── Skill Bars ────────────────────────────────────────── */
    function initSkillBars() {
        const bars = document.querySelectorAll(".skill-fill[data-width]");
        if (!bars.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        bar.style.setProperty("--w", bar.dataset.width + "%");
                        bar.classList.add("animated");
                        observer.unobserve(bar);
                    }
                });
            },
            { threshold: 0.3 }
        );

        bars.forEach((b) => observer.observe(b));
    }

    /* ── Skill Tabs ────────────────────────────────────────── */
    function initSkillTabs() {
        const tabs = document.querySelectorAll(".skill-tab");
        const cards = document.querySelectorAll(".skill-card[data-category]");
        if (!tabs.length) return;

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                tabs.forEach((t) => t.classList.remove("active"));
                tab.classList.add("active");

                const cat = tab.dataset.category;
                cards.forEach((card) => {
                    if (cat === "all" || card.dataset.category === cat) {
                        card.classList.remove("hidden");
                    } else {
                        card.classList.add("hidden");
                    }
                });
            });
        });
    }

    /* ── Project Filter ────────────────────────────────────── */
    function initProjectFilter() {
        const tags = document.querySelectorAll(".filter-tag");
        const cards = document.querySelectorAll(".project-card[data-category]");
        if (!tags.length) return;

        tags.forEach((tag) => {
            tag.addEventListener("click", () => {
                tags.forEach((t) => t.classList.remove("active"));
                tag.classList.add("active");

                const filter = tag.dataset.filter;
                cards.forEach((card) => {
                    const cats = card.dataset.category.split(" ");
                    if (filter === "all" || cats.includes(filter)) {
                        card.classList.remove("hidden");
                    } else {
                        card.classList.add("hidden");
                    }
                });
            });
        });
    }

    /* ── Project Search ────────────────────────────────────── */
    function initProjectSearch() {
        const input = document.getElementById("projectSearch");
        const cards = document.querySelectorAll(".project-card");
        if (!input) return;

        input.addEventListener("input", () => {
            const q = input.value.toLowerCase().trim();
            cards.forEach((card) => {
                const text = card.textContent.toLowerCase();
                card.classList.toggle("hidden", q !== "" && !text.includes(q));
            });
        });
    }

    /* ── Smooth Scroll ─────────────────────────────────────── */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                const href = this.getAttribute("href");
                if (href === "#") return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth" });
                }
            });
        });
    }

    /* ── Tilt Effect on Project Cards ──────────────────────── */
    function initTiltEffect() {
        if ("ontouchstart" in window) return; // skip on touch

        const cards = document.querySelectorAll(".project-card");
        cards.forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotateX = ((y - cy) / cy) * -5;
                const rotateY = ((x - cx) / cx) * 5;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });
            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });
        });
    }
})();
