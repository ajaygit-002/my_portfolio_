import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from '../../hooks/useLenis';
import { MagneticButton } from '../ui/MagneticButton';
import { Counter } from '../ui/Counter';
import { GlassCard } from '../ui/GlassCard';
import { Canvas } from '@react-three/fiber';
import { NeuralNetwork } from '../three/NeuralNetwork';
import { wordReveal } from '../../utils/animations';
import { ArrowRight, Download } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const Hero = () => {
  const lenis = useLenis();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const handleScrollToProjects = () => {
    if (lenis) {
      const target = document.getElementById('projects');
      if (target) {
        lenis.scrollTo(target, { offset: -80 });
      }
    }
  };

  const tagline = "Building Intelligent Systems with AI, Data Science & Modern Web Technologies";
  const { words, containerVariants, childVariants } = wordReveal(tagline, 0.8);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6 relative max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left Column (60% on desktop) */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 z-10">
          
          {/* Work Availability Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-mono font-medium tracking-wide uppercase shadow-[0_0_15px_rgba(0,255,163,0.1)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Available for Work
          </motion.div>

          {/* Heading intro */}
          <div className="space-y-1">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-text-secondary font-mono tracking-widest text-sm uppercase"
            >
              Hello, I'm
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-display font-extrabold text-6xl md:text-8xl tracking-tight text-white uppercase"
            >
              Ajay S
            </motion.h1>
          </div>

          {/* Role subtitle with typewriter typing animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="h-10 md:h-12 flex items-center"
          >
            <h2 className="font-display font-bold text-2xl md:text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase tracking-wider">
              AI Engineer & ML Developer
            </h2>
          </motion.div>

          {/* Tagline text reveal */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="flex flex-wrap max-w-xl"
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={childVariants}
                className="word-reveal-span text-text-secondary text-sm md:text-base mr-1.5 mb-1.5 font-medium leading-relaxed"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-4"
          >
            <GlassCard className="p-4 md:p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-2xl md:text-3xl font-display font-extrabold text-primary">
                <Counter end={4} suffix="+" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary mt-1">
                AI Projects
              </span>
            </GlassCard>

            <GlassCard className="p-4 md:p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-2xl md:text-3xl font-display font-extrabold text-secondary">
                <Counter end={15} suffix="+" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary mt-1">
                Tech Tools
              </span>
            </GlassCard>

            <GlassCard className="p-4 md:p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-2xl md:text-3xl font-display font-extrabold text-accent">
                <Counter end={1} />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary mt-1">
                Internship
              </span>
            </GlassCard>

            <GlassCard className="p-4 md:p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-2xl md:text-3xl font-display font-extrabold text-white">
                <Counter end={100} suffix="%" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary mt-1">
                Passion
              </span>
            </GlassCard>
          </motion.div>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-6"
          >
            <MagneticButton onClick={handleScrollToProjects} className="w-full sm:w-auto">
              <button
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-display font-bold uppercase tracking-wider text-sm bg-gradient-to-r from-secondary to-primary text-white flex items-center justify-center gap-2 hover:shadow-[0_0_20px_#00E5FF] transition-all duration-300"
                aria-label="View Projects"
              >
                View My Work
                <ArrowRight size={16} />
              </button>
            </MagneticButton>

            <MagneticButton className="w-full sm:w-auto">
              <a
                href="/resume.pdf"
                download
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 hover:border-primary/40 bg-white/5 text-white flex items-center justify-center gap-2 text-sm font-display font-bold uppercase tracking-wider transition-colors duration-300"
                aria-label="Download CV"
              >
                Download CV
                <Download size={16} />
              </a>
            </MagneticButton>
          </motion.div>

        </div>

        {/* Right Column (40% - 3D Canvas) */}
        <div className="lg:col-span-5 h-[350px] lg:h-[500px] w-full flex items-center justify-center relative">
          {/* Radial cyan shine backdrop behind canvas */}
          <div className="absolute w-72 h-72 rounded-full bg-primary/5 filter blur-3xl -z-10" />
          
          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 60 }}
            gl={{ alpha: true, antialias: true }}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <NeuralNetwork />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
};
