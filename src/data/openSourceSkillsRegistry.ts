// Images hosted on CDN — no local asset imports to avoid bundler issues
const PITCH_READY_IMG = 'https://pub.hyperagent.com/api/published/pbf01KZPTQP88_AM0R2ZQYWW73Q6N7/8bb6c7f7-115f-4d9f-98a9-bcf28c1e1d06.png';
const NARRATIVE_FILM_IMG = 'https://pub.hyperagent.com/api/published/pbf01KZPTQPW7_RE7XTBYK51JCWJHM/9dd0df4f-2ec2-4e09-ae30-1b3f5a8f76b3.png';
const PROVE_IT_IMG = 'https://pub.hyperagent.com/api/published/pbf01KZPTQQGH_2D3QW0XKYREXNCP1/dd22c94e-14aa-490e-ac7d-33a7f0365a76.png';

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
    image: PITCH_READY_IMG,
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
    image: NARRATIVE_FILM_IMG,
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
    image: PROVE_IT_IMG,
  },
];
