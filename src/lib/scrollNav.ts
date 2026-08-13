import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollToPlugin);

let pinnedScrollTrigger: ScrollTrigger | null = null;
let pinnedTimeline: gsap.core.Timeline | null = null;
let programmaticNavUntil = 0;

export function isProgrammaticNavigation(): boolean {
  return typeof performance !== 'undefined' && performance.now() < programmaticNavUntil;
}

function markProgrammaticNavigation(ms = 400) {
  programmaticNavUntil = performance.now() + ms;
}

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

export function getActiveIndexFromTimeline(
  tl: gsap.core.Timeline,
  sectionCount: number,
  handoffLeadMs = 120,
): number {
  const time = tl.time();
  let active = 0;

  for (let i = 1; i < sectionCount; i++) {
    const label = tl.labels[`section-${i}`];
    if (label === undefined) continue;
    if (time >= label - handoffLeadMs) active = i;
  }

  return active;
}

/** Force page + pinned timeline back to section 0 (hero). */
export function resetScrollToHero() {
  if (typeof window === 'undefined') return;

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if (pinnedScrollTrigger && pinnedTimeline) {
    pinnedTimeline.progress(0);
    pinnedScrollTrigger.scroll(pinnedScrollTrigger.start);
  }
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
  if (labelTime === undefined) {
    // Section is outside the pinned range (natural scroll tail, e.g. Contact at index 7).
    // Fall back to scrollIntoView so the nav link still works.
    anchor?.scrollIntoView({ behavior, block: 'start' });
    return;
  }

  const duration = pinnedTimeline.duration();
  if (duration <= 0) {
    anchor?.scrollIntoView({ behavior, block: 'start' });
    return;
  }

  const progress = labelTime / duration;
  const { start, end } = pinnedScrollTrigger;
  const targetY = start + progress * (end - start);

  // Kill any in-flight scroll tween — animating scroll scrubs the timeline through hero
  gsap.killTweensOf(window);

  markProgrammaticNavigation();

  // Jump timeline + scroll together so we never scrub through intermediate sections
  pinnedTimeline.progress(progress);
  pinnedScrollTrigger.scroll(targetY);
  window.scrollTo(0, targetY);
}

export function getSectionIndexFromScroll(scrollY: number, sectionCount: number): number {
  if (pinnedScrollTrigger && pinnedTimeline) {
    const duration = pinnedTimeline.duration();
    if (duration <= 0) return 0;

    for (let i = sectionCount - 1; i >= 0; i--) {
      const labelTime = pinnedTimeline.labels[`section-${i}`];
      if (labelTime === undefined) continue;
      const progress = labelTime / duration;
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
