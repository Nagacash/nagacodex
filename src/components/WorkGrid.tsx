import React, { useState, useRef, useEffect } from 'react';
import { Grid, ArrowRight, Workflow, Play, ExternalLink } from 'lucide-react';
import { ProjectItem } from '../types';
import sound from '../lib/sound';
import { mandeFilm } from '../lib/films';
import { apparelUrl } from '../lib/seo';
import baggyJpg from '../assets/images/baggy.jpg';
import baggyWebp from '../assets/images/baggy.webp';
// Images hosted on CDN — not bundled as local assets
const mandeStill = 'https://pub.hyperagent.com/api/published/pbf01KZPTQR5E_N8HNQHXVBJ54QZ3W/5fb370d7-c2a2-472b-b5d5-067c04a7c926.png';
const agentsVisual = 'https://pub.hyperagent.com/api/published/pbf01KZPTRDDV_TEWN07GNEFC0VST8/1336563c-9871-4352-ac84-80077109751c.png';
import ProjectDetailModal from './ProjectDetailModal';
import FilmPreviewModal from './FilmPreviewModal';

interface WorkflowArea {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
  accentClass: string;
}

const workflowAreas: WorkflowArea[] = [
  {
    id: 'agents',
    number: '01',
    title: 'AI Agents & Automation',
    description:
      'Custom agent systems that research, decide, and act — from intake bots and data pipelines to fully autonomous workflows. Built with Gemini, Claude, and MCP; shipped production-ready.',
    tags: ['Gemini API', 'Claude SDK', 'n8n', 'LangGraph', 'MCP'],
    accentClass: 'text-cyber',
  },
  {
    id: 'cinema',
    number: '02',
    title: 'AI Cinema & Media',
    description:
      'Text-to-video pipelines, generative narrative, and layered sound design for shorts and brand films. From script to final grade.',
    tags: ['Sora AI', 'Kling', 'Sound design', 'Color grade', 'FFmpeg'],
    accentClass: 'text-film',
  },
  {
    id: 'product',
    number: '03',
    title: 'Web & Product',
    description:
      'React apps, serverless APIs, and sharp interfaces built for performance and maintainability. Full-stack when needed; always production-ready.',
    tags: ['React', 'TypeScript', 'GSAP', 'Vercel', 'Tailwind'],
    accentClass: 'text-dev',
  },
  {
    id: 'security',
    number: '04',
    title: 'Security & Governance',
    description:
      'Offensive audits, smart-contract reviews, and AI governance frameworks so products ship with measurable risk reduction.',
    tags: ['Pentesting', 'Smart contracts', 'Cloud hardening', 'Compliance'],
    accentClass: 'text-neutral-500',
  },
];

const projects: ProjectItem[] = [
  {
    id: 'p1',
    title: 'Naga Codex — this site',
    category: 'Web & Product',
    tags: ['React 19', 'GSAP', 'TypeScript'],
    thumbnail: agentsVisual,
    tagline: 'Personal brand hub built from scratch.',
    detailLine: 'React 19, Tailwind v4, GSAP scroll-pinned transitions, multi-format video, structured SEO — shipped solo from Hamburg.',
    ctaLabel: 'View source',
    externalUrl: 'https://github.com/Nagacash/nagacodex',
  },
  {
    id: 'p2',
    title: 'Mandé Oyapock',
    category: 'AI film',
    tags: ['Sora AI'],
    thumbnail: mandeStill,
    videoSrc: mandeFilm.webm,
    videoFallbackSrc: mandeFilm.h264,
    tagline: 'Generative AI short film.',
    detailLine: 'Text-to-video pipeline with custom sound design and cinematic grading.',
    ctaLabel: 'Watch',
  },
  {
    id: 'p3',
    title: 'Naga Outerwear',
    category: 'Streetwear',
    tags: ['450 GSM'],
    thumbnail: baggyJpg,
    thumbnailWebp: baggyWebp,
    externalUrl: apparelUrl,
    tagline: 'Technical streetwear capsule.',
    detailLine: 'Brutalist outerwear built for Hamburg — shop the full line at Naga Club.',
    ctaLabel: 'Shop',
  },
];

