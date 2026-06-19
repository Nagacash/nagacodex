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
    <nav className="fixed top-0 left-0 right-0 z-fixed flex justify-center items-center gap-5 py-3 px-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
      {links.map(([label, idx]) => (
        <button
          key={idx}
          onClick={() => {
            sound.playClick();
            if (label === 'PODCAST') sound.pauseForContent();
            gsap.to(window, {
              scrollTo: { y: scrollOffsets[idx] },
              duration: 1.3,
              ease: 'power3.inOut',
              overwrite: 'auto',
            });
          }}
          className="font-mono text-[9px] text-neutral-500 hover:text-white tracking-widest uppercase transition-colors cursor-pointer"
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
