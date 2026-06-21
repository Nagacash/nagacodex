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
  accentColor: string;       // section's accent color
  index: number;             // section index (0-based)
  isActive?: boolean;        // controlled by ScrollTransitionManager
  stacked?: boolean;         // native vertical scroll layout (mobile)
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

  // Map section index to dynamic canvas fallback theme
  const getThemeFallback = (idx: number): SectionTheme => {
    switch (idx) {
      case 0: return 'none';     // Stellar / Hero
      case 1: return 'cyber';    // Matrix / Who
      case 2: return 'dev';      // Violet code / Work
      case 3: return 'film';     // Mist / Philosophy
      case 4: return 'culture';  // Woodland360 / Urban podcast
      case 5: return 'culture';  // Showcase Carousel
      case 6: return 'cyber';    // Contact / Blue
      default: return 'none';
    }
  };

  return (
    <div
      ref={containerRef}
      id={`transition-section-${index}`}
      data-transition={transitionType}
      data-accent={accentColor}
      className={
        stacked
          ? 'relative w-full min-h-dvh overflow-hidden flex flex-col justify-between'
          : 'absolute inset-0 w-full h-full overflow-hidden flex flex-col justify-between'
      }
      style={{
        zIndex: stacked ? undefined : isActive ? 50 : 10 + index,
        willChange: stacked ? undefined : 'transform, opacity',
      }}
    >
      {/* Dynamic Background Canvas/Video layer */}
      <div className="absolute inset-0 z-0 video-wrap select-none pointer-events-none">
        <VideoBackground
          webmSrc={bgVideoWebm}
          mp4Src={bgVideoMp4}
          themeFallback={getThemeFallback(index)}
          blendMode="screen"
          parallaxIntensity={0.12}
        />
      </div>

      {/* Render the actual interactive child overlay */}
      <div
        className={`relative z-10 w-full h-full flex flex-col content-wrapper overflow-y-auto overflow-x-hidden overscroll-contain ${
          index === 5 || index === 4 || index === 2 || index === 6
            ? 'justify-start py-4 sm:py-6 md:py-8'
            : 'justify-center'
        }`}
        style={{
          opacity: 1,
          pointerEvents: stacked || isActive ? 'auto' : 'none',
        }}
      >
        {cloneWithIsActive(children, isActive)}
      </div>
    </div>
  );
}
