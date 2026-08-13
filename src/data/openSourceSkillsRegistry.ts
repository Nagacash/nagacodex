// Images stored directly in the repo — no external CDN dependency
import pitchReadyImg from '../assets/images/skills/pitch-ready.jpg';
import narrativeFilmImg from '../assets/images/skills/narrative-film-direction.jpg';
import proveItImg from '../assets/images/skills/prove-it.jpg';
import socialPostForgeImg from '../assets/images/skills/social-post-forge.jpg';
import searchVisibilityImg from '../assets/images/skills/search-visibility.jpg';

export interface NagaRepo {
  id: string;
  name: string;
  description: string;
  tags: string[];
  githubUrl: string;
  license: string;
  updatedLabel: string;
  accent: string;
  image: string;
}

export const nagaRepos: NagaRepo[] = [
  {
    id: 'pitch-ready',
    name: 'Pitch-ready',
    description:
      'Pitch-ready creative package for any screen format: screenplay, music video, or ad campaign. Four entry points, same standard. Write once, pitch anywhere.',
    tags: ['script', 'scripting', 'music-video', 'screenwriting', 'advertising', 'commercial', 'film'],
    githubUrl: 'https://github.com/Nagacash/Pitch-ready',
    license: 'MIT',
    updatedLabel: '1 hour ago',
    accent: '#D4A843',
    image: pitchReadyImg,
  },
  {
    id: 'narrative-film-direction',
    name: 'narrative-film-direction',
    description:
      'The directing methodology for AI-generated narrative film — master shot, coverage, 180° rule, eyelines, editing grammar. Pairs with character-continuity-skill. Tested by Hermes 4 on a fresh scene.',
    tags: ['runway', 'codex', 'cinematography', 'naga', 'veo', 'runway-generated', 'ai-filmmaking'],
    githubUrl: 'https://github.com/Nagacash/narrative-film-direction',
    license: 'MIT',
    updatedLabel: '3 hours ago',
    accent: '#00FF88',
    image: narrativeFilmImg,
  },
  {
    id: 'prove-it',
    name: 'prove-it',
    description:
      "Your agent said done. It wasn't. Ten failure modes, a claim taxonomy, and the protocol to catch false completions before they ship.",
    tags: ['agents', 'verification', 'qa', 'completions', 'protocol', 'ai-safety'],
    githubUrl: 'https://github.com/Nagacash/prove-it',
    license: 'MIT',
    updatedLabel: 'recently',
    accent: '#FF6B35',
    image: proveItImg,
  },
  {
    id: 'social-post-forge',
    name: 'social-post-forge',
    description:
      'Turn a podcast, article, or pile of notes into platform-native LinkedIn, Instagram, X and TikTok posts. Rubric-scored, run through a 33-pattern AI-tell humanizer, benchmarked against trending structure — then shipped as a copy-paste pack or auto-published. Works as an agent skill or standalone CLI.',
    tags: ['agent-skills', 'content-marketing', 'ai-writing', 'anti-slop', 'humanizer', 'linkedin', 'instagram', 'tiktok'],
    githubUrl: 'https://github.com/Nagacash/social-post-forge',
    license: 'MIT',
    updatedLabel: 'today',
    accent: '#3B82F6',
    image: socialPostForgeImg,
  },
  {
    id: 'search-visibility-engineering',
    name: 'search-visibility-engineering',
    description:
      'Five-script SEO + AI-search audit suite: page-level signal scoring, technical crawl analysis, entity schema generation, AI answer-engine prompt benchmarking, and scored reports. Covers Google, Bing, ChatGPT, Perplexity, and Claude citation paths. Applied to nagacodex.cloud to lift SEO score 73→84.',
    tags: ['seo', 'ai-search', 'structured-data', 'schema-org', 'llms', 'perplexity', 'chatgpt', 'audit', 'python'],
    githubUrl: 'https://github.com/Nagacash/search-visibility-engineering',
    license: 'MIT',
    updatedLabel: 'today',
    accent: '#00FF88',
    image: searchVisibilityImg,
  },
];
