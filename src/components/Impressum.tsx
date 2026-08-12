import { ArrowLeft } from 'lucide-react';
import { scrollToSection } from '../lib/scrollNav';
import sound from '../lib/sound';

export default function Impressum() {
  return (
    <section
      id="impressum-section"
      className="relative w-full min-h-dvh py-20 sm:py-24 px-4 sm:px-6 md:px-12 section-canvas border-t border-neutral-200/80"
    >
      <div className="relative z-10 w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-neutral-900 uppercase leading-none mb-4">
            Impressum
          </h1>
          <p className="type-manifesto text-sm text-neutral-600">Angaben gemäß §5 TMG</p>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none text-neutral-800 space-y-8 type-manifesto-tight">

          {/* Section 1 */}
          <div>
            <h2 className="font-display font-bold text-xl tracking-tight text-neutral-900 uppercase mb-3">
              Verantwortlich für den Inhalt
            </h2>
            <div className="space-y-1 text-sm leading-relaxed">
              <p>Maurice Holda</p>
              <p>Bei Schuldts Stift 2</p>
              <p>20355 Hamburg</p>
              <p>Deutschland</p>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="font-display font-bold text-xl tracking-tight text-neutral-900 uppercase mb-3">
              Kontakt
            </h2>
            <div className="space-y-1 text-sm">
              <a
                href="mailto:chosenfewrecords@hotmail.de"
                className="text-cyber hover:underline"
              >
                E-Mail: chosenfewrecords@hotmail.de
              </a>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="font-display font-bold text-xl tracking-tight text-neutral-900 uppercase mb-3">
              Hinweis
            </h2>
            <p className="text-sm leading-relaxed">
              Dies ist kein gewerblich eingetragenes Unternehmen (keine GmbH/UG). Verantwortliche Person im Sinne des §55 Abs. 2 RStV: Maurice Holda (Adresse wie oben).
            </p>
          </div>

        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <button
            onClick={() => {
              sound.playClick();
              scrollToSection(0);
            }}
            className="flex items-center gap-2 text-cyber hover:text-[#00DD77] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-sm uppercase tracking-widest">Zurück zur Startseite</span>
          </button>
        </div>
      </div>
    </section>
  );
}