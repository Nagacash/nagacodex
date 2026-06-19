import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, ExternalLink, ShieldCheck, Play, ArrowRight, Grid, Monitor, Tag } from 'lucide-react';
import { ProjectItem } from '../types';
import sound from '../lib/sound';
import { mandeFilm } from '../lib/films';
import ProjectDetailModal from './ProjectDetailModal';
import FilmPreviewModal from './FilmPreviewModal';

const projects: ProjectItem[] = [
  {
    id: 'p2',
    title: 'MANDÉ OYAPOCK (AI FILM)',
    category: 'AI DIGITAL CINEMA',
    tags: ['Sora AI', 'Midjourney', 'Sound Design'],
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    videoSrc: mandeFilm.webm,
    videoFallbackSrc: mandeFilm.h264,
    aspectClass: 'md:col-span-2 md:row-span-2 min-h-[360px]',
  },
  {
    id: 'p3',
    title: 'NAGA_DECR_01 HEAVY OUTERWEAR',
    category: 'STREETWEAR CAPSULE',
    tags: ['Technical Apparel', 'Brutalist Design', '450 GSM'],
    thumbnail: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80',
    aspectClass: 'md:col-span-1 md:row-span-2 min-h-[380px]',
  },
  {
    id: 'p4',
    title: 'HYPER-COLLISION CHRONICLES',
    category: 'CINEMATIC MEDIAS',
    tags: ['Generative Pipeline', 'VFX', '3D Unreal Engine'],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    aspectClass: 'md:col-span-3 md:row-span-1 min-h-[200px]',
  },
];

