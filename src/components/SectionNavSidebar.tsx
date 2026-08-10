import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { Github } from 'lucide-react';
import { getSectionAccentColor, sectionNavLabels } from '../lib/sections';

interface SectionNavSidebarProps {
  activeIndex: number;
  sectionCount: number;
  onDotClick: (index: number) => void;
  onManualOpen: () => void;
}

function SectionNavSidebar({
  activeIndex,
  sectionCount,
  onDotClick,
  onManualOpen,
}: SectionNavSidebarProps) {
  const sidebar = (
    <nav
      aria-label="Section navigation"
      className="section-nav-sidebar hidden lg:flex fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-fixed flex-col gap-2 md:gap-3 items-center p-2 md:p-3 bg-[#0F1929]/96 backdrop-blur-md rounded-xl border border-white/10 shadow-lg"
    >
      {Array.from({ length: sectionCount }, (_, idx) => {
        const isActive = activeIndex === idx;
        const dotColor = getSectionAccentColor(idx);

        return (
          <button
            key={idx}
            type="button"
            onClick={() => onDotClick(idx)}
            className="group relative flex items-center justify-center w-8 h-8 cursor-pointer active:scale-90 transition-transform duration-150"
            title={`Navigate to Section ${idx + 1}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <span className="section-nav-tooltip hidden md:block absolute right-10 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-[opacity,transform] duration-150 bg-[#162035] border border-white/15 text-[8px] font-mono text-[#E8EDF5] tracking-widest px-2.5 py-1 rounded-md whitespace-nowrap uppercase shadow-md">
              {sectionNavLabels[idx]}
            </span>

            <span
              className={`absolute inset-0 rounded-lg border transition-[opacity,transform] duration-150 ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-40 group-hover:scale-95'
              }`}
              style={{ borderColor: isActive ? dotColor : 'rgba(255,255,255,0.3)' }}
            />

            <span
              className={`w-2 h-2 rounded-sm transition-[transform,background-color] duration-150 ${
                isActive ? 'scale-125' : 'bg-[#2A3D5A] scale-100 group-hover:bg-[#8B9BB4]'
              }`}
              style={{ backgroundColor: isActive ? dotColor : undefined }}
            />
          </button>
        );
      })}

      <div className="h-px w-4 bg-white/10 my-1" aria-hidden />

      <button
        type="button"
        onClick={onManualOpen}
        className="group relative flex items-center justify-center w-9 h-9 rounded-lg bg-[#162035] border border-white/10 hover:border-cyber/50 text-[#8B9BB4] hover:text-cyber cursor-pointer active:scale-95 transition-[border-color,color,transform] duration-150"
        title="Open source repos"
      >
        <span className="section-nav-tooltip hidden md:block absolute right-10 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-[opacity,transform] duration-150 bg-[#162035] border border-white/15 text-[8px] font-mono text-[#E8EDF5] tracking-widest px-2.5 py-1 rounded-md whitespace-nowrap uppercase shadow-md">
          OPEN SOURCE
        </span>
        <Github className="w-4 h-4" />
      </button>
    </nav>
  );

  if (typeof document === 'undefined') return sidebar;
  return createPortal(sidebar, document.body);
}

export default memo(SectionNavSidebar);
