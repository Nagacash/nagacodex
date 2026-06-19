import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { SectionTheme } from '../types';

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [theme, setTheme] = useState<SectionTheme>('none');
  const [isVisible, setIsVisible] = useState(false);

  // Motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Outer ring spring configuration (stiffness: 150, damping: 15)
  const springConfig = { stiffness: 150, damping: 15, mass: 0.6 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect mobile touch capability
    const mediaCheck = window.matchMedia('(pointer: coarse)');
    setIsMobile(mediaCheck.matches);

    const onMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mediaCheck.addEventListener('change', onMediaChange);

    if (mediaCheck.matches) return;

    // Position updates
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    // Hover state observer
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Class-based, element-based, or ARIA-role interactive hoverables
      const matchesHover = target.closest(
        'a, button, [role="button"], input, select, textarea, [data-cursor-hover], .tilt-card'
      );
      setIsHovered(!!matchesHover);

      // Section theme detector for cursor color
      const sectionNode = target.closest('[data-section]');
      if (sectionNode) {
        const currentSec = sectionNode.getAttribute('data-section') as SectionTheme;
        setTheme(currentSec || 'none');
      } else {
        setTheme('none');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      mediaCheck.removeEventListener('change', onMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isMobile || !isVisible) return null;

  // Determine accent color hex
  const getThemeColor = () => {
    switch (theme) {
      case 'cyber':
        return '#00FF88'; // Vibrant green
      case 'film':
        return '#FF6B35'; // Amber/orange
      case 'culture':
        return '#D4A843'; // Antique gold
      default:
        return '#FFFFFF'; // Clean white
    }
  };

  const themeColor = getThemeColor();

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden mix-blend-difference">
      {/* 1. Inner core dot (no lag, exact follow) */}
      <motion.div
        className="fixed w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          x: mouseX,
          y: mouseY,
          backgroundColor: themeColor,
        }}
        animate={{
          scale: isHovered ? 0.3 : 1.0,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* 2. Dynamic spring physics outer ring */}
      <motion.div
        className="fixed rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border"
        style={{
          x: ringX,
          y: ringY,
          borderColor: themeColor,
          width: isHovered ? 48 : 24,
          height: isHovered ? 48 : 24,
          backgroundColor: isHovered ? `${themeColor}0a` : 'transparent',
        }}
        transition={{
          width: { type: 'spring', stiffness: 200, damping: 20 },
          height: { type: 'spring', stiffness: 200, damping: 20 },
        }}
      >
        {/* Subtle geometric crosshair dots inside ring on active hover */}
        {isHovered && (
          <motion.div
            className="w-1 h-1 rounded-full absolute"
            style={{ backgroundColor: themeColor }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
      </motion.div>
    </div>
  );
}
