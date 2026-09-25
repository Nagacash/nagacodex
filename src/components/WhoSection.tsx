import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Film, Shirt, ArrowRight, Code, Scale } from 'lucide-react';
import { SectionTheme, PillarData } from '../types';
import VideoBackground from './VideoBackground';
import sound from '../lib/sound';
import { mandeFilm } from '../lib/films/mande';
import { scrollToSection } from '../lib/scrollNav';
import {
  euAiActExplainerPosterUrl,
  euAiActExplainerVideoUrl,
} from '../lib/euAiActExplainer';

export default function WhoSection() {
  const [activePillar, setActivePillar] = useState<SectionTheme>('none');
  const [hoveredPillar, setHoveredPillar] = useState<SectionTheme>('none');

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

  const handleSeeWork = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    scrollToSection(2);
  };

  const pillars: PillarData[] = [
    {
      id: 'cyber',
      title: 'Cyber Security',
      tagline: 'Security audits and hardening.',
      accentClass: 'text-cyber',
      glowClass: 'glow-cyber border-cyber bg-[#00FF88]/[0.02]',
      description: 'Offensive security, smart-contract auditing, and cloud hardening for enterprise and decentralized systems.',
      headlineStat: { label: 'Pentests completed', value: '140+' },
    },
    {
      id: 'film',
      title: 'AI Cinema',
      tagline: 'AI shorts, loops, and sound.',
      accentClass: 'text-film',
      glowClass: 'glow-film border-film bg-[#FF6B35]/[0.02]',
      description: 'Text-to-video for shorts, loops, and layered sound.',
      headlineStat: { label: 'Generated scenes', value: '18k+' },
    },
    {
      id: 'dev',
      title: 'Web Development',
      tagline: 'React apps and APIs.',
      accentClass: 'text-dev',
      glowClass: 'glow-dev border-dev bg-[#BD00FF]/[0.02]',
      description: 'React apps, PWAs, and serverless APIs built for performance and clean interfaces.',
      headlineStat: { label: 'Deployments', value: '280+' },
    },
    {
      id: 'culture',
      title: 'Street Culture',
      tagline: 'Brutalist streetwear from Hamburg.',
      accentClass: 'text-culture',
      glowClass: 'glow-culture border-culture bg-[#D4A843]/[0.02]',
      description: 'Technical outerwear with cryptographic prints and rugged 450 GSM cotton construction.',
      headlineStat: { label: 'Worldwide orders', value: '1,400+' },
    },
  ];

  return (
    <section
      id="who-section"
      data-section={hoveredPillar !== 'none' ? hoveredPillar : activePillar}
      className="relative w-full min-h-dvh flex flex-col justify-start py-16 sm:py-20 px-4 sm:px-6 md:px-12 section-canvas border-t border-neutral-200/80 transition-colors duration-700"
    >
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
            <VideoBackground themeFallback="cyber" blendMode="multiply" tone="light" />
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
              blendMode="multiply"
              tone="light"
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
            <VideoBackground themeFallback="dev" blendMode="multiply" tone="light" />
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
            <VideoBackground themeFallback="culture" blendMode="multiply" tone="light" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-cyber font-mono text-[9px] tracking-[0.3em] uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>Core disciplines</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-neutral-900 uppercase leading-none">
              Who is <span className="text-neutral-500">Maurice Holda</span>
            </h2>
          </div>
          <p className="max-w-sm type-manifesto text-sm text-neutral-800 leading-relaxed md:text-right">
            Agents, film, web, and security. One person in Hamburg.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {pillars.map((pillar) => {
            const isActive = activePillar === pillar.id;
            const isAnyActive = activePillar !== 'none';
            const isDimmed = isAnyActive && !isActive;

            return (
              <motion.div
                key={pillar.id}
                onMouseLeave={() => setHoveredPillar('none')}
                onMouseEnter={() => setHoveredPillar(pillar.id)}
                onClick={() => handlePillarClick(pillar.id)}
                className={`text-left select-none relative p-6 sm:p-8 border rounded-xl overflow-hidden cursor-pointer transition-ui border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm ${
                  isDimmed ? 'opacity-40' : ''
                }`}
              >
                <div className={`mb-5 ${pillar.accentClass}`}>
                  {pillar.id === 'cyber' && <Shield className="w-6 h-6" />}
                  {pillar.id === 'film' && <Film className="w-6 h-6" />}
                  {pillar.id === 'dev' && <Code className="w-6 h-6" />}
                  {pillar.id === 'culture' && <Shirt className="w-6 h-6" />}
                </div>

                <h3 className="font-display font-extrabold text-xl tracking-tight text-neutral-900 mb-2">
                  {pillar.title}
                </h3>
                <p className="type-manifesto text-sm text-neutral-800 leading-relaxed">
                  {pillar.tagline}
                </p>

                <AnimatePresence initial={false}>
                  {isActive ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 mt-6 border-t border-neutral-200 flex flex-col gap-5">
                        <p className="text-sm text-neutral-700 leading-relaxed type-manifesto">
                          {pillar.description}
                        </p>

                        <div className="flex justify-between items-center type-manifesto text-sm">
                          <span className="text-neutral-500">{pillar.headlineStat.label}</span>
                          <span className={`font-semibold ${pillar.accentClass}`}>
                            {pillar.headlineStat.value}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={handleSeeWork}
                          className="inline-flex items-center gap-2 self-start min-h-[44px] text-sm text-neutral-700 hover:text-neutral-900 transition-colors group/link"
                        >
                          See work
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="pt-10 border-t border-neutral-200 text-left">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="flex flex-col gap-3 max-w-xl">
              <div className="flex items-center gap-2 text-cyber font-mono text-[9px] tracking-[0.3em] uppercase">
                <Scale className="w-3.5 h-3.5" />
                <span>EU AI Act</span>
              </div>
              <h3 className="font-display font-black text-2xl md:text-3xl tracking-tight text-neutral-900 uppercase leading-none">
                Explainer <span className="text-neutral-500">video</span>
              </h3>
              <p className="type-manifesto text-sm text-neutral-700 leading-relaxed max-w-md">
                Maurice walks through what the EU AI Act means for builders, operators, and teams shipping AI in Europe: risk tiers, documentation, and what to fix before launch.
              </p>
            </div>
          </div>

          <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 shadow-sm">
            <video
              className="w-full h-full object-cover"
              controls
              playsInline
              preload="metadata"
              poster={euAiActExplainerPosterUrl}
              onPlay={() => sound.pauseForContent()}
              onPause={() => sound.resumeFromContent()}
              onEnded={() => sound.resumeFromContent()}
            >
              <source src={euAiActExplainerVideoUrl} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
