import React, { Suspense, useEffect, useRef, useState } from 'react';
import VideoBackground from './VideoBackground';
import { SectionTheme } from '../types';
import { useIsSectionActive } from '../lib/activeSection';

type LazyVideoSources = { webm: string; h264: string };

const lazySectionVideos = {
  1: () => import('../lib/films/who').then(m => ({ webm: m.whoAmbient.webm, h264: m.whoAmbient.h264 })),
  3: () => import('../lib/films/philosophy').then(m => ({ webm: m.philosophyAmbient.webm, h264: m.philosophyAmbient.h264 })),
};

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
  isActive: isActiveProp = false,
  stacked = false,
}: TransitionSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const storeActive = useIsSectionActive(index);
  const isActive = stacked ? isActiveProp : storeActive;
  const isDarkSection = index === 3;
  const bgTone = isDarkSection ? 'dark' : 'light';
  const isHero = index === 0;
  const [lazyVideos, setLazyVideos] = useState<LazyVideoSources | null>(null);
  const resolvedWebm = bgVideoWebm ?? lazyVideos?.webm;
  const resolvedMp4 = bgVideoMp4 ?? lazyVideos?.h264;
  const shouldLoadVideo = isHero || Boolean(resolvedWebm || resolvedMp4);

  useEffect(() => {
    if (bgVideoWebm || bgVideoMp4) return;
    const loader = lazySectionVideos[index];
    if (!loader || lazyVideos) return;
    const loadVideos = () => loader().then(setLazyVideos).catch(() => {});
    if (!stacked) { if (isActive) loadVideos(); return; }
    const el = containerRef.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { loadVideos(); observer.disconnect(); }
    }, { rootMargin: '240px 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [bgVideoWebm, bgVideoMp4, index, isActive, stacked, lazyVideos]);

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
        {shouldLoadVideo && (
          <VideoBackground
            webmSrc={resolvedWebm}
            mp4Src={resolvedMp4}
            themeFallback={getThemeFallback(index)}
            blendMode={isDarkSection ? 'screen' : isHero ? 'normal' : 'multiply'}
            parallaxIntensity={stacked ? (isHero ? 0.08 : 0.12) : 0}
            tone={bgTone}
            videoOpacity={isHero ? 1 : undefined}
            preload={isHero ? 'metadata' : 'none'}
            eager={isHero}
            active={isActive}
            useNativeVisibility={stacked}
          />
        )}
      </div>

      <div
        className={`relative z-10 w-full flex flex-col content-wrapper overscroll-contain ${
          stacked
            ? 'min-h-dvh overflow-x-hidden'
            : 'h-full overflow-y-auto overflow-x-hidden'
        } ${
          index === 0
            ? 'h-full min-h-0 justify-start overflow-hidden py-0'
            : index === 5 || index === 4 || index === 2 || index === 6 || index === 1
              ? 'justify-start py-4 sm:py-6 md:py-8'
              : 'justify-center'
        }`}
        style={{
          opacity: 1,
          // Sections at index 6+ are in the natural scroll tail after GSAP pinning ends;
          // they are always interactable regardless of the active-section store value.
          pointerEvents: stacked || isActive || index >= 6 ? 'auto' : 'none',
        }}
      >
        {cloneWithIsActive(children, stacked || isActive)}
      </div>
    </div>
  );
}
