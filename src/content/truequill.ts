/**
 * TrueQuill product facts — sourced from Nagacash/TrueQuill README + SUBMISSION.md.
 * Unverified items stay null/false; UI must hide them rather than invent copy.
 */
export const TRUEQUILL_MCP_URL = 'https://keen-spark-amvi2.run.mcp-use.com/mcp';

export const TRUEQUILL_GITHUB_URL = 'https://github.com/Nagacash/TrueQuill';

/** Pro landing — labeled coming soon until a real Pro page ships. */
export const TRUEQUILL_PRO_URL = 'https://nagacodex.cloud/pro';

export const TRUEQUILL_SECTION_INDEX = 3;

export const TRUEQUILL_META = {
  title: 'TrueQuill — Check drafts for AI tells',
  description:
    'Free MCP server that scores pasted text for AI-writing tells across 5 categories. 10 free checks/day. Powered by Naga Codex.',
  oneLiner: 'Check drafts for AI tells — write like a human',
} as const;

export type TrueQuillCategory = {
  id: string;
  name: string;
  severity: 'strong' | 'weak' | 'check-worthy';
  severityLabel: string;
};

/** Category names + severity from TrueQuill src/rules.ts CATEGORY_SEVERITY. */
export const TRUEQUILL_CATEGORIES: TrueQuillCategory[] = [
  {
    id: 'vocabulary',
    name: 'Vocabulary',
    severity: 'strong',
    severityLabel: 'Strong AI signal',
  },
  {
    id: 'sentence-patterns',
    name: 'Sentence patterns',
    severity: 'strong',
    severityLabel: 'Strong AI signal',
  },
  {
    id: 'punctuation',
    name: 'Punctuation',
    severity: 'weak',
    severityLabel: 'Weak style signal',
  },
  {
    id: 'three-item-lists',
    name: 'Three-item lists',
    severity: 'weak',
    severityLabel: 'Weak style signal',
  },
  {
    id: 'unsupported-proof',
    name: 'Unsupported proof',
    severity: 'check-worthy',
    severityLabel: 'Worth checking',
  },
];

export const TRUEQUILL_SAMPLE = {
  text: "It's not just a tool, it's a game-changing journey.",
  score: 3,
  maxScore: 5,
  flagged: ['vocabulary', 'sentence-patterns'] as const,
  /** Verdict from TrueQuill verdictFor() when score === 3 (two category hits). */
  verdict: 'Mixed signals — two AI tells flagged, consider a rewrite pass.',
} as const;

export const TRUEQUILL_FREE_DAILY_CHECKS = 10;

export type InstallTabId = 'chatgpt' | 'claude' | 'mcp-client' | 'chatgpt-free';

export type InstallTab = {
  id: InstallTabId;
  label: string;
  steps: string[];
  note?: string;
  command?: string;
};

export const TRUEQUILL_INSTALL_TABS: InstallTab[] = [
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    steps: [
      'Requires a paid ChatGPT plan.',
      'Open Settings → Connectors.',
      'Add an MCP server.',
      'Paste the TrueQuill MCP URL.',
      'No login needed.',
    ],
  },
  {
    id: 'claude',
    label: 'Claude',
    steps: [
      'Requires a paid Claude plan.',
      'Open Settings → Connectors.',
      'Add a custom MCP server.',
      'Paste the TrueQuill MCP URL.',
      'No login needed.',
    ],
  },
  {
    id: 'mcp-client',
    label: 'Any MCP client',
    steps: [
      'Run the MCP Inspector.',
      'Connect to the TrueQuill MCP URL.',
    ],
    command: 'npx -y @modelcontextprotocol/inspector',
  },
  {
    id: 'chatgpt-free',
    label: 'ChatGPT Free',
    steps: [
      'Directory listing is coming soon.',
      'Do not expect TrueQuill in the free ChatGPT directory yet.',
    ],
    note: 'Coming soon — not listed yet.',
  },
];
