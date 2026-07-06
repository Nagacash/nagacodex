import sound from '../lib/sound';
import { useActiveSectionIndex } from '../lib/activeSection';
import { getSectionAccentColor } from '../lib/sections';
import { scrollToSection } from '../lib/scrollNav';

const links = [
  ['WHO', 1],
  ['WORK', 2],
  ['PHILOSOPHY', 3],
  ['SHOWCASE', 4],
  ['PODCAST', 5],
  ['CONTACT', 6],
] as const;

export default function FixedNavbar() {
  const activeIndex = useActiveSectionIndex();
  const isPhilosophy = activeIndex === 3;

  return (
    <nav
      aria-label="Primary"
      className={`fixed top-0 inset-x-0 z-fixed safe-top pointer-events-auto border-b transition-colors duration-300 ${
        isPhilosophy
          ? 'bg-[#0A0A0A]/94 border-neutral-800/90 backdrop-blur-sm'
          : 'bg-white/[0.97] border-neutral-200/90'
      }`}
    >
      <div className="mx-auto w-full max-w-full overflow-x-auto hide-scrollbar snap-x snap-mandatory safe-x px-3 md:px-6">
        <div className="flex min-w-max md:min-w-0 items-center justify-center gap-0.5 sm:gap-2 md:gap-6 py-2 md:py-3 pr-4 md:pr-0">
          {links.map(([label, idx]) => {
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
                    : isPhilosophy
                      ? 'text-neutral-500 hover:text-neutral-200'
                      : 'text-neutral-600 hover:text-neutral-900'
                }`}
                style={isActive ? { color: accent } : undefined}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
