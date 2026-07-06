import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Film, Shirt, ArrowRight, Award, Code, ZoomIn } from 'lucide-react';
import { SectionTheme, PillarData } from '../types';
import VideoBackground from './VideoBackground';
import CertificationLightbox from './CertificationLightbox';
import sound from '../lib/sound';
import { mandeFilm } from '../lib/films';
import { certifications } from '../lib/certifications';
import type { Certification } from '../lib/certifications';
import { scrollToSection } from '../lib/scrollNav';

export default function WhoSection() {
  const [activePillar, setActivePillar] = useState<SectionTheme>('none');
  const [hoveredPillar, setHoveredPillar] = useState<SectionTheme>('none');
  const [activeCertification, setActiveCertification] = useState<Certification | null>(null);

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

  const handleOpenCertification = (cert: Certification) => {
    sound.playClick();
    setActiveCertification(cert);
  };

  const pillars: PillarData[] = [
    {
      id: 'cyber',
      title: 'Cyber Security',
      tagline: 'Enterprise protection and audits.',
      accentClass: 'text-cyber',
      glowClass: 'glow-cyber border-cyber bg-[#00FF88]/[0.02]',
      description: 'Offensive security, smart-contract auditing, and cloud hardening for enterprise and decentralized systems.',
      headlineStat: { label: 'Pentests completed', value: '140+' },
    },
    {
      id: 'film',
      title: 'AI Cinema',
      tagline: 'Generative narrative and sound.',
      accentClass: 'text-film',
      glowClass: 'glow-film border-film bg-[#FF6B35]/[0.02]',
      description: 'Text-to-video pipelines for immersive shorts, visual loops, and layered soundscapes.',
      headlineStat: { label: 'Generated scenes', value: '18k+' },
    },
    {
      id: 'dev',
      title: 'Web Development',
      tagline: 'Fast bespoke digital products.',
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
      className="relative w-full min-h-dvh flex flex-col justify-center py-16 sm:py-20 px-4 sm:px-6 md:px-12 section-canvas border-t border-neutral-200/80 transition-colors duration-700"
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
            Four disciplines. One operator.
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="flex flex-col gap-3 max-w-xl">
              <div className="flex items-center gap-2 text-culture font-mono text-[9px] tracking-[0.3em] uppercase">
                <Award className="w-3.5 h-3.5 text-culture" />
                <span>Certifications</span>
              </div>
              <h3 className="font-display font-black text-2xl md:text-3xl tracking-tight text-neutral-900 uppercase leading-none">
                Verified <span className="text-neutral-500">credentials</span>
              </h3>
              <p className="type-manifesto text-sm text-neutral-700 leading-relaxed max-w-md">
                AZAV-certified programs from Cert-IT, Masterschool, and DCI — documented training, not self-taught claims.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {certifications.map((cert) => (
              <button
                key={cert.id}
                type="button"
                onClick={() => handleOpenCertification(cert)}
                className={`group text-left flex flex-col rounded-xl bg-white border ${cert.borderColor} shadow-xs hover:shadow-md hover:border-neutral-300 transition-ui overflow-hidden cursor-pointer`}
              >
                <div className="relative aspect-[3/4] bg-neutral-100 border-b border-neutral-200 overflow-hidden">
                  <img
                    src={cert.image}
                    alt={`${cert.title} certificate — ${cert.issuer}`}
                    className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider bg-white text-neutral-900 px-3 py-2 rounded-full border border-neutral-200 shadow-sm">
                      <ZoomIn className="w-3.5 h-3.5" />
                      View certificate
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-2">
                  <span className="text-[10px] text-neutral-500 type-manifesto">{cert.issuer}</span>
                  <h4 className={`font-display font-extrabold text-lg text-neutral-900 tracking-tight ${cert.accentClass}`}>
                    {cert.title}
                  </h4>
                  <span className="font-mono text-xs text-neutral-500">{cert.completed}</span>
                  <p className="type-manifesto text-xs text-neutral-600 leading-relaxed pt-1">{cert.detail}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <CertificationLightbox
        certification={activeCertification}
        onClose={() => setActiveCertification(null)}
      />
    </section>
  );
}
