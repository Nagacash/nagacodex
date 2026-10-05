import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Shield, Layers, Github } from 'lucide-react';
import FloatingClips from './FloatingClips';
import SoundToggle from './SoundToggle';
import { BookingCta } from './BookingCta';
import sound from '../lib/sound';
const SkillsManualModal = lazy(() => import('./SkillsManualModal'));
import { brandLogo } from '../lib/brand';
import { OFFER_SECTION_INDEX, WORK_SECTION_INDEX } from '../content/homepageOffer';
import { scrollToHashOrSection, scrollToSection } from '../lib/scrollNav';
import operatorPortrait from '../assets/images/maurice-portrait.jpg';
import operatorPortraitWebp from '../assets/images/maurice-portrait.webp';

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
      className="relative w-full h-full min-h-dvh flex flex-col justify-start pt-24 sm:pt-28 pb-4 sm:pb-6 px-4 sm:px-6 md:px-12 bg-transparent select-none overflow-hidden"
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

      {/* 3. Central Core: Draggable Orb & Profile Hub */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center w-full max-w-5xl mx-auto overflow-y-auto overflow-x-hidden overscroll-contain py-4 sm:py-6">

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
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#0F1929]/95 px-2 py-0.5 rounded-full border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse shadow-[0_0_8px_#00FF88]" />
              <span className="font-mono text-[7px] text-[#C5CEDC] tracking-wider uppercase">Available for projects</span>
            </div>
            
            {/* Portrait frame with tech HUD accents */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center">
              <picture>
                <source srcSet={operatorPortraitWebp} type="image/webp" />
                <img
                  src={operatorPortrait}
                  alt="Portrait of Maurice Holda"
                  width={805}
                  height={1200}
                  decoding="async"
                  className="w-full h-full object-cover object-center opacity-90 group-hover:scale-[1.02] transition-transform duration-700"
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

          {/* Card 2: Offer-led hero copy */}
          <div className="lg:col-span-8 flex flex-col gap-5 justify-center">
            <div className="flex flex-col gap-4 rounded-xl glass p-5 sm:p-7">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#E8EDF5] leading-tight">
                AI workflows and web products for teams with work to get done.
              </h1>
              <p className="type-manifesto text-sm sm:text-base text-[#C5CEDC] leading-relaxed max-w-xl">
                I build inquiry-to-proposal workflows and custom web tools for agencies, studios and small businesses. You work directly with me, from scope to handover.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-1 w-full">
                <div className="w-full sm:flex-1 min-w-0">
                  <BookingCta fullWidth />
                </div>
                <a
                  href="#offer"
                  onClick={(e) => {
                    e.preventDefault();
                    sound.playClick();
                    scrollToHashOrSection('offer', OFFER_SECTION_INDEX);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center min-h-11 px-5 py-3 rounded-lg border border-white/20 font-display font-extrabold text-[11px] tracking-widest uppercase text-[#E8EDF5] hover:border-cyber/50 hover:text-white transition-colors"
                >
                  See the offer ↓
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['AI Agents', 'React', 'Security', 'AI Film', 'MCP', 'LLMs'].map((sk) => (
                <span
                  key={sk}
                  className="font-mono text-[8px] text-[#8B9BB4] bg-[#162035] border border-white/10 px-2.5 py-1 rounded uppercase"
                >
                  #{sk}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                scrollToSection(WORK_SECTION_INDEX);
              }}
              className="self-start font-mono text-[9px] tracking-widest uppercase text-[#8B9BB4] hover:text-cyber transition-colors min-h-11"
            >
              View work →
            </button>
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
            scrollToHashOrSection('offer', OFFER_SECTION_INDEX);
          }}
          aria-label="Scroll to offer"
        >
          <span className="text-[8px] font-semibold text-neutral-700 group-hover:text-neutral-900 group-active:text-neutral-900 transition-colors tracking-[0.2em] uppercase">
            Scroll
          </span>
          <ChevronDown className="w-5 h-5 text-cyber animate-bounce" />
        </button>

        <div className="hidden sm:flex flex-col items-end text-right gap-0.5">
          <span>LAT_GRID_LNG: 53.55</span>
          <span className="text-neutral-600">ALPHA_V0.96_BUILD</span>
          <div className="flex gap-2 mt-1 normal-case tracking-normal">
            <a href="/impressum.html" className="hover:text-neutral-800 transition-colors">Impressum</a>
            <a href="/datenschutz.html" className="hover:text-neutral-800 transition-colors">Datenschutz</a>
            <a href="mailto:chosenfewrecords@hotmail.de" className="hover:text-neutral-800 transition-colors">Contact</a>
          </div>
        </div>

        <div className="flex sm:hidden flex-col gap-1.5 w-full text-[7px] text-neutral-600">
          <div className="flex justify-between">
            <span>NAGACODEX.CLOUD</span>
            <span>LAT 53.55</span>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
            <a href="/impressum.html" className="hover:text-neutral-900 transition-colors">Impressum</a>
            <a href="/datenschutz.html" className="hover:text-neutral-900 transition-colors">Datenschutz</a>
            <a href="mailto:chosenfewrecords@hotmail.de" className="hover:text-neutral-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
      {/* Skills support manual modal */}
      {isManualOpen && (<Suspense fallback={null}><SkillsManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} /></Suspense>)}
    </section>
  );
}