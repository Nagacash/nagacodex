#!/usr/bin/env node
/**
 * Pick at most one agent skill for a task via TypeSafe / Jev.
 * Pattern: https://docs.typesafe.ai/cookbooks/skill_suggestion.md
 *
 * Usage:
 *   node scripts/suggest-skill.mjs "fix blank skill thumbnails on the landing page"
 *   node scripts/suggest-skill.mjs --all "..."   # include ~/.agents/skills (~900+)
 *   node scripts/suggest-skill.mjs --json "..."
 *
 * Requires TYPESAFE_API_KEY in env or project .env
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
loadEnv({ path: join(PROJECT_ROOT, '.env') });

const API = process.env.TYPESAFE_BASE_URL || 'https://api.typesafe.ai';
const MODEL = process.env.TYPESAFE_DEFAULT_MODEL || 'jev-latest';
const SHORTLIST = 3;
const EXCERPT_CHARS = 700;
const GATE_THRESHOLD = 0.3;
const FITS_THRESHOLD = 0.3;
const CHOICE_CHUNK = 200; // API max Choice options is 255

const GATE_QUESTIONS = {
  acts_on_user_system:
    "Is the assistant being asked to act on the user's files, accounts, devices, or online services, rather than only to explain or advise?",
  would_follow_documented_procedure:
    'Would a careful expert answering this consult a specific documented procedure or set of commands, rather than answering from general understanding?',
  prose_suffices:
    "Could a knowledgeable generalist fully satisfy this request in prose, with no tools, no documentation, and no access to the user's files or accounts?",
};
const INVERTED = new Set(['prose_suffices']);

function parseArgs(argv) {
  const flags = { all: false, json: false, help: false };
  const rest = [];
  for (const a of argv) {
    if (a === '--all') flags.all = true;
    else if (a === '--json') flags.json = true;
    else if (a === '--help' || a === '-h') flags.help = true;
    else rest.push(a);
  }
  return { flags, request: rest.join(' ').trim() };
}

function skillRoots(includeAll) {
  const home = homedir();
  const roots = [
    join(home, '.cursor', 'skills'),
    join(PROJECT_ROOT, '.cursor', 'skills'),
  ];
  if (includeAll) {
    roots.push(join(home, '.claude', 'skills'), join(home, '.agents', 'skills'));
  }
  return roots.filter((r) => existsSync(r));
}

function walkSkillMd(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name === '.git') continue;
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walkSkillMd(p, out);
    else if (ent.name === 'SKILL.md') out.push(p);
  }
  return out;
}

function parseFrontmatter(text) {
  if (!text.startsWith('---')) return { name: null, description: '', body: text };
  const end = text.indexOf('\n---', 3);
  if (end < 0) return { name: null, description: '', body: text };
  const fm = text.slice(4, end);
  const body = text.slice(end + 4).trim();
  let name = null;
  const nm = fm.match(/^name:\s*["']?([^"'\n]+)/m);
  if (nm) name = nm[1].trim();
  let description = '';
  const dm = fm.match(
    /^description:\s*(?:>\s*)?\n?((?:.|\n)*?)(?=\n[a-zA-Z_][\w-]*:|\Z)/m,
  );
  if (dm) {
    description = dm[1]
      .split('\n')
      .map((l) => l.replace(/^\s*>\s?/, '').trim())
      .filter(Boolean)
      .join(' ');
  }
  return { name, description, body };
}

function loadRoster(includeAll) {
  const byName = new Map();
  for (const root of skillRoots(includeAll)) {
    for (const path of walkSkillMd(root)) {
      let text;
      try {
        text = readFileSync(path, 'utf8');
      } catch {
        continue;
      }
      const { name: fmName, description, body } = parseFrontmatter(text);
      const name = fmName || path.split('/').slice(-2, -1)[0];
      if (!name) continue;
      // Prefer .cursor/skills over .agents duplicates
      const prefer =
        path.includes('/.cursor/skills/') || path.includes('/naga-codex/.cursor/skills/');
      if (byName.has(name) && !prefer) continue;
      byName.set(name, {
        name,
        description: (description || name).slice(0, 240),
        description_full: description || name,
        body: body.slice(0, 1600),
        path,
      });
    }
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

async function systemOne(apiKey, state, questions) {
  const res = await fetch(`${API}/v1/systemone`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ state, model: MODEL, questions }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`TypeSafe ${res.status}: ${text.slice(0, 400)}`);
  }
  return JSON.parse(text);
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function gateScore(answers) {
  const values = {};
  for (const [key, answer] of Object.entries(answers)) {
    if (!key.startsWith('gate::')) continue;
    values[key.slice(6)] = answer.noul;
  }
  const oriented = Object.entries(values).map(([k, v]) =>
    INVERTED.has(k) ? 1 - v : v,
  );
  return {
    gate: oriented.reduce((a, b) => a + b, 0) / oriented.length,
    values,
  };
}

async function rankWide(apiKey, request, roster) {
  const state = { request, recent_context: '' };
  const chunks = chunk(roster, CHOICE_CHUNK);
  const rankedParts = [];
  let gate = null;
  let values = null;
  let usage = { input_tokens: 0, output_tokens: 0 };

  for (let i = 0; i < chunks.length; i++) {
    const slice = chunks[i];
    const questions = {
      which: {
        type: 'choice',
        instructions:
          "Which of these skills, if any, is the right one to load to help with the user's latest request?",
        criteria: Object.fromEntries(slice.map((s) => [s.name, s.description])),
      },
    };
    // Gate nouls only on first chunk
    if (i === 0) {
      for (const [key, text] of Object.entries(GATE_QUESTIONS)) {
        questions[`gate::${key}`] = { type: 'noul', instructions: text };
      }
    }
    const response = await systemOne(apiKey, state, questions);
    usage.input_tokens += response.usage?.input_tokens || 0;
    usage.output_tokens += response.usage?.output_tokens || 0;
    const probs = response.answers.which.probabilities;
    rankedParts.push(
      ...Object.entries(probs).map(([name, p]) => ({ name, p })),
    );
    if (i === 0) {
      ({ gate, values } = gateScore(response.answers));
    }
  }

  rankedParts.sort((a, b) => b.p - a.p);
  // Deduplicate names keeping highest p
  const seen = new Map();
  for (const row of rankedParts) {
    if (!seen.has(row.name) || seen.get(row.name) < row.p) seen.set(row.name, row.p);
  }
  const ranked = [...seen.entries()]
    .map(([name, p]) => [name, p])
    .sort((a, b) => b[1] - a[1]);

  return { ranked: ranked.slice(0, 12), gate, values, usage };
}

async function rerank(apiKey, request, byName, names) {
  const state = { request, recent_context: '' };
  const questions = {
    which: {
      type: 'choice',
      instructions:
        "Exactly one of these skills is the right one to load for the user's latest request. Which one? Read what each actually does, not just its name.",
      criteria: Object.fromEntries(
        names.map((name) => {
          const s = byName.get(name);
          return [
            name,
            `${s.description_full} — ${s.body.slice(0, EXCERPT_CHARS)}`,
          ];
        }),
      ),
    },
  };
  for (const name of names) {
    const s = byName.get(name);
    questions[`fits::${name}`] = {
      type: 'noul',
      instructions: `Does the skill '${name}' do the specific thing the user's request asks for? It is described as: ${s.description_full}`,
    };
  }
  const response = await systemOne(apiKey, state, questions);
  const fits = {};
  for (const [key, answer] of Object.entries(response.answers)) {
    if (key.startsWith('fits::')) fits[key.slice(6)] = answer.noul;
  }
  return {
    winner: response.answers.which.choice,
    confidence: response.answers.which.confidence,
    fits,
    usage: response.usage || {},
  };
}

async function suggest(request, includeAll) {
  const apiKey = process.env.TYPESAFE_API_KEY;
  if (!apiKey) {
    throw new Error('TYPESAFE_API_KEY missing (set in .env or export it)');
  }
  const roster = loadRoster(includeAll);
  if (roster.length === 0) throw new Error('No SKILL.md files found');
  const byName = new Map(roster.map((s) => [s.name, s]));

  const wide = await rankWide(apiKey, request, roster);
  if (wide.gate < GATE_THRESHOLD) {
    return {
      skill: null,
      reason: 'gate_below_threshold',
      gate: wide.gate,
      gate_values: wide.values,
      shortlist: [],
      roster_size: roster.length,
      usage: wide.usage,
    };
  }

  const shortlist = wide.ranked.slice(0, SHORTLIST).map(([name]) => name);
  const result = await rerank(apiKey, request, byName, shortlist);
  const bestFit = Math.max(...Object.values(result.fits));
  if (bestFit < FITS_THRESHOLD) {
    return {
      skill: null,
      reason: 'fits_below_threshold',
      gate: wide.gate,
      shortlist: shortlist.map((name) => ({
        name,
        wide_p: wide.ranked.find(([n]) => n === name)?.[1],
        fits: result.fits[name],
        path: byName.get(name)?.path,
      })),
      roster_size: roster.length,
      usage: {
        input_tokens: (wide.usage.input_tokens || 0) + (result.usage.input_tokens || 0),
        output_tokens:
          (wide.usage.output_tokens || 0) + (result.usage.output_tokens || 0),
      },
    };
  }

  const winner = byName.get(result.winner);
  return {
    skill: result.winner,
    path: winner?.path,
    description: winner?.description,
    confidence: result.confidence,
    gate: wide.gate,
    shortlist: shortlist.map((name) => ({
      name,
      wide_p: wide.ranked.find(([n]) => n === name)?.[1],
      fits: result.fits[name],
      path: byName.get(name)?.path,
    })),
    roster_size: roster.length,
    block: `<skill_relevance>\nRelevant to the current request: ${result.winner}. Ignore this if it does not fit what the user actually asked for.\n</skill_relevance>`,
    usage: {
      input_tokens: (wide.usage.input_tokens || 0) + (result.usage.input_tokens || 0),
      output_tokens:
        (wide.usage.output_tokens || 0) + (result.usage.output_tokens || 0),
    },
  };
}

function printHelp() {
  console.log(`suggest-skill — TypeSafe/Jev skill picker

Usage:
  node scripts/suggest-skill.mjs [--all] [--json] "<task>"

Defaults to ~/.cursor/skills + this project's .cursor/skills.
Pass --all to also include ~/.claude/skills and ~/.agents/skills.

Requires TYPESAFE_API_KEY.`);
}

async function main() {
  const { flags, request } = parseArgs(process.argv.slice(2));
  if (flags.help || !request) {
    printHelp();
    process.exit(flags.help ? 0 : 1);
  }
  const result = await suggest(request, flags.all);
  if (flags.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  if (!result.skill) {
    console.log(`No skill suggested (${result.reason}, gate=${result.gate?.toFixed(2)})`);
    if (result.shortlist?.length) {
      console.log('Shortlist was:');
      for (const s of result.shortlist) {
        console.log(`  fits=${s.fits?.toFixed(2)}  ${s.name}`);
      }
    }
    console.log(`Roster: ${result.roster_size} skills`);
    return;
  }
  console.log(`Suggested: ${result.skill}`);
  console.log(`Path:      ${result.path}`);
  console.log(`Confidence:${result.confidence?.toFixed(2)}  gate=${result.gate.toFixed(2)}`);
  console.log('Shortlist:');
  for (const s of result.shortlist) {
    console.log(
      `  wide=${(s.wide_p ?? 0).toFixed(3)}  fits=${s.fits.toFixed(2)}  ${s.name}`,
    );
  }
  console.log('');
  console.log(result.block);
  console.log(
    `Tokens in/out: ${result.usage.input_tokens}/${result.usage.output_tokens}  (roster ${result.roster_size})`,
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
