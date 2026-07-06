/** Timeline label positions for desktop pinned scroll (px along master timeline). */
export const sectionTimelineLabels = {
  0: 0,
  1: 800,
  2: 1400,
  3: 2100,
  4: 2800,
  5: 3500,
  6: 4200,
} as const;

export const sectionCount = 7;

/** Static accent colors — avoids DOM reads on every sidebar render */
export const sectionAccentColors = [
  '#00FF88',
  '#FF6B35',
  '#BD00FF',
  '#D4A843',
  '#D4A843',
  '#D4A843',
  '#3B82F6',
] as const;

export const sectionNavLabels = [
  '01 // HERO',
  '02 // WHO',
  '03 // WORK',
  '04 // PHILOSOPHY',
  '05 // SHOWCASE',
  '06 // WOODLAND360',
  '07 // CONTACT',
] as const;

export function getSectionAccentColor(index: number): string {
  return sectionAccentColors[index] ?? '#00FF88';
}
