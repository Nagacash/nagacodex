import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ReactNode } from 'react';

export type ScrollRevealStyle = 'hero' | 'pushFade' | 'horizontal' | 'scaleBlur';

const revealVariants: Record<ScrollRevealStyle, Variants> = {
  hero: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  pushFade: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  horizontal: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
  scaleBlur: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
  },
};

const revealStyleBySection: ScrollRevealStyle[] = [
  'hero',
  'horizontal',
  'scaleBlur',
  'scaleBlur',
  'horizontal',
  'scaleBlur',
  'pushFade',
];

interface ScrollRevealProps {
  children: ReactNode;
  sectionIndex: number;
  className?: string;
}

export function scrollRevealStyleForSection(index: number): ScrollRevealStyle {
  return revealStyleBySection[index] ?? 'pushFade';
}

export default function ScrollReveal({ children, sectionIndex, className }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const style = scrollRevealStyleForSection(sectionIndex);
  const variants = revealVariants[style];

  return (
    <motion.div
      className={className}
      initial={sectionIndex === 0 ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: '-32px 0px -32px 0px' }}
      variants={variants}
      transition={
        reduceMotion
          ? { duration: 0.15, ease: 'ease' }
          : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
