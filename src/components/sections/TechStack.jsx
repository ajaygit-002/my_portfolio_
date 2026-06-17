import React from 'react';
import { SiTensorflow } from 'react-icons/si';
import { row1Tech, row2Tech } from '../../data/techStack';
import { Sparkles } from 'lucide-react';

const TechCard = ({ tech }) => {
  const isTensorflow = tech.name === "TensorFlow";

  // Apply custom inline brand color overrides on hover
  const hoverStyle = {
    '--hover-color': tech.color,
    '--hover-glow': `${tech.color}30`
  };

  return (
    <div
      style={hoverStyle}
      className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-black/5 bg-black/5 backdrop-blur-md select-none transition-all duration-300 hover:border-[var(--hover-color)] hover:shadow-[0_0_20px_var(--hover-glow)] hover:-translate-y-1 group"
    >
      {/* Icon rendering */}
      <div className="w-[22px] h-[22px] flex items-center justify-center transition-colors duration-300 text-slate-400 group-hover:text-[var(--hover-color)] shrink-0">
        {isTensorflow ? (
          <SiTensorflow size={22} />
        ) : tech.iconPath ? (
          <img 
            src={tech.iconPath} 
            alt={`${tech.name} icon`} 
            className="w-full h-full object-contain filter brightness-75 group-hover:brightness-100 group-hover:drop-shadow-[0_0_8px_var(--hover-color)] transition-all duration-300"
          />
        ) : (
          <Sparkles size={22} />
        )}
      </div>
      
      {/* Label rendering */}
      <span className="font-mono text-xs font-bold tracking-wider text-slate-300 group-hover:text-text-primary uppercase transition-colors duration-300">
        {tech.name}
      </span>
    </div>
  );
};

export const TechStack = () => {
  // Duplicate arrays to ensure seamless infinite looping marquee
  const row1Repeated = [...row1Tech, ...row1Tech, ...row1Tech, ...row1Tech];
  const row2Repeated = [...row2Tech, ...row2Tech, ...row2Tech, ...row2Tech];

  return (
    <section id="techstack" className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-transparent to-[#FFFFFF] w-full">
      <div className="max-w-7xl mx-auto px-6 space-y-4 mb-12 text-center lg:text-left">
        <span className="font-mono text-xs text-primary font-semibold uppercase tracking-[0.3em]">
          CORE SYSTEMS
        </span>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl uppercase tracking-tight text-text-primary">
          Technologies & Tools
        </h2>
      </div>

      {/* Infinite Marquee Columns */}
      <div className="flex flex-col gap-6 w-full relative">
        
        {/* Row 1 - Left scrolling */}
        <div className="marquee-container w-full">
          <div className="marquee-content marquee-row-1">
            {row1Repeated.map((tech, idx) => (
              <TechCard key={`row1-${tech.name}-${idx}`} tech={tech} />
            ))}
          </div>
        </div>

        {/* Row 2 - Right scrolling */}
        <div className="marquee-container w-full">
          <div className="marquee-content marquee-row-2">
            {row2Repeated.map((tech, idx) => (
              <TechCard key={`row2-${tech.name}-${idx}`} tech={tech} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
