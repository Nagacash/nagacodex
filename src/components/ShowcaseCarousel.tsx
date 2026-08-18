import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import sound from '../lib/sound';
import listeneuropeImg from '../assets/images/showcase/listeneurope.png';
import glamourAcademyImg from '../assets/images/showcase/glamour-academy.jpg';
import mesoskinImg from '../assets/images/showcase/mesoskin-hamburg.webp';
import wildeMuschelImg from '../assets/images/showcase/wilde-muschel.jpg';
import bodyandmindImg from '../assets/images/showcase/bodyandmind-hamburg.jpg';
import ericLoveImg from '../assets/images/showcase/eric-love.jpg';
import nagacodexImg from '../assets/images/showcase/nagacodex.jpg';
import nagaApparelImg from '../assets/images/showcase/naga-apparel.jpg';
import chosenFewImg from '../assets/images/showcase/chosen-few-records.jpg';
import cyberSecurityImg from '../assets/images/showcase/cyber-security.svg';
import sounddropImg from '../assets/images/showcase/sounddrop.jpg';
import nagafilmsImg from '../assets/images/showcase/nagafilms.jpg';

interface ShowcaseProject {
  id: string;
  name: string;
  shortDesc: string;
  url: string;
  image?: string;
}

interface ShowcaseCarouselProps {
  isActive?: boolean;
}

const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  // ── CLIENT WORK ──────────────────────────────────────────────────────────
  {
    id: 'listeneurope',
    name: 'Listen Europe',
    shortDesc: 'AI radio station & music generator platform',
    url: 'https://www.listeneurope.com/',
    image: listeneuropeImg,
  },
  {
    id: 'glamour-academy',
    name: 'Glamour Academy',
    shortDesc: 'Beauty academy & skin treatment clinic — Hamburg',
    url: 'https://www.glamour-academy.com/',
    image: glamourAcademyImg,
  },
  {
    id: 'mesoskin-hamburg',
    name: 'Mesoskin Hamburg',
    shortDesc: 'Medical aesthetics — drip spas, PDO threads & hyaluronic',
    url: 'https://www.mesoskin-hamburg.com/',
    image: mesoskinImg,
  },
  {
    id: 'wilde-muschel',
    name: 'Wilde Muschel',
    shortDesc: '18+ podcast site — age gate, Neon-backed player, likes & comments',
    url: 'https://wilde-muschel.vercel.app/',
    image: wildeMuschelImg,
  },
  {
    id: 'bodyandmind',
    name: 'Body & Mind Hamburg',
    shortDesc: 'Premium private training — boxing, kickboxing & recovery',
    url: 'https://www.bodyandmindhamburg.com/',
    image: bodyandmindImg,
  },
  {
    id: 'eric-love',
    name: 'Eric Gray — Love Is Here',
    shortDesc: 'Album launch site — music streaming & PayPal support',
    url: 'https://eric-love.vercel.app/',
    image: ericLoveImg,
  },
  // ── NAGA ECOSYSTEM ───────────────────────────────────────────────────────
  {
    id: 'nagacodex-brand',
    name: 'Naga Codex',
    shortDesc: 'Personal brand site: AI agents, film, web dev, security',
    url: 'https://nagacodex.cloud',
    image: nagacodexImg,
  },
  {
    id: 'naga-apparel',
    name: 'Naga Apparel',
    shortDesc: 'Technical streetwear, 450 GSM cotton',
    url: 'https://www.nagaclub.de',
    image: nagaApparelImg,
  },
  {
    id: 'chosen-few-records',
    name: 'Chosen Few Records',
    shortDesc: 'Hamburg music label, hip-hop and electronic',
    url: 'https://www.chosenfewrecords.com/',
    image: chosenFewImg,
  },
  {
    id: 'nagacodex-cyber-security',
    name: 'Naga Codex Cyber Security',
    shortDesc: '25 defensive agent skills: AppSec, AI/MCP, GDPR/NIS2',
    url: 'https://github.com/Nagacash/NagaCodex-cyber-security',
    image: cyberSecurityImg,
  },
  {
    id: 'sounddrop',
    name: 'SoundDrop',
    shortDesc: 'Ed25519-signed MP3 publishing — private keys stay in the browser',
    url: 'https://sounddrop-nu.vercel.app/',
    image: sounddropImg,
  },
  {
    id: 'nagafilms',
    name: 'Naga Films Studio',
    shortDesc: 'Self-hostable AI video production suite',
    url: 'https://www.naga-films.com/',
    image: nagafilmsImg,
  },
];

// Bundled screenshots — no external CDN dependency
const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;
};