export default function WorkGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [filmPreview, setFilmPreview] = useState<ProjectItem | null>(null);
  
  // Custom states for 3D tilt on grid items
  const [tilts, setTilts] = useState<Record<string, { x: number; y: number }>>({});
  
  // Custom video playback states to stop loop and freeze on final frame
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Drag Scroll Carousel Track Mock Project Strip (Item 5: Horizontal strip)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed modifier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // 3D Grid Tilts
  const handleGridCardMouseMove = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    
    // Tilt equations
    const rx = ((cy / rect.height) - 0.5) * -10;
    const ry = ((cx / rect.width) - 0.5) * 10;
    
    setTilts((prev) => ({
      ...prev,
      [id]: { x: rx, y: ry },
    }));
  };

  const resetGridCardTilt = (id: string) => {
    setTilts((prev) => ({
      ...prev,
      [id]: { x: 0, y: 0 },
    }));
  };

  // Video playback — autoplay showcase clips; restart on hover
  useEffect(() => {
    projects.forEach((project) => {
      if (!project.videoSrc) return;
      const video = videoRefs.current[project.id];
      if (!video) return;

      if (project.id === hoveredId) {
        video.currentTime = 0;
      }

      video.loop = true;
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [hoveredId]);

  return (
    <section
      id="work-section"
      data-section="culture"
      className="relative w-full min-h-dvh py-20 px-6 md:px-12 bg-transparent border-t border-neutral-900"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-culture font-mono text-[9px] tracking-[0.3em] uppercase mb-1.5">
              <Grid className="w-3.5 h-3.5" />
              <span>CASE_SHOWCASE // ARCHIVES</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-white uppercase leading-none">
              SELECTED <span className="text-neutral-400">CODEX WORKS</span>
            </h2>
          </div>
          <span className="font-mono text-xs text-neutral-600 tracking-wider">
            [P_ARCHIVE // BUNDLE_2026]
          </span>
        </div>

        {/* 1. Asymmetric Bento Grid of Projects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
          {projects.map((proj) => {
            const isHovered = hoveredId === proj.id;
            const tilt = tilts[proj.id] || { x: 0, y: 0 };

            return (
              <div
                key={proj.id}
                onMouseMove={(e) => handleGridCardMouseMove(proj.id, e)}
                onMouseLeave={() => {
                  resetGridCardTilt(proj.id);
                  setHoveredId(null);
                }}
                onMouseEnter={() => setHoveredId(proj.id)}
                onClick={() => {
                  sound.playClick();
                  if (proj.videoSrc) {
                    setFilmPreview(proj);
                  } else {
                    setSelectedProject(proj);
                  }
                }}
                className={`group/card relative rounded-xl overflow-hidden cursor-pointer flex flex-col justify-between p-6 glass hover:border-culture/40 transition-ui ${proj.aspectClass}`}
                style={{
                  transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
                  transition: 'transform 0.12s ease-out, border-color 0.3s, box-shadow 0.3s',
                }}
              >
                {/* Background image & active video hover crossfades */}
                <div className="absolute inset-0 z-0">
                  {!proj.videoSrc && (
                    <img
                      src={proj.thumbnail}
                      className="w-full h-full object-cover opacity-35 filter grayscale contrast-125 transition-ui-slow ease-in-out group-hover/card:scale-105 group-hover/card:brightness-50"
                      alt={proj.title}
                      referrerPolicy="no-referrer"
                    />
                  )}

                  {proj.videoSrc && (
                    <video
                      ref={(el) => {
                        videoRefs.current[proj.id] = el;
                      }}
                      className="absolute inset-0 w-full h-full object-cover opacity-90 transition-ui group-hover/card:opacity-100 group-hover/card:scale-[1.02]"
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

                  {/* Readability overlay — lighter when a clip is playing */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 transition-opacity duration-300 ${
                      proj.videoSrc
                        ? isHovered
                          ? 'opacity-50'
                          : 'opacity-65'
                        : isHovered
                          ? 'opacity-85'
                          : 'opacity-95'
                    }`}
                  />

                  {/* High Tech Cyber scanner wave overlay */}
                  {isHovered && !proj.videoSrc && (
                    <div className="absolute inset-0 w-full h-[2px] bg-culture/30 shadow-[0_0_10px_#D4A843] animate-bounce z-10 top-0 pointer-events-none" />
                  )}
                  
                  {/* Real-time styled holographic canvas fallback simulating short clips */}
                  {isHovered && !proj.videoSrc && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,168,67,0.15),transparent)] animate-pulse" />
                  )}
                </div>

                {/* Top Item Badge */}
                <div className="relative z-10 w-full flex justify-between items-start font-mono text-[8px] tracking-[0.2em]">
                  <span className="text-neutral-500 bg-black/60 px-2 py-0.5 border border-neutral-900 rounded-sm">
                    {proj.category}
                  </span>
                  
                  <div className="flex gap-1">
                    {proj.tags.slice(0, 2).map((t, tIdx) => (
                      <span key={tIdx} className="text-neutral-400 bg-neutral-900/90 px-1.5 py-0.5 rounded-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Copy */}
                <div className="relative z-10 pt-16 mt-auto flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 font-sans font-extrabold text-[#E8E8E8] leading-tight uppercase tracking-wide group-hover/card:text-culture transition-colors">
                    {proj.videoSrc && (
                      <Play className="w-3.5 h-3.5 text-film shrink-0" />
                    )}
                    <span className="text-base sm:text-lg">{proj.title}</span>
                  </div>

                  {/* Live indicators */}
                  <div className="flex items-center justify-between text-[8px] font-mono text-neutral-600 pt-3 border-t border-neutral-900/80 uppercase">
                    <span>{proj.videoSrc ? 'WATCH_FULL_FILM' : 'VIEW_SECURE_SPEC'}</span>
                    <Eye className="w-3.5 h-3.5 text-neutral-500 group-hover/card:text-culture group-hover/card:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* 2. Drag to Scroll Project Carousel Card (Exactly occupying 1 tall grid space or wide column) */}
          <div
            className="md:col-span-3 rounded-xl glass p-6 flex flex-col justify-between min-h-[220px] select-none text-left hover:border-neutral-700/60 transition-colors duration-300"
          >
            {/* Header coordinates */}
            <div className="w-full flex justify-between items-center font-mono text-[8.5px] text-neutral-500 pb-3 border-b border-neutral-900 mb-4 uppercase">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyber animate-pulse" />
                <span>CONTRACT_REGISTRY // PARALLEL_STREAM</span>
              </span>
              <span>DRAG_HORIZONTAL &lt; &gt;</span>
            </div>

            {/* Horizontal Drag-To-Scroll Container */}
            <div
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`flex gap-4 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing pb-2 transition-ui ${
                isDragging ? 'scale-[0.995]' : ''
              }`}
            >
              {[
                { label: 'GEN_MEDIA_CORE', type: 'VFX', status: '8K_UP', progress: 95, color: 'text-film' },
                { label: 'NAGA_DECR_SWEAT', type: 'Looper', status: 'STABLE', progress: 100, color: 'text-culture' },
                { label: 'MANDE_OYAPOCK', type: 'AI Film', status: 'LIVE', progress: 100, color: 'text-film' },
              ].map((tool, tIdx) => (
                <div
                  key={tIdx}
                  className="min-w-[190px] max-w-[190px] glass p-4 rounded-lg flex flex-col gap-3 font-mono text-[9px] hover:border-neutral-700/60 transition-colors duration-300"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400 font-bold">{tool.label}</span>
                    <span className={`px-1.5 py-0.5 bg-black/40 rounded-sm text-[7.5px] uppercase ${tool.color}`}>
                      {tool.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-neutral-900/70 flex flex-col gap-1 text-[8px] text-neutral-500">
                    <div className="flex justify-between">
                      <span>MODULE_TYPE</span>
                      <span className="text-neutral-400">{tool.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>INTEGRATION</span>
                      <span className="text-neutral-400">{tool.progress}%</span>
                    </div>
                  </div>

                  {/* Tech visual line bar graph */}
                  <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        tool.color === 'text-cyber'
                          ? 'bg-cyber'
                          : tool.color === 'text-film'
                          ? 'bg-film'
                          : 'bg-culture'
                      }`}
                      style={{ width: `${tool.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom info label */}
            <div className="w-full flex justify-between items-center font-mono text-[8.5px] text-neutral-600 mt-4 pt-3 border-t border-neutral-900">
              <span>SYSTEMS_INTELL_VER</span>
              <span>ONLINE // ST.PAULI // GER</span>
            </div>
          </div>
        </div>
      </div>

      <FilmPreviewModal
        project={filmPreview}
        onClose={() => setFilmPreview(null)}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
