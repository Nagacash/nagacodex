import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollToPlugin);

let pinnedScrollTrigger: ScrollTrigger | null = null;
let pinnedTimeline: gsap.core.Timeline | null = null;

export function registerPinnedNavigation(st: ScrollTrigger, tl: gsap.core.Timeline) {
  pinnedScrollTrigger = st;
  pinnedTimeline = tl;
}

export function unregisterPinnedNavigation() {
  pinnedScrollTrigger = null;
  pinnedTimeline = null;
}

export function isTouchLikeDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(max-width: 767px)').matches ||
    window.matchMedia('(pointer: coarse)').matches ||
    'ontouchstart' in window
  );
}

export function scrollToSection(index: number, behavior: ScrollBehavior = 'smooth') {
  const anchor = document.getElementById(`section-anchor-${index}`);

  if (anchor && (isTouchLikeDevice() || !pinnedScrollTrigger)) {
    anchor.scrollIntoView({ behavior, block: 'start' });
    return;
  }

  if (!pinnedScrollTrigger || !pinnedTimeline) {
    anchor?.scrollIntoView({ behavior, block: 'start' });
    return;
  }

  const labelTime = pinnedTimeline.labels[`section-${index}`];
  if (labelTime === undefined) return;

  const progress = labelTime / pinnedTimeline.duration();
  const { start, end } = pinnedScrollTrigger;
  const targetY = start + progress * (end - start);

  gsap.to(window, {
    scrollTo: { y: targetY },
    duration: 1.3,
    ease: 'power3.inOut',
    overwrite: 'auto',
  });
}

export function getSectionIndexFromScroll(scrollY: number, sectionCount: number): number {
  if (pinnedScrollTrigger && pinnedTimeline) {
    for (let i = sectionCount - 1; i >= 0; i--) {
      const labelTime = pinnedTimeline.labels[`section-${i}`];
      if (labelTime === undefined) continue;
      const progress = labelTime / pinnedTimeline.duration();
      const offset =
        pinnedScrollTrigger.start +
        progress * (pinnedScrollTrigger.end - pinnedScrollTrigger.start);
      if (scrollY >= offset - 100) return i;
    }
    return 0;
  }

  for (let i = sectionCount - 1; i >= 0; i--) {
    const anchor = document.getElementById(`section-anchor-${i}`);
    if (!anchor) continue;
    const top = anchor.getBoundingClientRect().top + window.scrollY;
    if (scrollY >= top - 120) return i;
  }
  return 0;
}
