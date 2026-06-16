import React, { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { GlassCard } from '../ui/GlassCard';
import { Canvas } from '@react-three/fiber';
import { SkillsOrbit } from '../three/SkillsOrbit';
import { skillCategories, orbitSkills } from '../../data/skills';
import { Badge } from '../ui/Badge';
import { Sparkles, BarChart2 } from 'lucide-react';

export const Skills = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Find selected skill details
  const getSkillDetails = () => {
    if (!selectedSkill) return null;
    
    // Look up in Categories
    for (const cat of skillCategories) {
      const found = cat.skills.find(s => s.name.toLowerCase() === selectedSkill.toLowerCase());
      if (found) return { ...found, category: cat.title };
    }
    
    // Look up in Orbit lists
    const allOrbitSkills = [...orbitSkills.ring1, ...orbitSkills.ring2];
    const foundOrbit = allOrbitSkills.find(s => s.name.toLowerCase() === selectedSkill.toLowerCase());
    if (foundOrbit) {
      // Return a mock default percentage since it's an orbit skill
      return { 
        name: foundOrbit.name, 
        level: foundOrbit.name === "Python" || foundOrbit.name === "React" ? 90 : 80, 
        category: "Central Technologies",
        color: foundOrbit.color
      };
    }

    return null;
  };

  const selectedDetails = getSkillDetails();

  return (
    <SectionWrapper id="skills" className="border-t border-white/5">
      <div className="space-y-4 mb-16 text-center lg:text-left">
        <span className="font-mono text-xs text-primary font-semibold uppercase tracking-[0.3em]">
          TECHNICAL SKILLS
        </span>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl uppercase tracking-tight text-white">
          Expertise & Tech Stack
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Sub-section A - 3D Orbiting Skills Globe */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="h-[360px] md:h-[420px] w-full relative select-none">
            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/5 rounded-full filter blur-3xl -z-10" />
            
            <span className="absolute top-0 right-4 text-[9px] font-mono tracking-widest text-text-muted uppercase pointer-events-none">
              [ Click a skill node to view level ]
            </span>
            
            <Canvas
              camera={{ position: [0, 0, 5], fov: 60 }}
              gl={{ alpha: true, antialias: true }}
              className="w-full h-full"
            >
              <Suspense fallback={null}>
                <SkillsOrbit onSelectSkill={(name) => setSelectedSkill(name)} />
              </Suspense>
            </Canvas>
          </div>

          {/* Selected Skill Details Box */}
          <div className="w-full max-w-md h-28 mt-4 relative">
            <AnimatePresence mode="wait">
              {selectedDetails ? (
                <motion.div
                  key={selectedDetails.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="w-full"
                >
                  <GlassCard className="p-4 md:p-5 rounded-2xl border-primary/20 bg-primary/5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-[#00FFA3]" />
                        <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                          {selectedDetails.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-text-muted uppercase">
                        {selectedDetails.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Animated Progress bar */}
                      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedDetails.level}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-secondary to-primary"
                        />
                      </div>
                      <span className="font-mono text-xs font-semibold text-primary">
                        {selectedDetails.level}%
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex items-center justify-center border border-dashed border-white/10 rounded-2xl p-4 text-center"
                >
                  <p className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em]">
                    Select a floating skill from the 3D globe to reveal details
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sub-section B - Skill Progress Cards */}
        <div className="lg:col-span-6 flex flex-col gap-6 w-full">
          {skillCategories.map((category) => (
            <GlassCard key={category.title} className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-primary" />
                <h3 className="font-display font-extrabold text-sm uppercase tracking-widest text-white">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono text-text-secondary uppercase">
                      <span className="font-bold tracking-wider text-slate-300">{skill.name}</span>
                      <span className="text-primary font-bold">{skill.level}%</span>
                    </div>
                    
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-secondary to-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </SectionWrapper>
  );
};
