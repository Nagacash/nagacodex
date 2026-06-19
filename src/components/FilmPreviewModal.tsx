import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Film } from 'lucide-react';
import sound from '../lib/sound';
import { ProjectItem } from '../types';

interface FilmPreviewModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export default function FilmPreviewModal({ project, onClose }: FilmPreviewModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!project) return;

    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [project, onClose]);

  useEffect(() => {
    if (!project?.videoSrc || !videoRef.current) return;
    const video = videoRef.current;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [project]);

  if (!project?.videoSrc) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-modal-elevated flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-lg">
        <div className="absolute inset-0" onClick={onClose} aria-hidden />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.35, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl bg-[#080808] border border-neutral-800 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(255,107,53,0.12)] z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-[2px] w-full bg-film" />

          <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-6 border-b border-neutral-900">
            <div className="flex items-center gap-3 min-w-0">
              <Film className="w-4 h-4 text-film shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest truncate">
                  {project.category}
                </span>
                <h2 className="font-display font-extrabold text-lg md:text-2xl text-white tracking-wide uppercase truncate">
                  {project.title}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 border border-neutral-800 hover:border-neutral-600 bg-neutral-950 text-neutral-400 hover:text-white rounded-lg transition-ui active:scale-90 cursor-pointer shrink-0"
              aria-label="Close film preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative w-full aspect-video bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-contain bg-black"
              controls
              playsInline
              autoPlay
              preload="auto"
              poster={project.thumbnail}
            >
              <source src={project.videoSrc} type="video/webm" />
              {project.videoFallbackSrc && (
                <source src={project.videoFallbackSrc} type="video/mp4" />
              )}
            </video>
          </div>

          <div className="px-5 py-4 md:px-6 md:py-5 border-t border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[8px] text-neutral-400 border border-neutral-800 bg-black/50 px-2 py-0.5 rounded-sm uppercase tracking-wider"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <p className="font-sans text-[11px] md:text-xs text-neutral-500 font-light max-w-xl text-left sm:text-right">
              Generative AI cinema — press Esc or click outside to close
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
