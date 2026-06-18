import React from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { GlassCard } from '../ui/GlassCard';
import { Counter } from '../ui/Counter';
import { Rocket, Box, BrainCircuit, GitCommit } from 'lucide-react';

export const Statistics = () => {
  const stats = [
    {
      icon: <Rocket className="w-8 h-8 text-[#00F5FF]" />,
      value: 6,
      suffix: "+",
      label: "Projects Completed",
      color: "from-[#00F5FF]/20 to-transparent",
      glow: "rgba(0, 245, 255, 0.5)"
    },
    {
      icon: <Box className="w-8 h-8 text-[#7C3AED]" />,
      value: 15,
      suffix: "+",
      label: "Technologies Learned",
      color: "from-[#7C3AED]/20 to-transparent",
      glow: "rgba(124, 58, 237, 0.5)"
    },
    {
      icon: <BrainCircuit className="w-8 h-8 text-[#8B5CF6]" />,
      value: 1,
      suffix: "",
      label: "Internship Experience",
      color: "from-[#8B5CF6]/20 to-transparent",
      glow: "rgba(139, 92, 246, 0.5)"
    },
    {
      icon: <GitCommit className="w-8 h-8 text-[#22D3EE]" />,
      value: 500,
      suffix: "+",
      label: "GitHub Contributions",
      color: "from-[#22D3EE]/20 to-transparent",
      glow: "rgba(34, 211, 238, 0.5)"
    }
  ];

  return (
    <SectionWrapper id="statistics" className="border-t border-white/5 relative z-10 py-24">
      {/* Aurora Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full filter blur-[150px] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4 md:px-0">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
          >
            <GlassCard className="relative p-8 h-full flex flex-col items-center justify-center text-center group hover:-translate-y-2 transition-transform duration-300">
              {/* Radial gradient background hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-b ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
              
              <div className="relative z-10 mb-6 w-16 h-16 flex items-center justify-center rounded-2xl bg-black/40 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: `0 0 20px ${stat.glow}` }}>
                {stat.icon}
              </div>
              
              <div className="relative z-10 space-y-2">
                <h3 className="font-display font-black text-5xl text-white tracking-tighter">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="font-mono text-xs uppercase tracking-widest text-text-secondary font-semibold">
                  {stat.label}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};
