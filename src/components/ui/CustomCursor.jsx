import React, { useState, useEffect, useRef } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';

export const CustomCursor = () => {
  const position = useMousePosition();
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [trail, setTrail] = useState([]);
  const [isTouch, setIsTouch] = useState(false);

  // Position history for trail
  useEffect(() => {
    if (position.x === -100 && position.y === -100) return;
    setIsHidden(false);
    
    setTrail((prev) => {
      const newTrail = [...prev, position];
      if (newTrail.length > 10) {
        newTrail.shift();
      }
      return newTrail;
    });
  }, [position]);

  // Hook up hover detection on interactive items
  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.hoverable') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('select') ||
        target.style.cursor === 'pointer';

      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, []);

  // Hide/Show cursor depending on window presence
  useEffect(() => {
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Add CSS class to disable default cursor on body
    document.body.classList.add('custom-cursor-active');

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  // Detect Touch Device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  if (isTouch || isHidden) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Trail Points */}
      {trail.map((point, index) => {
        const opacity = (index + 1) / trail.length * 0.35;
        const scale = 0.2 + ((index + 1) / trail.length) * 0.8;
        return (
          <div
            key={index}
            className="absolute w-2 h-2 rounded-full bg-[#00E5FF] -translate-x-1/2 -translate-y-1/2"
            style={{
              left: point.x,
              top: point.y,
              opacity,
              transform: `translate(-50%, -50%) scale(${scale})`,
              transition: 'opacity 0.05s, transform 0.05s',
            }}
          />
        );
      })}

      {/* Main Inner Dot */}
      <div
        className="absolute w-2.5 h-2.5 rounded-full bg-[#00E5FF] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isHovered ? 1.4 : 1})`,
        }}
      />

      {/* Delayed Lerping Ring */}
      <div
        className="absolute rounded-full border -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out"
        style={{
          left: position.x,
          top: position.y,
          width: isHovered ? '48px' : '32px',
          height: isHovered ? '48px' : '32px',
          transform: 'translate(-50%, -50%)',
          backgroundColor: isHovered ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
          borderColor: isHovered ? 'rgba(0, 229, 255, 0.8)' : 'rgba(0, 229, 255, 0.3)',
        }}
      />
    </div>
  );
};
