import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Copy,
  Check,
  X,
  Palette,
  Code,
  Terminal,
  TerminalSquare,
  ScrollText,
  Globe,
  Sparkles,
  Layers,
  Lightbulb,
  Bug,
  Boxes,
  ScanEye,
  ExternalLink,
} from 'lucide-react';
import sound from '../lib/sound';
import { openSourceSkills } from '../data/openSourceSkillsRegistry';

interface SkillsManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const skillIcons: Record<string, React.ReactNode> = {
  'frontend-design': <Palette className="w-4 h-4" />,
  'react-best-practices': <Code className="w-4 h-4" />,
  'web-design-guidelines': <ScanEye className="w-4 h-4" />,
  'agent-browser': <Globe className="w-4 h-4" />,
  'gsap-scrolltrigger': <ScrollText className="w-4 h-4" />,
  'composition-patterns': <Layers className="w-4 h-4" />,
  polish: <Sparkles className="w-4 h-4" />,
  'webapp-testing': <Terminal className="w-4 h-4" />,
  brainstorming: <Lightbulb className="w-4 h-4" />,
  'systematic-debugging': <Bug className="w-4 h-4" />,
  'skill-creator': <Boxes className="w-4 h-4" />,
};

export default function SkillsManualModal({ isOpen, onClose }: SkillsManualModalProps) {
  const [activeTab, setActiveTab] = useState<string>(openSourceSkills[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedInstallId, setCopiedInstallId] = useState<string | null>(null);

  const activeSkill = useMemo(
    () => openSourceSkills.find((s) => s.id === activeTab) ?? openSourceSkills[0],
    [activeTab],
  );

  const handleCopy = (text: string, id: string, kind: 'md' | 'install') => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    if (kind === 'md') {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setCopiedInstallId(id);
      setTimeout(() => setCopiedInstallId(null), 2000);
    }
  };

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

            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#FF6B35] via-[#00FF88] to-[#3B82F6]" />

            <div className="w-full md:w-64 md:h-full border-b md:border-b-0 md:border-r border-neutral-800 bg-[#0a0a0a]/80 p-5 flex flex-col shrink-0 text-left min-h-0 max-h-[42vh] md:max-h-none">
              <div className="flex flex-col gap-3 shrink-0 pb-3 border-b border-neutral-900/60">
                <span className="text-[8px] text-cyber tracking-[0.25em] uppercase">OPEN SOURCE // SKILLS.SH</span>
                <h2 className="font-display font-black text-sm tracking-wide text-white uppercase flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-culture" />
                  <span>NAGA_SKILLS_DB</span>
                </h2>
                <p className="font-sans text-[8.5px] text-neutral-500 leading-normal">
                  Popular agent skills from the public registry. Copy SKILL.md or install with one command.
                </p>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto py-3 pr-1">
                <div className="flex flex-col gap-1.5">
                  {openSourceSkills.map((sk) => {
                    const isSelected = activeTab === sk.id;
                    return (
                      <button
                        key={sk.id}
                        onClick={() => {
                          sound.playClick();
                          setActiveTab(sk.id);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left cursor-pointer transition-ui group shrink-0 ${
                          isSelected
                            ? 'bg-neutral-900/90 text-white shadow-md'
                            : 'bg-transparent text-neutral-400 border-transparent hover:text-white hover:border-neutral-900'
                        }`}
                        style={{ borderColor: isSelected ? sk.accent : undefined }}
                      >
                        <span
                          className="p-1 rounded bg-black/40 border border-neutral-900 transition-colors"
                          style={{ color: isSelected ? sk.accent : 'inherit' }}
                        >
                          {skillIcons[sk.id]}
                        </span>
                        <div className="flex flex-col leading-tight overflow-hidden min-w-0">
                          <span className="text-[9px] font-bold tracking-wider truncate uppercase">{sk.name.replace(/_/g, ' ')}</span>
                          <span className="text-[7.5px] text-neutral-500 font-light uppercase truncate">{sk.category.split(' // ')[1]}</span>
                        </div>
                        <span className="ml-auto text-[7px] text-neutral-600 shrink-0">{sk.installs}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t border-neutral-900 text-[8.5px] text-neutral-500 shrink-0">
                <a
                  href="https://skills.sh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[8.2px] text-culture hover:text-white transition-ui"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>BROWSE FULL REGISTRY AT SKILLS.SH</span>
                </a>
                <p className="font-sans text-[9px] text-neutral-400 leading-normal">
                  Paste into <code className="text-neutral-300">.cursor/skills/</code>, Claude Code, or run the install command globally.
                </p>
              </div>

            </div>

            <div className="flex-1 flex flex-col overflow-hidden bg-black/40 text-left min-h-0">

              <div className="p-4 border-b border-neutral-800 bg-[#090909]/90 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-[9px]">
                  <div className="flex flex-col">
                    <span className="text-[7px] text-neutral-500 uppercase tracking-widest font-bold">SOURCE REPOSITORY</span>
                    <span className="text-white font-mono mt-0.5">{activeSkill.source}</span>
                  </div>
                  <div className="h-6 w-[1.5px] bg-neutral-900 hidden sm:block" />
                  <div className="hidden sm:flex flex-col">
                    <span className="text-[7px] text-neutral-500 uppercase tracking-widest font-bold">REGISTRY INSTALLS</span>
                    <span className="font-mono mt-0.5" style={{ color: activeSkill.accent }}>{activeSkill.installs}</span>
                  </div>
                  <div className="h-6 w-[1.5px] bg-neutral-900 hidden md:block" />
                  <div className="hidden md:flex flex-col">
                    <span className="text-[7px] text-neutral-500 uppercase tracking-widest font-bold">LICENSE</span>
                    <span className="text-white font-mono mt-0.5">{activeSkill.license}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <button
                    onClick={() => handleCopy(activeSkill.installCmd, activeSkill.id, 'install')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold tracking-wider text-neutral-200 rounded border border-neutral-700 hover:border-neutral-500 bg-neutral-950 hover:bg-neutral-900 transition-ui active:scale-95 cursor-pointer uppercase"
                  >
                    {copiedInstallId === activeSkill.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>COPIED_INSTALL</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY_INSTALL_CMD</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleCopy(activeSkill.markdown, activeSkill.id, 'md')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold tracking-wider text-black rounded bg-white hover:bg-neutral-200 transition-ui active:scale-95 cursor-pointer uppercase"
                  >
                    {copiedId === activeSkill.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>COPIED_TO_CLIPBOARD</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY_SKILL_MD</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onClose();
                    }}
                    className="p-1.5 border border-neutral-800 hover:border-neutral-600 bg-neutral-950 text-neutral-400 hover:text-white rounded-md transition-ui active:scale-90 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 font-mono select-text selection:bg-neutral-800 text-xs text-neutral-200 bg-[#030303] min-h-0">
                <div className="mb-6 pb-2 border-b border-neutral-900 flex flex-wrap justify-between items-center gap-2 text-[9px] text-neutral-500">
                  <span className="flex items-center gap-1.5 font-bold">
                    <TerminalSquare className="w-3.5 h-3.5" style={{ color: activeSkill.accent }} />
                    <span>SKILL.md — {activeSkill.slug}</span>
                  </span>
                  <a
                    href={activeSkill.skillsShUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white transition-ui"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{activeSkill.skillsShUrl.replace('https://', '')}</span>
                  </a>
                </div>

                <pre className="whitespace-pre-wrap font-mono text-[10.5px] md:text-[11.5px] leading-relaxed text-neutral-300 font-light">
                  {activeSkill.markdown}
                </pre>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
