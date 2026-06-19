export type SectionTheme = 'cyber' | 'film' | 'culture' | 'dev' | 'none';

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  thumbnail: string;
  videoSrc?: string;
  videoFallbackSrc?: string;
  aspectClass: string;
}

export interface PillarData {
  id: SectionTheme;
  title: string;
  role: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  description: string;
  accentClass: string;
  glowClass: string;
  videoSrc?: string;
  videoFallbackSrc?: string;
}
