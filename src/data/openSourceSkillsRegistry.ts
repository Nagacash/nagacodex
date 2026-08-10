import pitchReadyCard from '../assets/images/pitch-ready-card.jpg';
import narrativeFilmCard from '../assets/images/narrative-film-card.jpg';
import proveItCard from '../assets/images/prove-it-card.jpg';

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
    image: pitchReadyCard,
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
    image: narrativeFilmCard,
  },
  {
    id: 'prove-it',
    name: 'prove-it',
    description:
      'Your agent said done. It wasn\'t. Ten failure modes, a claim taxonomy, and the protocol to catch false completions before they ship.',
    tags: ['agents', 'verification', 'qa', 'completions', 'protocol', 'ai-safety'],
    githubUrl: 'https://github.com/Nagacash/prove-it',
    license: 'MIT',
    updatedLabel: 'recently',
    accent: '#FF6B35',
    image: proveItCard,
  },
];
