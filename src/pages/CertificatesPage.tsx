import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, ZoomIn } from 'lucide-react';
import { certifications, type Certification } from '../lib/certifications';
import CertificationLightbox from '../components/CertificationLightbox';
import sound from '../lib/sound';

export default function CertificatesPage() {
  const [active, setActive] = useState<Certification | null>(null);

  useEffect(() => {
    document.title = 'Certificates & Education — Naga Codex | Maurice Holda';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-dvh bg-bg-dark text-text-main selection:bg-cyber/20 selection:text-cyber">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_40%_-10%,rgba(212,168,67,0.08),transparent_55%)]" />

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
          <Link
            to="/skills"
            onClick={() => sound.playClick()}
            className="font-mono text-[10px] uppercase tracking-widest text-cyber hover:text-white transition-colors min-h-[44px] flex items-center"
          >
            Skills
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <section className="pt-20 md:pt-28 pb-12 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 text-culture font-mono text-[9px] tracking-[0.3em] uppercase mb-4">
              <Award className="w-3.5 h-3.5" />
              <span>Education</span>
            </div>
            <h1 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight max-w-3xl leading-[1.05]">
              Certificates
            </h1>
            <p className="mt-6 max-w-2xl font-sans text-base md:text-lg text-text-muted leading-relaxed">
              Verified credentials from Cert-IT, Masterschool, and the Digital Career Institute —
              AI management, cyber security analysis, and full-stack web development.
            </p>
          </div>
        </section>

        <section className="pb-20 md:pb-28 px-4 md:px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {certifications.map((cert) => (
              <button
                key={cert.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActive(cert);
                }}
                className={`group text-left flex flex-col rounded-xl bg-black/40 border ${cert.borderColor} hover:border-white/20 transition-ui overflow-hidden cursor-pointer`}
              >
                <div className="relative aspect-[3/4] bg-neutral-950 border-b border-white/5 overflow-hidden">
                  <img
                    src={cert.image}
                    alt={`${cert.title} certificate issued by ${cert.issuer}`}
                    className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider bg-white text-[#050C17] px-3 py-2 rounded-md">
                      <ZoomIn className="w-3.5 h-3.5" />
                      View full size
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                    {cert.issuer}
                  </span>
                  <h2
                    className={`font-display font-extrabold text-lg text-white tracking-tight ${cert.accentClass}`}
                  >
                    {cert.title}
                  </h2>
                  <span className="font-mono text-xs text-neutral-500">{cert.completed}</span>
                  <p className="font-sans text-sm text-text-muted leading-relaxed pt-1">{cert.detail}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <footer className="py-12 border-t border-white/5 text-center">
          <Link
            to="/"
            onClick={() => sound.playClick()}
            className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-culture transition-colors"
          >
            ← Back to nagacodex.cloud
          </Link>
        </footer>
      </main>

      <CertificationLightbox certification={active} onClose={() => setActive(null)} />
    </div>
  );
}
