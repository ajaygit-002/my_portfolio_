import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaKaggle } from 'react-icons/fa';
import { useLenis } from '../../hooks/useLenis';

export const Footer = () => {
  const lenis = useLenis();

  const handleScrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
    }
  };

  return (
    <footer className="relative border-t border-black/5 bg-[#FFFFFF] py-12 px-6 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-primary/10 rounded-full filter blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Monogram branding */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-lg text-text-primary uppercase tracking-wider">
              AJAY S
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          </div>
          <p className="text-xs text-text-muted font-mono mt-1 uppercase tracking-widest">
            AI & Machine Learning Systems
          </p>
        </div>

        {/* Copyright notice */}
        <p className="text-center text-xs text-text-secondary font-mono order-3 md:order-2">
          &copy; {new Date().getFullYear()} AJAY S. ALL RIGHTS RESERVED.
        </p>

        {/* Social Network Row */}
        <div className="flex items-center gap-4 order-2 md:order-3">
          <a
            href="https://github.com/ajay"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-2xl border border-black/10 bg-black/5 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_10px_rgba(0,229,255,0.2)]"
            aria-label="GitHub Profile"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://linkedin.com/in/ajay"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-2xl border border-black/10 bg-black/5 flex items-center justify-center text-slate-400 hover:text-secondary hover:border-secondary/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_10px_rgba(124,58,237,0.2)]"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={18} />
          </a>
          <a
            href="https://twitter.com/ajay"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-2xl border border-black/10 bg-black/5 flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_10px_rgba(0,255,163,0.2)]"
            aria-label="Twitter Profile"
          >
            <FaTwitter size={18} />
          </a>
          <a
            href="https://kaggle.com/ajay"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-2xl border border-black/10 bg-black/5 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_10px_rgba(0,229,255,0.2)]"
            aria-label="Kaggle Profile"
          >
            <FaKaggle size={18} />
          </a>
        </div>
      </div>

      {/* Back to top clicker */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleScrollToTop}
          className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-muted hover:text-primary transition-colors hoverable"
        >
          [ BACK TO TOP ]
        </button>
      </div>
    </footer>
  );
};
