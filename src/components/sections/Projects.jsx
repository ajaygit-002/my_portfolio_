import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { projects } from '../../data/projects';
import { Badge } from '../ui/Badge';
import { Globe, Github, Sparkles } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const ProjectCard = ({ project }) => {
  const cardRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates of the mouse on the card
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Compute rotations (-7 to 7 degrees max tilt)
    const rotateX = -((mouseY - height / 2) / (height / 2)) * 7;
    const rotateY = ((mouseX - width / 2) / (width / 2)) * 7;
    
    setRotate({ x: rotateX, y: rotateY });
    // SPECULAR SHINE overlay position
    setShine({ x: mouseX, y: mouseY, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setShine({ x: 0, y: 0, opacity: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-card flex flex-col h-full overflow-hidden relative transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_40px_rgba(0,229,255,0.15)] group"
      style={!isMobile ? {
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.02)`,
        transition: 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease'
      } : {}}
    >
      {/* Specular Shine Overlay */}
      {!isMobile && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 180px at ${shine.x}px ${shine.y}px, rgba(255, 255, 255, ${shine.opacity}), transparent 80%)`
          }}
        />
      )}

      {/* Project Image Header / Custom Brand Gradient */}
      <div 
        className={`w-full h-44 relative bg-gradient-to-tr ${project.color} overflow-hidden flex items-center justify-center`}
      >
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        {/* Floating tech nodes graphic */}
        <div className="absolute w-24 h-24 rounded-full bg-white/10 blur-xl animate-pulse" />
        
        <Sparkles className="w-10 h-10 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.5)] z-10 group-hover:scale-110 transition-transform duration-500" />
      </div>

      {/* Card Body content */}
      <div className="p-6 md:p-6 flex flex-col flex-grow gap-4">
        
        {/* Category Label */}
        <div className="flex">
          <span className="font-mono text-[10px] font-extrabold tracking-widest text-primary uppercase bg-primary/5 border border-primary/20 px-2.5 py-1 rounded-md">
            {project.category}
          </span>
        </div>

        {/* Project Title */}
        <h3 className="font-display font-extrabold text-xl text-white uppercase tracking-wide group-hover:text-primary transition-colors">
          {project.name}
        </h3>

        {/* Description */}
        <p className="text-text-secondary text-xs md:text-sm font-medium leading-relaxed flex-grow">
          {project.description}
        </p>

        {/* Technologies badges */}
        <div className="flex flex-wrap gap-1.5 py-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} text={tech} />
          ))}
        </div>

        {/* Links Footer */}
        <div className="flex items-center gap-4 border-t border-white/5 pt-4 mt-auto">
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-primary hover:text-white transition-colors duration-300"
          >
            <Globe size={14} />
            <span>Live Demo</span>
          </a>
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-text-secondary hover:text-white transition-colors duration-300 ml-auto"
          >
            <Github size={14} />
            <span>GitHub</span>
          </a>
        </div>

      </div>
    </motion.div>
  );
};

export const Projects = () => {
  return (
    <SectionWrapper id="projects" className="border-t border-white/5">
      <div className="space-y-4 mb-16 text-center lg:text-left">
        <span className="font-mono text-xs text-primary font-semibold uppercase tracking-[0.3em]">
          MY WORKS
        </span>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl uppercase tracking-tight text-white">
          Featured AI Projects
        </h2>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </SectionWrapper>
  );
};
