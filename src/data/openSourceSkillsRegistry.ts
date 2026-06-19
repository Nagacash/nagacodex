import frontendDesign from './open-source-skills/frontend-design.md?raw';
import reactBestPractices from './open-source-skills/react-best-practices.md?raw';
import webDesignGuidelines from './open-source-skills/web-design-guidelines.md?raw';
import agentBrowser from './open-source-skills/agent-browser.md?raw';
import gsapScrolltrigger from './open-source-skills/gsap-scrolltrigger.md?raw';
import webappTesting from './open-source-skills/webapp-testing.md?raw';
import skillCreator from './open-source-skills/skill-creator.md?raw';
import brainstorming from './open-source-skills/brainstorming.md?raw';
import systematicDebugging from './open-source-skills/systematic-debugging.md?raw';
import compositionPatterns from './open-source-skills/composition-patterns.md?raw';
import polish from './open-source-skills/polish.md?raw';

export interface OpenSourceSkill {
  id: string;
  name: string;
  slug: string;
  source: string;
  installs: string;
  installCmd: string;
  skillsShUrl: string;
  license: string;
  category: string;
  accent: string;
  markdown: string;
}

export const openSourceSkills: OpenSourceSkill[] = [
  {
    id: 'frontend-design',
    name: 'FRONTEND_DESIGN',
    slug: 'frontend-design',
    source: 'anthropics/skills',
    installs: '566K',
    installCmd: 'npx skills add anthropics/skills@frontend-design -g -y',
    skillsShUrl: 'https://skills.sh/anthropics/skills/frontend-design',
    license: 'Apache-2.0',
    category: 'DESIGN // UI',
    accent: '#D4A843',
    markdown: frontendDesign,
  },
  {
    id: 'react-best-practices',
    name: 'VERCEL_REACT_BEST_PRACTICES',
    slug: 'vercel-react-best-practices',
    source: 'vercel-labs/agent-skills',
    installs: '488K',
    installCmd: 'npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y',
    skillsShUrl: 'https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices',
    license: 'MIT',
    category: 'REACT // PERFORMANCE',
    accent: '#3B82F6',
    markdown: reactBestPractices,
  },
  {
    id: 'web-design-guidelines',
    name: 'WEB_DESIGN_GUIDELINES',
    slug: 'web-design-guidelines',
    source: 'vercel-labs/agent-skills',
    installs: '402K',
    installCmd: 'npx skills add vercel-labs/agent-skills@web-design-guidelines -g -y',
    skillsShUrl: 'https://skills.sh/vercel-labs/agent-skills/web-design-guidelines',
    license: 'MIT',
    category: 'AUDIT // ACCESSIBILITY',
    accent: '#00FF88',
    markdown: webDesignGuidelines,
  },
  {
    id: 'agent-browser',
    name: 'AGENT_BROWSER',
    slug: 'agent-browser',
    source: 'vercel-labs/agent-browser',
    installs: '465K',
    installCmd: 'npx skills add vercel-labs/agent-browser@agent-browser -g -y',
    skillsShUrl: 'https://skills.sh/vercel-labs/agent-browser/agent-browser',
    license: 'MIT',
    category: 'TESTING // BROWSER',
    accent: '#FF6B35',
    markdown: agentBrowser,
  },
  {
    id: 'gsap-scrolltrigger',
    name: 'GSAP_SCROLLTRIGGER',
    slug: 'gsap-scrolltrigger',
    source: 'greensock/gsap-skills',
    installs: '92K',
    installCmd: 'npx skills add greensock/gsap-skills@gsap-scrolltrigger -g -y',
    skillsShUrl: 'https://skills.sh/greensock/gsap-skills/gsap-scrolltrigger',
    license: 'MIT',
    category: 'ANIMATION // SCROLL',
    accent: '#A855F7',
    markdown: gsapScrolltrigger,
  },
  {
    id: 'composition-patterns',
    name: 'VERCEL_COMPOSITION_PATTERNS',
    slug: 'vercel-composition-patterns',
    source: 'vercel-labs/agent-skills',
    installs: '217K',
    installCmd: 'npx skills add vercel-labs/agent-skills@vercel-composition-patterns -g -y',
    skillsShUrl: 'https://skills.sh/vercel-labs/agent-skills/vercel-composition-patterns',
    license: 'MIT',
    category: 'REACT // ARCHITECTURE',
    accent: '#3B82F6',
    markdown: compositionPatterns,
  },
  {
    id: 'polish',
    name: 'IMPECCABLE_POLISH',
    slug: 'polish',
    source: 'pbakaus/impeccable',
    installs: '86K',
    installCmd: 'npx skills add pbakaus/impeccable@polish -g -y',
    skillsShUrl: 'https://skills.sh/pbakaus/impeccable/polish',
    license: 'Apache-2.0',
    category: 'DESIGN // POLISH',
    accent: '#EC4899',
    markdown: polish,
  },
  {
    id: 'webapp-testing',
    name: 'WEBAPP_TESTING',
    slug: 'webapp-testing',
    source: 'anthropics/skills',
    installs: '99K',
    installCmd: 'npx skills add anthropics/skills@webapp-testing -g -y',
    skillsShUrl: 'https://skills.sh/anthropics/skills/webapp-testing',
    license: 'Apache-2.0',
    category: 'TESTING // PLAYWRIGHT',
    accent: '#00FF88',
    markdown: webappTesting,
  },
  {
    id: 'brainstorming',
    name: 'BRAINSTORMING',
    slug: 'brainstorming',
    source: 'obra/superpowers',
    installs: '232K',
    installCmd: 'npx skills add obra/superpowers@brainstorming -g -y',
    skillsShUrl: 'https://skills.sh/obra/superpowers/brainstorming',
    license: 'MIT',
    category: 'WORKFLOW // PLANNING',
    accent: '#D4A843',
    markdown: brainstorming,
  },
  {
    id: 'systematic-debugging',
    name: 'SYSTEMATIC_DEBUGGING',
    slug: 'systematic-debugging',
    source: 'obra/superpowers',
    installs: '151K',
    installCmd: 'npx skills add obra/superpowers@systematic-debugging -g -y',
    skillsShUrl: 'https://skills.sh/obra/superpowers/systematic-debugging',
    license: 'MIT',
    category: 'WORKFLOW // DEBUG',
    accent: '#FF6B35',
    markdown: systematicDebugging,
  },
  {
    id: 'skill-creator',
    name: 'SKILL_CREATOR',
    slug: 'skill-creator',
    source: 'anthropics/skills',
    installs: '278K',
    installCmd: 'npx skills add anthropics/skills@skill-creator -g -y',
    skillsShUrl: 'https://skills.sh/anthropics/skills/skill-creator',
    license: 'Apache-2.0',
    category: 'META // SKILLS',
    accent: '#00FF88',
    markdown: skillCreator,
  },
];
