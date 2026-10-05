export interface CaseStudyProof {
  url?: string | null;
  screenshots?: string[];
  demoVideoUrl?: string | null;
  namingPermission?: boolean;
}

export interface CaseStudyTestimonial {
  quote: string;
  permission: boolean;
}

export interface CaseStudy {
  id: string;
  label: string;
  title: string;
  problem?: string | null;
  role?: string | null;
  shipped?: string[] | null;
  proof?: CaseStudyProof | null;
  outcome?: string | null;
  testimonial?: CaseStudyTestimonial | null;
}

/**
 * Confirmed fields only. Optional blocks stay null/empty and are not rendered.
 */
export const caseStudies: CaseStudy[] = [
  {
    id: 'body-and-mind',
    label: 'Client Build · Website',
    title: 'A website for Body & Mind by Natalie',
    problem: null,
    role: 'I designed and built the website.',
    shipped: null,
    proof: null,
    outcome: null,
    testimonial: null,
  },
  {
    id: 'nagaflow',
    label: 'Naga Codex Product · Workflow automation. Own product, not client work.',
    title: 'NagaFlow: the workflow engine behind the Sprint',
    problem:
      'Small teams automate with tools that either send without a check or need engineers to keep running. I wanted a canvas where AI steps are fine, but a human can approve before anything leaves the building.',
    role: 'Sole builder: product, design and code.',
    shipped: [
      'Visual workflow editor with scheduled runs and inbound webhooks.',
      'AI steps with your own API keys.',
      'Human approval step through Slack, Discord or Telegram before sending.',
      'Email connectors that send directly or create a draft for review.',
      'Durable runs with waits, retries and step-by-step run history.',
    ],
    // URL/screenshots/demo hidden until domain and assets are confirmed.
    proof: null,
    outcome: null,
    testimonial: null,
  },
];
