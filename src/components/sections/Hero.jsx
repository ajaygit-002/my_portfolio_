import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from '../../hooks/useLenis';
import { MagneticButton } from '../ui/MagneticButton';
import { Canvas } from '@react-three/fiber';
import { AIAssistantOrb } from '../three/AIAssistantOrb';
import { wordReveal } from '../../utils/animations';
import { ArrowRight, Download, Terminal, Cpu } from 'lucide-react';
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

  const tagline = "Building Intelligent Experiences Through AI + Design + Engineering";
  const { words, containerVariants, childVariants } = wordReveal(tagline, 0.8);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6 relative max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Column - Command Center UI */}
        <div className="flex flex-col items-start space-y-6 z-10">
          
          {/* AI Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(0,245,255,0.2)] glass-card"
          >
            <Cpu size={14} className="animate-pulse" />
            System Online
          </motion.div>

          {/* Heading intro */}
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2 text-primary font-mono tracking-widest text-sm uppercase"
            >
              <Terminal size={14} />
              <span>Initializing Protocol:</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-display font-black text-6xl md:text-8xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-secondary uppercase"
            >
              AJAY S
            </motion.h1>
          </div>

          {/* Role subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-2"
          >
            <h2 className="font-display font-bold text-xl md:text-3xl text-text-primary uppercase tracking-wider">
              AI & Data Science Engineer
            </h2>
            <h3 className="font-mono text-sm md:text-base text-secondary uppercase tracking-widest">
              Frontend Developer <span className="text-text-muted mx-2">|</span> Machine Learning Enthusiast
            </h3>
          </motion.div>

          {/* Tagline text reveal */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="flex flex-wrap max-w-xl mt-4"
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={childVariants}
                className="word-reveal-span text-text-secondary text-base md:text-lg mr-1.5 mb-1.5 font-medium leading-relaxed"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA Row with Magnetic Liquid Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto pt-8"
          >
            <MagneticButton onClick={handleScrollToProjects} className="w-full sm:w-auto">
              <button
                className="relative overflow-hidden w-full sm:w-auto px-8 py-4 rounded-2xl font-display font-bold uppercase tracking-wider text-sm bg-gradient-to-r from-primary to-secondary text-bg-primary flex items-center justify-center gap-2 shadow-neon transition-all duration-300 group hover:scale-105"
                aria-label="Explore Work"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Work
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[ripple_1s_ease-out_forwards]" />
              </button>
            </MagneticButton>

            <MagneticButton className="w-full sm:w-auto">
              <a
                href="/resume.pdf"
                download
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-primary/30 hover:border-primary bg-bg-dark/50 backdrop-blur-md text-text-primary flex items-center justify-center gap-2 text-sm font-display font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-neon group hover:bg-primary/10"
                aria-label="Download Resume"
              >
                Download Resume
                <Download size={16} className="group-hover:-translate-y-1 transition-transform" />
              </a>
            </MagneticButton>
          </motion.div>

        </div>

        {/* Right Column - AI Assistant Orb */}
        <div className="h-[400px] lg:h-[600px] w-full flex items-center justify-center relative">
          {/* Radial cyan shine backdrop behind canvas */}
          <div className="absolute w-96 h-96 rounded-full bg-primary/10 filter blur-[100px] -z-10" />
          
          <Canvas
            camera={{ position: [0, 0, 5], fov: 60 }}
            gl={{ alpha: true, antialias: true }}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <AIAssistantOrb />
            </Suspense>
          </Canvas>
          
          {/* AI Interface Overlay elements */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-3 glass-card px-6 py-3 rounded-full">
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-primary rounded-full animate-[bounce_1s_infinite]" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-4 bg-primary rounded-full animate-[bounce_1s_infinite]" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-2 bg-primary rounded-full animate-[bounce_1s_infinite]" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Listening...</span>
          </div>
        </div>
      </div>
    </section>
  );
};
