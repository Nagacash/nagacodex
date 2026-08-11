import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Tag } from 'lucide-react';
import sound from '../lib/sound';
import { nagaRepos, NagaRepo } from '../data/openSourceSkillsRegistry';

interface SkillsManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SkillsManualModal({ isOpen, onClose }: SkillsManualModalProps) {
  const [activeId, setActiveId] = useState<string>(nagaRepos[0].id);

  const active: NagaRepo = nagaRepos.find((r) => r.id === activeId) ?? nagaRepos[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-modal-peak flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-md overflow-hidden font-mono">

          <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 140 }}
            className="relative w-full max-w-5xl h-[85vh] md:h-[80vh] bg-[#070707] border border-neutral-800 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_80px_rgba(0,0,0,0.95)] z-20 pointer-events-auto"
          >
            {/* Top accent bar */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#D4A843] via-[#00FF88] to-[#FF6B35]" />

            {/* LEFT PANEL — repo list */}
            <div className="w-full md:w-64 md:h-full border-b md:border-b-0 md:border-r border-neutral-800 bg-[#0a0a0a]/80 p-5 flex flex-col shrink-0 text-left min-h-0 max-h-[44vh] md:max-h-none">
              <div className="flex flex-col gap-2 shrink-0 pb-4 border-b border-neutral-900/60">
                <span className="text-[8px] text-[#00FF88] tracking-[0.25em] uppercase">BUILT FROM SCRATCH // MIT</span>
                <h2 className="font-display font-black text-sm tracking-wide text-white uppercase flex items-center gap-2">
                  <Github className="w-4 h-4 text-neutral-400" />
                  <span>NAGA CODEX SKILLS</span>
                </h2>
                <p className="font-sans text-[8.5px] text-neutral-400 leading-normal">
                  Original tools written by <span className="text-[#D4A843] font-semibold">Maurice Holda</span> — not wrappers, not clones. Built from real production work at Naga Codex and released free.
                </p>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto py-4 pr-1">
                <div className="flex flex-col gap-2">
                  {nagaRepos.map((repo) => {
                    const isSelected = activeId === repo.id;
                    return (
                      <button
                        key={repo.id}
                        onClick={() => {
                          sound.playClick();
                          setActiveId(repo.id);
                        }}
                        className={`w-full flex flex-col gap-2 p-3 rounded-lg border text-left cursor-pointer transition-ui shrink-0 ${
                          isSelected
                            ? 'bg-neutral-900/90 shadow-md'
                            : 'bg-transparent border-transparent hover:border-neutral-800 hover:bg-neutral-900/40'
                        }`}
                        style={{ borderColor: isSelected ? `${repo.accent}55` : undefined }}
                      >
                        {/* Thumbnail */}
                        <div className="w-full aspect-video rounded overflow-hidden bg-neutral-900">
                          <img
                            src={repo.image}
                            alt={repo.name}
                            className="w-full h-full object-cover opacity-90"
                          />
                        </div>
                        {/* Name + license + link */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-[9px] font-bold tracking-wider uppercase truncate"
                            style={{ color: isSelected ? repo.accent : '#a3a3a3' }}
                          >
                            {repo.name}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[7px] text-neutral-600 border border-neutral-800 px-1.5 py-0.5 rounded">
                              {repo.license}
                            </span>
                            <a
                              href={repo.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => { e.stopPropagation(); sound.playClick(); }}
                              className="text-neutral-500 hover:text-white transition-colors p-0.5"
                              title={`Open ${repo.name} on GitHub`}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-900 shrink-0">
                <a
                  href="https://github.com/Nagacash"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[8px] text-neutral-400 hover:text-white transition-ui"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>ALL NAGA CODEX REPOS ON GITHUB</span>
                </a>
              </div>
            </div>

            {/* RIGHT PANEL — active repo detail */}
            <div className="flex-1 flex flex-col overflow-hidden bg-black/40 text-left min-h-0">

              {/* Header */}
              <div className="p-4 border-b border-neutral-800 bg-[#090909]/90 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: active.accent }}
                  />
                  <a
                    href={active.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playClick()}
                    className="text-[10px] text-white font-bold tracking-widest uppercase truncate hover:underline underline-offset-2 cursor-pointer"
                  >
                    {active.name}
                  </a>
                  <span className="text-[8px] text-neutral-500 hidden sm:block shrink-0">
                    Updated {active.updatedLabel}
                  </span>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="p-1.5 border border-neutral-800 hover:border-neutral-600 bg-neutral-950 text-neutral-400 hover:text-white rounded-md transition-ui active:scale-90 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto min-h-0">

                {/* Hero image */}
                <div className="w-full aspect-video bg-neutral-900 overflow-hidden">
                  <img
                    src={active.image}
                    alt={active.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 md:p-8 flex flex-col gap-6">

                  {/* Provenance banner */}
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-[#D4A843]/20 bg-[#D4A843]/05">
                    <span className="text-[#D4A843] text-lg mt-0.5">✦</span>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[9px] text-[#D4A843] tracking-[0.2em] uppercase font-bold">Original work — Naga Codex</span>
                      <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
                        Written from scratch by <span className="text-white font-semibold">Maurice Holda</span> based on real production workflows. Not a fork, not a template — built to solve actual problems in AI filmmaking, agent development, and creative tooling.
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-sm text-neutral-300 leading-relaxed max-w-2xl">
                    {active.description}
                  </p>

                  {/* CTA — placed here so it's visible without scrolling */}
                  <a
                    href={active.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playClick()}
                    className="inline-flex items-center gap-2.5 self-start px-5 py-3 rounded-lg font-mono text-[10px] font-bold tracking-wider uppercase text-[#050C17] transition-ui active:scale-95 hover:opacity-90"
                    style={{ backgroundColor: active.accent }}
                  >
                    <Github className="w-4 h-4" />
                    <span>View on GitHub →</span>
                  </a>

                  {/* Tags */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[8px] text-neutral-500 uppercase tracking-widest">
                      <Tag className="w-3 h-3" />
                      <span>Topics</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {active.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border"
                          style={{
                            color: active.accent,
                            borderColor: `${active.accent}44`,
                            backgroundColor: `${active.accent}0d`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-4 text-[8.5px] text-neutral-500 font-mono uppercase tracking-widest border-t border-neutral-800 pt-4">
                    <span>License: <span className="text-[#00FF88]">{active.license} — free to use</span></span>
                    <span>Updated: <span className="text-neutral-300">{active.updatedLabel}</span></span>
                    <span>Author: <span className="text-[#D4A843]">Maurice Holda / Naga Codex</span></span>
                    <span>Origin: <span className="text-neutral-300">Hamburg, DE</span></span>
                  </div>


                </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
