/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO – Cinematic Animation Engine
   GSAP + ScrollTrigger · Three.js Particles · Lenis Smooth Scroll
   ═══════════════════════════════════════════════════════════════ */

(function () {
    "use strict";

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);
    const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;

    /* ── Loading Screen ────────────────────────────────────── */
    window.addEventListener("load", () => {
        const loader = $("#loader");
        if (loader) {
            setTimeout(() => loader.classList.add("hidden"), 800);
            setTimeout(() => (loader.style.display = "none"), 1600);
        }
        initAll();
    });

    function initAll() {
        initLenis();
        initThreeParticles();
        initTypewriter();
        initNavbar();
        initCustomCursor();
        initBackToTop();
        initGSAPAnimations();
        initCounters();
        initSkillRings();
        initSkillTabs();
        initProjectFilter();
        initProjectSearch();
        initSmoothScroll();
        initTiltEffect();
        initTimelineScroll();
    }

    /* ── Lenis Smooth Scroll ──────────────────────────────── */
    let lenis;
    function initLenis() {
        if (typeof Lenis === "undefined") return;
        try {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

            // Connect Lenis with GSAP ScrollTrigger
            if (typeof gsap !== "undefined" && gsap.registerPlugin) {
                lenis.on("scroll", () => {
                    if (typeof ScrollTrigger !== "undefined") {
                        ScrollTrigger.update();
                    }
                });
            }
        } catch (e) {
            console.warn("Lenis init failed:", e);
        }
    }

    /* ── Three.js Particle Field ──────────────────────────── */
    function initThreeParticles() {
        const canvas = $("#heroCanvas");
        if (!canvas || typeof THREE === "undefined") return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particles
        const COUNT = 300;
        const positions = new Float32Array(COUNT * 3);
        const colors = new Float32Array(COUNT * 3);
        const sizes = new Float32Array(COUNT);

        const cyanColor = new THREE.Color(0x00E5FF);
        const violetColor = new THREE.Color(0x8B5CF6);
        const indigoColor = new THREE.Color(0x6366F1);
        const palette = [cyanColor, violetColor, indigoColor];

        for (let i = 0; i < COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 2 + 0.5;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Lines between nearby particles
        const linePositions = [];
        const LINE_DIST = 12;

        function updateLines() {
            const pos = geometry.attributes.position.array;
            linePositions.length = 0;

            for (let i = 0; i < COUNT; i++) {
                for (let j = i + 1; j < COUNT; j++) {
                    const dx = pos[i * 3] - pos[j * 3];
                    const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                    const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < LINE_DIST) {
                        linePositions.push(
                            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
                            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
                        );
                    }
                }
            }
        }

        updateLines();

        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x00E5FF,
            transparent: true,
            opacity: 0.06,
            blending: THREE.AdditiveBlending,
        });
        const lines = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(lines);

        // Mouse interaction
        const mouse = { x: 0, y: 0 };
        canvas.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        });

        // Animation loop
        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.001;

            const pos = geometry.attributes.position.array;
            for (let i = 0; i < COUNT; i++) {
                pos[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.015;
                pos[i * 3] += Math.cos(time + i * 0.05) * 0.01;
            }
            geometry.attributes.position.needsUpdate = true;

            points.rotation.y = mouse.x * 0.1;
            points.rotation.x = mouse.y * 0.05;
            lines.rotation.y = mouse.x * 0.1;
            lines.rotation.x = mouse.y * 0.05;

            // Update lines periodically
            if (Math.floor(time * 1000) % 60 === 0) {
                updateLines();
                lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
            }

            renderer.render(scene, camera);
        }

        animate();

        // Resize handler
        window.addEventListener("resize", () => {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }

    /* ── Typewriter ────────────────────────────────────────── */
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

            let delay = deleting ? 35 : 70;
            if (!deleting && charIdx === word.length) {
                delay = 2200;
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
        const navToggle = $("#navToggle");
        const navLinksContainer = $("#navLinks");

        // Scroll behavior
        window.addEventListener("scroll", () => {
            if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);

            let current = "";
            sections.forEach((sec) => {
                if (window.scrollY >= sec.offsetTop - 150) current = sec.id;
            });
            navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
            });
        });

        // Mobile toggle
        if (navToggle && navLinksContainer) {
            navToggle.addEventListener("click", () => {
                navLinksContainer.classList.toggle("open");
            });

            // Close on link click
            navLinks.forEach((link) => {
                link.addEventListener("click", () => {
                    navLinksContainer.classList.remove("open");
                });
            });
        }
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
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = rx + "px";
            ring.style.top = ry + "px";
            requestAnimationFrame(animateRing);
        })();

        $$("a, button, input, textarea, .project-card, .skill-card, .stat-card, .cert-card, .dashboard-card").forEach((el) => {
            el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
            el.addEventListener("mouseleave", () => ring.classList.remove("hovered"));
        });
    }

    /* ── Back To Top ───────────────────────────────────────── */
    function initBackToTop() {
        const btn = $("#backToTop");
        if (!btn) return;
        window.addEventListener("scroll", () => btn.classList.toggle("visible", window.scrollY > 500));
        btn.addEventListener("click", () => {
            if (lenis) {
                lenis.scrollTo(0);
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }

    /* ── GSAP Animations ──────────────────────────────────── */
    function initGSAPAnimations() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        // Reveal animations
        $$(".reveal-up").forEach((el) => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            });
        });

        $$(".reveal-left").forEach((el) => {
            gsap.to(el, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            });
        });

        $$(".reveal-right").forEach((el) => {
            gsap.to(el, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            });
        });

        $$(".reveal-scale").forEach((el, i) => {
            gsap.to(el, {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                delay: (i % 6) * 0.08,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none none",
                },
            });
        });

        // Parallax on gradient orbs
        $$(".hero-gradient-orb").forEach((orb) => {
            gsap.to(orb, {
                y: -80,
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                },
            });
        });

        // Section glow parallax
        $$(".section-glow").forEach((glow) => {
            gsap.to(glow, {
                y: -50,
                scrollTrigger: {
                    trigger: glow.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                },
            });
        });
    }

    /* ── Counter Animation ─────────────────────────────────── */
    function initCounters() {
        const counters = $$("[data-target]");
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
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        })(start);
    }

    /* ── Skill Progress Rings ─────────────────────────────── */
    function initSkillRings() {
        const rings = $$(".skill-progress-fill[data-percent]");
        if (!rings.length) return;

        const circumference = 2 * Math.PI * 22; // r=22

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const percent = parseInt(entry.target.dataset.percent, 10);
                    const offset = circumference - (percent / 100) * circumference;
                    entry.target.style.strokeDashoffset = offset;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        rings.forEach((ring) => observer.observe(ring));
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
                    const cats = card.dataset.category.split(" ");
                    card.classList.toggle("hidden", filter !== "all" && !cats.includes(filter));
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

    /* ── Smooth Scroll (anchor links) ─────────────────────── */
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                const href = this.getAttribute("href");
                if (href === "#") return;
                const target = $(href);
                if (target) {
                    e.preventDefault();
                    if (lenis) {
                        lenis.scrollTo(target, { offset: -72 });
                    } else {
                        target.scrollIntoView({ behavior: "smooth" });
                    }
                }
            });
        });
    }

    /* ── Tilt Effect on Cards ─────────────────────────────── */
    function initTiltEffect() {
        if (isTouchDevice()) return;

        $$(".project-card, .cert-card").forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                card.style.transform = `perspective(800px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-8px)`;
            });
            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });
        });
    }

    /* ── GSAP Horizontal Timeline ─────────────────────────── */
    function initTimelineScroll() {
        const track = $("#timelineTrack");
        const wrapper = $(".timeline-wrapper");
        if (!track || !wrapper || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

        // Calculate how far we need to scroll
        const calculateScroll = () => {
            const trackWidth = track.scrollWidth;
            const wrapperWidth = wrapper.offsetWidth;
            return -(trackWidth - wrapperWidth);
        };

        gsap.to(track, {
            x: calculateScroll,
            ease: "none",
            scrollTrigger: {
                trigger: wrapper,
                start: "top 60%",
                end: () => `+=${track.scrollWidth - wrapper.offsetWidth}`,
                scrub: 1,
                invalidateOnRefresh: true,
            },
        });
    }
})();
