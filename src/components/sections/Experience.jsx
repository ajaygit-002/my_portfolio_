import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { GlassCard } from '../ui/GlassCard';
import { experiences } from '../../data/experience';
import { Badge } from '../ui/Badge';
import { Calendar, Building2, ChevronRight } from 'lucide-react';

export const Experience = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);
  const glowOpacity = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  return (
    <SectionWrapper id="experience" className="border-t border-white/5 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full filter blur-[120px] pointer-events-none -z-10" />

      <div className="space-y-4 mb-24 text-center">
        <span className="font-mono text-xs text-primary font-semibold uppercase tracking-[0.3em]">
          CAREER PATH
        </span>
        <h2 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-text-muted">
          Experience
        </h2>
      </div>

      <div ref={containerRef} className="relative max-w-4xl mx-auto pl-8 md:pl-16">
        {/* Draw-on-scroll Glowing vertical spine */}
        <div className="absolute left-0 md:left-4 top-2 bottom-2 w-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            style={{ height: pathHeight }} 
            className="w-full bg-gradient-to-b from-primary via-secondary to-accent shadow-neon origin-top"
          />
          {/* Particle Trail Head */}
          <motion.div
            style={{ top: pathHeight, opacity: glowOpacity }}
            className="absolute left-1/2 -translate-x-1/2 w-4 h-16 bg-white blur-md"
          />
        </div>

        {/* Experience List */}
        <div className="space-y-20">
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="relative">
              
              {/* Timeline Connector node */}
              <div className="absolute -left-[42px] md:-left-[31px] top-6 flex items-center justify-center">
                {/* Outer pulsing ring */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="absolute w-12 h-12 rounded-full bg-primary/20 border border-primary/40 animate-pulse" 
                />
                {/* Central solid dot */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", delay: idx * 0.2 + 0.2 }}
                  className="w-4 h-4 rounded-full bg-white border-[4px] border-primary shadow-neon z-10" 
                />
              </div>

              {/* Card Container */}
              <motion.div
                initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, type: "spring", bounce: 0.3 }}
              >
                <GlassCard className="flex flex-col gap-6 relative overflow-hidden group p-8 bg-bg-dark/60 hover:bg-bg-dark/80 transition-colors duration-500">
                  {/* Subtle edge glowing background */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none group-hover:from-primary/20 transition-all duration-500" />

                  {/* Header metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div className="space-y-2">
                      <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-wide group-hover:text-primary transition-colors">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-3 font-mono text-sm">
                        <Building2 size={16} className="text-secondary" />
                        <span className="font-bold text-text-primary">{exp.company}</span>
                        <span className="text-[10px] text-text-muted px-2 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-widest">
                          {exp.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-text-secondary font-mono text-xs bg-black/40 border border-white/5 px-4 py-2 rounded-full self-start sm:self-auto shadow-inner">
                      <Calendar size={14} className="text-info" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Achievement bullets */}
                  <ul className="space-y-4 mt-2">
                    {exp.bullets.map((bullet, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className="flex items-start gap-4 text-text-secondary text-sm md:text-base leading-relaxed group/bullet"
                      >
                        <ChevronRight size={16} className="text-primary mt-1 shrink-0 group-hover/bullet:translate-x-1 transition-transform" />
                        <span className="group-hover/bullet:text-white transition-colors">{bullet}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Technology labels */}
                  <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/5">
                    {exp.tags.map((tag) => (
                      <Badge key={tag} text={tag} />
                    ))}
                  </div>

                </GlassCard>
              </motion.div>

            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
