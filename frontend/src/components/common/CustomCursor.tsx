import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useApp } from '../../context/AppContext';

export const CustomCursor: React.FC = () => {
  const { isCustomCursorEnabled } = useApp();

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring for the outer halo ring
  const springConfig = { damping: 28, stiffness: 450, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable on touch screens
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if hovering over interactive element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, input, select, textarea, [role="button"], .cursor-pointer, label'
      );
      setIsHovered(!!interactive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || !isCustomCursorEnabled || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Outer Spring Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.8 : isHovered ? 2 : 1,
            borderColor: isHovered ? '#FF5B26' : 'rgba(255, 91, 38, 0.4)',
            backgroundColor: isHovered ? 'rgba(255, 91, 38, 0.08)' : 'rgba(255, 91, 38, 0.02)'
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="w-7 h-7 rounded-full border border-[#FF5B26]/40 backdrop-blur-[0.5px]"
        />
      </motion.div>

      {/* Inner Pinpoint Dot (Follows mouse immediately) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      >
        <motion.div
          animate={{
            scale: isHovered ? 0.5 : 1,
            backgroundColor: '#FF5B26'
          }}
          transition={{ duration: 0.1 }}
          className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,91,38,0.8)]"
        />
      </motion.div>
    </>
  );
};
