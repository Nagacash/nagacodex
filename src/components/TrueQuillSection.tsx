import { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, Github } from 'lucide-react';
import sound from '../lib/sound';
import {
  TRUEQUILL_CATEGORIES,
  TRUEQUILL_FREE_DAILY_CHECKS,
  TRUEQUILL_GITHUB_URL,
  TRUEQUILL_INSTALL_TABS,
  TRUEQUILL_MCP_URL,
  TRUEQUILL_META,
  TRUEQUILL_PRO_URL,
  TRUEQUILL_SAMPLE,
  type InstallTabId,
} from '../content/truequill';
import truequillLogo from '../assets/images/truequillLogo';

const HOME_TITLE = 'Naga Codex | Maurice Holda — AI, Film & Web Dev';
const HOME_DESCRIPTION =
  'Maurice Holda builds AI agent systems, generative films, and custom web products from Hamburg. Security consulting too. Open source on GitHub.';

function setMetaDescription(content: string) {
  const el = document.querySelector('meta[name="description"]');
  if (el) el.setAttribute('content', content);
}

function CopyUrlButton({ text, label }: { text: string; label: string }) {
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
      className="inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-lg border border-neutral-300 bg-white font-mono text-[10px] uppercase tracking-wider text-neutral-800 hover:border-cyber/50 hover:text-neutral-950 transition-colors"
      aria-label={`Copy ${label}`}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-cyber" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy URL'}
    </button>
  );
}

function severityClass(severity: 'strong' | 'weak' | 'check-worthy'): string {
  if (severity === 'strong') return 'text-film border-film/30 bg-film/5';
  if (severity === 'weak') return 'text-neutral-600 border-neutral-300 bg-neutral-50';
  return 'text-culture border-culture/30 bg-culture/5';
}

/**
 * TrueQuill product section — free MCP funnel for AI-tell checks.
 */
