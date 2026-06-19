import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, ChevronLeft, ChevronRight, Sparkles, Laptop, ShieldCheck, Loader2, Globe } from 'lucide-react';
import sound from '../lib/sound';

interface ProjectItem {
  id: string;
  title: string;
  url: string;
  description: string;
  subTitle: string;
  category: string;
  accent: string;
  colorMix: string;
  role: string;
  duration: string;
  stack: string[];
  features: string[];
  previewPrompt: string;
}

interface ShowcaseCarouselProps {
  isActive?: boolean;
}

const PREVIEW_WIDTH = 1280;
const PREVIEW_HEIGHT = 800;

function screenshotUrl(url: string) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1280`;
}

export default function ShowcaseCarousel({ isActive = false }: ShowcaseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [useScreenshotFallback, setUseScreenshotFallback] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.42);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const projects: ProjectItem[] = [
    {
      id: 'listen_europe',
      title: 'LISTEN EUROPE',
      url: 'https://www.listeneurope.com/',
      subTitle: 'SOUNDSCAPES FROM THE WORLD OUTSIDE',
      category: 'AUDITORY SOUNDSCAPES // PLATFORM EXPERIENCES',
      description: 'An premium architectural sensory portal map mapping generative environmental frequencies from across the continent. Engineered for acoustic meditation, noise cancellation, and luxury interactive auditory simulation.',
      role: 'CORE ARCHITECT & AUDIOPHILE UI DEVELOPER',
      duration: '4 MONTHS (GENESIS DEPLOY)',
      accent: '#00FF88',
      colorMix: 'from-emerald-950/45 via-[#022c22]/10 to-[#070707]',
      stack: ['NEXT.JS', 'TAILWIND CSS', 'CSS SPECTRUM AUDIO API', 'MAPBOX V4', 'RADIX PRIMITIVES'],
      features: ['Real-time audio signal mapping', 'Spatial audio synthesis stream', 'High-density spatial geolocation coordinate map'],
      previewPrompt: 'luxury sound studio node',
    },
    {
      id: 'glamour_academy',
      title: 'GLAMOUR ACADEMY',
      url: 'https://www.glamour-academy.com/',
      subTitle: 'HIGH-ART COSMETIC MASTERY',
      category: 'EDITORIAL EDUCATION // CLASSROOM SIMULATION',
      description: 'The digital flagship for an elite cosmetic styling academy. Fusing warm editorial champagnes with fluid high-fashion grids to deliver online curriculum schedules, course admissions, and real-time interactive face-makeup canvas simulations.',
      role: 'CREATIVE DESIGNER & INTERACTIVE MECHANICS ENGINEER',
      duration: '3 MONTHS (PRODUCTION)',
      accent: '#D4A843',
      colorMix: 'from-amber-950/40 via-[#221703]/10 to-[#070707]',
      stack: ['REACT 18', 'VITE', 'FRAMER MOTION KINETICS', 'GLSL SHADERS', 'POSTGRESQL DB'],
      features: ['3D Liquid gold viewport scroll transitions', 'Comprehensive interactive coursework LMS', 'Vector face coordinates overlay mapping'],
      previewPrompt: 'editorial luxury styling art',
    },
    {
      id: 'body_mind',
      title: 'BODY & MIND HAMBURG',
      url: 'https://www.bodyandmindhamburg.com/',
      subTitle: 'HOLISTIC LUXURY PHYSIOTHERAPY',
      category: 'HEALTH OPTIMIZATION // PRIVATE CLINIC CLIENT PORTAL',
      description: 'An immersive digital sanctum for a premium medical training, luxury physiotherapy, and mental performance institute in Hamburg. Features modern typographic calendars, custom rehabilitation log vaults, and booking triggers.',
      role: 'LEAD ARCHITECT & COMPILER DEPLOYMENT HEAD',
      duration: '2.5 MONTHS (ACTIVE RUN)',
      accent: '#3B82F6',
      colorMix: 'from-blue-950/45 via-[#172554]/10 to-[#070707]',
      stack: ['REACT SPA', 'GSAP TIMELINE ENGINES', 'EXPRESS NODE SERVER', 'SQL SCHEDULERS', 'TAILWIND'],
      features: ['Interactive dynamic symptom/muscle pinpoint selector', 'Zero-latency calendar scheduling booking engine', 'Encrypted rehabilitation progress records tracking'],
      previewPrompt: 'minimalist zen healthcare',
    },
  ];

  const currentProj = projects[currentIndex];
  const shouldLoadPreview = isActive;

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const updateScale = () => {
      const { width, height } = node.getBoundingClientRect();
      if (!width || !height) return;
      const scale = Math.min(width / PREVIEW_WIDTH, height / PREVIEW_HEIGHT);
      setPreviewScale(scale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPreviewLoading(true);
    setUseScreenshotFallback(false);

    if (!shouldLoadPreview) return;

    const fallbackTimer = window.setTimeout(() => {
      setUseScreenshotFallback(true);
      setPreviewLoading(false);
    }, 5000);

    return () => window.clearTimeout(fallbackTimer);
  }, [currentProj.id, shouldLoadPreview]);

  const handleNext = () => {
    sound.playClick();
    setPreviewLoading(true);
    setUseScreenshotFallback(false);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    sound.playClick();
    setPreviewLoading(true);
    setUseScreenshotFallback(false);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleOpenLink = (url: string) => {
    sound.playClick();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const previewFrame = useMemo(() => {
    if (!shouldLoadPreview) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-950 text-neutral-500">
          <Globe className="w-6 h-6 text-neutral-600" />
          <span className="font-mono text-[8px] uppercase tracking-widest">Scroll to showcase to load preview</span>
        </div>
      );
    }

    if (useScreenshotFallback) {
      return (
        <button
          type="button"
          onClick={() => handleOpenLink(currentProj.url)}
          className="absolute inset-0 w-full h-full group cursor-pointer"
          title="Open live site"
        >
          <img
            src={screenshotUrl(currentProj.url)}
            alt={`${currentProj.title} site preview`}
            className="w-full h-full object-cover object-top bg-white"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="font-mono text-[9px] bg-black/80 text-white px-3 py-1.5 rounded border border-neutral-700 uppercase tracking-widest">
              Open live site ↗
            </span>
          </div>
        </button>
      );
    }

    return (
      <div
        className="absolute top-0 left-0 origin-top-left pointer-events-none"
        style={{
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
          transform: `scale(${previewScale})`,
        }}
      >
        <iframe
          key={currentProj.id}
          src={currentProj.url}
          title={`${currentProj.title} live preview`}
          className="w-full h-full border-0 bg-white pointer-events-auto"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setPreviewLoading(false)}
        />
      </div>
    );
  }, [shouldLoadPreview, useScreenshotFallback, currentProj, previewScale]);

  return (
    <section
      id="showcase-carousel-section"
      className="relative w-full min-h-dvh py-12 px-6 md:px-12 flex flex-col justify-between overflow-x-hidden select-text"
    >
      <div
        className={`absolute inset-0 z-0 bg-gradient-to-br ${currentProj.colorMix} opacity-90 transition-opacity duration-500 ease-out`}
      />

      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-45" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-cyber font-mono text-[9px] tracking-[0.3em] uppercase mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00FF88]" />
            <span>CASE_STUDIES // LIVE_DEPLOYMENTS</span>
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white uppercase leading-none">
            PREVIOUS <span className="text-neutral-500">PRODUCTIONS</span>
          </h2>
        </div>
        <div className="mt-3 md:mt-0 flex items-center gap-5 text-[8.5px] font-mono text-neutral-500 uppercase tracking-widest leading-none">
          <span>ACTIVE_SERVERS: {projects.length}/{projects.length} ONLINE</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start my-auto py-6">
        <div className="lg:col-span-5 flex flex-col gap-6 text-left order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProj.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-black/60 border border-neutral-900 font-mono text-[8.5px] tracking-widest text-[#D4A843] uppercase">
                  {currentProj.category}
                </span>
                <span className="text-[7.5px] font-mono text-neutral-500 uppercase">
                  {currentProj.duration}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-display font-extrabold text-2xl md:text-4xl tracking-tight text-white uppercase">
                  {currentProj.title}
                </h3>
                <span
                  className="font-mono text-[10px] tracking-wider uppercase font-bold"
                  style={{ color: currentProj.accent }}
                >
                  {currentProj.subTitle}
                </span>
              </div>

              <p className="font-sans text-[11.5px] md:text-xs text-neutral-400 leading-relaxed font-light">
                {currentProj.description}
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 my-2">
                <div>
                  <span className="block text-[7px] text-neutral-500 font-mono tracking-widest uppercase mb-1">DESIGNER_ROLE</span>
                  <span className="font-mono text-[8.5px] text-neutral-300 font-medium uppercase leading-tight block">
                    {currentProj.role}
                  </span>
                </div>
                <div>
                  <span className="block text-[7px] text-neutral-500 font-mono tracking-widest uppercase mb-1">TECH_STACK // EMITTER</span>
                  <div className="flex flex-wrap gap-1">
                    {currentProj.stack.slice(0, 3).map((st, i) => (
                      <span key={i} className="text-[7.5px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-1 rounded-sm uppercase">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <button
                  onClick={() => handleOpenLink(currentProj.url)}
                  className="flex items-center gap-2 px-5 py-2.5 text-[9px] font-mono font-bold tracking-widest text-black rounded select-none cursor-pointer transition-ui active:scale-95 group uppercase"
                  style={{ backgroundColor: currentProj.accent }}
                >
                  <span>LAUNCH_ACTIVE_DEPLOY</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <span className="font-mono text-[8px] text-neutral-500 tracking-wider">
                  {useScreenshotFallback ? 'STATIC_PREVIEW // EMBED_BLOCKED' : 'LIVE_IFRAME_PREVIEW'}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-7 flex flex-col items-center justify-center order-1 lg:order-2 w-full">
          <div className="relative w-full max-w-xl h-[280px] sm:h-[420px] bg-neutral-950/70 border border-neutral-900 rounded-2xl overflow-hidden glass p-3 sm:p-4 flex flex-col justify-between shadow-[0_45px_100px_rgba(0,0,0,0.8)]">
            <div className="w-full h-8 flex justify-between items-center px-4 bg-neutral-900/60 border border-neutral-800 rounded-lg text-[8px] font-mono text-neutral-500 z-20 shrink-0">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 rounded-full bg-rose-500/70" />
                <span className="w-2 h-2 rounded-full bg-amber-400/70" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
              </div>
              <button
                type="button"
                onClick={() => handleOpenLink(currentProj.url)}
                className="bg-black/40 px-6 py-0.5 rounded text-[7.5px] border border-neutral-950/70 text-neutral-400 font-mono tracking-wide w-48 truncate uppercase text-center flex items-center justify-center gap-1.5 hover:border-neutral-700 hover:text-white transition-colors cursor-pointer"
                title="Open live site"
              >
                <Laptop className="w-2.5 h-2.5 text-[#00FF88]" />
                <span>{currentProj.url.replace('https://', '').replace('www.', '')}</span>
              </button>
              <span className="text-[7.5px] text-[#00FF88] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>SECURE</span>
              </span>
            </div>

            <div
              ref={viewportRef}
              className="relative flex-1 mt-3 rounded-xl overflow-hidden border border-neutral-900 bg-white z-10 min-h-0"
            >
              {previewLoading && shouldLoadPreview && !useScreenshotFallback && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-neutral-950/90">
                  <Loader2 className="w-5 h-5 text-cyber animate-spin" />
                  <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
                    Loading live preview…
                  </span>
                </div>
              )}

              {previewFrame}

              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/25 to-transparent pointer-events-none z-[1]" />
            </div>

            <div className="w-full flex justify-between items-center px-1 text-[7px] font-mono text-neutral-600 z-20 pt-3 shrink-0">
              <span>PROJECT // 0{currentIndex + 1}_OF_0{projects.length}</span>
              <div className="flex gap-2">
                {projects.map((_, idx) => (
                  <span
                    key={idx}
                    className="h-1 rounded-full transition-ui"
                    style={{
                      width: currentIndex === idx ? '16px' : '4px',
                      backgroundColor: currentIndex === idx ? currentProj.accent : '#262626',
                    }}
                  />
                ))}
              </div>
              <span className="uppercase">COMPILER_BUILD_SUCCESS</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="p-2 border border-neutral-900 hover:border-white/10 bg-neutral-950 text-neutral-400 hover:text-white rounded-lg transition-ui active:scale-90 cursor-pointer"
              title="Previous project"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-[9px] tracking-[0.3em] text-neutral-500 uppercase">
              DECK_SELECT
            </span>
            <button
              onClick={handleNext}
              className="p-2 border border-neutral-900 hover:border-white/10 bg-neutral-950 text-neutral-400 hover:text-white rounded-lg transition-ui active:scale-90 cursor-pointer"
              title="Next project"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex justify-between items-center text-[7.5px] font-mono text-neutral-500 pt-6 border-t border-white/5 shrink-0">
        <span>STYLING_MODULE // CINEMATIC_PERSPECTIVE</span>
        <span>SWIPE_SUPPORT_ENABLED: TRUE</span>
        <span>UTC_TIMESTAMP_DEVICES: 2026_EST</span>
      </div>
    </section>
  );
}
