import React from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { GlassCard } from '../ui/GlassCard';
import { experiences } from '../../data/experience';
import { Badge } from '../ui/Badge';
import { Calendar, Building2 } from 'lucide-react';

export const Experience = () => {
  return (
    <SectionWrapper id="experience" className="border-t border-black/5">
      <div className="space-y-4 mb-16 text-center lg:text-left">
        <span className="font-mono text-xs text-primary font-semibold uppercase tracking-[0.3em]">
          CAREER PATH
        </span>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl uppercase tracking-tight text-text-primary">
          Work Experience
        </h2>
      </div>

      <div className="relative max-w-3xl mx-auto pl-8 md:pl-12">
        {/* Glowing vertical spine */}
        <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-gradient-to-b from-primary via-secondary to-accent shadow-[0_0_10px_rgba(0,229,255,0.3)]" />

        {/* Experience List */}
        <div className="space-y-12">
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="relative">
              
              {/* Timeline Connector node */}
              <div className="absolute -left-[41px] md:-left-[57px] top-4 flex items-center justify-center">
                {/* Outer pulsing ring */}
                <div className="absolute w-8 h-8 rounded-full bg-primary/20 border border-primary/40 animate-ping" style={{ animationDuration: '3s' }} />
                {/* Central solid dot */}
                <div className="w-4 h-4 rounded-full bg-[#FFFFFF] border-[3px] border-primary shadow-[0_0_8px_#2563EB] z-10" />
              </div>

              {/* Card Container */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <GlassCard className="flex flex-col gap-4 relative overflow-hidden group">
                  {/* Subtle edge glowing background */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />

                  {/* Header metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-4">
                    <div>
                      <h3 className="font-display font-extrabold text-lg md:text-xl text-text-primary uppercase tracking-wide">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 text-primary font-mono text-xs mt-1">
                        <Building2 size={13} />
                        <span className="font-bold">{exp.company}</span>
                        <span className="text-[10px] text-text-muted px-1.5 py-0.5 rounded bg-black/5 border border-black/10 uppercase tracking-widest">
                          {exp.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-text-secondary font-mono text-xs bg-black/5 border border-black/5 px-3 py-1.5 rounded-xl self-start sm:self-auto shadow-inner">
                      <Calendar size={13} className="text-secondary" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Achievement bullets */}
                  <ul className="space-y-3 mt-2">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3 text-text-secondary text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technology labels */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-black/5">
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
