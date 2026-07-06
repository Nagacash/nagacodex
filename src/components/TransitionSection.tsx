import React, { Suspense, useRef } from 'react';
import VideoBackground from './VideoBackground';
import { SectionTheme } from '../types';

function cloneWithIsActive(children: React.ReactNode, isActive: boolean): React.ReactNode {
  if (!React.isValidElement(children)) return children;

  if (children.type === Suspense) {
    return React.cloneElement(
      children,
      {},
      cloneWithIsActive(children.props.children, isActive),
    );
  }

  return React.cloneElement(children, { isActive } as { isActive: boolean });
}

export interface TransitionSectionProps {
  id: string;
  children: React.ReactNode;
  transitionType: 'push-fade' | 'horizontal-slide' | 'scale-blur' | 'split-reveal';
  bgVideoWebm?: string;
  bgVideoMp4?: string;
  accentColor: string;
  index: number;
  isActive?: boolean;
  stacked?: boolean;
}

function getThemeFallback(idx: number): SectionTheme {
  switch (idx) {
    case 0: return 'none';
    case 1: return 'cyber';
    case 2: return 'dev';
    case 3: return 'film';
    case 4: return 'culture';
    case 5: return 'culture';
    case 6: return 'cyber';
    default: return 'none';
  }
}

export default function TransitionSection({
  id,
  children,
  transitionType,
  bgVideoWebm,
  bgVideoMp4,
  accentColor,
  index,
  isActive = false,
  stacked = false,
}: TransitionSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDarkSection = index === 3;
  const bgTone = isDarkSection ? 'dark' : 'light';
  const isHero = index === 0;

  return (
    <div
      ref={containerRef}
      id={`transition-section-${index}`}
      data-transition={transitionType}
      data-accent={accentColor}
      className={
        stacked
          ? `relative w-full min-h-dvh overflow-hidden flex flex-col justify-between ${isDarkSection ? 'philosophy-shell' : 'section-canvas'}`
          : `absolute inset-0 w-full h-full overflow-hidden flex flex-col justify-between ${isDarkSection ? 'philosophy-shell' : 'section-canvas'}`
      }
      style={{
        zIndex: stacked ? undefined : (isActive ? 50 : 10 + index),
        willChange: stacked ? undefined : 'transform, opacity',
      }}
    >
      <div className="absolute inset-0 z-0 video-wrap select-none pointer-events-none">
        <VideoBackground
          webmSrc={bgVideoWebm}
          mp4Src={bgVideoMp4}
          themeFallback={getThemeFallback(index)}
          blendMode={isDarkSection ? 'screen' : isHero ? 'normal' : 'multiply'}
          parallaxIntensity={0.12}
          tone={bgTone}
          videoOpacity={isHero ? 1 : undefined}
        />
      </div>

      <div
        className={`relative z-10 w-full flex flex-col content-wrapper overscroll-contain ${
          stacked
            ? 'min-h-dvh overflow-x-hidden'
            : 'h-full overflow-y-auto overflow-x-hidden'
        } ${
          index === 0
            ? 'h-full min-h-0 justify-start overflow-hidden py-0'
            : index === 5 || index === 4 || index === 2 || index === 6
              ? 'justify-start py-4 sm:py-6 md:py-8'
              : 'justify-center'
        }`}
        style={{
          opacity: 1,
          pointerEvents: stacked || isActive ? 'auto' : 'none',
        }}
      >
        {cloneWithIsActive(children, stacked || isActive)}
      </div>
    </div>
  );
}
