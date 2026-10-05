import { caseStudies, type CaseStudy } from '../content/caseStudies';

function hasProof(study: CaseStudy): boolean {
  const proof = study.proof;
  if (!proof) return false;
  if (proof.namingPermission === false) return false;
  const hasUrl = Boolean(proof.url);
  const hasShots = Boolean(proof.screenshots && proof.screenshots.length > 0);
  const hasVideo = Boolean(proof.demoVideoUrl);
  return hasUrl || hasShots || hasVideo;
}

function renderCaseStudy(study: CaseStudy) {
  const showProof = hasProof(study);
  const showTestimonial =
    Boolean(study.testimonial?.quote) && study.testimonial?.permission === true;

  return (
    <article
      key={study.id}
      className="flex flex-col gap-4 border border-neutral-200 bg-white rounded-xl p-5 sm:p-6"
    >
      <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-cyber">
        {study.label}
      </p>
      <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight text-neutral-900 leading-tight">
        {study.title}
      </h3>

      {study.problem ? (
        <div>
          <h4 className="font-mono text-[9px] tracking-[0.2em] uppercase text-neutral-500 mb-1.5">
            Problem
          </h4>
          <p className="text-sm text-neutral-700 leading-relaxed">{study.problem}</p>
        </div>
      ) : null}

      {study.role ? (
        <div>
          <h4 className="font-mono text-[9px] tracking-[0.2em] uppercase text-neutral-500 mb-1.5">
            My role
          </h4>
          <p className="text-sm text-neutral-700 leading-relaxed">{study.role}</p>
        </div>
      ) : null}

      {study.shipped && study.shipped.length > 0 ? (
        <div>
          <h4 className="font-mono text-[9px] tracking-[0.2em] uppercase text-neutral-500 mb-1.5">
            What shipped
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700 leading-relaxed">
            {study.shipped.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {showProof && study.proof ? (
        <div>
          <h4 className="font-mono text-[9px] tracking-[0.2em] uppercase text-neutral-500 mb-1.5">
            Proof
          </h4>
          <div className="flex flex-col gap-2 text-sm text-neutral-700">
            {study.proof.url ? (
              <a
                href={study.proof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyber hover:underline break-all"
              >
                {study.proof.url}
              </a>
            ) : null}
            {study.proof.screenshots?.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                className="w-full max-w-md rounded-lg border border-neutral-200"
                loading="lazy"
              />
            ))}
            {study.proof.demoVideoUrl ? (
              <a
                href={study.proof.demoVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyber hover:underline"
              >
                Demo video
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      {study.outcome ? (
        <div>
          <h4 className="font-mono text-[9px] tracking-[0.2em] uppercase text-neutral-500 mb-1.5">
            Outcome
          </h4>
          <p className="text-sm text-neutral-700 leading-relaxed">{study.outcome}</p>
        </div>
      ) : null}

      {showTestimonial && study.testimonial ? (
        <blockquote className="border-l-2 border-cyber/40 pl-4 text-sm text-neutral-700 italic leading-relaxed">
          {study.testimonial.quote}
        </blockquote>
      ) : null}
    </article>
  );
}

export default function CaseStudiesSection() {
  return (
    <section
      id="case-studies"
      data-section="none"
      className="relative w-full min-h-dvh flex flex-col justify-start py-14 sm:py-16 px-4 sm:px-6 md:px-12 section-canvas border-t border-neutral-200/80 overflow-x-hidden"
    >
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-cyber">
            Case studies
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-neutral-900 uppercase leading-none">
            Selected <span className="text-neutral-500">work</span>
          </h2>
        </header>

        <div className="flex flex-col gap-6">{caseStudies.map(renderCaseStudy)}</div>
      </div>
    </section>
  );
}
