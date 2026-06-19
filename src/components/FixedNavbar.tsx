import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import sound from '../lib/sound';
import { scrollOffsets } from '../lib/sections';

gsap.registerPlugin(ScrollToPlugin);

const links = [
  ['WHO', 1],
  ['WORK', 2],
  ['PHILOSOPHY', 3],
  ['PODCAST', 4],
  ['SHOWCASE', 5],
  ['CONTACT', 6],
] as const;

export default function FixedNavbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-fixed safe-top pointer-events-auto bg-gradient-to-b from-black/90 via-black/70 to-transparent">
      <div className="mx-auto w-full max-w-full overflow-x-auto hide-scrollbar px-3 md:px-6">
        <div className="flex min-w-max md:min-w-0 items-center justify-center gap-1 sm:gap-2 md:gap-5 py-2 md:py-3">
          {links.map(([label, idx]) => (
            <button
              key={idx}
              onClick={() => {
                sound.playClick();
                gsap.to(window, {
                  scrollTo: { y: scrollOffsets[idx] },
                  duration: 1.3,
                  ease: 'power3.inOut',
                  overwrite: 'auto',
                });
              }}
              className="font-mono text-[8px] sm:text-[9px] text-neutral-500 hover:text-white tracking-widest uppercase transition-colors cursor-pointer px-2 py-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center md:min-h-0 md:min-w-0 md:px-0 md:py-0 shrink-0"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
