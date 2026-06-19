import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useLenis } from '../../hooks/useLenis';
import { Menu, X } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
];

export const Navbar = () => {
  const { activeSection, mobileMenuOpen, setMobileMenuOpen } = useApp();
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    
    // Smooth scroll with Lenis
    if (lenis) {
      if (id === 'home') {
        lenis.scrollTo(0);
      } else {
        const target = document.getElementById(id);
        if (target) {
          lenis.scrollTo(target, { offset: -80 });
        }
      }
    }
  };

  const handleHireClick = () => {
    window.location.href = "mailto:ajay.w@example.com?subject=Opportunity%20Discovery";
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
          scrolled
            ? 'bg-[#FFFFFF]/85 backdrop-blur-lg border-black/5 py-4'
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Monogram */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left hoverable"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-secondary to-primary p-[1.5px] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-[10px] bg-[#FFFFFF] flex items-center justify-center font-display font-extrabold text-base text-primary tracking-tighter">
                AS
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm tracking-widest text-text-primary uppercase group-hover:text-primary transition-colors">
                Ajay S
              </span>
              <span className="font-mono text-[9px] text-text-secondary uppercase tracking-[0.2em]">
                AI Engineer
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.id} className="relative py-1 px-2">
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`font-display font-semibold text-sm tracking-wide transition-colors hoverable uppercase ${
                        isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {link.label}
                    </button>
                    {isActive && (
                      <motion.span
                        layoutId="underline"
                        className="absolute left-2 right-2 bottom-0 h-[2px] bg-primary shadow-[0_0_8px_#2563EB]"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Hire Me CTA */}
            <MagneticButton onClick={handleHireClick}>
              <button
                className="px-5 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-gradient-to-r from-secondary to-primary text-white hover:shadow-[0_0_15px_#2563EB] transition-all hover:scale-[1.03]"
                aria-label="Hire Ajay S"
              >
                Hire Me
              </button>
            </MagneticButton>
          </nav>

          {/* Mobile Menu Toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-black/10 bg-black/5 hover:bg-black/10 text-text-primary"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 bg-[#FFFFFF] z-40 flex flex-col justify-center px-8 md:hidden"
          >
            {/* Ambient glows behind drawer */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl -z-10" />
            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-secondary/10 rounded-full filter blur-3xl -z-10" />

            <ul className="flex flex-col gap-6 text-center">
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`font-display font-extrabold text-2xl uppercase tracking-widest transition-colors ${
                        isActive ? 'text-primary' : 'text-slate-400 hover:text-text-primary'
                      }`}
                    >
                      {link.label}
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: navLinks.length * 0.05 }}
              className="mt-12 flex justify-center"
            >
              <button
                onClick={handleHireClick}
                className="w-full max-w-xs py-4 rounded-full font-display font-bold uppercase tracking-wider bg-gradient-to-r from-secondary to-primary text-white text-sm"
              >
                Hire Me
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