export default function WorkGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [filmPreview, setFilmPreview] = useState<ProjectItem | null>(null);

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  useEffect(() => {
    projects.forEach((project) => {
      if (!project.videoSrc) return;
      const video = videoRefs.current[project.id];
      if (!video) return;
      if (project.id === hoveredId) video.currentTime = 0;
      video.loop = true;
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [hoveredId]);

  const handleCardClick = (proj: ProjectItem) => {
    sound.playClick();
    if (proj.externalUrl) {
      window.open(proj.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (proj.videoSrc) {
      sound.pauseForContent();
      setFilmPreview(proj);
      return;
    }
    setSelectedProject(proj);
  };

  return (
    <section
      id="work-section"
      data-section="culture"
      className="relative w-full min-h-dvh py-16 sm:py-20 px-4 sm:px-6 md:px-12 section-canvas border-t border-neutral-200/80"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-16 md:gap-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-3 max-w-xl">
            <div className="flex items-center gap-2 text-dev font-mono text-[9px] tracking-[0.3em] uppercase">
              <Workflow className="w-3.5 h-3.5" />
              <span>How I build</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-neutral-900 uppercase leading-none">
              Workflow<span className="text-neutral-500">.</span>
            </h2>
          </div>
          <p className="max-w-md type-manifesto text-sm text-neutral-800 leading-relaxed md:text-right">
            Four disciplines, one studio — AI agents, generative film, web engineering, and security from Hamburg.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {workflowAreas.map((area) => (
            <article
              key={area.id}
              className="flex flex-col gap-4 p-6 sm:p-8 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm transition-ui"
            >
              <div className="flex items-start justify-between gap-4">
                <span className={`font-mono text-xs tracking-[0.25em] uppercase ${area.accentClass}`}>
                  {area.number}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-display font-semibold text-lg sm:text-xl text-neutral-900 tracking-tight">
                  {area.title}
                  <span className="text-neutral-400">.</span>
                </h3>
                <p className="type-manifesto text-sm text-neutral-700 leading-relaxed">
                  {area.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {area.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] uppercase tracking-wider text-neutral-600 border border-neutral-200 bg-neutral-50 px-2.5 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-3 max-w-xl pt-4 border-t border-neutral-200">
          <div className="flex items-center gap-2 text-culture font-mono text-[9px] tracking-[0.3em] uppercase">
            <Grid className="w-3.5 h-3.5" />
            <span>Selected work</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-neutral-900 uppercase leading-none">
            Codex <span className="text-neutral-500">projects</span>
          </h2>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {projects.map((proj, index) => {
            const isHovered = hoveredId === proj.id;
            const isFilm = proj.id === 'p2';

            return (
              <article
                key={proj.id}
                className={`group/card flex flex-col gap-5 w-full ${
                  index > 0 ? 'pt-16 md:pt-24 border-t border-neutral-200' : ''
                }`}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`${proj.ctaLabel ?? 'View'} ${proj.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(proj);
                    }
                  }}
                  onMouseEnter={() => setHoveredId(proj.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleCardClick(proj)}
                  className={`group/preview relative overflow-hidden rounded-xl bg-white border border-neutral-200 transition-ui hover:border-neutral-400 hover:shadow-md cursor-pointer w-full ${
                    isFilm ? 'aspect-[16/9] max-w-5xl' : 'aspect-[4/3] sm:aspect-[3/2] max-w-3xl'
                  }`}
                >
                  {!proj.videoSrc && (
                    <picture>
                      {proj.thumbnailWebp && (
                        <source srcSet={proj.thumbnailWebp} type="image/webp" />
                      )}
                      <img
                        src={proj.thumbnail}
                        className={`w-full h-full object-cover transition-ui-slow ease-out group-hover/card:scale-[1.02] ${
                          isFilm
                            ? 'opacity-80 grayscale-[20%] group-hover/card:grayscale-0'
                            : 'opacity-90 grayscale-[15%]'
                        }`}
                        alt={proj.title}
                      />
                    </picture>
                  )}

                  {proj.videoSrc && (
                    <video
                      ref={(el) => {
                        videoRefs.current[proj.id] = el;
                      }}
                      className="absolute inset-0 w-full h-full object-cover transition-ui group-hover/card:scale-[1.01]"
                      muted
                      playsInline
                      autoPlay
                      loop
                      preload="auto"
                      poster={proj.thumbnail}
                    >
                      <source src={proj.videoSrc} type="video/webm" />
                      {proj.videoFallbackSrc && (
                        <source src={proj.videoFallbackSrc} type="video/mp4" />
                      )}
                    </video>
                  )}

                  <div
                    className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    } bg-black/35`}
                  />

                  <div
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2 type-manifesto text-sm bg-white text-neutral-900 px-4 py-2.5 rounded-full border border-neutral-200 shadow-lg">
                      {proj.videoSrc ? (
                        <Play className="w-4 h-4 fill-neutral-900" />
                      ) : (
                        <ExternalLink className="w-4 h-4" />
                      )}
                      {proj.ctaLabel ?? 'View'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                  <div
                    className={`absolute top-3 right-3 pointer-events-none transition-opacity duration-300 ${
                      isHovered ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-wider text-white/90 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                      Click to {proj.ctaLabel?.toLowerCase() ?? 'open'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 px-1">
                  <h3 className="font-display font-semibold text-lg sm:text-xl text-neutral-900 tracking-tight">
                    {proj.title}
                  </h3>
                  {proj.tagline && (
                    <p className="type-manifesto text-sm text-neutral-800 font-normal leading-relaxed max-w-prose">
                      {proj.tagline}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCardClick(proj)}
                    className="inline-flex items-center gap-2 self-start min-h-12 py-3 text-sm type-manifesto text-neutral-700 hover:text-neutral-900 transition-colors group-hover/card:text-neutral-900 group-hover/card:underline underline-offset-4"
                  >
                    {proj.ctaLabel ?? 'View'}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/card:translate-x-1" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <p className="type-manifesto text-sm text-neutral-500 text-center md:text-left">
          More work on request — email Maurice directly.
        </p>
      </div>

      <FilmPreviewModal
        project={filmPreview}
        onClose={() => {
          sound.resumeFromContent();
          setFilmPreview(null);
        }}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
