import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, X } from 'lucide-react';
import sound from '../lib/sound';
import { ProjectItem } from '../types';

interface FilmPreviewModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

function videoMime(src: string): string {
  return src.endsWith('.webm') ? 'video/webm' : 'video/mp4';
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

  const productUrl = project.externalUrl;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-modal-elevated flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-lg">
        <div className="absolute inset-0" onClick={onClose} aria-hidden />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl bg-[#080808] border border-neutral-800 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(255,107,53,0.12)] z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-[2px] w-full bg-film" />

          <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-6 border-b border-neutral-900">
            <h2 className="font-display font-extrabold text-lg md:text-2xl text-white tracking-tight truncate min-w-0">
              {project.title}
            </h2>

            <div className="flex items-center gap-2 shrink-0">
              {productUrl ? (
                <a
                  href={productUrl}
                  target={productUrl.startsWith('/') ? undefined : '_blank'}
                  rel={productUrl.startsWith('/') ? undefined : 'noopener noreferrer'}
                  onClick={() => sound.playClick()}
                  className="inline-flex items-center gap-2 px-3 py-2 min-h-[44px] border border-neutral-700 hover:border-film/50 bg-neutral-950 text-[#E8EDF5] hover:text-white rounded-lg transition-ui font-mono text-[10px] uppercase tracking-wider"
                >
                  Open product
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="p-2 min-h-[44px] min-w-[44px] border border-neutral-800 hover:border-neutral-600 bg-neutral-950 text-neutral-400 hover:text-white rounded-lg transition-ui active:scale-90 cursor-pointer flex items-center justify-center"
                aria-label="Close film preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
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
              onEnded={() => sound.resumeFromContent()}
            >
              <source src={project.videoSrc} type={videoMime(project.videoSrc)} />
              {project.videoFallbackSrc && project.videoFallbackSrc !== project.videoSrc ? (
                <source
                  src={project.videoFallbackSrc}
                  type={videoMime(project.videoFallbackSrc)}
                />
              ) : null}
            </video>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
