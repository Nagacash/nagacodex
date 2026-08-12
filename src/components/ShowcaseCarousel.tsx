import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, ChevronLeft, ChevronRight, Sparkles, Loader2, Globe } from 'lucide-react';
import sound from '../lib/sound';

interface ShowcaseProject {
  id: string;
  title: string;
  url: string;
  image?: string; // optional static image — overrides live screenshot when present
  description: string;
  category: string;
  accent: string;
  colorMix: string;
  role: string;
  duration: string;
  stack: string[];
  features: string[];
}

interface ShowcaseCarouselProps {
  isActive?: boolean;
}

const SCREENSHOT_WIDTH = 1440;

const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'naga_codex_brand',
    title: 'Naga Codex',
    url: 'https://nagacodex.cloud',
    image: 'https://pub.hyperagent.com/api/published/pbf01KZS1QR7E_3G27JY8QNAVFH7M8/1140768b-32df-48de-a083-d91a23df106e.png',
    category: 'AI Studio',
    description: 'Personal brand hub built from scratch — AI agents, generative film, web engineering, and security consulting from Hamburg. Solo operator, zero middlemen.',
    role: 'Founder & full-stack developer',
    duration: 'Ongoing',
    accent: '#00FF88',
    colorMix: 'from-emerald-900/20 via-bg-dark to-bg-dark',
    stack: ['React 19', 'GSAP', 'TypeScript', 'Tailwind v4', 'Gemini API'],
    features: ['ChatGPT-style hero interface', 'GSAP pinned scroll transitions', 'Dark navy design system'],
  },
  {
    id: 'naga_films_studio',
    title: 'Naga Films Studio',
    url: 'https://nagafilms-studio.vercel.app/',
    image: 'https://pub.hyperagent.com/api/published/pbf01KZTVBNAV_04ZVAYZMBD20HSZV/d56f547c-77ab-4237-9e8c-68ca3746f22f.jpg',
    category: 'AI Cinema',
    description: 'Self-hostable generative video production suite — AI image generation, video synthesis, cinematic workflows, and lip-sync. Built and curated by Naga Codex.',
    role: 'Founder & architect',
    duration: 'Ongoing',
    accent: '#FF6B35',
    colorMix: 'from-red-900/20 via-bg-dark to-bg-dark',
    stack: ['Next.js 15', 'React 19', 'Electron 33', 'Drizzle ORM', 'Neon'],
    features: ['Image studio with in-canvas editing', 'Text-to-video pipeline', 'AI cinema workflows', 'Lip-sync engine', 'Self-hosted deployment'],
  },
  {
    id: 'naga_apparel',
    title: 'Naga Apparel',
    url: 'https://nagaclub.de',
    image: 'https://pub.hyperagent.com/api/published/pbf01KZS1QRQ8_ZS8JTTPZ39EPW613/ca83c012-2dd5-4c32-a6f5-52e1b0cc2c03.png',
    category: 'Streetwear',
    description: 'Technical outerwear from Hamburg — 450 GSM brutalist construction, cryptographic prints, and direct-to-fan commerce rooted in St. Pauli street culture.',
    role: 'Brand & creative direction',
    duration: 'Ongoing',
    accent: '#D4A843',
    colorMix: 'from-amber-900/20 via-bg-dark to-bg-dark',
    stack: ['Brand design', 'E-commerce', 'Print systems', 'Direct-to-fan'],
    features: ['450 GSM cotton construction', 'Limited capsule drops', 'Hamburg street culture aesthetic'],
  },
  {
    id: 'chosen_few_records',
    title: 'Chosen Few Records',
    url: 'https://chosenfewrecrecords.vercel.app/',
    category: 'Music',
    description: 'Hamburg underground music label — hip-hop and electronic production, A&R, and artist development rooted in the city\'s independent music scene.',
    role: 'Founder & creative director',
    duration: 'Ongoing',
    accent: '#FF6B35',
    colorMix: 'from-orange-900/20 via-bg-dark to-bg-dark',
    stack: ['Music production', 'Label management', 'Artist development', 'Sound design'],
    features: ['Original production', 'Hamburg underground scene', 'Independent artist support'],
  },
  {
    id: 'body_mind',
    title: 'Body & Mind Hamburg',
    url: 'https://www.bodyandmindhamburg.com/',
    category: 'Healthcare',
    description: 'Premium physiotherapy and mental performance institute with booking and rehabilitation tracking.',
    role: 'Lead architect',
    duration: '2.5 months',
    accent: '#3B82F6',
    colorMix: 'from-blue-100/90 via-white to-bg-dark',
    stack: ['React', 'GSAP', 'Express', 'Tailwind'],
    features: ['Symptom pinpoint selector', 'Calendar scheduling', 'Encrypted progress records'],
  },
  {
    id: 'eric_gray',
    title: 'Eric Gray',
    url: 'https://www.ericgraymusician.com/',
    category: 'Music',
    description:
      'Album launch site for producer, artist, and smooth jazz guitarist Eric Gray — Love Is Here rollout with video, streaming, and direct fan support.',
    role: 'Design & front-end development',
    duration: '2 months',
    accent: '#FF6B35',
    colorMix: 'from-orange-100/90 via-white to-bg-dark',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Vercel'],
    features: [
      'Love Is Here album landing & tracklist',
      'Embedded music video experience',
      'Streaming & PayPal support links',
    ],
  },
  {
    id: 'fascher_bros',
    title: 'Fascher Bros',
    url: 'https://fascherbros.com/',
    category: 'Culture',
    description:
      'Heritage site for Uwe, Horst & Fredi Fascher — St. Pauli legends of the Reeperbahn, Star-Club era, and the Beatles’ Hamburg years, built around a documentary film and GoFundMe campaign.',
    role: 'Design & front-end development',
    duration: '2 months',
    accent: '#E11D48',
    colorMix: 'from-rose-100/90 via-white to-bg-dark',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Vercel'],
    features: [
      'Könige von St. Pauli documentary landing',
      'Star-Club & Beatles heritage narrative',
      'GoFundMe crowdfunding integration',
    ],
  },
  {
    id: 'listen_europe',
    title: 'Listen Europe',
    url: 'https://www.listeneurope.com/',
    category: 'Soundscapes',
    description: 'A sensory portal mapping environmental frequencies across Europe for acoustic meditation.',
    role: 'Core architect & UI developer',
    duration: '4 months',
    accent: '#00FF88',
    colorMix: 'from-emerald-50 via-bg-dark to-bg-dark',
    stack: ['Next.js', 'Tailwind CSS', 'Mapbox', 'Radix'],
    features: ['Real-time audio mapping', 'Spatial audio synthesis', 'Geolocation coordinate map'],
  },
  {
    id: 'glamour_academy',
    title: 'Glamour Academy',
    url: 'https://www.glamour-academy.com/',
    category: 'Education',
    description: 'Digital flagship for an elite cosmetic academy with course admissions and interactive simulations.',
    role: 'Creative designer & engineer',
    duration: '3 months',
    accent: '#D4A843',
    colorMix: 'from-amber-100/90 via-white to-bg-dark',
    stack: ['React 18', 'Vite', 'Framer Motion', 'PostgreSQL'],
    features: ['3D scroll transitions', 'Interactive coursework LMS', 'Face coordinate mapping'],
  },
];

