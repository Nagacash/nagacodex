import { Link } from 'react-router-dom';
import sound from '../lib/sound';
import { useActiveSectionIndex } from '../lib/activeSection';
import { getSectionAccentColor } from '../lib/sections';
import { scrollToSection } from '../lib/scrollNav';
import { CONTACT_SECTION_INDEX } from '../content/homepageOffer';

const sectionLinks = [
  ['HOME', 0],
  ['OFFER', 1],
  ['CASES', 2],
  ['TRUEQUILL', 3],
  ['WHO', 4],
  ['WORK', 5],
  ['PHILOSOPHY', 6],
  ['SHOWCASE', 7],
  ['ECOSYSTEM', 8],
  ['PODCAST', 9],
] as const;

export default function FixedNavbar() {
  const activeIndex = useActiveSectionIndex();

  return (
    <nav
      aria-label="Primary"
      className="fixed top-0 inset-x-0 z-fixed safe-top pointer-events-auto border-b border-white/10 bg-[#070D1A]/95 backdrop-blur-md transition-colors duration-300"
    >
      <div className="mx-auto w-full overflow-x-auto hide-scrollbar safe-x">
        <div className="flex w-max min-w-full items-center justify-center gap-0.5 px-3 py-2 md:px-4">
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
                className={`relative font-mono text-[9px] tracking-[0.14em] uppercase transition-colors cursor-pointer px-2 py-2 min-h-[44px] flex items-center justify-center shrink-0 ${
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
            className="relative font-mono text-[9px] tracking-[0.14em] uppercase transition-colors cursor-pointer px-2 py-2 min-h-[44px] flex items-center justify-center shrink-0 text-[#8B9BB4] hover:text-[#E8EDF5]"
          >
            CERTS
          </Link>
          <Link
            to="/skills"
            onClick={() => sound.playClick()}
            className="relative font-mono text-[9px] tracking-[0.14em] uppercase transition-colors cursor-pointer px-2 py-2 min-h-[44px] flex items-center justify-center shrink-0 text-[#8B9BB4] hover:text-[#E8EDF5]"
          >
            SKILLS
          </Link>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              scrollToSection(CONTACT_SECTION_INDEX);
            }}
            aria-current={activeIndex === CONTACT_SECTION_INDEX ? 'true' : undefined}
            className={`relative font-mono text-[9px] tracking-[0.14em] uppercase transition-colors cursor-pointer px-2 py-2 min-h-[44px] flex items-center justify-center shrink-0 ${
              activeIndex === CONTACT_SECTION_INDEX
                ? 'font-semibold'
                : 'text-[#8B9BB4] hover:text-[#E8EDF5]'
            }`}
            style={
              activeIndex === CONTACT_SECTION_INDEX
                ? { color: getSectionAccentColor(CONTACT_SECTION_INDEX) }
                : undefined
            }
          >
            CONTACT
            {activeIndex === CONTACT_SECTION_INDEX && (
              <span
                className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-sm"
                style={{ backgroundColor: getSectionAccentColor(CONTACT_SECTION_INDEX) }}
              />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
