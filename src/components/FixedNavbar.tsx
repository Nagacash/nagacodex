import { Link } from 'react-router-dom';
import sound from '../lib/sound';
import { useActiveSectionIndex } from '../lib/activeSection';
import { getSectionAccentColor } from '../lib/sections';
import { scrollToSection } from '../lib/scrollNav';

const sectionLinks = [
  ['HOME', 0],
  ['WHO', 1],
  ['WORK', 2],
  ['PHILOSOPHY', 3],
  ['SHOWCASE', 4],
  ['ECOSYSTEM', 5],
  ['PODCAST', 6],
] as const;

const CONTACT_INDEX = 7;

export default function FixedNavbar() {
  const activeIndex = useActiveSectionIndex();

  return (
    <nav
      aria-label="Primary"
      className="fixed top-0 inset-x-0 z-fixed safe-top pointer-events-auto border-b border-white/10 bg-[#070D1A]/95 backdrop-blur-md transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-full overflow-x-auto hide-scrollbar snap-x snap-mandatory safe-x px-3 md:px-6">
        <div className="flex min-w-max md:min-w-0 items-center justify-center gap-0.5 sm:gap-2 md:gap-6 py-2 md:py-3 pr-4 md:pr-0">
          {sectionLinks.map(([label, idx]) => {
            const isActive = activeIndex === idx;
            const accent = getSectionAccentColor(idx);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  sound.playClick();
                  scrollToSection(idx);
                }}
                aria-current={isActive ? 'true' : undefined}
                className={`relative snap-center font-mono text-[9px] sm:text-[9px] tracking-widest uppercase transition-colors cursor-pointer px-2.5 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'font-semibold'
                    : 'text-[#8B9BB4] hover:text-[#E8EDF5]'
                }`}
                style={isActive ? { color: accent } : undefined}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-sm"
                    style={{ backgroundColor: accent }}
                  />
                )}
              </button>
            );
          })}

          <Link
            to="/certificates"
            onClick={() => sound.playClick()}
            className="relative snap-center font-mono text-[9px] tracking-widest uppercase transition-colors cursor-pointer px-2.5 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 text-culture hover:text-white"
          >
            CERTS
          </Link>
          <Link
            to="/skills"
            onClick={() => sound.playClick()}
            className="relative snap-center font-mono text-[9px] tracking-widest uppercase transition-colors cursor-pointer px-2.5 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 text-cyber hover:text-white"
          >
            SKILLS
          </Link>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              scrollToSection(CONTACT_INDEX);
            }}
            aria-current={activeIndex === CONTACT_INDEX ? 'true' : undefined}
            className={`relative snap-center font-mono text-[9px] tracking-widest uppercase transition-colors cursor-pointer px-2.5 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 ${
              activeIndex === CONTACT_INDEX
                ? 'font-semibold'
                : 'text-[#8B9BB4] hover:text-[#E8EDF5]'
            }`}
            style={
              activeIndex === CONTACT_INDEX
                ? { color: getSectionAccentColor(CONTACT_INDEX) }
                : undefined
            }
          >
            CONTACT
            {activeIndex === CONTACT_INDEX && (
              <span
                className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-sm"
                style={{ backgroundColor: getSectionAccentColor(CONTACT_INDEX) }}
              />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
