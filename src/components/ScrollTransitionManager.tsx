import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ChevronDown, Sparkles, AlertCircle, BookOpen } from 'lucide-react';
import sound from '../lib/sound';
import SkillsManualModal from './SkillsManualModal';
import { TransitionSectionProps } from './TransitionSection';

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
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(
    () => (typeof window !== 'undefined' ? window.innerHeight : 800)
  );

  // Parse children into sections array to gain properties
  const sections = React.Children.toArray(children) as React.ReactElement[];
  const numSections = sections.length;

  // Scroll distance mapped 1:1 to the GSAP timeline (pin starts at scroll 0)
  const scrollDistance = 4800;
  const scrollOffsets = [0, 800, 1400, 2100, 2800, 3500, 4200];
  const maxWindowScroll = scrollDistance;

  // Find active index based on scroll position
  const getIndexFromScroll = (scrollY: number) => {
    for (let i = numSections - 1; i >= 0; i--) {
      if (scrollY >= scrollOffsets[i] - 100) {
        return i;
      }
    }
    return 0;
  };

  // 1. Check for reduced motion, mobile, and viewport changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);

    const handleViewportChange = () => {
      setViewportHeight(window.innerHeight);
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad/i.test(navigator.userAgent));
      ScrollTrigger.refresh();
    };
    handleViewportChange();
    window.addEventListener('resize', handleViewportChange);

    return () => {
      mediaQuery.removeEventListener('change', listener);
      window.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  // 2. Wheel momentum smooth scroll engine for Desktop
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

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
  }, [prefersReducedMotion, isMobile, maxWindowScroll]);

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

  // Sync active section index with real scroll position
  useEffect(() => {
    const syncActive = () => setActiveIndex(getIndexFromScroll(window.scrollY));
    syncActive();
    window.addEventListener('scroll', syncActive, { passive: true });
    return () => window.removeEventListener('scroll', syncActive);
  }, [numSections]);

  // 4. Register the master GSAP scroll timeline
  useEffect(() => {
    if (prefersReducedMotion) {
      // In reduced motion, simply fallback to absolute block layers visible on basic triggers
      const onMainScroll = () => {
        const idx = getIndexFromScroll(window.scrollY);
        setActiveIndex(idx);
        sections.forEach((_, sIdx) => {
          const el = document.getElementById(`transition-section-${sIdx}`);
          if (el) {
            el.style.visibility = sIdx === idx ? 'visible' : 'hidden';
            el.style.opacity = sIdx === idx ? '1' : '0';
          }
        });
      };
      window.addEventListener('scroll', onMainScroll, { passive: true });
      return () => window.removeEventListener('scroll', onMainScroll);
    }

    // Helper to safely apply video speed changes
    const applyVideoSpeed = (idx: number, speed: number) => {
      const video = document.querySelector(`#transition-section-${idx} video`) as HTMLVideoElement;
      if (video) {
        try {
          video.playbackRate = speed;
        } catch (e) {
          // fail safe
        }
      }
    };

    // Proxies for speed tweaking during transitions
    const speedProxies = [
      { speed: 1.0 },
      { speed: 1.0 },
      { speed: 1.0 },
      { speed: 1.0 },
      { speed: 1.0 },
      { speed: 1.0 },
      { speed: 1.0 },
    ];

    // Master Scroll timeline — pin viewport from page top so section 0 shows immediately
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: pinRef.current,
        start: 'top top',
        end: `+=${scrollDistance}`,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: () => {
          setActiveIndex(getIndexFromScroll(window.scrollY));
        },
      }
    });

    // Pin off-screen start positions only — visibility handled by React isActive
    gsap.set('#transition-section-0', { opacity: 1, scale: 1, y: 0 });
    gsap.set('#transition-section-1', { y: '100vh', x: 0 });
    gsap.set('#transition-section-2', { x: '100vw', scale: 1, opacity: 1, filter: 'blur(0px)' });
    gsap.set('#transition-section-4', { x: '100vw', opacity: 0 });

    // We can define the individual transition phases along the timeline scroll distance!
    
    // --- PHASE 1: HERO (0) -> WHO (1) [Scroll 0 -> 800] ---
    masterTimeline.to({}, { duration: 800 }, 0); // anchor spacer

    // HERO exits (Push scale down & fade) — animate section, never touch content-wrapper
    masterTimeline.fromTo('#transition-section-0',
      { opacity: 1, scale: 1, y: 0 },
      { opacity: 0, scale: 0.95, y: -30, ease: 'power1.out', duration: 800 },
      0
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

    // WORK exits (Scale down + Blur filter)
    masterTimeline.fromTo('#transition-section-2',
      { scale: 1, opacity: 1, filter: 'blur(0px)' },
      { scale: 0.8, opacity: 0, filter: 'blur(10px)', ease: 'power2.inOut', duration: 700 },
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

    // PHILOSOPHY enters (Scale up + Unblur)
    masterTimeline.fromTo('#transition-section-3',
      { scale: 0.8, opacity: 0, filter: 'blur(10px)' },
      { scale: 1.0, opacity: 1.0, filter: 'blur(0px)', ease: 'power2.inOut', duration: 680 },
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


    // --- PHASE 4: PHILOSOPHY (3) -> WOODLAND360 (4) [Scroll 2100 -> 2800] ---
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

    // WOODLAND360 enters (Slide from right)
    masterTimeline.fromTo('#transition-section-4',
      { x: '100vw', opacity: 0 },
      { x: '0vw', opacity: 1.0, ease: 'power2.inOut', duration: 650 },
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

    // --- PHASE 5: WOODLAND360 (4) -> SHOWCASE (5) [Scroll 2800 -> 3500] ---
    masterTimeline.to({}, { duration: 700 }, 2800); // Anchor

    // WOODLAND360 exits (Slide left)
    masterTimeline.to('#transition-section-4', {
      x: '-100vw',
      opacity: 0,
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

    // SHOWCASE enters (Zoom/Fade in)
    masterTimeline.fromTo('#transition-section-5',
      { scale: 0.92, opacity: 0 },
      { scale: 1.0, opacity: 1.0, ease: 'power2.out', duration: 650 },
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

    // --- PHASE 6: SHOWCASE (5) -> CONTACT (6) [Scroll 3500 -> 4200] ---
    masterTimeline.to({}, { duration: 700 }, 3500); // Anchor

    // SHOWCASE exits (Scale-down & fade)
    masterTimeline.to('#transition-section-5', {
      scale: 0.85,
      opacity: 0,
      y: -50,
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
    setActiveIndex(getIndexFromScroll(window.scrollY));

    return () => {
      masterTimeline.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [prefersReducedMotion, numSections]);

  // Keep ScrollTrigger measurements in sync when the viewport changes
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [viewportHeight]);

  // Handle slide dot clicking -> smooth scroll to offsets
  const handleDotClick = (idx: number) => {
    sound.playClick();
    const targetScroll = scrollOffsets[idx];

    gsap.to(window, {
      scrollTo: { y: targetScroll },
      duration: 1.3,
      ease: 'power3.inOut',
      overwrite: 'auto',
    });
  };

  // Get active section color and title
  const getSectionColor = (idx: number) => {
    const el = document.getElementById(`transition-section-${idx}`);
    return el ? el.getAttribute('data-accent') || '#00FF88' : '#00FF88';
  };

  const currentAccent = getSectionColor(activeIndex);

  return (
    <div ref={containerRef} className="relative w-full bg-[#070707]">
      
      {/* 1. GSAP-pinned viewport (replaces CSS sticky + spacer) */}
      <div ref={pinRef} className="relative w-full h-screen overflow-hidden bg-black">
        
        {/* Dynamic section stack wrapper */}
        <div className={`relative w-full h-full transition-ui ${isGlitching ? 'glitch-screen' : ''}`}>
          
          {/* Render individual TransitionSections */}
          {sections.map((child, idx) => {
            const enhanced = React.cloneElement(child as React.ReactElement<TransitionSectionProps>, {
              isActive: activeIndex === idx,
            });

            // Keep split-reveal DOM mounted so GSAP can finish exit animations
            if (idx === 3 && !prefersReducedMotion) {
              return (
                <div key={`split-shell-${idx}`} className="absolute inset-0 w-full h-full" style={{ zIndex: activeIndex === 3 ? 50 : 13 }}>
                  
                  {/* Top Split segment half */}
                  <div
                    id="split-top-part"
                    className="absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-black border-b border-neutral-900/60"
                    style={{ clipPath: 'inset(0 0 0 0)', transform: 'translateY(0)', willChange: 'transform, opacity' }}
                  >
                    <div className="absolute top-0 left-0 w-full h-[200%]">
                      {enhanced}
                    </div>
                  </div>

                  {/* Bottom Split segment half */}
                  <div
                    id="split-bottom-part"
                    className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-black border-t border-neutral-900/60"
                    style={{ clipPath: 'inset(0 0 0 0)', transform: 'translateY(0)', willChange: 'transform, opacity' }}
                  >
                    <div className="absolute bottom-0 left-0 w-full h-[200%] -top-[100%]">
                      {enhanced}
                    </div>
                  </div>

                </div>
              );
            }

            return enhanced;
          })}

          {/* 2. Global overlay effects rendered as layers inside viewports */}
          
          {/* Gradient sweeps (midpoint trans layers) */}
          <div
            id="overlay-gradient-0"
            className="absolute inset-y-0 w-[40vw] z-[90] pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background: `linear-gradient(90deg, transparent, ${getSectionColor(0)}, #000, ${getSectionColor(1)}, transparent)`,
              willChange: 'transform',
            }}
          />
          <div
            id="overlay-gradient-1"
            className="absolute inset-y-0 w-[40vw] z-[90] pointer-events-none opacity-45 mix-blend-screen"
            style={{
              background: `linear-gradient(90deg, transparent, ${getSectionColor(1)}, #000, ${getSectionColor(2)}, transparent)`,
              willChange: 'transform',
            }}
          />
          <div
            id="overlay-gradient-2"
            className="absolute inset-y-0 w-[40vw] z-[90] pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background: `linear-gradient(90deg, transparent, ${getSectionColor(2)}, #000, ${getSectionColor(3)}, transparent)`,
              willChange: 'transform',
            }}
          />
          <div
            id="overlay-gradient-3"
            className="absolute inset-y-0 w-[40vw] z-[90] pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background: `linear-gradient(90deg, transparent, ${getSectionColor(3)}, #000, ${getSectionColor(4)}, transparent)`,
              willChange: 'transform',
            }}
          />
          <div
            id="overlay-gradient-4"
            className="absolute inset-y-0 w-[40vw] z-[90] pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background: `linear-gradient(90deg, transparent, ${getSectionColor(4)}, #000, ${getSectionColor(5)}, transparent)`,
              willChange: 'transform',
            }}
          />
          <div
            id="overlay-gradient-5"
            className="absolute inset-y-0 w-[40vw] z-[90] pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background: `linear-gradient(90deg, transparent, ${getSectionColor(5)}, #000, ${getSectionColor(6)}, transparent)`,
              willChange: 'transform',
            }}
          />

          {/* Dynamic horizontal scan lines */}
          <div id="scanline-0" className="absolute left-0 w-full h-[2px] z-[91] pointer-events-none opacity-0 shadow-[0_0_15px_currentColor]" style={{ color: getSectionColor(1), background: 'currentColor' }} />
          <div id="scanline-1" className="absolute left-0 w-full h-[2px] z-[91] pointer-events-none opacity-0 shadow-[0_0_15px_currentColor]" style={{ color: getSectionColor(2), background: 'currentColor' }} />
          <div id="scanline-2" className="absolute left-0 w-full h-[2px] z-[91] pointer-events-none opacity-0 shadow-[0_0_15px_currentColor]" style={{ color: getSectionColor(3), background: 'currentColor' }} />
          <div id="scanline-3" className="absolute left-0 w-full h-[2px] z-[91] pointer-events-none opacity-0 shadow-[0_0_15px_currentColor]" style={{ color: getSectionColor(4), background: 'currentColor' }} />
          <div id="scanline-4" className="absolute left-0 w-full h-[2px] z-[91] pointer-events-none opacity-0 shadow-[0_0_15px_currentColor]" style={{ color: getSectionColor(5), background: 'currentColor' }} />
          <div id="scanline-5" className="absolute left-0 w-full h-[2px] z-[91] pointer-events-none opacity-0 shadow-[0_0_15px_currentColor]" style={{ color: getSectionColor(6), background: 'currentColor' }} />

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

        {/* 3. Section Dots Progress Indicator (Navigation Overlay) */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-fixed flex flex-col gap-4 items-center p-3 bg-black/40 backdrop-blur-md rounded-full border border-neutral-900/60 shadow-lg">
          {sections.map((_, idx) => {
            const isActive = activeIndex === idx;
            const dotColor = getSectionColor(idx);
            
            return (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className="group relative flex items-center justify-center w-8 h-8 cursor-pointer active:scale-90 transition-transform"
                title={`Navigate to Section ${idx + 1}`}
              >
                {/* Floating tooltip labels on hover */}
                <span className="absolute right-10 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-ui bg-neutral-950 border border-neutral-800 text-[8.5px] font-mono text-white tracking-widest px-2.5 py-1 rounded-md whitespace-nowrap uppercase">
                  {idx === 0 && '01 // HERO'}
                  {idx === 1 && '02 // WHO'}
                  {idx === 2 && '03 // WORK'}
                  {idx === 3 && '04 // PHILOSOPHY'}
                  {idx === 4 && '05 // WOODLAND360'}
                  {idx === 5 && '06 // SHOWCASE'}
                  {idx === 6 && '07 // CONTACT'}
                </span>

                {/* Outer halo */}
                <span
                  className={`absolute inset-0 rounded-full border opacity-0 scale-90 transition-ui ${
                    isActive ? 'opacity-100 scale-100' : 'group-hover:opacity-40 group-hover:scale-95'
                  }`}
                  style={{ borderColor: isActive ? dotColor : '#ffffff' }}
                />

                {/* Inner dot */}
                <span
                  className={`w-2 h-2 rounded-full transition-ui ${
                    isActive ? 'scale-125' : 'bg-neutral-600 scale-100 group-hover:bg-neutral-300'
                  }`}
                  style={{ backgroundColor: isActive ? dotColor : undefined }}
                />
              </button>
            );
          })}
          
          {/* Support manual overlay trigger */}
          <div className="h-[1px] w-4 bg-neutral-900/85 my-1" />

          <button
            onClick={() => {
              sound.playClick();
              setIsManualOpen(true);
            }}
            className="group relative flex items-center justify-center w-11 h-11 rounded-lg bg-neutral-950/40 border border-neutral-900 hover:border-culture text-neutral-500 hover:text-culture cursor-pointer active:scale-95 transition-ui"
            title="Open Developer Blueprints Support manual"
          >
            {/* Tooltip */}
            <span className="absolute right-10 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-ui bg-neutral-950 border border-neutral-800 text-[8px] font-mono text-culture tracking-widest px-2.5 py-1 rounded-md whitespace-nowrap uppercase">
              BLUEPRINTS_BOOK
            </span>
            <BookOpen className="w-4 h-4 group-hover:rotate-6 transition-transform duration-300" />
          </button>
        </div>

        {/* 4. Scroll idle indicator HUD (Fades in on rest) */}
        <div
          ref={scrollIndicatorRef}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-fixed flex flex-col items-center gap-1.5 transition-ui transform ${
            showIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          {/* Chevron and active segment display */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-900 bg-black/60 backdrop-blur-md shadow-md animate-bounce cursor-pointer text-[8px] font-mono tracking-widest uppercase transition-colors"
            style={{ color: currentAccent, borderColor: `${currentAccent}33` }}
            onClick={() => handleDotClick(Math.min(activeIndex + 1, numSections - 1))}
          >
            <span>SCROLL_TO_PROCEED</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
          
          {/* Stop Scroll dynamic progress bar indicator */}
          <div className="w-24 h-[1.5px] bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-ui ease-out"
              style={{
                width: `${((activeIndex + 1) / numSections) * 100}%`,
                backgroundColor: currentAccent,
              }}
            />
          </div>
        </div>

      </div>

      {/* Developer cognitive manual system blueprints overlay */}
      <SkillsManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />

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
