import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Film, Shirt, Command, Activity, ArrowRight, Zap, Target, Cpu, Code, Award, BookOpen } from 'lucide-react';
import { SectionTheme, PillarData } from '../types';
import VideoBackground from './VideoBackground';
import sound from '../lib/sound';
import { mandeFilm } from '../lib/films';

export default function WhoSection() {
  const [activePillar, setActivePillar] = useState<SectionTheme>('none');
  const [hoveredPillar, setHoveredPillar] = useState<SectionTheme>('none');

  // Coordinates for 3D card tilts
  const [tilt1, setTilt1] = useState({ x: 0, y: 0 });
  const [tilt2, setTilt2] = useState({ x: 0, y: 0 });
  const [tilt3, setTilt3] = useState({ x: 0, y: 0 });
  const [tilt4, setTilt4] = useState({ x: 0, y: 0 });

  const handleCardTilt = (idx: number, e: React.MouseEvent<HTMLDivElement>) => {
    const cardRect = e.currentTarget.getBoundingClientRect();
    const cursorX = e.clientX - cardRect.left;
    const cursorY = e.clientY - cardRect.top;
    
    // Convert to angle (-12deg to 12deg range limit)
    const rx = ((cursorY / cardRect.height) - 0.5) * -12;
    const ry = ((cursorX / cardRect.width) - 0.5) * 12;

    if (idx === 1) setTilt1({ x: rx, y: ry });
    if (idx === 2) setTilt2({ x: rx, y: ry });
    if (idx === 3) setTilt3({ x: rx, y: ry });
    if (idx === 4) setTilt4({ x: rx, y: ry });
  };

  const resetCardTilt = (idx: number) => {
    if (idx === 1) setTilt1({ x: 0, y: 0 });
    if (idx === 2) setTilt2({ x: 0, y: 0 });
    if (idx === 3) setTilt3({ x: 0, y: 0 });
    if (idx === 4) setTilt4({ x: 0, y: 0 });
  };

  const handlePillarClick = (theme: SectionTheme) => {
    if (activePillar === theme) {
      setActivePillar('none');
      sound.playClick();
      if (theme === 'film') sound.resumeFromContent();
    } else {
      setActivePillar(theme);
      sound.playTransition();
      if (theme === 'film') sound.pauseForContent();
    }
  };

  const getTiltVal = (idx: number) => {
    if (idx === 1) return tilt1;
    if (idx === 2) return tilt2;
    if (idx === 3) return tilt3;
    return tilt4;
  };

  const pillars: PillarData[] = [
    {
      id: 'cyber',
      title: 'CYBER SECURITY',
      role: 'CORE ADVISOR / OPERATOR',
      subtitle: 'DIGITAL SOVEREIGNTY',
      accentClass: 'text-cyber',
      glowClass: 'glow-cyber border-cyber bg-[#00FF88]/[0.02]',
      description: 'Consultancy operations validating enterprise network architectures. Specializing in off-sec operations, automated smart-contract auditing, red-teaming simulations, and hardening sensitive cloud infrastructure. Protecting Hamburg enterprise systems and international decentralized systems.',
      stats: [
        { label: 'PENTESTS COMPLETED', value: '140+' },
        { label: 'CONTRACTS AUDITED', value: '45' },
        { label: 'CVSS SEVERITY REDUCED', value: '98%' },
      ],
    },
    {
      id: 'film',
      title: 'AI CINEMA',
      role: 'DIRECTOR / SYNTHESIZER',
      subtitle: 'GENERATIVE FUTURES',
      accentClass: 'text-film',
      glowClass: 'glow-film border-film bg-[#FF6B35]/[0.02]',
      description: 'Pioneering text-to-video / image generative pipeline integration. Fabricating immersive narrative shorts, abstract computer-generated visual loops, and multi-layered soundscapes. Directing creative agencies and indie filmmakers into the era of artificial synthesizers and procedural art.',
      stats: [
        { label: 'GENERATED SCENES', value: '18,200+' },
        { label: 'INDIE FESTIVALS', value: '5' },
        { label: 'PIPELINE SPEED MULTI', value: '4.5X' },
      ],
    },
    {
      id: 'dev',
      title: 'WEB DEVELOPMENT',
      role: 'ENGINEER / ARCHITECT',
      subtitle: 'CUSTOM APPLICATIONS',
      accentClass: 'text-dev',
      glowClass: 'glow-dev border-dev bg-[#BD00FF]/[0.02]',
      description: 'Engineered responsive bespoke React applications, progressive web systems, high-frequency microservice APIs, and secure serverless operations. Scaling complex design patterns into lightning-fast, standards-compliant digital interfaces.',
      stats: [
        { label: 'BUILD DEPLOYMENTS', value: '280+' },
        { label: 'PERFORMANCE SCORE', value: '100%' },
        { label: 'SYSTEM COLD START', value: '< 80ms' },
      ],
    },
    {
      id: 'culture',
      title: 'STREET CULTURE',
      role: 'BRAND ARCHITECT',
      subtitle: 'SUBVERSIVE STREETWEAR',
      accentClass: 'text-culture',
      glowClass: 'glow-culture border-culture bg-[#D4A843]/[0.02]',
      description: 'Founder and lead creative designer of Hamburg-based streetwear capsule line. Infusing brutalist typography, cryptographic print styles, and rugged technical garments. Translating cyber security warnings and glitch paradigms into luxury raw heavy cotton outerwear.',
      stats: [
        { label: 'CAPSULE RELEASES', value: '6' },
        { label: 'WORLDWIDE ORDERS', value: '1,400+' },
        { label: 'THREAD DENSITY (GSM)', value: '450' },
      ],
    },
  ];

  const educations = [
    {
      institution: "AI HUB STARTPLATZ, KÖLN - DE",
      degree: "AI MANAGER, IT",
      period: "JANUARY 2026",
      status: "GRADUATED WITH CERTIFICATION (AI MANAGER)",
      skills: ["GEN-AI PIPELINES", "AGENT ARCHITECTS", "NEURAL DEPLOYMENT"],
      accent: "text-cyber",
      borderColor: "border-cyber/30",
    },
    {
      institution: "MASTERSCHOOL UNIVERSITY, BERLIN - DE",
      degree: "CYBER SECURITY, ANALYST",
      period: "FEBRUARY 2025",
      status: "GRADUATED WITH CERTIFICATION (SECURITY +)",
      skills: ["NETWORK COMPLIANCE", "AST FUZZING", "SIEM AUDITING"],
      accent: "text-film",
      borderColor: "border-film/30",
    },
    {
      institution: "DCI UNIVERSITY, BERLIN - DE",
      degree: "WEBDEV, IT",
      period: "JULY 2022",
      status: "GRADUATED WITH CERTIFICATION (WEBDEV)",
      skills: ["FULLSTACK SPA", "DOM FLOW DYNAMICS", "COMPILER TUNING"],
      accent: "text-dev",
      borderColor: "border-dev/30",
    }
  ];

  return (
    <section
      id="who-section"
      data-section={hoveredPillar !== 'none' ? hoveredPillar : activePillar}
      className="relative w-full min-h-dvh flex flex-col justify-center py-20 px-6 md:px-12 bg-transparent border-t border-neutral-900 transition-colors duration-700"
    >
      {/* 1. Backdrop Video Controllers (Morphs as cards are active or hovered) */}
      <AnimatePresence mode="popLayout">
        {activePillar === 'cyber' || hoveredPillar === 'cyber' ? (
          <motion.div
            key="bg-cyber"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <VideoBackground themeFallback="cyber" blendMode="screen" />
          </motion.div>
        ) : activePillar === 'film' || hoveredPillar === 'film' ? (
          <motion.div
            key="bg-film"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <VideoBackground
              themeFallback="film"
              blendMode="screen"
              webmSrc={mandeFilm.webm}
              mp4Src={mandeFilm.h264}
            />
          </motion.div>
        ) : activePillar === 'dev' || hoveredPillar === 'dev' ? (
          <motion.div
            key="bg-dev"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <VideoBackground themeFallback="dev" blendMode="screen" />
          </motion.div>
        ) : activePillar === 'culture' || hoveredPillar === 'culture' ? (
          <motion.div
            key="bg-culture"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <VideoBackground themeFallback="culture" blendMode="screen" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-cyber font-mono text-[9px] tracking-[0.3em] uppercase mb-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>IDENTITY PROFILE // CORE PILLARS</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-white uppercase leading-none">
              WHO IS <span className="text-neutral-400">MAURICE HOLDA</span>
            </h2>
          </div>
          <p className="max-w-md text-xs font-mono text-neutral-500 tracking-wide uppercase text-left md:text-right">
            NAGA CODEX represents the convergence of systemic protection, synthetic visual generation, and tangible tactile wearable artifacts.
          </p>
        </div>

        {/* 2. Interactive Columns grid list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-start">
          {pillars.map((pillar, idx) => {
            const index = idx + 1;
            const tilt = getTiltVal(index);
            const isActive = activePillar === pillar.id;
            const isAnyActive = activePillar !== 'none';
            const isDimmed = isAnyActive && !isActive;

            return (
              <motion.div
                key={pillar.id}
                onMouseMove={(e) => handleCardTilt(index, e)}
                onMouseLeave={() => {
                  resetCardTilt(index);
                  setHoveredPillar('none');
                }}
                onMouseEnter={() => setHoveredPillar(pillar.id)}
                onClick={() => handlePillarClick(pillar.id)}
                className={`tilt-card text-left select-none relative p-6 border rounded-xl overflow-hidden cursor-pointer transition-ui ${
                  isActive || hoveredPillar === pillar.id ? pillar.glowClass : 'glass border-neutral-800/40'
                } ${isDimmed ? 'opacity-40 scale-[0.98]' : 'hover:scale-[1.01]'}`}
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
                  transition: 'transform 0.1s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s, scale 0.3s',
                }}
              >
                {/* Accent glow corner indicator */}
                <div className={`absolute top-0 left-0 w-12 h-[2px] bg-gradient-to-r ${
                  pillar.id === 'cyber' ? 'from-cyber' : pillar.id === 'film' ? 'from-film' : pillar.id === 'dev' ? 'from-dev' : 'from-culture'
                } to-transparent`} />

                {/* Index marker */}
                <div className="w-full flex justify-between items-center mb-6 font-mono text-[9px] text-neutral-600">
                  <span>CODE_V{index}.0</span>
                  <span>[{pillar.subtitle}]</span>
                </div>

                {/* Pillar Icon */}
                <div className={`mb-6 p-3 rounded-lg w-fit bg-neutral-900 border border-neutral-800 ${pillar.accentClass}`}>
                  {pillar.id === 'cyber' && <Shield className="w-6 h-6" />}
                  {pillar.id === 'film' && <Film className="w-6 h-6" />}
                  {pillar.id === 'dev' && <Code className="w-6 h-6" />}
                  {pillar.id === 'culture' && <Shirt className="w-6 h-6" />}
                </div>

                <h3 className="font-display font-extrabold text-xl tracking-wide text-white uppercase mb-1">
                  {pillar.title}
                </h3>
                <p className="font-mono text-[9px] text-neutral-400 tracking-wider mb-6">
                  {pillar.role}
                </p>

                {/* Inline expand animation details */}
                <AnimatePresence initial={false}>
                  {isActive ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-neutral-900 mt-4 flex flex-col gap-5">
                        
                        <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                          {pillar.description}
                        </p>

                        {/* Live dynamic metrics listing inside expanded box */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-neutral-900">
                          {pillar.stats.map((s, sIdx) => (
                            <div key={sIdx} className="flex justify-between items-center font-mono text-[9.5px]">
                              <span className="text-neutral-500 uppercase">{s.label}</span>
                              <span className={`font-bold ${pillar.accentClass}`}>{s.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Expandable CTA panel */}
                        <div className="flex items-center gap-1 font-mono text-[8.5px] uppercase tracking-widest text-[#E8E8E8] group/card mt-2">
                          <span>EXPLORE CONTRACTS</span>
                          <ArrowRight className="w-3.5 h-3.5 text-current group-hover/card:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase mt-4 pt-4 border-t border-neutral-900/40">
                      <span>ACTIVATE MODULE</span>
                      <Command className="w-3 h-3 text-neutral-600 group-hover:text-neutral-400" />
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* 3. Academic Dossier & certifications sub-panel */}
        <div className="mt-12 pt-10 border-t border-neutral-900/60 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-culture font-mono text-[9px] tracking-[0.3em] uppercase mb-1.5">
                <Award className="w-3.5 h-3.5 text-[#D4A843]" />
                <span>VERIFIED SCHOLASTIC LEDGER // CERTIFICATIONS</span>
              </div>
              <h3 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white uppercase leading-none">
                ACADEMIC <span className="text-neutral-500">DOSSIER</span>
              </h3>
            </div>
            <p className="max-w-xs text-[9px] font-mono text-neutral-500 tracking-wide uppercase">
              DECENTRALIZED CREDENTIAL RECORDS SECURED WITH ENTERPRISE CERTIFICATE KEY PAIRS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {educations.map((edu, idx) => (
              <div 
                key={idx}
                className={`relative p-5 rounded-lg bg-neutral-950/40 border ${edu.borderColor} glass hover:bg-neutral-950/70 transition-ui flex flex-col justify-between h-48 group`}
              >
                {/* Visual side accent dot */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-500 bg-neutral-900/60 px-2 py-0.5 rounded border border-neutral-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{edu.period}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[7.5px] text-neutral-500 font-mono tracking-widest uppercase">
                    {edu.institution}
                  </span>
                  <h4 className="font-display font-extrabold text-base text-white tracking-wide uppercase leading-tight group-hover:text-[#D4A843] transition-colors duration-300">
                    {edu.degree}
                  </h4>
                  <span className="text-[9.5px] font-mono font-bold text-neutral-400 uppercase tracking-wide leading-none flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-neutral-600" />
                    <span>{edu.status}</span>
                  </span>
                </div>

                {/* Micro tech tags listing skill competencies */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-900">
                  {edu.skills.map((sk, i) => (
                    <span 
                      key={i} 
                      className="text-[7px] font-mono bg-neutral-900 px-1.5 py-0.5 rounded-sm border border-neutral-800 text-neutral-500 uppercase tracking-wider"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
