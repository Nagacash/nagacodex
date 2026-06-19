import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Shield, Film, Shirt, Github, Instagram, Linkedin, ArrowUpRight, CheckCircle2, Code } from 'lucide-react';
import SoundToggle from './SoundToggle';
import sound from '../lib/sound';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  // Magnetic button displacement offsets
  const [b1Offset, setB1Offset] = useState({ x: 0, y: 0 });
  const [b2Offset, setB2Offset] = useState({ x: 0, y: 0 });
  const [b3Offset, setB3Offset] = useState({ x: 0, y: 0 });
  const [b4Offset, setB4Offset] = useState({ x: 0, y: 0 });

  const handleMagneticMove = (btnIndex: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // find hover offset relative to center of button
    const cx = e.clientX - (rect.left + rect.width / 2);
    const cy = e.clientY - (rect.top + rect.height / 2);
    
    // Magnetic pull ratio (0.35x intensity)
    const pullX = cx * 0.35;
    const pullY = cy * 0.35;

    if (btnIndex === 1) setB1Offset({ x: pullX, y: pullY });
    if (btnIndex === 2) setB2Offset({ x: pullX, y: pullY });
    if (btnIndex === 3) setB3Offset({ x: pullX, y: pullY });
    if (btnIndex === 4) setB4Offset({ x: pullX, y: pullY });
  };

  const handleMagneticLeave = (btnIndex: number) => {
    if (btnIndex === 1) setB1Offset({ x: 0, y: 0 });
    if (btnIndex === 2) setB2Offset({ x: 0, y: 0 });
    if (btnIndex === 3) setB3Offset({ x: 0, y: 0 });
    if (btnIndex === 4) setB4Offset({ x: 0, y: 0 });
  };

  const handleEmailCopy = () => {
    navigator.clipboard.writeText('maurice@nagacodex.cloud');
    setCopied(true);
    sound.playBeep();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="contact-section"
      data-section="cyber"
      className="relative w-full bg-transparent border-t border-neutral-900 pt-24 pb-12 px-6 md:px-12 text-left"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-16">
        
        {/* Contact Layout Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex flex-col max-w-lg">
            <span className="font-mono text-[9px] text-cyber tracking-[0.3em] uppercase mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse" />
              <span>TERMINAL_ESTABLISHMENT_COMM</span>
            </span>
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-tight text-white uppercase leading-none mb-4">
              SECURE <span className="text-neutral-500">THE CONNECTION</span>
            </h2>
            <p className="text-xs text-neutral-400 font-mono tracking-wide leading-relaxed uppercase">
              RESERVED FOR SYSTEM HARDENING, PROCEDURAL CINEMATOGRAPHY PIXEL COMMISSIONS, AND HIGH-CONSTRUCT TECHNICAL DISTRIBUTION CODES.
            </p>
          </div>

          {/* Core Interactive Copy Banner */}
          <div className="flex flex-col font-mono text-sm p-6 rounded-xl w-full md:w-auto min-w-[300px] glass border-neutral-800/40 hover:border-neutral-700/60 transition-colors duration-300">
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest mb-2">DIRECT FEED CHANNEL</span>
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-white tracking-wide">maurice@nagacodex.cloud</span>
              <button
                onClick={handleEmailCopy}
                className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[9px] text-cyber rounded-sm font-bold uppercase tracking-wider transition-colors hover:border-neutral-700 active:scale-95 cursor-pointer"
              >
                {copied ? 'CON_COPIED' : 'COPY_ADDR'}
              </button>
            </div>
            {copied && (
              <span className="text-[8px] text-neutral-400 flex items-center gap-1 mt-2 tracking-widest font-sans">
                <CheckCircle2 className="w-3 h-3 text-cyber inline" /> COP_ADDRESS_LINKED_TO_CLIPBOARD
              </span>
            )}
          </div>
        </div>

        {/* 2. Magnetic CTA Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-neutral-900/60">
          
          {/* CTA 1: Cyber */}
          <motion.a
            href="mailto:maurice@nagacodex.cloud?subject=Naga%20Codex%20-%20Cybersecurity%20Auditing"
            onClick={() => sound.playClick()}
            onMouseMove={(e) => handleMagneticMove(1, e)}
            onMouseLeave={() => handleMagneticLeave(1)}
            animate={{ x: b1Offset.x, y: b1Offset.y }}
            className="group relative flex items-center justify-between p-7 rounded-xl glass border-neutral-800/40 hover:border-cyber/50 hover:shadow-[0_0_24px_rgba(0,255,136,0.08)] cursor-pointer transition-ui overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 relative z-10 text-left">
              <Shield className="w-5 h-5 text-cyber mb-2" />
              <span className="font-display font-extrabold text-white text-lg tracking-wide uppercase">INITIATE AUDIT</span>
              <span className="font-mono text-[8.5px] text-neutral-500 tracking-wider">SECURE SENSITIVE ECOSYSTEMS</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-neutral-600 group-hover:text-cyber group-hover:translate-x-1 group-hover:-translate-y-1 transition-ui relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>

          {/* CTA 2: Film */}
          <motion.a
            href="mailto:maurice@nagacodex.cloud?subject=Naga%20Codex%20-%20AI%20Cinema%20Commission"
            onClick={() => sound.playClick()}
            onMouseMove={(e) => handleMagneticMove(2, e)}
            onMouseLeave={() => handleMagneticLeave(2)}
            animate={{ x: b2Offset.x, y: b2Offset.y }}
            className="group relative flex items-center justify-between p-7 rounded-xl glass border-neutral-800/40 hover:border-film/50 hover:shadow-[0_0_24px_rgba(255,107,53,0.08)] cursor-pointer transition-ui overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 relative z-10 text-left">
              <Film className="w-5 h-5 text-film mb-2" />
              <span className="font-display font-extrabold text-white text-lg tracking-wide uppercase">COMMISSION DIRECT</span>
              <span className="font-mono text-[8.5px] text-neutral-500 tracking-wider">PROCEDURAL CINEMATIC RENDERS</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-neutral-600 group-hover:text-film group-hover:translate-x-1 group-hover:-translate-y-1 transition-ui relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-film/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>

          {/* CTA 4: Web Dev */}
          <motion.a
            href="mailto:maurice@nagacodex.cloud?subject=Naga%20Codex%20-%20Web%20Development%20Project"
            onClick={() => sound.playClick()}
            onMouseMove={(e) => handleMagneticMove(4, e)}
            onMouseLeave={() => handleMagneticLeave(4)}
            animate={{ x: b4Offset.x, y: b4Offset.y }}
            className="group relative flex items-center justify-between p-7 rounded-xl glass border-neutral-800/40 hover:border-dev/50 hover:shadow-[0_0_24px_rgba(189,0,255,0.08)] cursor-pointer transition-ui overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 relative z-10 text-left">
              <Code className="w-5 h-5 text-dev mb-2" />
              <span className="font-display font-extrabold text-white text-lg tracking-wide uppercase">DEVELOP APP</span>
              <span className="font-mono text-[8.5px] text-neutral-500 tracking-wider">BESPOKE REACT ARCHITECTURES</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-neutral-600 group-hover:text-dev group-hover:translate-x-1 group-hover:-translate-y-1 transition-ui relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-dev/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>

          {/* CTA 3: Wear */}
          <motion.a
            href="https://nagacodex.cloud/shop"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            onMouseMove={(e) => handleMagneticMove(3, e)}
            onMouseLeave={() => handleMagneticLeave(3)}
            animate={{ x: b3Offset.x, y: b3Offset.y }}
            className="group relative flex items-center justify-between p-7 rounded-xl glass border-neutral-800/40 hover:border-culture/50 hover:shadow-[0_0_24px_rgba(212,168,67,0.08)] cursor-pointer transition-ui overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 relative z-10 text-left">
              <Shirt className="w-5 h-5 text-culture mb-2" />
              <span className="font-display font-extrabold text-white text-lg tracking-wide uppercase">ACQUIRE WEAR</span>
              <span className="font-mono text-[8.5px] text-neutral-500 tracking-wider">BRUTALIST TECHNICAL APPAREL</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-neutral-600 group-hover:text-culture group-hover:translate-x-1 group-hover:-translate-y-1 transition-ui relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-culture/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>
        </div>

        {/* 3. Footer Bar with Socials and Audiomodule toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-neutral-950 mt-12 font-mono text-[9px] text-neutral-500">
          
          <div className="flex flex-col items-center md:items-start gap-1">
            <span>MAURICE HOLDA © 2026 // ALL CORES HARDENED</span>
            <span>HNGR_GER_LAT_53.55</span>
          </div>

          {/* Custom vector SVG Socials */}
          <div className="flex items-center gap-5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-neutral-950 border border-neutral-900 hover:border-cyber rounded-full text-neutral-400 hover:text-white transition-ui hover:scale-105"
              aria-label="Maurice Holda's GitHub Secure Audits Profile"
              onClick={() => sound.playClick()}
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-neutral-950 border border-neutral-900 hover:border-film rounded-full text-neutral-400 hover:text-white transition-ui hover:scale-105"
              aria-label="Maurice Holda's Film/Creative Instagram Profile"
              onClick={() => sound.playClick()}
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-neutral-950 border border-neutral-900 hover:border-culture rounded-full text-neutral-400 hover:text-white transition-ui hover:scale-105"
              aria-label="Maurice Holda's Corporate Consulting LinkedIn Profile"
              onClick={() => sound.playClick()}
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          {/* Self-contained widget controller inside the footer bar */}
          <div className="flex items-center">
            <SoundToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
