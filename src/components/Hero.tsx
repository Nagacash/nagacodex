import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useMotionValue } from 'motion/react';
import { HelpCircle, ChevronDown, Monitor, Shield, Layers, Award, MapPin, CheckCircle2, BookOpen } from 'lucide-react';
import VideoBackground from './VideoBackground';
import FloatingClips from './FloatingClips';
import SoundToggle from './SoundToggle';
import sound from '../lib/sound';
import SkillsManualModal from './SkillsManualModal';
import { brandLogo } from '../lib/brand';
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
      className="relative w-full min-h-dvh flex flex-col justify-between py-12 px-6 md:px-12 bg-transparent select-none pointer-events-none overflow-x-hidden"
    >
      {/* Decorative vector background */}
      <FloatingClips theme="cyber" />

      {/* 2. Top Bar Navigation Elements */}
      <div className="relative z-20 w-full flex justify-between items-center pointer-events-auto">
        <div className="flex items-center gap-3">
          <img
            src={brandLogo}
            alt="Naga Codex"
            className="w-10 h-10 object-contain shrink-0"
          />
          <div className="flex flex-col">
          <span className="font-display font-extrabold tracking-tight text-xl text-white">
            NAGA <span className="text-culture">CODEX</span>
          </span>
          <span className="font-mono text-[8px] text-cyber uppercase tracking-widest mt-0.5">HAMBURG // HQ</span>
        </div>
        </div>
        
        {/* Subtle coordinate & system status panel with embedded Sound Toggle */}
        <div className="flex items-center gap-4 font-mono text-[9px] text-neutral-400">
          <button
            onClick={() => {
              sound.playClick();
              setIsManualOpen(true);
            }}
            className="flex md:hidden items-center gap-1.5 px-2.5 py-1 rounded border border-neutral-800 bg-neutral-950 text-[#D4A843] active:scale-95 transition-transform cursor-pointer"
            title="Open Blueprints DB"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>EXPLORE WORK</span>
          </button>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => {
                sound.playClick();
                setIsManualOpen(true);
              }}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-[#D4A843] transition-colors cursor-pointer group"
              title="Open Blueprints Manual"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D4A843] group-hover:scale-110 transition-transform" />
              <span className="underline decoration-neutral-800 hover:decoration-[#D4A843] transition-ui">EXPLORE WORK</span>
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
      <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-5xl mx-auto">
        
        {/* Giant Title Headers */}
        <div className="w-full text-center flex flex-col justify-center items-center pointer-events-none gap-2">
          
          {/* Headline Row 1 */}
          <h1 className="font-display font-extrabold text-[12vw] md:text-[8vw] xl:text-[7.5rem] tracking-tighter text-white leading-[0.85] uppercase text-glitch">
            {titleLine1.map((w, idx) => (
              <RepellingWord key={`t1-${idx}`} word={w} orbPos={isMobile ? { x: 0, y: 0 } : orbPos} />
            ))}
          </h1>

          {/* Headline Row 2 */}
          <h1 className="font-display font-extrabold text-[12vw] md:text-[8vw] xl:text-[7.5rem] tracking-tighter text-culture leading-[0.85] uppercase">
            {titleLine2.map((w, idx) => (
              <RepellingWord key={`t2-${idx}`} word={w} orbPos={isMobile ? { x: 0, y: 0 } : orbPos} />
            ))}
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
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_28px_rgba(212,168,67,0.45)] border border-culture/30 bg-black/80">
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
                  className="absolute top-26 bg-black/80 backdrop-blur-md px-2.5 py-1 border border-neutral-800 rounded-sm font-mono text-[7.5px] text-cyber tracking-widest uppercase text-center whitespace-nowrap"
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
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded-full border border-neutral-800">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse shadow-[0_0_8px_#00FF88]" />
              <span className="font-mono text-[7px] text-neutral-300 tracking-wider uppercase">Available for projects</span>
            </div>
            
            {/* Portrait frame with tech HUD accents */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 flex items-center justify-center">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              
              {/* Overlay crosshairs */}
              <div className="absolute top-2 left-2 font-mono text-[6px] text-neutral-500">ID: N_C_8841</div>
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <span className="w-1 h-1 bg-cyber" />
                <span className="font-mono text-[6.5px] text-cyber">OPERATOR SELECTED</span>
              </div>
            </div>

            {/* Identity Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-xl text-white tracking-tight">Maurice Holda</h3>
                <span className="bg-[#D4A843]/10 border border-[#D4A843]/30 text-culture rounded-sm px-1.5 py-0.5 font-mono text-[7px] tracking-widest uppercase font-bold">AI MANAGER</span>
              </div>
              <p className="font-mono text-[8.5px] text-neutral-400 mt-1 uppercase tracking-wider">
                AI Manager · Full-Stack Developer · Cybersecurity
              </p>
              <div className="text-[8px] font-mono text-neutral-500 mt-2.5 border-t border-neutral-900 pt-2 flex justify-between uppercase">
                <span>Base: Hamburg, Germany</span>
                <span className="text-cyber">SEC+ // AI strategy & ops</span>
              </div>
            </div>
          </div>

          {/* Card 2: Professional Playbook & Credentials */}
          <div className="lg:col-span-8 flex flex-col gap-5 justify-between">
            {/* Playbook Description */}
            <div className="glass rounded-xl p-6 flex flex-col gap-4 flex-1 hover:border-neutral-800 transition-colors duration-300">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 font-mono text-[8.5px] text-culture tracking-widest uppercase">
                  <Award className="w-3.5 h-3.5 text-culture animate-pulse" />
                  <span>Certified AI Manager & Security Operator</span>
                </div>
                <div className="font-mono text-[7px] text-neutral-500">PLAYBOOK // N_C_DEC_0</div>
              </div>

              {/* Custom header and paragraph */}
              <div className="flex flex-col gap-2">
                <h4 className="font-display font-bold text-base md:text-lg text-white uppercase tracking-tight font-syne">
                  Orchestrating AI Capabilities and Product Systems.
                </h4>
                <p className="font-sans text-xs md:text-sm text-neutral-300 font-light leading-relaxed">
                  Maurice Holda applies a Certified AI Manager playbook at Naga Codex—combining product visioning, governance, and technical leadership so copilots, MCP agents, and web systems ship with measurable impact and trusted guardrails.
                </p>
              </div>

              {/* Credentials / Specs bento rows */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1.5">
                <div className="border border-white/5 bg-white/[0.01] p-3 rounded-lg flex flex-col gap-1">
                  <span className="font-mono text-[7px] text-neutral-500 uppercase tracking-widest">Certified</span>
                  <span className="font-display font-extrabold text-[10.5px] text-white tracking-tight uppercase">AI Manager · Security+</span>
                </div>
                <div className="border border-white/5 bg-white/[0.01] p-3 rounded-lg flex flex-col gap-1">
                  <span className="font-mono text-[7px] text-neutral-500 uppercase tracking-widest">Focus</span>
                  <span className="font-display font-extrabold text-[10.5px] text-culture tracking-tight uppercase">AI Strategy & Ops</span>
                </div>
                <div className="border border-white/5 bg-white/[0.01] p-3 rounded-lg flex flex-col gap-1">
                  <span className="font-mono text-[7px] text-neutral-500 uppercase tracking-widest">Base</span>
                  <span className="font-display font-extrabold text-[10.5px] text-white tracking-tight uppercase">Hamburg, Germany</span>
                </div>
              </div>
            </div>

            {/* Bottom Competencies and CTA block */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Skill tag lists */}
              <div className="sm:col-span-7 flex flex-wrap gap-1.5">
                {["AI/ML", "React", "Next.js", "Security", "Cloud", "LLMs"].map((sk) => (
                  <span
                    key={sk}
                    className="font-mono text-[8.5px] text-neutral-400 bg-white/[0.02] border border-white/10 px-2 py-0.5 rounded uppercase hover:border-culture hover:text-white transition-colors duration-200"
                  >
                    #{sk}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="sm:col-span-5 flex gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    document.getElementById('who-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 font-display font-extrabold text-[9.5px] tracking-widest text-center uppercase bg-culture text-black py-2.5 px-3 rounded-lg hover:bg-white transition-colors duration-300 active:scale-95"
                >
                  START A BUILD
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 font-display font-extrabold text-[9.5px] tracking-widest text-center uppercase border border-neutral-700 hover:border-white text-white py-2.5 px-3 rounded-lg transition-colors duration-300 active:scale-95"
                >
                  VIEW WORK
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Bottom Row Metrics */}
      <h3 className="relative z-10 w-full flex justify-between items-end text-neutral-500 font-mono text-[8px] tracking-[0.2em] uppercase pointer-events-auto">
        <div className="flex flex-col gap-1">
          <span>HOST: NAGACODEX.CLOUD</span>
          <span className="text-[7.5px] text-neutral-600">HAMBURG // ST.PAULI</span>
        </div>

        {/* Dynamic breathing Chevron to scroll indicators */}
        <div className="flex flex-col items-center gap-1.5 group mx-auto animate-bounce pb-2 cursor-pointer"
             onClick={() => document.getElementById('who-section')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="text-[7.5px] text-neutral-400 group-hover:text-white transition-colors tracking-[0.3em]">SEC_WHO</span>
          <ChevronDown className="w-4 h-4 text-[#00FF88]" />
        </div>

        <div className="flex flex-col items-end text-right gap-0.5">
          <span>LAT_GRID_LNG: 53.55</span>
          <span className="text-neutral-600">ALPHA_V0.96_BUILD</span>
        </div>
      </h3>
      {/* Skills support manual modal */}
      <SkillsManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
    </section>
  );
}
