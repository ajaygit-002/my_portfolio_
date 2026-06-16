import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [textStage, setTextStage] = useState(0); // 0: logo, 1: AI, 2: Developer, 3: Portfolio, 4: Progress

  useEffect(() => {
    const t1 = setTimeout(() => setTextStage(1), 400);
    const t2 = setTimeout(() => setTextStage(2), 800);
    const t3 = setTimeout(() => setTextStage(3), 1200);
    const t4 = setTimeout(() => setTextStage(4), 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    if (textStage < 4) return;
    const duration = 600; // time to load from 0 to 100
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(Math.floor(percent));
      if (percent === 100) {
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [textStage]);

  useEffect(() => {
    if (progress === 100) {
      const finishTimeout = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(finishTimeout);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#050816]"
      exit={{
        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      <motion.div
        className="flex flex-col items-center gap-6"
        animate={progress === 100 ? { scale: 1.1, filter: "blur(8px)", opacity: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Glow Ring with Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#00E5FF] to-[#00FFA3] p-[2px]"
        >
          <div className="flex items-center justify-center w-full h-full rounded-full bg-[#050816]">
            {/* Custom SVG Brain / Node Monogram */}
            <svg
              className="w-12 h-12 text-[#00E5FF] animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-full bg-[#00E5FF]/20 blur-md -z-10 animate-ping" style={{ animationDuration: '3s' }} />
        </motion.div>

        {/* Typing text segments */}
        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {textStage === 1 && (
              <motion.span
                key="ai"
                initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
                className="font-display font-extrabold text-2xl tracking-wide text-white uppercase"
              >
                AI
              </motion.span>
            )}
            {textStage === 2 && (
              <motion.span
                key="developer"
                initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
                className="font-display font-extrabold text-2xl tracking-wide text-white uppercase"
              >
                Developer
              </motion.span>
            )}
            {textStage >= 3 && (
              <motion.span
                key="portfolio"
                initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                className="font-display font-extrabold text-2xl tracking-wide text-[#00E5FF] uppercase glow-text"
              >
                Portfolio
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Loading Progress Bar */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-56 h-[3px] rounded-full bg-white/5 overflow-hidden relative border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#7C3AED] via-[#00E5FF] to-[#00FFA3]"
              style={{ width: `${progress}%` }}
            />
          </div>
          {textStage === 4 && (
            <span className="font-mono text-[10px] text-slate-500 tracking-[0.25em] uppercase">
              SYSTEM INITIALIZING {progress}%
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
