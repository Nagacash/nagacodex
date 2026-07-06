import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ChevronDown, Sparkles, AlertCircle } from 'lucide-react';
import sound from '../lib/sound';
import { sectionTimelineLabels, getSectionAccentColor } from '../lib/sections';
import {
  getActiveIndexFromTimeline,
  getSectionIndexFromScroll,
  isProgrammaticNavigation,
  isTouchLikeDevice,
  registerPinnedNavigation,
  resetScrollToHero,
  scrollToSection,
  unregisterPinnedNavigation,
} from '../lib/scrollNav';
import { setActiveSectionIndex } from '../lib/activeSection';
import SectionNavSidebar from './SectionNavSidebar';
import ScrollReveal from './ScrollReveal';
import { TransitionSectionProps } from './TransitionSection';

const SkillsManualModal = lazy(() => import('./SkillsManualModal'));

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface ScrollTransitionManagerProps {
  children: React.ReactNode;
}

export default function ScrollTransitionManager({ children }: ScrollTransitionManagerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const [useNativeScroll, setUseNativeScroll] = useState(() =>
    typeof window !== 'undefined' ? isTouchLikeDevice() : false,
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const activeIndexRef = useRef(0);
  const gsapReadyRef = useRef(false);
  const atHeroScrollRef = useRef(true);
  const [atHeroScroll, setAtHeroScroll] = useState(true);
  const viewportInitializedRef = useRef(false);
  const lastVideoSpeedRef = useRef<Record<number, number>>({});
  const [viewportHeight, setViewportHeight] = useState(
    () => (typeof window !== 'undefined' ? window.innerHeight : 800)
  );

  // Parse children into sections array to gain properties
  const sections = React.Children.toArray(children) as React.ReactElement[];
  const numSections = sections.length;

  // Scroll distance mapped 1:1 to the GSAP timeline (pin starts at scroll 0)
  const scrollDistance = 4800;
  const maxWindowScroll = scrollDistance;

  const getIndexFromScroll = (scrollY: number) =>
    getSectionIndexFromScroll(scrollY, numSections);

  const setActiveIndexIfChanged = (idx: number) => {
    if (activeIndexRef.current === idx) return;
    activeIndexRef.current = idx;
    setActiveSectionIndex(idx);
    setActiveIndex(idx);
  };

  const setAtHeroScrollIfChanged = (next: boolean) => {
    if (atHeroScrollRef.current === next) return;
    atHeroScrollRef.current = next;
    setAtHeroScroll(next);
  };

  // 1. Check for reduced motion, touch/native scroll, and viewport changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);

    const handleViewportChange = () => {
      setViewportHeight(window.innerHeight);
      setUseNativeScroll(isTouchLikeDevice());
    };
    handleViewportChange();
    window.addEventListener('resize', handleViewportChange);

    return () => {
      mediaQuery.removeEventListener('change', listener);
      window.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  // 2. Wheel momentum smooth scroll engine for Desktop only (never on touch)
  useEffect(() => {
    if (prefersReducedMotion || useNativeScroll) return;

    let targetScroll = window.scrollY;

    const canScrollWithin = (target: HTMLElement, deltaY: number) => {
      const style = window.getComputedStyle(target);
      const overflowY = style.overflowY;
      if (overflowY !== 'auto' && overflowY !== 'scroll') return false;
      if (target.scrollHeight <= target.clientHeight) return false;

      const atTop = target.scrollTop <= 0;
      const atBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 1;
      return (deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom);
    };
    
    // Listen to wheel events with { passive: false } to support e.preventDefault()
    const handleWheel = (e: WheelEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target !== document.body) {
        if (canScrollWithin(target, e.deltaY)) return;
        target = target.parentElement;
      }

      e.preventDefault();
      targetScroll = window.scrollY;
      
      const delta = e.deltaY;
      targetScroll += delta * 1.1; // modest boost
      targetScroll = Math.max(0, Math.min(targetScroll, maxWindowScroll));

      gsap.to(window, {
        scrollTo: { y: targetScroll },
        duration: 0.85,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [prefersReducedMotion, useNativeScroll, maxWindowScroll]);

  // 3. Scroll activity timer to show/hide indicators (Stop scroll hint)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleScrollActivity = () => {
      setShowIndicator(false);
      clearTimeout(timer);

      // Trigger reveal after exactly 1 second of resting scroll position
      timer = setTimeout(() => {
        setShowIndicator(true);
      }, 1000);
    };

    window.addEventListener('scroll', handleScrollActivity, { passive: true });
    // Initialize
    timer = setTimeout(() => {
      setShowIndicator(true);
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScrollActivity);
      clearTimeout(timer);
    };
  }, []);

  // Always open on hero after intro — block browser scroll restoration
  useEffect(() => {
    resetScrollToHero();
    activeIndexRef.current = 0;
    setActiveSectionIndex(0);
    setActiveIndex(0);
  }, []);

  // Sync active section for native stacked scroll only (pinned mode uses GSAP onUpdate)
  useEffect(() => {
    const syncActive = () => {
      if (gsapReadyRef.current) return;
      setActiveIndexIfChanged(getIndexFromScroll(window.scrollY));
    };
    syncActive();
    window.addEventListener('scroll', syncActive, { passive: true });
    return () => window.removeEventListener('scroll', syncActive);
  }, [numSections, useNativeScroll, prefersReducedMotion]);

  // IntersectionObserver for native stacked scroll
  useEffect(() => {
    if (!useNativeScroll && !prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length === 0) return;
        const idx = Number(visible[0].target.getAttribute('data-section-index'));
        if (!Number.isNaN(idx)) setActiveIndexIfChanged(idx);
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: [0, 0.25, 0.5, 0.75] },
    );

    sections.forEach((_, idx) => {
      const anchor = document.getElementById(`section-anchor-${idx}`);
      if (anchor) observer.observe(anchor);
    });

    return () => observer.disconnect();
  }, [useNativeScroll, prefersReducedMotion, numSections]);

  // 4. Register the master GSAP scroll timeline (desktop pinned mode only)
  useEffect(() => {
    if (prefersReducedMotion || useNativeScroll) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    const restoreHeroFrame = () => {
      gsap.set('#transition-section-0', {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        visibility: 'visible',
      });
      gsap.set('#transition-section-0 .content-wrapper', {
        opacity: 1,
        visibility: 'visible',
      });
      gsap.set('#transition-section-1', { y: '100vh', x: 0, opacity: 1 });
    };

    const applyVideoSpeed = (idx: number, speed: number) => {
      const rounded = Math.round(speed * 100) / 100;
      if (lastVideoSpeedRef.current[idx] === rounded) return;
      lastVideoSpeedRef.current[idx] = rounded;

      const video = document.querySelector(`#transition-section-${idx} video`) as HTMLVideoElement;
      if (video) {
        try {
          video.playbackRate = rounded;
        } catch {
          // fail safe
        }
      }
    };

    const speedProxies = [
      { speed: 1.0 },
      { speed: 1.0 },
      { speed: 1.0 },
      { speed: 1.0 },
      { speed: 1.0 },
      { speed: 1.0 },
      { speed: 1.0 },
    ];

    const frameId = requestAnimationFrame(() => {
      if (cancelled || !pinRef.current || !containerRef.current) return;

      ctx = gsap.context(() => {
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        id: 'master-pin',
        trigger: containerRef.current,
        pin: pinRef.current,
        pinReparent: false,
        pinType: 'transform',
        start: 'top top',
        end: `+=${scrollDistance}`,
        scrub: 0.8,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (isProgrammaticNavigation()) return;

          const atHero = self.scroll() <= self.start + 80;
          setAtHeroScrollIfChanged(atHero);

          if (atHero) {
            restoreHeroFrame();
            setActiveIndexIfChanged(0);
            return;
          }

          setActiveIndexIfChanged(getActiveIndexFromTimeline(masterTimeline, numSections));
        },
        onRefreshInit: (self) => {
          if (self.scroll() <= 80) {
            self.scroll(self.start);
          }
        },
      }
    });

    Object.entries(sectionTimelineLabels).forEach(([idx, time]) => {
      masterTimeline.addLabel(`section-${idx}`, time);
    });

    // Pin off-screen start positions only — visibility handled by React isActive
    gsap.set('#transition-section-0', { opacity: 1, scale: 1, y: 0, x: 0 });
    gsap.set('#transition-section-1', { y: '100vh', x: 0, opacity: 1 });
    gsap.set('#transition-section-2', { x: '100vw', scale: 1, opacity: 1, y: 0 });
    gsap.set('#transition-section-3', { scale: 0.88, opacity: 0, x: 0, y: 0 });
    gsap.set('#transition-section-4', { scale: 0.92, opacity: 0, y: 0, x: 0 });
    gsap.set('#transition-section-5', { x: '100vw', opacity: 0 });
    gsap.set('#transition-section-6', { scale: 0.92, opacity: 0, y: 0 });

    // We can define the individual transition phases along the timeline scroll distance!
    
    // --- PHASE 1: HERO (0) -> WHO (1) [Scroll 0 -> 800] ---
    masterTimeline.to({}, { duration: 800 }, 0); // anchor spacer

    // HERO exits — transform only; never fade the content wrapper
    masterTimeline.fromTo(
      '#transition-section-0',
      { scale: 1, y: 0 },
      { scale: 0.98, y: -20, ease: 'power1.out', duration: 800, immediateRender: false },
      0,
    );

    // Hero backdrop video fades and slows down
    masterTimeline.fromTo('#transition-section-0 .video-wrap',
      { opacity: 1 },
      { opacity: 0.3, ease: 'power1.out', duration: 800 },
      0
    );
    masterTimeline.to(speedProxies[0], {
      speed: 0.25,
      ease: 'power1.out',
      duration: 800,
      onUpdate: () => applyVideoSpeed(0, speedProxies[0].speed)
    }, 0);

    // WHO enters (Push Up from below)
    masterTimeline.fromTo('#transition-section-1',
      { y: '100vh' },
      { y: '0vh', ease: 'power2.inOut', duration: 700 },
      100
    );
    masterTimeline.fromTo('#transition-section-1 .video-wrap',
      { opacity: 0.3 },
      { opacity: 1.0, ease: 'power1.out', duration: 500 },
      200
    );

    // Active midpoint effects (approx scroll 400): Gradient Sweep & Scanline sweep, Particle flash
    masterTimeline.fromTo('#overlay-gradient-0',
      { x: '-100vw' },
      { x: '100vw', ease: 'none' },
      200
    );
    masterTimeline.fromTo('#scanline-0',
      { y: '-10vh', opacity: 0 },
      { y: '110vh', opacity: 1, ease: 'power1.inOut' },
      250
    );
    masterTimeline.fromTo('#flash-0',
      { opacity: 0 },
      { opacity: 0.85, yoyo: true, repeat: 1, ease: 'power1.in' },
      350
    );
    masterTimeline.to('#vignette-pulse',
      { opacity: 0.8, yoyo: true, repeat: 1, duration: 250 },
      250
    );


    // --- PHASE 2: WHO (1) -> WORK (2) [Scroll 800 -> 1400] ---
    masterTimeline.to({}, { duration: 600 }, 800); // Anchor

    // WHO exits (Horizontal Slide Left)
    masterTimeline.to('#transition-section-1', {
      x: '-100vw',
      ease: 'power2.inOut',
      duration: 600,
    }, 800);
    masterTimeline.fromTo('#transition-section-1 .video-wrap',
      { opacity: 1 },
      { opacity: 0.3, ease: 'power1.out', duration: 600 },
      800
    );
    masterTimeline.to(speedProxies[1], {
      speed: 0.25,
      ease: 'power1.out',
      duration: 600,
      onUpdate: () => applyVideoSpeed(1, speedProxies[1].speed)
    }, 800);

    // WORK enters (Horizontal Slide from right)
    masterTimeline.fromTo('#transition-section-2',
      { x: '100vw' },
      { x: '0vw', ease: 'power2.inOut', duration: 600 },
      800
    );
    masterTimeline.fromTo('#transition-section-2 .video-wrap',
      { opacity: 0.3 },
      { opacity: 1.0, ease: 'power1.out', duration: 500 },
      900
    );

    // Glitch trigger near midpoint 1100
    masterTimeline.to({}, {
      duration: 150,
      onStart: () => setIsGlitching(true),
      onComplete: () => setIsGlitching(false),
      onReverseComplete: () => setIsGlitching(false),
    }, 1025);

    // Midpoint: Gradient 1, Scanline 1, Vignette pulse
    masterTimeline.fromTo('#overlay-gradient-1',
      { x: '-100vw' },
      { x: '100vw', ease: 'none' },
      950
    );
    masterTimeline.fromTo('#scanline-1',
      { y: '-10vh', opacity: 0 },
      { y: '110vh', opacity: 1, ease: 'power1.inOut' },
      1000
    );
    masterTimeline.to('#vignette-pulse',
      { opacity: 0.8, yoyo: true, repeat: 1, duration: 200 },
      1000
    );


    // --- PHASE 3: WORK (2) -> PHILOSOPHY (3) [Scroll 1400 -> 2100] ---
    masterTimeline.to({}, { duration: 700 }, 1400); // Anchor

    // WORK exits (scale + fade — avoid filter blur during scrub for compositor perf)
    masterTimeline.fromTo('#transition-section-2',
      { scale: 1, opacity: 1 },
      { scale: 0.88, opacity: 0, ease: 'power2.inOut', duration: 700, force3D: true },
      1400
    );
    masterTimeline.fromTo('#transition-section-2 .video-wrap',
      { opacity: 1 },
      { opacity: 0.25, ease: 'power1.out', duration: 700 },
      1400
    );
    masterTimeline.to(speedProxies[2], {
      speed: 0.25,
      ease: 'power1.out',
      duration: 700,
      onUpdate: () => applyVideoSpeed(2, speedProxies[2].speed)
    }, 1400);

    // PHILOSOPHY enters (scale up + fade)
    masterTimeline.fromTo('#transition-section-3',
      { scale: 0.88, opacity: 0 },
      { scale: 1.0, opacity: 1.0, ease: 'power2.inOut', duration: 680, force3D: true },
      1420
    );
    masterTimeline.fromTo('#transition-section-3 .video-wrap',
      { opacity: 0.3 },
      { opacity: 1.0, ease: 'power1.out', duration: 500 },
      1500
    );

    // Midpoint: Gradient 2, Scanline 2, Flash 2
    masterTimeline.fromTo('#overlay-gradient-2',
      { x: '-100vw' },
      { x: '100vw', ease: 'none' },
      1650
    );
    masterTimeline.fromTo('#scanline-2',
      { y: '-10vh', opacity: 0 },
      { y: '110vh', opacity: 1, ease: 'power1.inOut' },
      1700
    );
    masterTimeline.fromTo('#flash-2',
      { opacity: 0 },
      { opacity: 0.9, yoyo: true, repeat: 1, ease: 'power1.in' },
      1700
    );
    masterTimeline.to('#vignette-pulse',
      { opacity: 0.85, yoyo: true, repeat: 1, duration: 250 },
      1700
    );


    // --- PHASE 4: PHILOSOPHY (3) -> SHOWCASE (4) [Scroll 2100 -> 2800] ---
    masterTimeline.to({}, { duration: 700 }, 2100); // Anchor

    // PHILOSOPHY exits (Split Reveal)
    masterTimeline.to('#split-top-part', {
      y: '-55vh',
      opacity: 0,
      ease: 'power2.in',
    }, 2100);
    masterTimeline.to('#split-bottom-part', {
      y: '55vh',
      opacity: 0,
      ease: 'power2.in',
    }, 2100);
    masterTimeline.to('#transition-section-3 .video-wrap', {
      opacity: 0.1,
      ease: 'power1.out',
    }, 2100);
    masterTimeline.to(speedProxies[3], {
      speed: 0.25,
      ease: 'power1.out',
      onUpdate: () => applyVideoSpeed(3, speedProxies[3].speed)
    }, 2100);

    // SHOWCASE enters (Zoom/Fade in)
    masterTimeline.fromTo('#transition-section-4',
      { scale: 0.92, opacity: 0 },
      { scale: 1.0, opacity: 1.0, ease: 'power2.out', duration: 650 },
      2150
    );
    masterTimeline.fromTo('#transition-section-4 .video-wrap',
      { opacity: 0.3 },
      { opacity: 1.0, ease: 'power1.out' },
      2200
    );

    // Midpoint: Gradient 3, Scanline 3
    masterTimeline.fromTo('#overlay-gradient-3',
      { x: '-100vw' },
      { x: '100vw', ease: 'none' },
      2350
    );
    masterTimeline.fromTo('#scanline-3',
      { y: '-10vh', opacity: 0 },
      { y: '110vh', opacity: 1, ease: 'power1.inOut' },
      2400
    );
    masterTimeline.to('#vignette-pulse',
      { opacity: 0.8, yoyo: true, repeat: 1, duration: 200 },
      2400
    );

    // --- PHASE 5: SHOWCASE (4) -> WOODLAND360 (5) [Scroll 2800 -> 3500] ---
    masterTimeline.to({}, { duration: 700 }, 2800); // Anchor

    // SHOWCASE exits (Scale-down & fade)
    masterTimeline.to('#transition-section-4', {
      scale: 0.85,
      opacity: 0,
      y: -50,
      ease: 'power2.inOut',
    }, 2800);
    masterTimeline.to('#transition-section-4 .video-wrap', {
      opacity: 0.1,
      ease: 'power1.out',
    }, 2800);
    masterTimeline.to(speedProxies[4], {
      speed: 0.25,
      ease: 'power1.out',
      onUpdate: () => applyVideoSpeed(4, speedProxies[4].speed)
    }, 2800);

    // WOODLAND360 enters (Slide from right)
    masterTimeline.fromTo('#transition-section-5',
      { x: '100vw', opacity: 0 },
      { x: '0vw', opacity: 1.0, ease: 'power2.inOut', duration: 650 },
      2850
    );
    masterTimeline.fromTo('#transition-section-5 .video-wrap',
      { opacity: 0.3 },
      { opacity: 1.0, ease: 'power1.out' },
      2900
    );

    // Midpoint: Gradient 4, Scanline 4
    masterTimeline.fromTo('#overlay-gradient-4',
      { x: '-100vw' },
      { x: '100vw', ease: 'none' },
      3050
    );
    masterTimeline.fromTo('#scanline-4',
      { y: '-10vh', opacity: 0 },
      { y: '110vh', opacity: 1, ease: 'power1.inOut' },
      3100
    );
    masterTimeline.to('#vignette-pulse',
      { opacity: 0.8, yoyo: true, repeat: 1, duration: 200 },
      3100
    );

    // --- PHASE 6: WOODLAND360 (5) -> CONTACT (6) [Scroll 3500 -> 4200] ---
    masterTimeline.to({}, { duration: 700 }, 3500); // Anchor

    // WOODLAND360 exits (Slide left)
    masterTimeline.to('#transition-section-5', {
      x: '-100vw',
      opacity: 0,
      ease: 'power2.inOut',
    }, 3500);
    masterTimeline.to('#transition-section-5 .video-wrap', {
      opacity: 0.1,
      ease: 'power1.out',
    }, 3500);
    masterTimeline.to(speedProxies[5], {
      speed: 0.25,
      ease: 'power1.out',
      onUpdate: () => applyVideoSpeed(5, speedProxies[5].speed)
    }, 3500);

    // CONTACT enters (Zoom/Fade in)
    masterTimeline.fromTo('#transition-section-6',
      { scale: 0.92, opacity: 0 },
      { scale: 1.0, opacity: 1.0, ease: 'power2.out', duration: 650 },
      3550
    );
    masterTimeline.fromTo('#transition-section-6 .video-wrap',
      { opacity: 0.3 },
      { opacity: 1.0, ease: 'power1.out' },
      3600
    );

    // Midpoint: Gradient 5, Scanline 5
    masterTimeline.fromTo('#overlay-gradient-5',
      { x: '-100vw' },
      { x: '100vw', ease: 'none' },
      3750
    );
    masterTimeline.fromTo('#scanline-5',
      { y: '-10vh', opacity: 0 },
      { y: '110vh', opacity: 1, ease: 'power1.inOut' },
      3800
    );
    masterTimeline.to('#vignette-pulse',
      { opacity: 0.8, yoyo: true, repeat: 1, duration: 200 },
      3800
    );

    ScrollTrigger.refresh();
    resetScrollToHero();
    restoreHeroFrame();
    gsapReadyRef.current = true;
    setAtHeroScrollIfChanged(true);
    activeIndexRef.current = 0;
    setActiveSectionIndex(0);
    setActiveIndex(0);

    const st = masterTimeline.scrollTrigger;
    if (st) registerPinnedNavigation(st, masterTimeline);
      }, pinRef);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      gsapReadyRef.current = false;
      unregisterPinnedNavigation();
      ctx?.revert();
    };
  }, [prefersReducedMotion, useNativeScroll, numSections]);

  // Debounced refresh when layout height changes (ScrollTrigger also auto-refreshes on resize)
  useEffect(() => {
    if (prefersReducedMotion || useNativeScroll) return;
    if (!viewportInitializedRef.current) {
      viewportInitializedRef.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      const atHero = window.scrollY < 80;
      ScrollTrigger.refresh();
      if (atHero) {
        resetScrollToHero();
        gsap.set('#transition-section-0', { opacity: 1, scale: 1, y: 0, x: 0, visibility: 'visible' });
        gsap.set('#transition-section-1', { y: '100vh', x: 0, opacity: 1 });
        setAtHeroScrollIfChanged(true);
        gsapReadyRef.current = true;
        activeIndexRef.current = 0;
        setActiveSectionIndex(0);
        setActiveIndex(0);
      }
    }, 150);
    return () => window.clearTimeout(timer);
  }, [viewportHeight, prefersReducedMotion, useNativeScroll]);

  // Handle slide dot clicking -> smooth scroll to offsets
  const handleDotClick = useCallback((idx: number) => {
    sound.playClick();
    activeIndexRef.current = idx;
    setActiveSectionIndex(idx);
    setActiveIndex(idx);
    setAtHeroScrollIfChanged(idx === 0);
    scrollToSection(idx);
  }, []);

  const handleManualOpen = useCallback(() => {
    sound.playClick();
    setIsManualOpen(true);
  }, []);

  const nativeLayout = useNativeScroll || prefersReducedMotion;

  const currentAccent = getSectionAccentColor(activeIndex);

  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden bg-bg-dark">
      {nativeLayout ? (
        <div className="relative w-full">
          {sections.map((child, idx) => {
            const enhanced = React.cloneElement(child as React.ReactElement<TransitionSectionProps>, {
              isActive: true,
              stacked: true,
            });

            return (
              <div key={`section-anchor-${idx}`}>
                <ScrollReveal
                  sectionIndex={idx}
                  className="relative w-full scroll-mt-[calc(5rem+env(safe-area-inset-top,0px))]"
                >
                  <div
                    id={`section-anchor-${idx}`}
                    data-section-index={idx}
                    className="relative w-full"
                  >
                    {enhanced}
                  </div>
                </ScrollReveal>
              </div>
            );
          })}
        </div>
      ) : (
      <>
      {/* GSAP-pinned viewport (desktop only) — single DOM, no duplicate section ids */}
      <div ref={pinRef} className="relative w-full h-screen overflow-hidden bg-bg-dark z-40">
        
        {/* Dynamic section stack wrapper */}
        <div className={`relative w-full h-full transition-ui ${isGlitching ? 'glitch-screen' : ''}`}>
          
          {/* Render individual TransitionSections */}
          {sections.map((child, idx) => {
            const sectionActive =
              activeIndex === idx || (idx === 0 && atHeroScroll && activeIndex === 0);
            const enhanced = React.cloneElement(child as React.ReactElement<TransitionSectionProps>, {
              isActive: sectionActive,
            });

            // Keep split-reveal DOM mounted so GSAP can finish exit animations
            if (idx === 3 && !prefersReducedMotion) {
              return (
                <div key={`split-shell-${idx}`} className="absolute inset-0 w-full h-full" style={{ zIndex: activeIndex === 3 ? 50 : 13 }}>
                  
                  {/* Top Split segment half */}
                  <div
                    id="split-top-part"
                    className="absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-bg-dark border-b border-neutral-200"
                    style={{ clipPath: 'inset(0 0 0 0)', transform: 'translateY(0)', willChange: 'transform, opacity' }}
                  >
                    <div className="absolute top-0 left-0 w-full h-[200%]">
                      {enhanced}
                    </div>
                  </div>

                  {/* Bottom Split segment half */}
                  <div
                    id="split-bottom-part"
                    className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-bg-dark border-t border-neutral-200"
                    style={{ clipPath: 'inset(0 0 0 0)', transform: 'translateY(0)', willChange: 'transform, opacity' }}
                  >
                    <div className="absolute bottom-0 left-0 w-full h-[200%] -top-[100%]">
                      {enhanced}
                    </div>
                  </div>

                </div>
              );
            }

            return (
              <React.Fragment key={`pin-section-${idx}`}>
                {enhanced}
              </React.Fragment>
            );
          })}

          {/* 2. Global overlay effects rendered as layers inside viewports */}
          
          {/* Gradient sweeps (midpoint trans layers) */}
          <div
            id="overlay-gradient-0"
            className="absolute inset-y-0 w-[40vw] z-[90] pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background: `linear-gradient(90deg, transparent, ${getSectionAccentColor(0)}, #000, ${getSectionAccentColor(1)}, transparent)`,
              willChange: 'transform',
            }}
          />
          <div
            id="overlay-gradient-1"
            className="absolute inset-y-0 w-[40vw] z-[90] pointer-events-none opacity-45 mix-blend-screen"
            style={{
              background: `linear-gradient(90deg, transparent, ${getSectionAccentColor(1)}, #000, ${getSectionAccentColor(2)}, transparent)`,
              willChange: 'transform',
            }}
          />
          <div
            id="overlay-gradient-2"
            className="absolute inset-y-0 w-[40vw] z-[90] pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background: `linear-gradient(90deg, transparent, ${getSectionAccentColor(2)}, #000, ${getSectionAccentColor(3)}, transparent)`,
              willChange: 'transform',
            }}
          />
          <div
            id="overlay-gradient-3"
            className="absolute inset-y-0 w-[40vw] z-[90] pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background: `linear-gradient(90deg, transparent, ${getSectionAccentColor(3)}, #000, ${getSectionAccentColor(4)}, transparent)`,
              willChange: 'transform',
            }}
          />
          <div
            id="overlay-gradient-4"
            className="absolute inset-y-0 w-[40vw] z-[90] pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background: `linear-gradient(90deg, transparent, ${getSectionAccentColor(4)}, #000, ${getSectionAccentColor(5)}, transparent)`,
              willChange: 'transform',
            }}
          />
          <div
            id="overlay-gradient-5"
            className="absolute inset-y-0 w-[40vw] z-[90] pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background: `linear-gradient(90deg, transparent, ${getSectionAccentColor(5)}, #000, ${getSectionAccentColor(6)}, transparent)`,
              willChange: 'transform',
            }}
          />

          {/* Dynamic horizontal scan lines */}
          <div id="scanline-0" className="absolute left-0 w-full h-[2px] z-[91] pointer-events-none opacity-0 shadow-[0_0_15px_currentColor]" style={{ color: getSectionAccentColor(1), background: 'currentColor' }} />
          <div id="scanline-1" className="absolute left-0 w-full h-[2px] z-[91] pointer-events-none opacity-0 shadow-[0_0_15px_currentColor]" style={{ color: getSectionAccentColor(2), background: 'currentColor' }} />
          <div id="scanline-2" className="absolute left-0 w-full h-[2px] z-[91] pointer-events-none opacity-0 shadow-[0_0_15px_currentColor]" style={{ color: getSectionAccentColor(3), background: 'currentColor' }} />
          <div id="scanline-3" className="absolute left-0 w-full h-[2px] z-[91] pointer-events-none opacity-0 shadow-[0_0_15px_currentColor]" style={{ color: getSectionAccentColor(4), background: 'currentColor' }} />
          <div id="scanline-4" className="absolute left-0 w-full h-[2px] z-[91] pointer-events-none opacity-0 shadow-[0_0_15px_currentColor]" style={{ color: getSectionAccentColor(5), background: 'currentColor' }} />
          <div id="scanline-5" className="absolute left-0 w-full h-[2px] z-[91] pointer-events-none opacity-0 shadow-[0_0_15px_currentColor]" style={{ color: getSectionAccentColor(6), background: 'currentColor' }} />

          {/* Particle bursts at transition midpoint */}
          <div
            id="flash-0"
            className="absolute inset-0 z-[88] bg-[#00FF88]/[0.15] opacity-0 pointer-events-none mix-blend-color-dodge flex items-center justify-center"
          >
            <div className="flex gap-4">
              <Sparkles className="w-12 h-12 text-[#00FF88] animate-ping" />
            </div>
          </div>
          <div
            id="flash-2"
            className="absolute inset-0 z-[88] bg-[#D4A843]/[0.15] opacity-0 pointer-events-none mix-blend-color-dodge flex items-center justify-center"
          >
            <div className="flex gap-4">
              <Sparkles className="w-12 h-12 text-[#D4A843] animate-ping" />
            </div>
          </div>

          {/* Vignette pulse container */}
          <div
            id="vignette-pulse"
            className="absolute inset-0 pointer-events-none z-[92] opacity-0"
            style={{
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.85)',
              willChange: 'opacity',
            }}
          />

        </div>

      </div>
      </>
      )}

      <SectionNavSidebar
        activeIndex={activeIndex}
        sectionCount={numSections}
        onDotClick={handleDotClick}
        onManualOpen={handleManualOpen}
      />

      {!nativeLayout && (
        <>
        {/* Scroll idle indicator HUD — desktop pinned only */}
        <div
          ref={scrollIndicatorRef}
          className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-fixed safe-bottom flex flex-col items-center gap-1.5 transition-ui transform ${
            showIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          {/* Chevron and active segment display */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 min-h-11 rounded-full border border-neutral-200 bg-white/90 backdrop-blur-md shadow-sm animate-bounce cursor-pointer text-[8px] font-mono tracking-widest uppercase transition-colors"
            style={{ color: currentAccent, borderColor: `${currentAccent}33` }}
            onClick={() => handleDotClick(Math.min(activeIndex + 1, numSections - 1))}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDotClick(Math.min(activeIndex + 1, numSections - 1));
              }
            }}
          >
            <span>SCROLL_TO_PROCEED</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
          
          {/* Stop Scroll dynamic progress bar indicator */}
          <div className="w-24 h-[1.5px] bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-ui ease-out"
              style={{
                width: `${((activeIndex + 1) / numSections) * 100}%`,
                backgroundColor: currentAccent,
              }}
            />
          </div>
        </div>
        </>
      )}

      {/* Developer cognitive manual system blueprints overlay */}
      {isManualOpen && (
        <Suspense fallback={null}>
          <SkillsManualModal
            isOpen={isManualOpen}
            onClose={() => setIsManualOpen(false)}
          />
        </Suspense>
      )}

      {/* Custom Glitch Filter & styling */}
      <style>{`
        .glitch-screen {
          animation: glitchFrame 0.25s infinite;
          filter: contrast(1.15) brightness(1.1) saturate(1.1);
        }
        @keyframes glitchFrame {
          0% {
            clip-path: inset(0 0 0 0);
            transform: translate(0) skew(0deg);
          }
          10% {
            clip-path: inset(3% 0 85% 0);
            transform: translate(-4px, 3px) skew(-2deg);
          }
          20% {
            clip-path: inset(62% 0 10% 0);
            transform: translate(4px, -3px) skew(2deg);
          }
          30% {
            clip-path: inset(0 0 0 0);
            transform: translate(0) skew(0deg);
          }
          40% {
            clip-path: inset(41% 0 38% 0);
            transform: translate(-3px, -2px) skew(-1deg);
          }
          50% {
            clip-path: inset(18% 0 71% 0);
            transform: translate(3px, 4px) skew(1deg);
          }
          60% {
            clip-path: inset(0 0 0 0);
            transform: translate(0) skew(0deg);
          }
        }
      `}</style>
    </div>
  );
}
