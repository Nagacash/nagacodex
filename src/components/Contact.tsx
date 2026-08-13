import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Film, Shirt, Github, Instagram, Linkedin, ArrowUpRight, CheckCircle2, Code, ChevronUp } from 'lucide-react';
import SoundToggle from './SoundToggle';
import sound from '../lib/sound';
import { scrollToSection } from '../lib/scrollNav';
import { apparelUrl, linkedInUrl, nagaApparelInstagramUrl } from '../lib/seo';

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
    navigator.clipboard.writeText('chosenfewrecords@hotmail.de');
    setCopied(true);
    sound.playBeep();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="contact-section"
      data-section="cyber"
      className="relative w-full section-canvas border-t border-neutral-200/80 pt-20 sm:pt-24 pb-10 sm:pb-12 px-4 sm:px-6 md:px-12 text-left"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-16">
        
        {/* Contact Layout Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex flex-col max-w-lg">
            <span className="font-mono text-[9px] text-cyber tracking-[0.3em] uppercase mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse" />
              <span>GET IN TOUCH</span>
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-6xl tracking-tight text-neutral-900 uppercase leading-none mb-4">
              LET'S <span className="text-neutral-500">WORK TOGETHER</span>
            </h2>
            <p className="text-xs text-neutral-600 type-manifesto-tight leading-relaxed">
              Security audits, AI films, web builds, and streetwear. Pick what you need — I'll handle the rest.
            </p>
            <p className="mt-3 text-sm text-neutral-800 type-manifesto leading-relaxed max-w-lg">
              Maurice Holda is an AI developer, filmmaker, and security consultant based in Hamburg. Naga Codex builds alongside{' '}
              <a
                href="https://www.naga-films.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-film hover:underline underline-offset-2"
              >
                Naga Films Studio
              </a>
              {' '}(self-hostable AI production suite),{' '}
              <a
                href={apparelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-culture hover:underline underline-offset-2"
              >
                Naga Apparel
              </a>
              {' '}(technical streetwear), and{' '}
              <a
                href="https://chosenfewrecrecords.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-film hover:underline underline-offset-2"
              >
                Chosen Few Records
              </a>
              {' '}(Hamburg music label).
            </p>
          </div>

          {/* Core Interactive Copy Banner */}
          <div className="flex flex-col font-mono text-sm p-5 sm:p-6 rounded-xl w-full md:w-auto md:min-w-[300px] min-w-0 glass border-neutral-200/40 hover:border-neutral-700/60 transition-colors duration-300">
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest mb-2">EMAIL ME DIRECTLY</span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <span className="font-bold text-neutral-900 tracking-wide break-all text-sm sm:text-base">chosenfewrecords@hotmail.de</span>
              <button
                onClick={handleEmailCopy}
                className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-200 text-[9px] text-cyber rounded-sm font-bold uppercase tracking-wider transition-colors hover:border-neutral-700 active:scale-95 cursor-pointer"
              >
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>
            {copied && (
              <span className="text-[8px] text-neutral-400 flex items-center gap-1 mt-2 tracking-widest type-manifesto">
                <CheckCircle2 className="w-3 h-3 text-cyber inline" /> Email copied to clipboard
              </span>
            )}
          </div>
        </div>

        {/* Book a call — primary CTA */}
        <div className="pt-8 border-t border-white/10">
          <a
            href="https://calendly.com/sonic13-ch"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-xl border border-cyber/30 bg-cyber/5 hover:bg-cyber/10 hover:border-cyber/60 transition-ui cursor-pointer"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber animate-pulse shadow-[0_0_8px_#00FF88]" />
                <span className="font-mono text-[9px] text-cyber tracking-[0.3em] uppercase font-bold">Available now</span>
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#E8EDF5] tracking-tight uppercase leading-none">
                Book a free 20-min call
              </h3>
              <p className="font-mono text-[10px] text-[#8B9BB4] uppercase tracking-wider">
                No pitch deck. No agency overhead. Just a direct conversation.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-[9px] text-[#8B9BB4] uppercase tracking-wider hidden sm:block">calendly.com/sonic13-ch</span>
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyber text-black font-display font-extrabold text-sm uppercase tracking-widest group-hover:bg-[#00DD77] transition-colors active:scale-95">
                Book now
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
          </a>
        </div>

        {/* 2. Magnetic CTA Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/10">
          
          {/* CTA 1: Cyber */}
          <motion.a
            href="mailto:chosenfewrecords@hotmail.de?subject=Naga%20Codex%20-%20Cybersecurity%20Auditing"
            onClick={() => sound.playClick()}
            onMouseMove={(e) => handleMagneticMove(1, e)}
            onMouseLeave={() => handleMagneticLeave(1)}
            animate={{ x: b1Offset.x, y: b1Offset.y }}
            className="group relative flex items-center justify-between p-7 rounded-xl glass border-neutral-200/40 hover:border-cyber/50 hover:shadow-[0_0_24px_rgba(0,255,136,0.08)] cursor-pointer transition-ui overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 relative z-10 text-left">
              <Shield className="w-5 h-5 text-cyber mb-2" />
              <span className="font-display font-extrabold text-neutral-900 text-lg tracking-wide uppercase">SECURITY AUDIT</span>
              <span className="type-manifesto-tight text-[8.5px] text-neutral-500">Harden your systems</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-neutral-600 group-hover:text-cyber group-hover:translate-x-1 group-hover:-translate-y-1 transition-ui relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>

          {/* CTA 2: Film */}
          <motion.a
            href="mailto:chosenfewrecords@hotmail.de?subject=Naga%20Codex%20-%20AI%20Cinema%20Commission"
            onClick={() => sound.playClick()}
            onMouseMove={(e) => handleMagneticMove(2, e)}
            onMouseLeave={() => handleMagneticLeave(2)}
            animate={{ x: b2Offset.x, y: b2Offset.y }}
            className="group relative flex items-center justify-between p-7 rounded-xl glass border-neutral-200/40 hover:border-film/50 hover:shadow-[0_0_24px_rgba(255,107,53,0.08)] cursor-pointer transition-ui overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 relative z-10 text-left">
              <Film className="w-5 h-5 text-film mb-2" />
              <span className="font-display font-extrabold text-neutral-900 text-lg tracking-wide uppercase">AI CINEMA</span>
              <span className="type-manifesto-tight text-[8.5px] text-neutral-500">Commission a film</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-neutral-600 group-hover:text-film group-hover:translate-x-1 group-hover:-translate-y-1 transition-ui relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-film/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>

          {/* CTA 4: Web Dev */}
          <motion.a
            href="mailto:chosenfewrecords@hotmail.de?subject=Naga%20Codex%20-%20Web%20Development%20Project"
            onClick={() => sound.playClick()}
            onMouseMove={(e) => handleMagneticMove(4, e)}
            onMouseLeave={() => handleMagneticLeave(4)}
            animate={{ x: b4Offset.x, y: b4Offset.y }}
            className="group relative flex items-center justify-between p-7 rounded-xl glass border-neutral-200/40 hover:border-dev/50 hover:shadow-[0_0_24px_rgba(189,0,255,0.08)] cursor-pointer transition-ui overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 relative z-10 text-left">
              <Code className="w-5 h-5 text-dev mb-2" />
              <span className="font-display font-extrabold text-neutral-900 text-lg tracking-wide uppercase">WEB DEVELOPMENT</span>
              <span className="type-manifesto-tight text-[8.5px] text-neutral-500">Build something custom</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-neutral-600 group-hover:text-dev group-hover:translate-x-1 group-hover:-translate-y-1 transition-ui relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-dev/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>

          {/* CTA 3: Wear */}
          <motion.a
            href={apparelUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            onMouseMove={(e) => handleMagneticMove(3, e)}
            onMouseLeave={() => handleMagneticLeave(3)}
            animate={{ x: b3Offset.x, y: b3Offset.y }}
            className="group relative flex items-center justify-between p-7 rounded-xl glass border-neutral-200/40 hover:border-culture/50 hover:shadow-[0_0_24px_rgba(212,168,67,0.08)] cursor-pointer transition-ui overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 relative z-10 text-left">
              <Shirt className="w-5 h-5 text-culture mb-2" />
              <span className="font-display font-extrabold text-neutral-900 text-lg tracking-wide uppercase">SHOP WEAR</span>
              <span className="type-manifesto-tight text-[8.5px] text-neutral-500">Browse the collection</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-neutral-600 group-hover:text-culture group-hover:translate-x-1 group-hover:-translate-y-1 transition-ui relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-culture/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>
        </div>

        {/* Answer-first FAQ for search + AI engines */}
        <section aria-labelledby="faq-heading" className="glass rounded-xl border-neutral-200/40 p-6 sm:p-8 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] text-culture tracking-[0.3em] uppercase">FAQ</span>
            <h2 id="faq-heading" className="font-display font-extrabold text-xl sm:text-2xl text-neutral-900 uppercase tracking-wide">
              Common questions
            </h2>
          </div>
          <div className="flex flex-col gap-3 text-left">
            <details className="group border border-neutral-200 rounded-lg p-4 open:border-neutral-200">
              <summary className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wide cursor-pointer list-none flex justify-between items-center">
                Who is Maurice Holda?
                <span className="font-mono text-[10px] text-neutral-500 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-neutral-800 type-manifesto leading-relaxed">
                Maurice Holda is a Certified AI Manager, Cyber Security Analyst, and Web Developer based in Hamburg.
                He leads Naga Codex across AI strategy, security consulting, generative film, web development, and Naga streetwear.
              </p>
            </details>
            <details className="group border border-neutral-200 rounded-lg p-4 open:border-neutral-200">
              <summary className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wide cursor-pointer list-none flex justify-between items-center">
                What does Naga Codex do?
                <span className="font-mono text-[10px] text-neutral-500 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-neutral-800 type-manifesto leading-relaxed">
                Naga Codex delivers cybersecurity audits, AI management and agent workflows, generative AI cinema,
                custom web applications, and technical apparel through{' '}
                <a href={apparelUrl} target="_blank" rel="noopener noreferrer" className="text-culture hover:underline">
                  Naga Club
                </a>
                .
              </p>
            </details>
            <details className="group border border-neutral-200 rounded-lg p-4 open:border-neutral-200">
              <summary className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wide cursor-pointer list-none flex justify-between items-center">
                How do I get started?
                <span className="font-mono text-[10px] text-neutral-500 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-neutral-800 type-manifesto leading-relaxed">
                Email{' '}
                <a href="mailto:chosenfewrecords@hotmail.de" className="text-cyber hover:underline">
                  chosenfewrecords@hotmail.de
                </a>{' '}
                with your project type — security audit, AI film, web build, or wear collaboration.
              </p>
            </details>
          </div>
        </section>

        {/* 3. Footer Bar with Socials and Audiomodule toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-neutral-300 mt-12 font-mono text-[9px] text-neutral-600 safe-bottom">
          
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left order-2 md:order-none">
            <span>MAURICE HOLDA © 2026 // ALL CORES HARDENED</span>
            <span>HNGR_GER_LAT_53.55</span>
            <time dateTime="2026-08-13" className="text-neutral-500">Updated 13 August 2026</time>
            <div className="flex gap-3 mt-1">
              <a href="/impressum/" className="hover:text-neutral-900 transition-colors">Impressum</a>
              <span>·</span>
              <a href="/datenschutz/" className="hover:text-neutral-900 transition-colors">Datenschutz</a>
            </div>
          </div>

          {/* Custom vector SVG Socials */}
          <div className="flex items-center gap-4 order-1 md:order-none">
            <a
              href="https://github.com/Nagacash"
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target flex items-center justify-center p-3 bg-white border border-neutral-200 hover:border-cyber rounded-lg text-[#8B9BB4] hover:text-[#E8EDF5] active:text-[#E8EDF5] transition-ui"
              aria-label="Maurice Holda's GitHub Secure Audits Profile"
              onClick={() => sound.playClick()}
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={nagaApparelInstagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Naga Apparel (@naga_apparel)"
              className="tap-target flex items-center justify-center p-3 bg-white border border-neutral-200 hover:border-film rounded-lg text-[#8B9BB4] hover:text-[#E8EDF5] active:text-[#E8EDF5] transition-ui"
              aria-label="Naga Apparel on Instagram (@naga_apparel)"
              onClick={() => sound.playClick()}
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Maurice Holda on LinkedIn"
              className="tap-target flex items-center justify-center p-3 bg-white border border-neutral-200 hover:border-culture rounded-lg text-[#8B9BB4] hover:text-[#E8EDF5] active:text-[#E8EDF5] transition-ui"
              aria-label="Maurice Holda on LinkedIn"
              onClick={() => sound.playClick()}
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          {/* Self-contained widget controller inside the footer bar */}
          <div className="flex items-center gap-4 order-3 md:order-none">
            <SoundToggle />
            <button
              onClick={() => {
                sound.playClick();
                scrollToSection(0);
              }}
              className="tap-target flex items-center justify-center p-3 bg-[#162035] border border-white/10 hover:border-cyber/50 rounded-lg text-[#8B9BB4] hover:text-cyber active:text-cyber transition-ui cursor-pointer"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