function screenshotUrl(url: string) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${SCREENSHOT_WIDTH}`;
}

function preloadScreenshot(url: string) {
  const img = new Image();
  img.referrerPolicy = 'no-referrer';
  img.src = screenshotUrl(url);
}

function preloadProject(p: { url: string; image?: string }) {
  if (p.image) return; // static images need no preloading
  preloadScreenshot(p.url);
}

export default function ShowcaseCarousel({ isActive = false }: ShowcaseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [showLoadingUi, setShowLoadingUi] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const projects = SHOWCASE_PROJECTS;
  const currentProj = projects[currentIndex];
  const currentShot = currentProj.image ?? screenshotUrl(currentProj.url);

  const prefetchNeighbors = useCallback((index: number) => {
    preloadScreenshot(SHOWCASE_PROJECTS[index].url);
    preloadScreenshot(SHOWCASE_PROJECTS[(index + 1) % SHOWCASE_PROJECTS.length].url);
    preloadScreenshot(SHOWCASE_PROJECTS[(index - 1 + SHOWCASE_PROJECTS.length) % SHOWCASE_PROJECTS.length].url);
  }, []);

  useEffect(() => {
    SHOWCASE_PROJECTS.forEach((p) => { if (!p.image) preloadScreenshot(p.url); });
  }, []);

  useEffect(() => {
    if (!isActive) return;
    prefetchNeighbors(currentIndex);
  }, [isActive, currentIndex, prefetchNeighbors]);

  useEffect(() => {
    setPreviewLoading(true);
    setPreviewError(false);
    setShowLoadingUi(false);
    const spinnerTimer = window.setTimeout(() => setShowLoadingUi(true), 180);
    return () => window.clearTimeout(spinnerTimer);
  }, [currentProj.id]);

  const markPreviewReady = useCallback(() => {
    setPreviewLoading(false);
    setShowLoadingUi(false);
  }, []);

  const bindPreviewImage = useCallback(
    (img: HTMLImageElement | null) => {
      if (!img) return;
      if (img.complete && img.naturalWidth > 0) {
        markPreviewReady();
      }
    },
    [markPreviewReady],
  );

  const handleNext = () => {
    sound.playClick();
    setPreviewLoading(true);
    setPreviewError(false);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    sound.playClick();
    setPreviewLoading(true);
    setPreviewError(false);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleOpenLink = (url: string) => {
    sound.playClick();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const previewFrame = useMemo(() => {
    if (previewError) {
      return (
        <button
          type="button"
          onClick={() => handleOpenLink(currentProj.url)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-100 cursor-pointer hover:bg-neutral-50 transition-colors"
        >
          <Globe className="w-8 h-8 text-neutral-500" />
          <span className="type-manifesto text-sm text-neutral-800">Preview unavailable — open live site</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => handleOpenLink(currentProj.url)}
        className="absolute inset-0 w-full h-full group cursor-pointer overflow-hidden"
        title="Open live site"
      >
        <img
          key={currentProj.id}
          ref={bindPreviewImage}
          src={currentShot}
          alt={`${currentProj.title} site preview`}
          className="absolute inset-0 w-full h-full object-cover object-top bg-white"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={markPreviewReady}
          onError={() => {
            setPreviewError(true);
            markPreviewReady();
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 group-active:bg-black/15 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100">
          <span className="type-manifesto text-xs bg-black/80 text-white px-3 py-2 rounded border border-neutral-700">
            Open live site
          </span>
        </div>
        <span className="absolute bottom-3 right-3 md:hidden type-manifesto text-[10px] bg-white/95 text-neutral-800 px-2.5 py-1.5 rounded-full border border-neutral-200 shadow-sm pointer-events-none">
          Tap to open
        </span>
      </button>
    );
  }, [previewError, currentProj, currentShot, bindPreviewImage, markPreviewReady]);

  return (
    <section
      id="showcase-carousel-section"
      className="relative w-full min-h-dvh py-16 sm:py-20 px-4 sm:px-6 md:px-12 flex flex-col justify-center overflow-x-hidden select-text section-canvas"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-3 max-w-xl">
          <div className="flex items-center gap-2 text-cyber font-mono text-[9px] tracking-[0.3em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#00FF88]" />
            <span>Brands & client work</span>
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-neutral-900 uppercase leading-none">
            Selected <span className="text-neutral-500">work</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col items-center justify-center order-1 w-full">
            <div className="relative w-full h-[min(55vh,340px)] sm:h-[440px] md:h-[520px] rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-md">
              <div ref={viewportRef} className="relative w-full h-full bg-neutral-100 overflow-hidden">
                {previewLoading && showLoadingUi && !previewError && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-neutral-100/95">
                    <Loader2 className="w-5 h-5 text-cyber animate-spin" />
                    <span className="type-manifesto text-xs text-neutral-600">Loading preview…</span>
                  </div>
                )}

                {previewFrame}
              </div>
            </div>

          <div className="flex items-center gap-6 mt-6 sm:mt-8 w-full max-w-md justify-between">
              <button
                onClick={handlePrev}
                className="tap-target p-3 text-neutral-500 hover:text-neutral-900 active:text-neutral-900 transition-colors cursor-pointer flex items-center justify-center"
                title="Previous project"
                aria-label="Previous project"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2" role="tablist" aria-label="Showcase projects">
                {projects.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={currentIndex === idx}
                    aria-label={`Project ${idx + 1} of ${projects.length}`}
                    onClick={() => {
                      sound.playClick();
                      setCurrentIndex(idx);
                    }}
                    className="tap-target flex items-center justify-center p-2 cursor-pointer"
                  >
                    <span
                      className="h-1 rounded-full transition-ui block"
                      style={{
                        width: currentIndex === idx ? '20px' : '6px',
                        backgroundColor: currentIndex === idx ? currentProj.accent : '#404040',
                      }}
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={handleNext}
                className="tap-target p-3 text-neutral-500 hover:text-neutral-900 active:text-neutral-900 transition-colors cursor-pointer flex items-center justify-center"
                title="Next project"
                aria-label="Next project"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 text-left order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProj.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col gap-5"
              >
                <span className="self-start type-manifesto text-xs text-neutral-500 tracking-wide">
                  {currentProj.category}
                </span>

                <h3 className="font-display font-semibold text-2xl md:text-3xl tracking-tight text-neutral-900 leading-tight">
                  {currentProj.title}
                </h3>

                <p className="type-manifesto text-sm text-neutral-800 leading-relaxed font-normal max-w-prose">
                  {currentProj.description}
                </p>

                <button
                  onClick={() => handleOpenLink(currentProj.url)}
                  className="inline-flex items-center gap-2 self-start min-h-12 py-3 text-sm type-manifesto text-neutral-700 hover:text-neutral-900 transition-colors group/link"
                >
                  Visit site
                  <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </button>

                <details className="group/details mt-2">
                  <summary className="type-manifesto text-sm text-neutral-700 cursor-pointer hover:text-black transition-colors list-none flex items-center gap-2 min-h-12 py-2">
                    <span className="group-open/details:rotate-90 transition-transform">›</span>
                    Project details
                  </summary>
                  <div className="mt-4 pl-4 border-l border-neutral-300 flex flex-col gap-4 text-sm type-manifesto text-neutral-800">
                    <div>
                      <span className="block text-xs text-neutral-600 mb-1 font-medium">Role</span>
                      {currentProj.role}
                    </div>
                    <div>
                      <span className="block text-xs text-neutral-600 mb-1 font-medium">Duration</span>
                      {currentProj.duration}
                    </div>
                    <div>
                      <span className="block text-xs text-neutral-600 mb-1 font-medium">Stack</span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentProj.stack.map((st) => (
                          <span key={st} className="text-xs bg-neutral-100 border border-neutral-300 text-neutral-800 px-2 py-0.5 rounded">
                            {st}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="block text-xs text-neutral-600 mb-1 font-medium">Features</span>
                      <ul className="list-disc pl-4 space-y-1">
                        {currentProj.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
