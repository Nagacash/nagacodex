/** Timeline label positions for desktop pinned scroll (px along master timeline). */
export const sectionTimelineLabels = {
  0: 0,
  1: 800,
  2: 1400,
  3: 2100,
  4: 2800,
  5: 3500,
  6: 4200,
  7: 4900,
  8: 5600,
  9: 6300,
} as const;

/** Matches HomePage TransitionSection children count. */
export const sectionCount = 10;

/** Static accent colors — avoids DOM reads on every sidebar render */
export const sectionAccentColors = [
  '#00FF88', // hero
  '#00FF88', // offer
  '#BD00FF', // case studies
  '#FF6B35', // who
  '#BD00FF', // work
  '#D4A843', // philosophy
  '#D4A843', // showcase
  '#D4A843', // ecosystem
  '#D4A843', // woodland360
  '#3B82F6', // contact
] as const;

export const sectionNavLabels = [
  '01 // HERO',
  '02 // OFFER',
  '03 // CASES',
  '04 // WHO',
  '05 // WORK',
  '06 // PHILOSOPHY',
  '07 // SHOWCASE',
  '08 // ECOSYSTEM',
  '09 // PODCAST',
  '10 // CONTACT',
] as const;

export function getSectionAccentColor(index: number): string {
  return sectionAccentColors[index] ?? '#00FF88';
}
