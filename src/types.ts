export type SectionTheme = 'cyber' | 'film' | 'culture' | 'dev' | 'none';

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  thumbnail: string;
  thumbnailWebp?: string;
  videoSrc?: string;
  videoFallbackSrc?: string;
  externalUrl?: string;
  tagline?: string;
  detailLine?: string;
  ctaLabel?: string;
  aspectClass?: string;
}

export interface PillarData {
  id: SectionTheme;
  title: string;
  tagline: string;
  headlineStat: { label: string; value: string };
  description: string;
  accentClass: string;
  glowClass: string;
  videoSrc?: string;
  videoFallbackSrc?: string;
}
