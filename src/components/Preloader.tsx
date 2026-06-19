import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { brandLogo } from '../lib/brand';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const duration = 1600; // 1.6s simulated load
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const currentProgress = Math.min(Math.floor((stepCount / steps) * 100), 100);
      setProgress(currentProgress);

      if (stepCount >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(() => {
            onComplete();
          }, 600);
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="preloader-container"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0A] font-mono text-xs text-[#E8E8E8] select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Audio/Visual aesthetic line decor */}
          <div className="absolute top-8 left-8 flex items-center gap-3 opacity-30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse" />
            <span>NAGA_CODEX_INITIALIZATION</span>
          </div>

          <div className="absolute top-8 right-8 text-neutral-600">
            VERSION 4.2.14
          </div>

          <div className="relative flex flex-col items-center max-w-md px-6">
            <motion.img
              src={brandLogo}
              alt="Naga Codex logo"
              className="w-32 h-32 mb-8 object-contain drop-shadow-[0_0_24px_rgba(212,168,67,0.35)]"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />

            {/* Wordmark NAGA CODEX */}
            <h1 className="font-display text-2xl tracking-[0.4em] text-white font-bold text-center select-none uppercase mb-2">
              NAGA CODEX
            </h1>
            <div className="text-[10px] tracking-[0.2em] text-[#00FF88] opacity-80 uppercase mb-8">
              CYBERNETICS // DIGITAL CINEMA // LIFESTYLE
            </div>

            {/* Loader Track */}
            <div className="w-64 h-[2px] bg-neutral-900 rounded-full overflow-hidden relative mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-cyber via-film to-culture"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Indicator Details */}
            <div className="w-64 flex justify-between text-[10px] uppercase text-neutral-500 tracking-wider">
              <span>STATUS: BOOTING</span>
              <span className="font-bold text-neutral-300">{progress}%</span>
            </div>
          </div>

          {/* Coordinate system decoration */}
          <div className="absolute bottom-8 left-8 text-[10px] text-neutral-600">
            LOC: HNGR_GER // LAT: 53.5511° N // LON: 9.9937° E
          </div>
          <div className="absolute bottom-8 right-8 text-[10px] text-neutral-600">
            SEC_AUTHLINK_SECURE_100
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
