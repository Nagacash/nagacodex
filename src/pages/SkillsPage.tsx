import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, Github, ArrowLeft, Shield, Terminal } from 'lucide-react';
import skillsData from '../../website-data/skills.json';
import sound from '../lib/sound';

type SkillsPayload = typeof skillsData;

const HERO_IMG = '/skills/hero-banner.jpg';
const PIPELINE_IMG = '/skills/workflow-pipeline.jpg';
const EMBLEM_IMG = '/skills/emblem.jpg';
const HERO_VIDEO = '/skills/hero-ambient.mp4';

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
  const [heroVideoOk, setHeroVideoOk] = useState(false);

  useEffect(() => {
    document.title = 'Naga Codex Skills — Engineering Workflow';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(HERO_VIDEO, { method: 'HEAD' })
      .then((r) => {
        if (!cancelled) setHeroVideoOk(r.ok);
      })
      .catch(() => {
        if (!cancelled) setHeroVideoOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-dvh bg-bg-dark text-text-main selection:bg-cyber/20 selection:text-cyber">
      <header className="sticky top-0 z-fixed border-b border-white/10 bg-[#070D1A]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <span className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-wide text-white">
            <img
              src={EMBLEM_IMG}
              alt=""
              width={22}
              height={22}
              className="w-[22px] h-[22px] rounded-sm object-cover ring-1 ring-cyber/40"
              aria-hidden
            />
            NAGA CODEX
          </span>
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
        {/* Full-bleed hero — brand + one line + CTA + dominant visual */}
        <section className="relative min-h-[min(92dvh,920px)] flex flex-col justify-end overflow-hidden">
          <div className="absolute inset-0" aria-hidden>
            {heroVideoOk ? (
              <video
                className="absolute inset-0 w-full h-full object-cover skills-hero-media"
                autoPlay
                muted
                loop
                playsInline
                poster={HERO_IMG}
              >
                <source src={HERO_VIDEO} type="video/mp4" />
              </video>
            ) : (
              <img
                src={HERO_IMG}
                alt=""
                className="absolute inset-0 w-full h-full object-cover skills-hero-media"
                fetchPriority="high"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050C17]/95 via-[#070D1A]/72 to-[#070D1A]/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D1A] via-[#070D1A]/55 to-transparent" />
            <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay skills-hero-grain" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto w-full px-4 md:px-6 pt-28 pb-16 md:pb-24">
            <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-cyber mb-5 skills-fade-up">
              Engineering workflow
            </p>
            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[0.95] max-w-3xl skills-fade-up skills-fade-up-delay-1">
              <span className="block text-cyber/90 text-[0.38em] md:text-[0.34em] tracking-[0.18em] font-mono font-bold mb-3 md:mb-4">
                NAGA CODEX
              </span>
              Skills
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base md:text-lg text-text-muted leading-relaxed skills-fade-up skills-fade-up-delay-2">
              {data.meta.subtitle}. State lives in files — not in a chat session.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 skills-fade-up skills-fade-up-delay-3">
              <a
                href="#install"
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-cyber text-[#050C17] font-mono text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity min-h-[44px] shadow-[0_0_40px_rgba(0,255,136,0.25)]"
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
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-white/20 bg-black/30 backdrop-blur-sm font-mono text-[10px] uppercase tracking-wider text-white hover:border-cyber transition-colors min-h-[44px]"
                >
                  <Github className="w-4 h-4" />
                  Repository
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Pipeline visual plane */}
        <section
          id="pipeline"
          className="relative border-t border-white/5 overflow-hidden"
          aria-label="Nine-phase workflow visualization"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,255,136,0.08),transparent_55%)]" />
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-cyber mb-2">
                  Visual map
                </p>
                <h2 className="font-display font-black text-xl md:text-2xl text-white tracking-tight">
                  idea → scope → ship
                </h2>
              </div>
              <p className="hidden sm:block font-mono text-[9px] text-neutral-500 uppercase tracking-wider max-w-[14rem] text-right leading-relaxed">
                Nine phases. Run only what the change needs.
              </p>
            </div>
            <div className="relative skills-pipeline-frame">
              <img
                src={PIPELINE_IMG}
                alt="Nine glowing workflow nodes linked across a dark engineering grid"
                className="w-full h-auto block rounded-sm"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-cyber/20" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#070D1A]/80 to-transparent" />
            </div>
            <ol className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {data.skills.map((skill) => (
                <li key={skill.slug} className="shrink-0">
                  <a
                    href={`#phase-${skill.slug}`}
                    onClick={() => sound.playClick()}
                    className="group inline-flex items-center gap-2 px-3 py-2 min-h-[44px] border border-white/10 bg-black/40 hover:border-cyber/50 hover:bg-cyber/5 transition-colors"
                  >
                    <span className="font-mono text-[9px] text-neutral-500 group-hover:text-cyber">
                      {String(skill.phase).padStart(2, '0')}
                    </span>
                    <code className="font-mono text-[10px] text-cyber">{skill.command}</code>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Nine phases */}
        <Section id="workflow" eyebrow="01 — Phases" title="Nine-phase workflow">
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.skills.map((skill) => (
              <li
                key={skill.slug}
                id={`phase-${skill.slug}`}
                className="group relative border border-neutral-800/80 bg-gradient-to-br from-black/50 to-surface/40 p-5 transition-colors hover:border-cyber/40"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyber/80 to-transparent opacity-60 group-hover:opacity-100"
                  aria-hidden
                />
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
          <p className="mt-8 font-mono text-[9px] text-neutral-500 max-w-xl leading-relaxed">
            Looking for Pitch-ready, prove-it, and other GitHub domain skills? Open them from the
            homepage Blueprints Manual — this page is the nine-phase engineering workflow.
          </p>
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
              <div key={c.id} className="p-4 border border-white/5 bg-surface/40">
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
              <div key={d.id} className="border border-neutral-800 p-4">
                <h3 className="font-mono text-sm text-film uppercase tracking-wider mb-2">{d.name}</h3>
                <p className="font-sans text-sm text-text-muted leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Install */}
        <Section id="install" eyebrow="05 — Install" title="Installation">
          {unpublished && (
            <div className="mb-6 p-4 border border-culture/30 bg-culture/5">
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
                <pre className="flex-1 overflow-x-auto p-4 bg-black border border-neutral-800 font-mono text-[12px] text-cyber">
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
                <pre className="flex-1 overflow-x-auto p-4 bg-black border border-neutral-800 font-mono text-[12px] text-cyber">
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
                className="px-3 py-2 border border-neutral-800 font-mono text-[10px] uppercase tracking-wider text-neutral-300"
              >
                {a}
              </li>
            ))}
          </ul>
        </Section>

        {/* Security */}
        <Section id="security" eyebrow="07 — Security" title="Security">
          <div className="flex gap-4 p-5 border border-neutral-800 bg-black/40">
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
