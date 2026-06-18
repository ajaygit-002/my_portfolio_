import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { projects } from '../../data/projects';
import { Badge } from '../ui/Badge';
import { Globe, Github, Sparkles, Activity, Zap, Cpu } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const handleMouseMove = (e) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 5;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group rounded-[2.5rem] p-[1px] bg-gradient-to-b from-white/10 to-transparent overflow-visible"
      style={!isMobile ? {
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.1s ease-out'
      } : {}}
    >
      {/* Glow Effect behind card */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700 -z-10 rounded-[2.5rem]`} />

      <div className="bg-bg-dark/80 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-white/5 h-full flex flex-col relative z-10 shadow-glass">
        
        {/* Media Container */}
        <div className="relative w-full h-56 md:h-64 overflow-hidden bg-black/50">
          <div className={`absolute inset-0 bg-gradient-to-tr ${project.color} opacity-40 mix-blend-overlay z-10`} />
          
          <video 
            src={project.videoUrl} 
            autoPlay 
            loop 
            muted 
            playsInline
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'} opacity-60 group-hover:opacity-100`}
          />

          {/* Floating Performance Metrics Overlays */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {Object.entries(project.performance).map(([key, value], i) => (
              <motion.div 
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg"
              >
                {i === 0 ? <Activity size={12} className="text-primary" /> : 
                 i === 1 ? <Zap size={12} className="text-secondary" /> : 
                 <Cpu size={12} className="text-info" />}
                <span className="text-[10px] font-mono text-white/80 uppercase tracking-wider">
                  <span className="text-white font-bold">{value}</span> {key}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Hover Play Indicator */}
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${project.color} flex items-center justify-center backdrop-blur-xl shadow-neon`}>
              <Sparkles className="text-white w-6 h-6 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-8 flex flex-col flex-grow relative bg-gradient-to-b from-transparent to-bg-dark/90">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] font-extrabold tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 px-3 py-1 rounded-full shadow-inner">
              {project.category}
            </span>
          </div>

          <h3 className="font-display font-black text-2xl text-white uppercase tracking-wide mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-primary transition-all duration-300">
            {project.name}
          </h3>

          <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-grow">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.technologies.map((tech) => (
              <Badge key={tech} text={tech} />
            ))}
          </div>

          {/* Links Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors duration-300 group/link"
            >
              <Globe size={16} />
              <span className="relative overflow-hidden">
                <span className="inline-block transition-transform duration-300 group-hover/link:-translate-y-full">Live Demo</span>
                <span className="absolute left-0 top-0 inline-block transition-transform duration-300 translate-y-full group-hover/link:translate-y-0 text-white">Live Demo</span>
              </span>
            </a>
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors duration-300"
            >
              <Github size={16} />
              <span>Source</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Projects = () => {
  return (
    <SectionWrapper id="projects" className="border-t border-white/5 relative">
      <div className="space-y-4 mb-24 text-center">
        <span className="font-mono text-xs text-primary font-semibold uppercase tracking-[0.3em]">
          PREMIUM SHOWCASE
        </span>
        <h2 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-text-muted">
          Featured Projects
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto px-4 md:px-0">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
};
