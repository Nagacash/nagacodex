import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight } from 'lucide-react';
import sound from '../lib/sound';
import { ProjectItem } from '../types';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  if (!project) return null;

  const summary = project.detailLine ?? project.tagline ?? '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-modal flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-[#090909] border border-neutral-800 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 flex flex-col my-4"
        >
          <div className={`h-[2px] w-full ${project.id === 'p4' ? 'bg-dev' : 'bg-culture'}`} />

          <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl md:text-2xl text-white tracking-tight">
              {project.title}
            </h2>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 min-h-[44px] min-w-[44px] border border-neutral-800 hover:border-neutral-600 bg-neutral-950 text-neutral-400 hover:text-white rounded-lg transition-ui active:scale-90 cursor-pointer flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-6 p-6 md:p-8">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-black">
              {project.id === 'p2' && project.videoSrc ? (
                <video
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  poster={project.thumbnail}
                >
                  <source src={project.videoSrc} type="video/webm" />
                  {project.videoFallbackSrc && (
                    <source src={project.videoFallbackSrc} type="video/mp4" />
                  )}
                </video>
              ) : (
                <picture>
                  {project.thumbnailWebp && (
                    <source srcSet={project.thumbnailWebp} type="image/webp" />
                  )}
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </picture>
              )}
            </div>

            <div className="flex flex-col gap-3 max-w-prose">
              {project.tagline && (
                <p className="font-sans text-base text-white font-medium leading-relaxed">
                  {project.tagline}
                </p>
              )}
              {summary && summary !== project.tagline && (
                <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed">
                  {summary}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {project.externalUrl && (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-sm font-mono font-bold border border-culture/40 hover:border-culture text-culture hover:bg-culture hover:text-black rounded-md transition-ui active:scale-95 cursor-pointer"
                >
                  {project.ctaLabel ?? 'Shop'}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-sans border border-neutral-800 hover:border-white text-white hover:bg-white hover:text-black rounded-md transition-ui active:scale-95 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
