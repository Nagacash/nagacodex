import React, { useEffect, useRef, useState, useMemo, lazy, Suspense } from 'react';
import { motion, useMotionValue } from 'motion/react';
import { HelpCircle, ChevronDown, Monitor, Shield, Layers, MapPin, CheckCircle2, Github } from 'lucide-react';
import VideoBackground from './VideoBackground';
import FloatingClips from './FloatingClips';
import SoundToggle from './SoundToggle';
import sound from '../lib/sound';
const SkillsManualModal = lazy(() => import('./SkillsManualModal'));
import { brandLogo } from '../lib/brand';
import { scrollToSection } from '../lib/scrollNav';
import operatorPortrait from '../assets/images/maurice-portrait.jpg';
import operatorPortraitWebp from '../assets/images/maurice-portrait.webp';

interface RepellingWordProps {
  key?: string | number;
  word: string;
  orbPos: { x: number; y: number };
}

// Interactive repelling word sub-component
function RepellingWord({ word, orbPos }: RepellingWordProps) {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const [restCoords, setRestCoords] = useState<{ x: number; y: number } | null>(null);

  // Read viewport position to find static layout center
  const measureCoords = () => {
    if (spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect();
      setRestCoords({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  };

  useEffect(() => {
    measureCoords();
    // Re-measure position on window resize
    window.addEventListener('resize', measureCoords);
    window.addEventListener('scroll', measureCoords, { passive: true });
    return () => {
      window.removeEventListener('resize', measureCoords);
      window.removeEventListener('scroll', measureCoords);
    };
  }, []);

  // Compute repulsion vector relative to general dragging coordinates
  const offsets = useMemo(() => {
    if (!restCoords || orbPos.x === 0 && orbPos.y === 0) return { x: 0, y: 0 };

    const dx = restCoords.x - orbPos.x;
    const dy = restCoords.y - orbPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Repelling boundary field radius
    const radius = 110; 

    if (distance < radius && distance > 0) {
      const force = (radius - distance) / radius; // 1.0 (at center) to 0.0 (at edge)
      const pushFactor = 80; // High vector repulsion amplitude
      return {
        x: (dx / distance) * force * pushFactor,
        y: (dy / distance) * force * pushFactor,
      };
    }

    return { x: 0, y: 0 };
  }, [restCoords, orbPos]);

  return (
    <span
      ref={spanRef}
      style={{
        transform: `translate3d(${offsets.x}px, ${offsets.y}px, 0)`,
        transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="inline-block will-change-transform select-none"
    >
      {word}&nbsp;
    </span>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Track orb center in standard viewport coordinates
  const [orbPos, setOrbPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [dragPrompt, setDragPrompt] = useState(true);
  const [isManualOpen, setIsManualOpen] = useState(false);

  // Initialize screen state checks
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);

    // Initial positioning in relative center of the screen
    setOrbPos({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.45,
    });

    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Splitting core typography texts for kinetic animation repellers
  const titleLine1 = useMemo(() => "NAGA".split(' '), []);
  const titleLine2 = useMemo(() => "CODEX".split(' '), []);
  const manifestoParagraph = useMemo(
    () => "Personal brand of Maurice Holda: cyber security consultant, AI filmmaker, and streetwear brand owner based in Hamburg, Germany. Navigating the intersections of digital sovereignty, computer-generated cinematic media, and elevated counter-culture fashion.".split(' '),
    []
  );

  // Track dragging updates
  const handleOrbDrag = (_: any, info: any) => {
    // Collect coordinates in actual viewport offset
    setOrbPos({
      x: info.point.x,
      y: info.point.y,
    });
    if (dragPrompt) {
      setDragPrompt(false);
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero-section"
      data-section="none"
      className="relative w-full h-full min-h-dvh flex flex-col pt-[calc(4.75rem+env(safe-area-inset-top,0px))] sm:pt-[calc(5.25rem+env(safe-area-inset-top,0px))] pb-4 sm:pb-6 px-4 sm:px-6 md:px-12 bg-transparent select-none overflow-hidden"
    >
      {/* Decorative vector background */}
      <FloatingClips theme="cyber" />

      {/* 2. Top Bar Navigation Elements */}
      <div className="relative z-20 w-full shrink-0 mt-2 sm:mt-3 flex flex-wrap justify-between items-center gap-2 pointer-events-auto min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img
            src={brandLogo}
            alt="Naga Codex"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain shrink-0"
          />
          <div className="flex flex-col min-w-0">
          <span className="font-display font-extrabold tracking-tight text-base sm:text-xl text-black truncate">
            NAGA <span className="text-culture">CODEX</span>
          </span>
          <span className="hidden sm:block font-mono text-[8px] text-cyber uppercase tracking-widest mt-0.5">HAMBURG // HQ</span>
        </div>
        </div>
        
        {/* Subtle coordinate & system status panel with embedded Sound Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 font-mono text-[9px] text-neutral-500 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setIsManualOpen(true);
            }}
            className="flex md:hidden items-center justify-center gap-1.5 px-3 py-2 min-h-11 rounded border border-neutral-200 bg-white text-[#D4A843] active:scale-95 transition-transform cursor-pointer text-[8px] shrink-0"
            title="Open Blueprints DB"
          >
            <Github className="w-3.5 h-3.5" />
            <span>EXPLORE WORK</span>
          </button>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => {
                sound.playClick();
                setIsManualOpen(true);
              }}
              className="flex items-center gap-1.5 text-neutral-500 hover:text-[#D4A843] transition-colors cursor-pointer group"
              title="Open Blueprints Manual"
            >
              <Github className="w-3.5 h-3.5 text-[#D4A843] group-hover:scale-110 transition-transform" />
              <span className="underline decoration-neutral-300 hover:decoration-[#D4A843] transition-ui">EXPLORE WORK</span>
            </button>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-cyber animate-pulse" />
              <span>SEC_SYSTEM_ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-film" />
              <span>FILM_RENDER_CORE_0</span>
            </div>
          </div>
          <SoundToggle />
        </div>
      </div>

      {/* 3. Central Core: Draggable Orb & Kinetic Words */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center w-full max-w-5xl mx-auto overflow-y-auto overflow-x-hidden overscroll-contain py-4 sm:py-6">
        
        {/* Giant Title Headers */}
        <div className="w-full max-w-full text-center flex flex-col justify-center items-center pointer-events-none gap-2 px-1">
          <h1 className="font-display font-extrabold w-full max-w-full text-[10.5vw] sm:text-[12vw] md:text-[8vw] xl:text-[7.5rem] tracking-tighter leading-[0.85] uppercase overflow-hidden">
            <span className="block text-black text-glitch">
              {titleLine1.map((w, idx) => (
                <RepellingWord key={`t1-${idx}`} word={w} orbPos={isMobile ? { x: 0, y: 0 } : orbPos} />
              ))}
            </span>
            <span className="block text-culture">
              {titleLine2.map((w, idx) => (
                <RepellingWord key={`t2-${idx}`} word={w} orbPos={isMobile ? { x: 0, y: 0 } : orbPos} />
              ))}
            </span>
          </h1>
        </div>

        {/* Draggable Active Glowing Core Orb (Disable on mobile to fall back to clean presentation) */}
        {!isMobile && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            {/* Draggable container bounding grid */}
            <motion.div
              drag
              dragConstraints={containerRef}
              dragElastic={0.05}
              dragMomentum={false}
              onDrag={handleOrbDrag}
              whileDrag={{ scale: 1.12 }}
              className="absolute pointer-events-auto w-24 h-24 flex items-center justify-center cursor-grab active:cursor-grabbing group hover:scale-105 transition-ui"
              style={{
                touchAction: 'none',
              }}
            >
              {/* Energy shield outer ring */}
              <div className="absolute inset-0 rounded-full border border-cyber/15 animate-ping opacity-60 pointer-events-none" />
              <div className="absolute inset-2 rounded-full border border-film/10 animate-pulse pointer-events-none" />

              {/* Pulsing core shadow glowing */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyber/15 via-film/10 to-culture/15 blur-xl group-hover:scale-125 transition-transform duration-500" />

              {/* Brand core */}
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_28px_rgba(212,168,67,0.35)] border border-culture/40 bg-white/90">
                <img
                  src={brandLogo}
                  alt="Naga Codex emblem"
                  className="w-12 h-12 object-contain pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Interactive guidelines indicator */}
              {dragPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: [0.3, 0.8, 0.3], y: 0 }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute top-26 bg-white/90 backdrop-blur-md px-2.5 py-1 border border-neutral-200 rounded-sm font-mono text-[7.5px] text-cyber tracking-widest uppercase text-center whitespace-nowrap"
                >
                  ◄ DRAG_ORB_TO_REFLOW ►
                </motion.div>
              )}
            </motion.div>
          </div>
        )}

        {/* Operator Profile Credentials Hub */}
        <div className="mt-12 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pointer-events-auto text-left relative z-30">
          
          {/* Card 1: Avatar / Identity Badge */}
          <div className="lg:col-span-4 glass rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-culture/40 transition-colors duration-300">
            {/* Status Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 px-2 py-0.5 rounded-full border border-neutral-200">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse shadow-[0_0_8px_#00FF88]" />
              <span className="font-mono text-[7px] text-neutral-600 tracking-wider uppercase">Available for projects</span>
            </div>
            
            {/* Portrait frame with tech HUD accents */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center">
              <picture>
                <source srcSet={operatorPortraitWebp} type="image/webp" />
                <img
                  src={operatorPortrait}
                  alt="Portrait of Maurice Holda"
                  width={800}
                  height={800}
                  decoding="async"
                  className="w-full h-full object-cover object-[center_20%] opacity-85 group-hover:scale-102 transition-transform duration-700"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/30 via-transparent to-transparent opacity-60" />
              
              {/* Overlay crosshairs */}
              <div className="absolute top-2 left-2 font-mono text-[6px] text-neutral-500">ID: N_C_8841</div>
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <span className="w-1 h-1 bg-cyber" />
                <span className="font-mono text-[6.5px] text-cyber">OPERATOR SELECTED</span>
              </div>
            </div>

            {/* Identity Info */}
            <div className="flex flex-col gap-2">
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-neutral-900 tracking-tight">Maurice Holda</h3>
              <span className="self-start bg-[#D4A843]/10 border border-[#D4A843]/30 text-culture rounded-sm px-1.5 py-0.5 font-mono text-[7px] tracking-widest uppercase font-bold">AI MANAGER</span>
              <p className="font-mono text-[7px] sm:text-[8px] text-neutral-500 uppercase tracking-wide leading-relaxed break-words">
                AI Agents · Film · Web Dev · Security — Hamburg
              </p>
              <div className="text-[7px] sm:text-[8px] font-mono text-neutral-500 border-t border-neutral-200 pt-2 flex flex-col gap-1 uppercase">
                <span>Base: Hamburg, Germany</span>
                <span className="text-cyber">AGENTS // FILM // WEB // SEC</span>
              </div>
            </div>
          </div>

          {/* Card 2: AI Chat Interface */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* ChatGPT-style conversation window */}
            <div className="flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#08111E]">

              {/* Window chrome bar */}
              <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/10 bg-[#050C17]">
                <div className="flex gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex items-center gap-2 mx-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse shadow-[0_0_8px_#00FF88]" />
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#E8EDF5] font-bold uppercase">NAGA CODEX AI</span>
                </div>
                <span className="shrink-0 font-mono text-[7px] text-[#8B9BB4] border border-white/10 px-2 py-0.5 rounded">GPT-4.1 • LIVE</span>
              </div>

              {/* Thread */}
              <div className="flex flex-col gap-4 p-4">

                {/* User Q */}
                <div className="flex justify-end">
                  <div className="max-w-[76%] bg-[#162035] border border-white/10 rounded-xl rounded-tr-sm px-3.5 py-2.5">
                    <p className="font-sans text-[11.5px] text-[#E8EDF5] leading-relaxed">What can Naga Codex actually ship?</p>
                  </div>
                </div>

                {/* AI A */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyber/10 border border-cyber/25 flex items-center justify-center shrink-0 mt-0.5">
                    <img src={brandLogo} alt="NC" className="w-5 h-5 object-contain" />
                  </div>
                  <div className="flex-1 bg-[#0D1A2A] border border-white/8 rounded-xl rounded-tl-sm px-3.5 py-2.5">
                    <p className="font-sans text-[11.5px] text-[#C5CEDC] leading-relaxed">
                      AI agent systems that run while you sleep. React products that convert. Generative films that stop the scroll. Security audits that catch what others miss.{' '}
                      <span className="text-cyber font-semibold">Zero middlemen</span> — you talk directly to the builder shipping your product.
                    </p>
                  </div>
                </div>

                {/* User Q */}
                <div className="flex justify-end">
                  <div className="max-w-[76%] bg-[#162035] border border-white/10 rounded-xl rounded-tr-sm px-3.5 py-2.5">
                    <p className="font-sans text-[11.5px] text-[#E8EDF5] leading-relaxed">What's the edge over an agency?</p>
                  </div>
                </div>

                {/* AI A */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyber/10 border border-cyber/25 flex items-center justify-center shrink-0 mt-0.5">
                    <img src={brandLogo} alt="NC" className="w-5 h-5 object-contain" />
                  </div>
                  <div className="flex-1 bg-[#0D1A2A] border border-white/8 rounded-xl rounded-tl-sm px-3.5 py-2.5">
                    <p className="font-sans text-[11.5px] text-[#C5CEDC] leading-relaxed">
                      No retainers. No account managers. No scoping decks that cost €5K. Four disciplines under one operator —{' '}
                      <span className="text-cyber">agents</span>,{' '}
                      <span className="text-film">film</span>,{' '}
                      <span className="text-dev">web</span>,{' '}
                      <span className="text-[#E8EDF5]">security</span>.
                      {' '}140+ audits. 280+ deployments. 18K+ AI-generated scenes. Hamburg bred, ships worldwide.
                    </p>
                  </div>
                </div>

                {/* User Q */}
                <div className="flex justify-end">
                  <div className="max-w-[76%] bg-[#162035] border border-white/10 rounded-xl rounded-tr-sm px-3.5 py-2.5">
                    <p className="font-sans text-[11.5px] text-[#E8EDF5] leading-relaxed">How fast can you move?</p>
                  </div>
                </div>

                {/* AI A — last, with blinking cursor */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyber/10 border border-cyber/25 flex items-center justify-center shrink-0 mt-0.5">
                    <img src={brandLogo} alt="NC" className="w-5 h-5 object-contain" />
                  </div>
                  <div className="flex-1 bg-[#0D1A2A] border border-white/8 rounded-xl rounded-tl-sm px-3.5 py-2.5">
                    <p className="font-sans text-[11.5px] text-[#C5CEDC] leading-relaxed">
                      Agent system:{' '}<span className="text-cyber font-medium">2–4 weeks</span>.{' '}
                      Web build:{' '}<span className="text-dev font-medium">1–3 weeks</span>.{' '}
                      Security audit:{' '}<span className="text-film font-medium">48h</span> initial report.
                      {' '}First call is 20 minutes, free, no pitch deck. Just a direct conversation about what needs to get built.
                      <span className="inline-block w-[2px] h-3.5 bg-cyber ml-0.5 animate-pulse align-text-bottom rounded-sm" />
                    </p>
                  </div>
                </div>

              </div>

              {/* Fake input bar */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-t border-white/10 bg-[#050C17]">
                <div className="flex-1 bg-[#0F1929] border border-white/8 rounded-lg px-3 py-2 font-sans text-[11px] text-[#4A5A72]">
                  Ask Naga Codex anything...
                </div>
                <a
                  href="https://calendly.com/sonic13-ch"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyber text-[#050C17] font-mono text-[9px] font-bold uppercase tracking-wider hover:bg-[#00DD77] transition-colors active:scale-95 cursor-pointer"
                >
                  Book Call ↗
                </a>
              </div>
            </div>

            {/* Tags + CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-7 flex flex-wrap gap-1.5">
                {['AI Agents', 'React', 'Security', 'AI Film', 'MCP', 'LLMs'].map((sk) => (
                  <span
                    key={sk}
                    className="font-mono text-[8px] text-[#8B9BB4] bg-[#162035] border border-white/10 px-2.5 py-1 rounded uppercase hover:border-cyber/40 hover:text-cyber transition-colors duration-200 cursor-default"
                  >
                    #{sk}
                  </span>
                ))}
              </div>
              <div className="sm:col-span-5 flex gap-2">
                <button
                  onClick={() => { sound.playClick(); scrollToSection(1); }}
                  className="flex-1 font-display font-extrabold text-[9.5px] tracking-widest text-center uppercase bg-cyber text-[#050C17] py-3 px-3 min-h-11 rounded-lg hover:bg-[#00DD77] transition-colors duration-200 active:scale-95"
                >
                  START A BUILD
                </button>
                <button
                  onClick={() => { sound.playClick(); scrollToSection(2); }}
                  className="flex-1 font-display font-extrabold text-[9.5px] tracking-widest text-center uppercase border border-white/20 hover:border-white/40 text-[#E8EDF5] py-3 px-3 min-h-11 rounded-lg transition-colors duration-200 active:scale-95"
                >
                  VIEW WORK
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 4. Bottom Row Metrics — pinned to viewport bottom */}
      <footer className="relative z-20 w-full shrink-0 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 text-neutral-500 font-mono text-[8px] tracking-[0.2em] uppercase pointer-events-auto pt-3 safe-bottom border-t border-neutral-200/60">
        <div className="hidden sm:flex flex-col gap-1">
          <span>HOST: NAGACODEX.CLOUD</span>
          <span className="text-[7.5px] text-neutral-600">HAMBURG // ST.PAULI</span>
        </div>

        <button
          type="button"
          className="flex flex-col items-center gap-1 group mx-auto min-h-11 py-1 cursor-pointer order-first sm:order-none"
          onClick={() => {
            sound.playClick();
            scrollToSection(1);
          }}
          aria-label="Scroll to next section"
        >
          <span className="text-[8px] font-semibold text-neutral-700 group-hover:text-neutral-900 group-active:text-neutral-900 transition-colors tracking-[0.2em] uppercase">
            Scroll
          </span>
          <ChevronDown className="w-5 h-5 text-cyber animate-bounce" />
        </button>

        <div className="hidden sm:flex flex-col items-end text-right gap-0.5">
          <span>LAT_GRID_LNG: 53.55</span>
          <span className="text-neutral-600">ALPHA_V0.96_BUILD</span>
        </div>

        <div className="flex sm:hidden justify-between w-full text-[7px] text-neutral-600">
          <span>NAGACODEX.CLOUD</span>
          <span>LAT 53.55</span>
        </div>
      </footer>
      {/* Skills support manual modal */}
      {isManualOpen && (<Suspense fallback={null}><SkillsManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} /></Suspense>)}
    </section>
  );
}