export default function TrueQuillSection() {
  const [tab, setTab] = useState<InstallTabId>('chatgpt');
  const activeTab = TRUEQUILL_INSTALL_TABS.find((t) => t.id === tab) ?? TRUEQUILL_INSTALL_TABS[0];

  useEffect(() => {
    const apply = () => {
      if (window.location.hash === '#truequill') {
        document.title = `${TRUEQUILL_META.title} | Naga Codex`;
        setMetaDescription(TRUEQUILL_META.description);
      }
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => {
      window.removeEventListener('hashchange', apply);
      document.title = HOME_TITLE;
      setMetaDescription(HOME_DESCRIPTION);
    };
  }, []);

  return (
    <section
      id="truequill"
      data-section="none"
      className="relative w-full min-h-[min(100dvh,980px)] flex flex-col justify-start py-14 sm:py-16 px-4 sm:px-6 md:px-12 section-canvas border-t border-neutral-200/80 overflow-x-hidden"
    >
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col gap-8 sm:gap-10">
        <header className="grid gap-6 lg:grid-cols-[1fr_minmax(200px,280px)] lg:items-end">
          <div className="flex flex-col gap-3 min-w-0">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-cyber">
              PRODUCT // TRUEQUILL
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-neutral-900 leading-tight">
              {TRUEQUILL_META.title}
            </h2>
            <p className="type-manifesto text-sm sm:text-base text-neutral-700 leading-relaxed max-w-2xl">
              {TRUEQUILL_META.description}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
              Free · {TRUEQUILL_FREE_DAILY_CHECKS} checks/day · score out of 5
            </p>
          </div>

          <div
            className="relative aspect-[5/6] w-full max-w-[240px] mx-auto lg:mx-0 lg:justify-self-end rounded-xl overflow-hidden border border-neutral-200 bg-[#0B1220] shadow-sm"
            aria-hidden={false}
          >
            <div
              className="absolute inset-0 opacity-80"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 20%, rgba(212,168,67,0.28), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(0,255,136,0.08), transparent 45%)',
              }}
            />
            <img
              src={truequillLogo}
              alt="TrueQuill gold cobra logo"
              width={512}
              height={610}
              className="relative z-10 w-full h-full object-contain p-5"
            />
          </div>
        </header>

        {/* What it does */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-lg sm:text-xl tracking-tight text-neutral-900">
            What it checks
          </h3>
          <p className="text-sm text-neutral-700 leading-relaxed max-w-3xl">
            Each of the five categories with at least one match costs 1 point. 5/5 means clean.
            Vocabulary and sentence patterns are strong AI signals; punctuation and three-item lists
            are weaker style signals; unsupported proof is worth verifying but may be a real claim.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {TRUEQUILL_CATEGORIES.map((cat) => (
              <li
                key={cat.id}
                className="flex flex-col gap-1.5 border border-neutral-200 bg-white rounded-xl p-4"
              >
                <span className="font-display font-bold text-sm text-neutral-900">{cat.name}</span>
                <span
                  className={`self-start font-mono text-[8px] tracking-wider uppercase px-1.5 py-0.5 rounded-sm border ${severityClass(cat.severity)}`}
                >
                  {cat.severityLabel}
                </span>
              </li>
            ))}
          </ul>

          <div className="border border-neutral-200 bg-white rounded-xl p-4 sm:p-5 flex flex-col gap-3">
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-cyber">
              Sample check
            </p>
            <blockquote className="font-mono text-sm text-neutral-800 leading-relaxed border-l-2 border-culture/50 pl-3">
              “{TRUEQUILL_SAMPLE.text}”
            </blockquote>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-display font-extrabold text-2xl text-neutral-900 tracking-tight">
                {TRUEQUILL_SAMPLE.score}/{TRUEQUILL_SAMPLE.maxScore}
              </p>
              <p className="text-sm text-neutral-700 leading-relaxed">{TRUEQUILL_SAMPLE.verdict}</p>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
              Flagged: {TRUEQUILL_SAMPLE.flagged.join(' · ')}
            </p>
          </div>
        </div>

        {/* Install */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-lg sm:text-xl tracking-tight text-neutral-900">
            Install
          </h3>
          <div
            role="tablist"
            aria-label="TrueQuill install platforms"
            className="flex flex-wrap gap-1.5"
          >
            {TRUEQUILL_INSTALL_TABS.map((t) => {
              const selected = t.id === tab;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    sound.playClick();
                    setTab(t.id);
                  }}
                  className={`min-h-11 px-3 py-2 rounded-lg font-mono text-[9px] tracking-widest uppercase transition-colors border ${
                    selected
                      ? 'bg-[#162035] text-cyber border-cyber/40'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            className="border border-neutral-200 bg-white rounded-xl p-4 sm:p-5 flex flex-col gap-3"
          >
            {activeTab.note ? (
              <p className="font-mono text-[10px] uppercase tracking-wider text-culture">
                {activeTab.note}
              </p>
            ) : null}
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-neutral-700 leading-relaxed">
              {activeTab.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            {activeTab.command ? (
              <pre className="overflow-x-auto p-3 sm:p-4 bg-black border border-neutral-800 rounded-lg font-mono text-[11px] sm:text-[12px] text-cyber">
                {activeTab.command}
              </pre>
            ) : null}
            {tab !== 'chatgpt-free' ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
                <code className="flex-1 min-w-0 overflow-x-auto font-mono text-[11px] text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5">
                  {TRUEQUILL_MCP_URL}
                </code>
                <CopyUrlButton text={TRUEQUILL_MCP_URL} label="TrueQuill MCP URL" />
              </div>
            ) : null}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <a
            href={TRUEQUILL_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-lg border border-neutral-300 bg-white font-mono text-[10px] uppercase tracking-wider text-neutral-800 hover:border-cyber/50 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub repo
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          <a
            href={TRUEQUILL_PRO_URL}
            onClick={() => sound.playClick()}
            className="inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-lg border border-culture/40 bg-culture/5 font-mono text-[10px] uppercase tracking-wider text-culture hover:border-culture/70 transition-colors"
          >
            TrueQuill Pro
            <span className="text-[8px] tracking-widest opacity-80">Coming soon</span>
          </a>
        </div>
      </div>
    </section>
  );
}
