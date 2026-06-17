import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SectionWrapper } from '../ui/SectionWrapper';
import { GlassCard } from '../ui/GlassCard';
import { GraduationCap, MapPin, Briefcase, Languages } from 'lucide-react';

export const About = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start('animate');
    }
  }, [controls, inView]);

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const badgeVariants = (xOffset, yOffset, delay) => ({
    animate: {
      y: [yOffset, yOffset - 12, yOffset],
      x: [xOffset, xOffset + 8, xOffset],
      transition: {
        duration: 4 + delay,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  });

  return (
    <SectionWrapper id="about" className="border-t border-black/5">
      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left - Rotating profile image + Orbiting badges */}
        <div className="lg:col-span-5 flex items-center justify-center relative min-h-[450px]">
          {/* Cyan/Violet Glow behind image */}
          <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-secondary/20 to-primary/20 filter blur-3xl" />
          
          {/* Rotating gradient outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute w-72 h-72 rounded-full border border-dashed border-primary/40 flex items-center justify-center"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[310px] h-[310px] rounded-full border border-dashed border-secondary/30 flex items-center justify-center"
          />

          {/* Hexagonal container with image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-64 h-64 relative overflow-hidden bg-gradient-to-tr from-secondary to-primary p-[3px] shadow-[0_0_30px_rgba(0,229,255,0.2)] rounded-[32px]"
          >
            <div className="w-full h-full rounded-[30px] overflow-hidden bg-[#FFFFFF]">
              <img
                src="/assets/images/profile.png"
                alt="Ajay S Profile Avatar"
                className="w-full h-full object-cover scale-[1.05] transition-transform duration-500 hover:scale-[1.12]"
              />
            </div>
          </motion.div>

          {/* Floating Badges */}
          <motion.div
            variants={badgeVariants(-80, -90, 0)}
            animate="animate"
            className="absolute px-3 py-1.5 rounded-xl border border-primary/20 bg-bg-primary/90 text-primary font-mono text-[10px] uppercase font-bold tracking-widest shadow-lg pointer-events-none"
          >
            🤖 AI Engineer
          </motion.div>

          <motion.div
            variants={badgeVariants(100, -50, 1)}
            animate="animate"
            className="absolute px-3 py-1.5 rounded-xl border border-secondary/20 bg-bg-primary/90 text-secondary font-mono text-[10px] uppercase font-bold tracking-widest shadow-lg pointer-events-none"
          >
            📊 ML Specialist
          </motion.div>

          <motion.div
            variants={badgeVariants(-90, 80, 2)}
            animate="animate"
            className="absolute px-3 py-1.5 rounded-xl border border-accent/20 bg-bg-primary/90 text-accent font-mono text-[10px] uppercase font-bold tracking-widest shadow-lg pointer-events-none"
          >
            💻 Full Stack
          </motion.div>

          <motion.div
            variants={badgeVariants(90, 90, 3.5)}
            animate="animate"
            className="absolute px-3 py-1.5 rounded-xl border border-white/20 bg-bg-primary/90 text-text-primary font-mono text-[10px] uppercase font-bold tracking-widest shadow-lg pointer-events-none"
          >
            🧩 Problem Solver
          </motion.div>
        </div>

        {/* Right - Profile Details & Bio */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs text-primary font-semibold uppercase tracking-[0.3em]">
              ABOUT ME
            </span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl uppercase tracking-tight text-text-primary leading-tight">
              Passionate About Building Intelligent Systems
            </h2>
          </div>

          <div className="text-text-secondary text-sm md:text-base space-y-4 font-medium leading-relaxed">
            <p>
              I am an AI Engineer specializing in designing and implementing smart, production-ready systems. 
              My expertise covers deep learning models, natural language processing pipelines, RAG (Retrieval-Augmented Generation) architectures, and Model Context Protocol (MCP) integrations.
            </p>
            <p>
              Driven by a deep passion for data science and AI, I build clean, optimized, and performant full-stack systems 
              that turn complex neural representations into seamless user experiences. I focus on practical deployment, 
              ensuring machine learning models scale and solve tangible business challenges.
            </p>
          </div>

          {/* Info cards grid */}
          <motion.div
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="initial"
            animate={controls}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
          >
            <GlassCard variants={cardVariants} className="p-4 md:p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <GraduationCap size={20} />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-xs uppercase tracking-widest text-text-primary">
                  Education
                </h4>
                <p className="text-xs text-text-secondary mt-1 font-semibold">
                  B.E/B.Tech
                </p>
                <p className="text-[10px] text-text-muted mt-0.5 font-mono">
                  Computer Science
                </p>
              </div>
            </GlassCard>

            <GlassCard variants={cardVariants} className="p-4 md:p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-xs uppercase tracking-widest text-text-primary">
                  Location
                </h4>
                <p className="text-xs text-text-secondary mt-1 font-semibold">
                  Tamil Nadu, IN
                </p>
                <p className="text-[10px] text-text-muted mt-0.5 font-mono">
                  Available Remotely
                </p>
              </div>
            </GlassCard>

            <GlassCard variants={cardVariants} className="p-4 md:p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Briefcase size={20} />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-xs uppercase tracking-widest text-text-primary">
                  Status
                </h4>
                <p className="text-xs text-text-secondary mt-1 font-semibold">
                  Open to Work
                </p>
                <p className="text-[10px] text-text-muted mt-0.5 font-mono">
                  Full-Time or Freelance
                </p>
              </div>
            </GlassCard>

            <GlassCard variants={cardVariants} className="p-4 md:p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center text-text-primary shrink-0">
                <Languages size={20} />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-xs uppercase tracking-widest text-text-primary">
                  Languages
                </h4>
                <p className="text-xs text-text-secondary mt-1 font-semibold">
                  English, Tamil
                </p>
                <p className="text-[10px] text-text-muted mt-0.5 font-mono">
                  Professional Proficiency
                </p>
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </SectionWrapper>
  );
};
