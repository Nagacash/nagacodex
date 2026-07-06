import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen } from 'lucide-react';
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
      className="section-nav-sidebar hidden lg:flex fixed right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-fixed flex-col gap-2 sm:gap-3 md:gap-4 items-center p-2 sm:p-2.5 md:p-3 bg-white/[0.97] rounded-full border border-neutral-200 shadow-sm"
    >
      {Array.from({ length: sectionCount }, (_, idx) => {
        const isActive = activeIndex === idx;
        const dotColor = getSectionAccentColor(idx);

        return (
          <button
            key={idx}
            type="button"
            onClick={() => onDotClick(idx)}
            className="group relative flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 cursor-pointer active:scale-90 transition-transform duration-150"
            title={`Navigate to Section ${idx + 1}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <span className="section-nav-tooltip hidden md:block absolute right-10 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-[opacity,transform] duration-150 bg-white border border-neutral-200 text-[8.5px] font-mono text-neutral-800 tracking-widest px-2.5 py-1 rounded-md whitespace-nowrap uppercase shadow-sm">
              {sectionNavLabels[idx]}
            </span>

            <span
              className={`absolute inset-0 rounded-full border transition-[opacity,transform] duration-150 ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-40 group-hover:scale-95'
              }`}
              style={{ borderColor: isActive ? dotColor : '#ffffff' }}
            />

            <span
              className={`w-2 h-2 rounded-full transition-[transform,background-color] duration-150 ${
                isActive ? 'scale-125' : 'bg-neutral-600 scale-100 group-hover:bg-neutral-300'
              }`}
              style={{ backgroundColor: isActive ? dotColor : undefined }}
            />
          </button>
        );
      })}

      <div className="h-px w-4 bg-neutral-900/85 my-1" aria-hidden />

      <button
        type="button"
        onClick={onManualOpen}
        className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-white border border-neutral-200 hover:border-culture text-neutral-500 hover:text-culture cursor-pointer active:scale-95 transition-[border-color,color,transform] duration-150"
        title="Open Developer Blueprints Support manual"
      >
        <span className="section-nav-tooltip hidden md:block absolute right-10 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-[opacity,transform] duration-150 bg-white border border-neutral-200 text-[8px] font-mono text-culture tracking-widest px-2.5 py-1 rounded-md whitespace-nowrap uppercase shadow-sm">
          BOOK A CALL
        </span>
        <BookOpen className="w-4 h-4" />
      </button>
    </nav>
  );

  if (typeof document === 'undefined') return sidebar;
  return createPortal(sidebar, document.body);
}

export default memo(SectionNavSidebar);
