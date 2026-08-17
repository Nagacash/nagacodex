import { SITE_UPDATED, SITE_UPDATED_LABEL } from '../lib/siteMeta';

/** Persistent legal links — TMG/DSGVO: easily reachable from every page state. */
export default function LegalFooter() {
  return (
    <footer
      aria-label="Legal and contact"
      className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:left-3 z-fixed pointer-events-auto safe-bottom safe-x"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[7px] tracking-widest uppercase text-neutral-500">
        <a href="/impressum.html" className="hover:text-neutral-300 transition-colors">
          Impressum
        </a>
        <span aria-hidden="true">·</span>
        <a href="/datenschutz.html" className="hover:text-neutral-300 transition-colors">
          Datenschutz
        </a>
        <span aria-hidden="true">·</span>
        <a href="mailto:chosenfewrecords@hotmail.de" className="hover:text-neutral-300 transition-colors">
          Contact
        </a>
        <span aria-hidden="true">·</span>
        <a
          href="/master-school"
          className="hover:text-neutral-300 transition-colors"
          title="Funded tech training — recommended by Naga Codex"
        >
          Recommended training
        </a>
        <span aria-hidden="true">·</span>
        <time dateTime={SITE_UPDATED} className="text-neutral-600">
          Updated {SITE_UPDATED_LABEL}
        </time>
      </nav>
    </footer>
  );
}
