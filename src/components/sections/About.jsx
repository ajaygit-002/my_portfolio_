import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { GlassCard } from '../ui/GlassCard';
import { Database, Code2, BrainCircuit, GraduationCap } from 'lucide-react';

export const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  const milestones = [
    {
      icon: <GraduationCap size={24} />,
      title: "Final Year B.Tech AI & DS Student",
      desc: "Currently completing my degree in Artificial Intelligence and Data Science, building a strong foundation in algorithms and intelligent systems.",
      color: "from-[#00F5FF] to-[#7C3AED]",
      iconColor: "text-[#00F5FF]"
    },
    {
      icon: <Code2 size={24} />,
      title: "Frontend Developer",
      desc: "Creating stunning, high-performance web applications using React, Three.js, and modern animation libraries like Framer Motion.",
      color: "from-[#7C3AED] to-[#8B5CF6]",
      iconColor: "text-[#7C3AED]"
    },
    {
      icon: <BrainCircuit size={24} />,
      title: "Machine Learning Developer",
      desc: "Designing deep learning models and NLP pipelines, bringing AI from concept to production-ready deployments.",
      color: "from-[#8B5CF6] to-[#22D3EE]",
      iconColor: "text-[#8B5CF6]"
    },
    {
      icon: <Database size={24} />,
      title: "Data Analyst Intern",
      desc: "Extracted insights from complex datasets, optimizing data workflows and building predictive models at Besant Technologies.",
      color: "from-[#22D3EE] to-[#38BDF8]",
      iconColor: "text-[#22D3EE]"
    }
  ];

  return (
    <SectionWrapper id="about" className="border-t border-white/5 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none -z-10" />

      <div className="space-y-4 mb-24 text-center">
        <span className="font-mono text-xs text-primary font-semibold uppercase tracking-[0.3em]">
          MY JOURNEY
        </span>
        <h2 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-text-muted">
          Evolution of an Engineer
        </h2>
      </div>

      <div ref={containerRef} className="relative max-w-5xl mx-auto px-4 md:px-0">
        {/* Animated Journey Path SVG */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 md:-ml-0.5">
          <motion.div style={{ opacity }} className="h-full w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              style={{ scaleY: pathLength, transformOrigin: "top" }}
              className="w-full h-full bg-gradient-to-b from-primary via-secondary to-info"
            />
          </motion.div>
        </div>

        <div className="space-y-24 md:space-y-32">
          {milestones.map((item, idx) => (
            <div key={idx} className={`relative flex flex-col md:flex-row items-center justify-between ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Center Node */}
              <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12">
                <div className="absolute w-full h-full rounded-full bg-bg-dark border border-white/10" />
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                  className={`relative z-10 ${item.iconColor}`}
                >
                  {item.icon}
                </motion.div>
                {/* Glow ring */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1.5 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                  className={`absolute w-full h-full rounded-full bg-gradient-to-r ${item.color} filter blur-md opacity-40`}
                />
              </div>

              {/* Floating Achievement Card */}
              <div className={`w-full md:w-5/12 pl-20 md:pl-0 ${idx % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                <motion.div
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <GlassCard className="p-8 relative overflow-hidden group">
                    <div className={`absolute top-0 ${idx % 2 === 0 ? 'right-0' : 'left-0'} w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 filter blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
                    <h3 className="font-display font-bold text-2xl text-white mb-3 tracking-wide">{item.title}</h3>
                    <p className="text-text-secondary font-sans leading-relaxed">{item.desc}</p>
                  </GlassCard>
                </motion.div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
