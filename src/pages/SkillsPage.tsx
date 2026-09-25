import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, Github, ArrowLeft, Shield, Terminal } from 'lucide-react';
import skillsData from '../../website-data/skills.json';
import sound from '../lib/sound';

type SkillsPayload = typeof skillsData;

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        sound.playClick();
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        });
      }}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-700 bg-neutral-950 text-[10px] font-mono uppercase tracking-wider text-neutral-300 hover:text-white hover:border-cyber/50 transition-colors min-h-[44px]"
      aria-label={`Copy ${label}`}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-cyber" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function Section({
  id,
  title,
  children,
  eyebrow,
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16 md:py-20 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {eyebrow && (
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-cyber mb-3">{eyebrow}</p>
        )}
        <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight mb-8">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

export default function SkillsPage() {
  const data = skillsData as SkillsPayload;
  const unpublished = data.meta.repositoryStatus === 'unpublished';

  useEffect(() => {
    document.title = 'Naga Codex Skills — Engineering Workflow';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-dvh bg-bg-dark text-text-main selection:bg-cyber/20 selection:text-cyber">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(0,255,136,0.06),transparent_55%)]" />

      <header className="sticky top-0 z-fixed border-b border-white/10 bg-[#070D1A]/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <span className="font-display font-bold text-sm tracking-wide text-white">NAGA CODEX</span>
          <a
            href="/#hero"
            onClick={() => sound.playClick()}
            className="font-mono text-[10px] uppercase tracking-widest text-culture hover:text-white transition-colors min-h-[44px] flex items-center"
          >
            Domain skills
          </a>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="pt-20 md:pt-28 pb-16 md:pb-24 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-cyber mb-4">
              Engineering workflow
            </p>
            <h1 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight max-w-3xl leading-[1.05]">
              {data.meta.title}
            </h1>
            <p className="mt-6 max-w-2xl font-sans text-base md:text-lg text-text-muted leading-relaxed">
              {data.meta.subtitle}. State lives in files — scope, specs, AGENTS.md, tests — not in a
              chat session.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#install"
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-cyber text-[#050C17] font-mono text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity min-h-[44px]"
              >
                <Terminal className="w-4 h-4" />
                Install
              </a>
              {unpublished ? (
                <span className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-neutral-700 font-mono text-[10px] uppercase tracking-wider text-neutral-500 min-h-[44px]">
                  Repo pending publish
                </span>
              ) : (
                <a
                  href={data.meta.repositoryUrlPlaceholder}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-neutral-600 font-mono text-[10px] uppercase tracking-wider text-white hover:border-cyber transition-colors min-h-[44px]"
                >
                  <Github className="w-4 h-4" />
                  Repository
                </a>
              )}
            </div>
            <p className="mt-6 font-mono text-[9px] text-neutral-500 max-w-xl leading-relaxed">
              Looking for Pitch-ready, prove-it, and other GitHub domain skills? Open them from the
              homepage Blueprints Manual — this page is the nine-phase engineering workflow.
            </p>
          </div>
        </section>

        {/* Nine phases */}
        <Section id="workflow" eyebrow="01 — Phases" title="Nine-phase workflow">
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.skills.map((skill) => (
              <li
                key={skill.slug}
                id={`phase-${skill.slug}`}
                className="border border-neutral-800 bg-black/30 p-5 rounded-lg"
              >
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <span className="font-mono text-[9px] text-neutral-500">
                    {String(skill.phase).padStart(2, '0')}
                  </span>
                  <code className="font-mono text-[10px] text-cyber">{skill.command}</code>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">{skill.name}</h3>
                <p className="font-sans text-sm text-text-muted leading-relaxed">{skill.description}</p>
                <p className="mt-3 font-mono text-[8px] uppercase tracking-wider text-neutral-600">
                  {skill.artifactPaths.join(' · ')}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        {/* Outputs */}
        <Section id="outputs" eyebrow="02 — Artifacts" title="Workflow outputs">
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.outputs.map((o) => (
              <li
                key={o.path}
                className="flex flex-col gap-1 border-l-2 border-culture/40 pl-4 py-2"
              >
                <span className="font-display font-semibold text-white">{o.name}</span>
                <code className="font-mono text-[11px] text-cyber/80">{o.path}</code>
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">
                  Owner: {o.owner}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Concepts */}
        <Section id="concepts" eyebrow="03 — Control" title="Agent-control concepts">
          <div className="grid gap-4 sm:grid-cols-2">
            {data.concepts.map((c) => (
              <div key={c.id} className="p-4 rounded-lg bg-surface/50 border border-white/5">
                <h3 className="font-display font-bold text-white mb-2">{c.name}</h3>
                <p className="font-sans text-sm text-text-muted leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Depth */}
        <Section id="depth" eyebrow="04 — Depth" title="Workflow depth">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.workflowDepths.map((d) => (
              <div key={d.id} className="border border-neutral-800 p-4 rounded-lg">
                <h3 className="font-mono text-sm text-film uppercase tracking-wider mb-2">{d.name}</h3>
                <p className="font-sans text-sm text-text-muted leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Install */}
        <Section id="install" eyebrow="05 — Install" title="Installation">
          {unpublished && (
            <div className="mb-6 p-4 rounded-lg border border-culture/30 bg-culture/5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-culture mb-1">
                Placeholder status
              </p>
              <p className="font-sans text-sm text-text-muted leading-relaxed">
                {data.install.localNote} Public commands below activate after{' '}
                <code className="text-cyber text-[12px]">{data.meta.repositoryUrlPlaceholder}</code>{' '}
                is published.
              </p>
            </div>
          )}
          <div className="space-y-6">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-2">
                Install all
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <pre className="flex-1 overflow-x-auto p-4 rounded-lg bg-black border border-neutral-800 font-mono text-[12px] text-cyber">
                  {data.install.allPlaceholder}
                </pre>
                <CopyButton text={data.install.allPlaceholder} label="install all command" />
              </div>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-2">
                Install one skill
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <pre className="flex-1 overflow-x-auto p-4 rounded-lg bg-black border border-neutral-800 font-mono text-[12px] text-cyber">
                  {data.install.onePlaceholder}
                </pre>
                <CopyButton text={data.install.onePlaceholder} label="install one command" />
              </div>
            </div>
          </div>
        </Section>

        {/* Agents */}
        <Section id="agents" eyebrow="06 — Agents" title="Supported agents">
          <ul className="flex flex-wrap gap-2">
            {data.supportedAgents.map((a) => (
              <li
                key={a}
                className="px-3 py-2 rounded-md border border-neutral-800 font-mono text-[10px] uppercase tracking-wider text-neutral-300"
              >
                {a}
              </li>
            ))}
          </ul>
        </Section>

        {/* Security */}
        <Section id="security" eyebrow="07 — Security" title="Security">
          <div className="flex gap-4 p-5 rounded-lg border border-neutral-800 bg-black/40">
            <Shield className="w-6 h-6 text-cyber shrink-0 mt-0.5" />
            <div className="space-y-3 font-sans text-sm text-text-muted leading-relaxed">
              <p>
                Skills are instructions and may include scripts. Inspect them before installing.
              </p>
              <p>
                Secrets should be blocked by runtime Deny rules and never committed. Production
                actions, DNS, credentials, and destructive commands require explicit human approval.
              </p>
              <p>
                This public page exposes only approved metadata — no server paths, env vars, API
                keys, or Hostinger credentials.
              </p>
            </div>
          </div>
        </Section>

        {/* License */}
        <Section id="license" eyebrow="08 — License" title="License">
          <p className="font-sans text-sm text-text-muted leading-relaxed max-w-2xl">
            Naga Codex Skills are released under the MIT License. Full copyright notices live in the
            repository{' '}
            <a
              href={`${data.meta.repositoryUrlPlaceholder}/blob/main/LICENSE`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber hover:underline"
            >
              LICENSE
            </a>
            .
          </p>
        </Section>

        {/* FAQ */}
        <Section id="faq" eyebrow="09 — FAQ" title="FAQ">
          <dl className="space-y-6">
            {data.faq.map((item) => (
              <div key={item.q} className="border-b border-white/5 pb-6">
                <dt className="font-display font-bold text-white mb-2">{item.q}</dt>
                <dd className="font-sans text-sm text-text-muted leading-relaxed">{item.a}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <footer className="py-12 border-t border-white/5 text-center">
          <Link
            to="/"
            onClick={() => sound.playClick()}
            className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-cyber transition-colors"
          >
            ← Back to nagacodex.cloud
          </Link>
        </footer>
      </main>
    </div>
  );
}
