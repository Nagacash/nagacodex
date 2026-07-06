import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { Certification } from '../lib/certifications';

interface CertificationLightboxProps {
  certification: Certification | null;
  onClose: () => void;
}

export default function CertificationLightbox({
  certification,
  onClose,
}: CertificationLightboxProps) {
  useEffect(() => {
    if (!certification) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [certification, onClose]);

  return (
    <AnimatePresence>
      {certification && (
        <motion.div
          className="fixed inset-0 z-modal-peak flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${certification.title} certificate`}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
            aria-label="Close certificate viewer"
          />

          <motion.div
            className="relative z-10 w-full max-w-2xl max-h-[90dvh] flex flex-col gap-4"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex items-start justify-between gap-4 px-1">
              <div className="flex flex-col gap-1 text-left">
                <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
                  {certification.issuer}
                </span>
                <h3 className={`font-display font-bold text-lg text-white uppercase tracking-tight ${certification.accentClass}`}>
                  {certification.title}
                </h3>
                <span className="font-mono text-[10px] text-neutral-400">{certification.completed}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 tap-target flex items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 active:bg-white/20 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xl">
              <img
                src={certification.image}
                alt={`${certification.title} certificate issued by ${certification.issuer}`}
                className="w-full h-auto max-h-[75dvh] object-contain bg-neutral-50"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