export default function ShowcaseCarousel({ isActive = false }: ShowcaseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [showLoadingUi, setShowLoadingUi] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const projects = SHOWCASE_PROJECTS;
  const currentProj = projects[currentIndex];
  const currentShot = currentProj.image ?? '';

  const prefetchNeighbors = useCallback((index: number) => {
    const preloadAt = (i: number) => {
      const src = SHOWCASE_PROJECTS[i].image;
      if (src) preloadImage(src);
    };
    preloadAt(index);
    preloadAt((index + 1) % SHOWCASE_PROJECTS.length);
    preloadAt((index - 1 + SHOWCASE_PROJECTS.length) % SHOWCASE_PROJECTS.length);
  }, []);

  useEffect(() => {
    SHOWCASE_PROJECTS.forEach((p) => { if (p.image) preloadImage(p.image); });
  }, []);

  useEffect(() => {
    prefetchNeighbors(currentIndex);
    setPreviewLoaded(false);
    setPreviewError(false);
    setShowLoadingUi(false);

    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(() => setShowLoadingUi(true), 1200);

    return () => {
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    };
  }, [currentIndex, prefetchNeighbors]);

  const handlePrev = () => {
    sound.playClick();
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    sound.playClick();
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const goToIndex = (index: number) => {
    sound.playClick();
    setCurrentIndex(index);
  };

  return (
    <section
      id="showcase-carousel-section"
      className="relative w-full min-h-dvh py-16 sm:py-20 px-4 sm:px-6 md:px-12 flex flex-col justify-start overflow-x-hidden select-text section-canvas"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <div className="flex flex-col gap-3 max-w-xl">
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-neutral-900 uppercase leading-none">
            Selected <span className="text-neutral-500">work</span>
          </h2>
          <p className="max-w-md type-manifesto text-sm text-neutral-700 leading-relaxed">
            Recent client and personal projects from Hamburg.
          </p>
        </div>

        {/* Carousel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Project Card List (Left) */}
          <div className="lg:col-span-4 flex flex-col gap-3 order-2 lg:order-1">
            {projects.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => goToIndex(idx)}
                className={`text-left p-4 rounded-lg border transition-ui cursor-pointer group ${
                  idx === currentIndex
                    ? 'bg-neutral-900 border-neutral-700 text-white shadow-lg'
                    : 'bg-white border-neutral-200 text-neutral-900 hover:border-neutral-400 hover:shadow-md'
                }`}
              >
                <div className="font-display font-semibold text-sm sm:text-base tracking-tight">{proj.name}</div>
                <div className={`text-[11px] sm:text-xs leading-snug mt-1 ${
                  idx === currentIndex ? 'text-neutral-300' : 'text-neutral-600'
                }`}>
                  {proj.shortDesc}
                </div>
              </button>
            ))}
          </div>

          {/* Viewport (Right) */}
          <div
            ref={viewportRef}
            className="lg:col-span-8 flex flex-col gap-4 order-1 lg:order-2 w-full"
          >
            {/* Screenshot Preview */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center">
              <img
                src={currentShot}
                alt={currentProj.name}
                className="w-full h-full object-cover"
                onLoad={() => {
                  setPreviewLoaded(true);
                  setShowLoadingUi(false);
                  if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
                }}
                onError={() => {
                  setPreviewError(true);
                  setShowLoadingUi(false);
                  if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
                }}
              />

              {showLoadingUi && !previewLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-100/95">
                  <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
                  <span className="font-mono text-xs text-neutral-600">Loading preview...</span>
                </div>
              )}

              {previewError && !showLoadingUi && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-neutral-600 font-mono text-xs text-center px-4">
                  Preview unavailable
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrev}
                className="tap-target p-3 text-neutral-500 hover:text-neutral-900 active:text-neutral-900 transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Previous project"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Dot Indicators */}
              <div className="flex items-center gap-2 flex-1 justify-center">
                {projects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToIndex(idx)}
                    className="tap-target flex items-center justify-center p-2 cursor-pointer"
                    aria-label={`Go to project ${idx + 1}`}
                  >
                    <div
                      className={`rounded-full transition-ui ${
                        idx === currentIndex
                          ? 'w-2.5 h-2.5 bg-neutral-900'
                          : 'w-2 h-2 bg-neutral-300 hover:bg-neutral-400'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="tap-target p-3 text-neutral-500 hover:text-neutral-900 active:text-neutral-900 transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Next project"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Project Link */}
            <a
              href={currentProj.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="flex items-center justify-between p-4 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer group"
            >
              <span className="font-display font-semibold text-sm tracking-tight">Visit project</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}