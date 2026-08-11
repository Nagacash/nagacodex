import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { brandLogo } from '../lib/brand';
interface PreloaderProps { onComplete: () => void; }
const MIN_VISIBLE_MS = 450, MAX_WAIT_MS = 1400;
export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const finish = useCallback(() => { setProgress(100); setIsDone(true); window.setTimeout(onComplete, 280); }, [onComplete]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    const startedAt = performance.now(); let rafId = 0, cancelled = false, completed = false;
    const complete = () => { if (cancelled || completed) return; completed = true; finish(); };
    const tick = (now: number) => {
      if (cancelled || completed) return;
      setProgress(Math.min(96, Math.round(((now - startedAt) / MAX_WAIT_MS) * 100)));
      if (now - startedAt >= MIN_VISIBLE_MS) {
        if (!('fonts' in document) || document.fonts.status === 'loaded' || now - startedAt >= MAX_WAIT_MS) { complete(); return; }
      }
      rafId = requestAnimationFrame(tick);
    };
    if ('fonts' in document) document.fonts.ready.then(() => { if (performance.now() - startedAt >= MIN_VISIBLE_MS) complete(); });
    rafId = requestAnimationFrame(tick);
    const cap = window.setTimeout(complete, MAX_WAIT_MS + 200);
    return () => { cancelled = true; cancelAnimationFrame(rafId); window.clearTimeout(cap); };
  }, [finish]);
  return (<AnimatePresence>{!isDone && (<motion.div id="preloader-container" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-dark font-mono text-xs select-none" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}><div className="relative flex flex-col items-center px-6"><motion.img src={brandLogo} alt="Naga Codex logo" className="w-32 h-32 mb-8 object-contain" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} /><h1 className="font-display text-2xl tracking-[0.4em] text-neutral-900 font-bold uppercase mb-2">NAGA CODEX</h1><div className="w-64 h-[2px] bg-neutral-200 rounded-full overflow-hidden mb-3"><motion.div className="h-full bg-gradient-to-r from-cyber via-film to-culture" style={{ width: progress + '%' }} /></div><span className="text-[10px] text-neutral-500 uppercase">{progress}%</span></div></motion.div>)}</AnimatePresence>);
}