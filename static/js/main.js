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

    /* ── GSAP Cinematic Animation Engine ─────────────────── */
    function initGSAPAnimations() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);
        if (typeof ScrollToPlugin !== "undefined") gsap.registerPlugin(ScrollToPlugin);
        if (typeof TextPlugin !== "undefined") gsap.registerPlugin(TextPlugin);

        // ─── Global GSAP Defaults ────────────────────────────
        gsap.defaults({ ease: "power3.out", duration: 0.9 });

        // ─── 1. HERO Cinematic Entrance Timeline ─────────────
        const heroTL = gsap.timeline({ delay: 0.6 });

        heroTL
            .from(".hero-badge", {
                opacity: 0,
                y: 30,
                scale: 0.8,
                duration: 0.7,
                ease: "back.out(1.7)",
            })
            .from(".hero-name", {
                opacity: 0,
                y: 60,
                clipPath: "inset(100% 0 0 0)",
                duration: 1.0,
                ease: "expo.out",
            }, "-=0.3")
            .from(".name-highlight", {
                backgroundSize: "0% 100%",
                duration: 0.8,
                ease: "power2.inOut",
            }, "-=0.5")
            .from(".hero-typewriter", {
                opacity: 0,
                y: 25,
                duration: 0.6,
            }, "-=0.4")
            .from(".hero-description", {
                opacity: 0,
                y: 25,
                duration: 0.6,
            }, "-=0.3")
            .from(".hero-cta .btn-primary-glow", {
                opacity: 0,
                x: -40,
                scale: 0.9,
                duration: 0.6,
                ease: "back.out(1.4)",
            }, "-=0.2")
            .from(".hero-cta .btn-outline-glow", {
                opacity: 0,
                x: 40,
                scale: 0.9,
                duration: 0.6,
                ease: "back.out(1.4)",
            }, "-=0.5")
            .from(".social-links .social-icon", {
                opacity: 0,
                y: 20,
                stagger: 0.08,
                duration: 0.4,
                ease: "back.out(2)",
            }, "-=0.3")
            .from(".hero-stat", {
                opacity: 0,
                y: 30,
                scale: 0.85,
                stagger: 0.12,
                duration: 0.5,
                ease: "back.out(1.6)",
            }, "-=0.3")
            .from(".hero-gradient-orb", {
                opacity: 0,
                scale: 0,
                stagger: 0.15,
                duration: 1.2,
                ease: "elastic.out(1, 0.5)",
            }, "-=0.8");

        // ─── 2. Text Split Animation for Section Titles ──────
        $$(".section-title").forEach((title) => {
            // Wrap each letter in a span for individual animation
            const text = title.innerHTML;
            // Only process text nodes, not nested HTML
            const words = text.split(/(<[^>]+>)/);
            let html = "";
            words.forEach((part) => {
                if (part.startsWith("<")) {
                    html += part; // keep HTML tags intact
                } else {
                    part.split("").forEach((char) => {
                        if (char === " ") {
                            html += " ";
                        } else {
                            html += `<span class="gsap-char" style="display:inline-block">${char}</span>`;
                        }
                    });
                }
            });
            title.innerHTML = html;

            gsap.from(title.querySelectorAll(".gsap-char"), {
                opacity: 0,
                y: 40,
                rotateX: -90,
                stagger: 0.025,
                duration: 0.6,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            });
        });

        // ─── 3. Section Tags — Slide In With Line ────────────
        $$(".section-tag").forEach((tag) => {
            gsap.from(tag, {
                opacity: 0,
                x: -50,
                duration: 0.7,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: tag,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
            });
        });

        // ─── 4. Section Dividers — Expand From Center ────────
        $$(".section-divider").forEach((div) => {
            gsap.from(div, {
                scaleX: 0,
                duration: 0.8,
                ease: "power4.inOut",
                scrollTrigger: {
                    trigger: div,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
            });
        });

        // ─── 5. Reveal Up — Staggered Fade & Slide ──────────
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

        // ─── 6. Reveal Left / Right — Horizontal Slide ──────
        $$(".reveal-left").forEach((el) => {
            gsap.to(el, {
                opacity: 1,
                x: 0,
                duration: 0.9,
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
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            });
        });

        // ─── 7. Skill Cards — Staggered 3D Pop-In ───────────
        $$(".reveal-scale").forEach((el, i) => {
            gsap.to(el, {
                opacity: 1,
                scale: 1,
                rotateY: 0,
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

        // Set initial 3D state for skill cards
        gsap.set(".reveal-scale", { rotateY: 15 });

        // ─── 8. Project Cards — Cinematic Scroll Reveal ──────
        $$(".project-card").forEach((card, i) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
            });

            tl.from(card, {
                opacity: 0,
                y: 60,
                rotateX: -8,
                scale: 0.92,
                duration: 0.8,
                delay: (i % 3) * 0.15,
                ease: "power3.out",
            })
            .from(card.querySelector(".project-body h4"), {
                opacity: 0,
                x: -20,
                duration: 0.4,
            }, "-=0.3")
            .from(card.querySelector(".project-body p"), {
                opacity: 0,
                y: 10,
                duration: 0.3,
            }, "-=0.2")
            .from(card.querySelectorAll(".project-tags span"), {
                opacity: 0,
                scale: 0,
                stagger: 0.05,
                duration: 0.3,
                ease: "back.out(3)",
            }, "-=0.15");
        });

        // ─── 9. Dashboard Cards — Counter Pulse Reveal ───────
        $$(".dashboard-card").forEach((card, i) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
            });

            tl.from(card, {
                opacity: 0,
                y: 50,
                scale: 0.85,
                duration: 0.7,
                delay: i * 0.12,
                ease: "back.out(1.4)",
            })
            .from(card.querySelector(".dashboard-icon"), {
                scale: 0,
                rotation: -180,
                duration: 0.6,
                ease: "back.out(2)",
            }, "-=0.3")
            .from(card.querySelector(".dashboard-number"), {
                opacity: 0,
                y: 20,
                duration: 0.4,
            }, "-=0.2");
        });

        // ─── 10. Certification Cards — Flip Reveal ──────────
        $$(".cert-card").forEach((card, i) => {
            gsap.from(card, {
                opacity: 0,
                rotateY: 90,
                scale: 0.8,
                duration: 0.8,
                delay: i * 0.15,
                ease: "power3.out",
                transformPerspective: 800,
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
            });
        });

        // ─── 11. Contact Section — Staggered Details ────────
        $$(".contact-item").forEach((item, i) => {
            gsap.from(item, {
                opacity: 0,
                x: -40,
                duration: 0.6,
                delay: i * 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                    toggleActions: "play none none none",
                },
            });
        });

        // Contact form fields slide in
        $$(".form-group").forEach((group, i) => {
            gsap.from(group, {
                opacity: 0,
                y: 30,
                duration: 0.5,
                delay: i * 0.08,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: group,
                    start: "top 92%",
                    toggleActions: "play none none none",
                },
            });
        });

        // ─── 12. Footer — Cascade Reveal ────────────────────
        const footerTL = gsap.timeline({
            scrollTrigger: {
                trigger: ".footer-section",
                start: "top 90%",
                toggleActions: "play none none none",
            },
        });

        if ($(".footer-brand")) {
            footerTL.from(".footer-brand", {
                opacity: 0,
                y: 20,
                duration: 0.5,
            });
        }
        if ($(".footer-desc")) {
            footerTL.from(".footer-desc", {
                opacity: 0,
                y: 15,
                duration: 0.4,
            }, "-=0.2");
        }
        if ($$(".footer-links li").length) {
            footerTL.from(".footer-links li", {
                opacity: 0,
                x: -15,
                stagger: 0.05,
                duration: 0.3,
            }, "-=0.2");
        }
        if ($$(".footer-socials a").length) {
            footerTL.from(".footer-socials a", {
                opacity: 0,
                scale: 0,
                stagger: 0.08,
                duration: 0.3,
                ease: "back.out(3)",
            }, "-=0.15");
        }

        // ─── 13. Parallax on Gradient Orbs ──────────────────
        $$(".hero-gradient-orb").forEach((orb, i) => {
            gsap.to(orb, {
                y: -80 - i * 30,
                rotation: i % 2 === 0 ? 15 : -15,
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.5,
                },
            });
        });

        // ─── 14. Section Glow Parallax ──────────────────────
        $$(".section-glow").forEach((glow) => {
            gsap.to(glow, {
                y: -60,
                scale: 1.2,
                scrollTrigger: {
                    trigger: glow.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5,
                },
            });
        });

        // ─── 15. Navbar Shrink on Scroll ────────────────────
        ScrollTrigger.create({
            start: 50,
            onToggle: (self) => {
                const nav = $(".navbar");
                if (nav) {
                    gsap.to(nav, {
                        backdropFilter: self.isActive ? "blur(20px)" : "blur(0px)",
                        duration: 0.3,
                    });
                }
            },
        });

        // ─── 16. Magnetic Hover on Interactive Cards ────────
        if (!isTouchDevice()) {
            $$(".stat-card, .dashboard-card, .skill-card").forEach((card) => {
                card.addEventListener("mouseenter", () => {
                    gsap.to(card, {
                        scale: 1.05,
                        boxShadow: "0 20px 60px rgba(0, 229, 255, 0.15)",
                        duration: 0.3,
                        ease: "power2.out",
                    });
                });
                card.addEventListener("mouseleave", () => {
                    gsap.to(card, {
                        scale: 1,
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                        duration: 0.4,
                        ease: "power2.inOut",
                    });
                });
            });

            // CTA Buttons magnetic pull
            $$(".btn-primary-glow, .btn-outline-glow").forEach((btn) => {
                btn.addEventListener("mousemove", (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
                    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
                    gsap.to(btn, {
                        x: x,
                        y: y,
                        duration: 0.3,
                        ease: "power2.out",
                    });
                });
                btn.addEventListener("mouseleave", () => {
                    gsap.to(btn, {
                        x: 0,
                        y: 0,
                        duration: 0.5,
                        ease: "elastic.out(1, 0.3)",
                    });
                });
            });
        }

        // ─── 17. Scroll Progress Indicator ──────────────────
        const progressBar = document.createElement("div");
        progressBar.id = "gsapScrollProgress";
        Object.assign(progressBar.style, {
            position: "fixed",
            top: "0",
            left: "0",
            height: "3px",
            width: "0%",
            background: "linear-gradient(90deg, #00E5FF, #8B5CF6, #EC4899)",
            zIndex: "9999",
            transition: "none",
            borderRadius: "0 2px 2px 0",
        });
        document.body.appendChild(progressBar);

        gsap.to(progressBar, {
            width: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3,
            },
        });

        // ─── 18. Chatbot Toggle Bounce ──────────────────────
        const chatToggle = $("#chatToggle");
        if (chatToggle) {
            gsap.from(chatToggle, {
                scale: 0,
                rotation: -360,
                duration: 0.8,
                delay: 2.5,
                ease: "elastic.out(1, 0.4)",
            });

            // Subtle attention pulse every 8 seconds
            gsap.to(chatToggle, {
                scale: 1.1,
                duration: 0.4,
                yoyo: true,
                repeat: -1,
                repeatDelay: 8,
                ease: "power2.inOut",
            });
        }
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

    /* ── Smooth Scroll (GSAP ScrollToPlugin) ────────────── */
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                const href = this.getAttribute("href");
                if (href === "#") return;
                const target = $(href);
                if (target) {
                    e.preventDefault();
                    if (typeof gsap !== "undefined" && typeof ScrollToPlugin !== "undefined") {
                        gsap.to(window, {
                            duration: 1.2,
                            scrollTo: { y: target, offsetY: 72 },
                            ease: "power3.inOut",
                        });
                    } else if (lenis) {
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
