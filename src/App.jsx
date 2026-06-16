import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { AppProvider, useApp } from './context/AppContext';
import { Loader } from './components/ui/Loader';
import { BackgroundCanvas } from './components/three/BackgroundCanvas';
import { CustomCursor } from './components/ui/CustomCursor';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Sections
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Experience } from './components/sections/Experience';
import { Projects } from './components/sections/Projects';
import { TechStack } from './components/sections/TechStack';
import { Contact } from './components/sections/Contact';

// Register GSAP ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  console.log("AppContent rendering, loaderFinished:", useApp().loaderFinished);
  const { loaderFinished, setLoaderFinished, setActiveSection } = useApp();

  // 1. Initialize Lenis Smooth Scroll and connect to GSAP ticker
  useEffect(() => {
    if (!loaderFinished) return;

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 1.3,
    });

    window.lenis = lenis;

    // Direct scroll updates to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickHandler = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickHandler);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      window.lenis = null;
      gsap.ticker.remove(tickHandler);
    };
  }, [loaderFinished]);

  // 2. Observe sections and highlight active page nav link in header
  useEffect(() => {
    if (!loaderFinished) return;

    const sections = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];
    const activeObservers = [];

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          root: null,
          rootMargin: '-35% 0px -35% 0px', // Capture when element fills center slice of screen
          threshold: 0
        }
      );

      observer.observe(element);
      activeObservers.push({ observer, element });
    });

    return () => {
      activeObservers.forEach(({ observer, element }) => observer.unobserve(element));
    };
  }, [loaderFinished, setActiveSection]);

  return (
    <>
      <AnimatePresence mode="wait">
        {!loaderFinished && (
          <Loader onComplete={() => setLoaderFinished(true)} />
        )}
      </AnimatePresence>

      {loaderFinished && (
        <>
          {/* Global Visual Canvas Background */}
          <BackgroundCanvas />
          
          {/* Custom interactive cursor tracking ring and trail */}
          <CustomCursor />
          
          {/* Layout Head & Navigation */}
          <Navbar />
          
          {/* Scroll container wrapper */}
          <main className="relative flex flex-col items-center w-full z-10 overflow-hidden">
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <TechStack />
            <Contact />
            <Footer />
          </main>
        </>
      )}
    </>
  );
}

export default function App() {
  console.log("App wrapper rendering");
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
