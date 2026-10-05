import { homepageOffer } from '../content/homepageOffer';
import { BookingCta } from './BookingCta';

const workflowSteps = [
  'Inquiry comes in through a form, email or webhook.',
  'It is read and sorted against your criteria.',
  'A proposal draft is prepared in your wording.',
  'A person approves, edits or rejects it.',
  'The approved email is sent, or saved as a draft if preferred.',
  'A follow-up is scheduled automatically.',
  'Every run is logged step by step, so you can see what happened.',
];

function buildIntro(): string {
  if (homepageOffer.deliveryBusinessDays != null) {
    return `One manual workflow in your business, turned into an AI-assisted one, planned for ${homepageOffer.deliveryBusinessDays} business days. You keep control: nothing goes to a client until a person on your team approves it.`;
  }
  return 'One manual workflow in your business, turned into an AI-assisted one. You keep control: nothing goes to a client until a person on your team approves it.';
}

function buildIncludes(): string[] {
  const items = [
    'A short scoping call to pick the one workflow.',
    'The workflow built and connected to the systems agreed during scoping.',
    'Human approval before anything is sent.',
    'Testing with real examples.',
    'Handover walkthrough and a one-page written guide.',
  ];
  if (homepageOffer.includePostHandoverSupport) {
    items.push('Post-handover support, once the support duration and scope are confirmed.');
  }
  return items;
}

function buildExcludes(): string[] {
  const items = [
    'More than one workflow. Extra workflows are scoped separately.',
    'Running costs of third-party tools and AI usage, including subscriptions and API keys. These are paid directly by the client.',
    'Any promise of more leads or revenue. The sprint builds a process; results depend on the client’s inquiries and offer.',
  ];
  if (homepageOffer.includeHostingExclusionLine) {
    items.splice(
      2,
      0,
      'Ongoing hosting or a NagaFlow subscription unless agreed separately.',
    );
  }
  return items;
}

function buildHowItWorks(): string[] {
  return [
    'Fit call: free; we check that the workflow fits a sprint.',
    'Proposal: you get a written scope and price.',
    'Sprint: I build, you test.',
    'Handover: walkthrough and guide.',
  ];
}

/**
 * Eager-loaded offer block. Stable min-height avoids layout shift when flags flip.
 */
export default function OfferSection() {
  const includes = buildIncludes();
  const excludes = buildExcludes();
  const howItWorks = buildHowItWorks();
  const showPrice = homepageOffer.priceEur != null;

  return (
    <section
      id="offer"
      data-section="none"
      className="relative w-full min-h-[min(100dvh,920px)] flex flex-col justify-start py-14 sm:py-16 px-4 sm:px-6 md:px-12 section-canvas border-t border-neutral-200/80 overflow-x-hidden"
    >
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col gap-8 sm:gap-10">
        <header className="flex flex-col gap-3">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-cyber">
            THE OFFER
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-neutral-900 leading-tight">
            AI Workflow Sprint: from inquiry to proposal, with you approving every send.
          </h2>
          <p className="type-manifesto text-sm sm:text-base text-neutral-700 leading-relaxed">
            {buildIntro()}
          </p>
          {showPrice && (
            <p className="font-display font-extrabold text-xl sm:text-2xl text-neutral-900 tracking-tight">
              EUR {homepageOffer.priceEur}
              {homepageOffer.showTaxWording ? (
                <span className="block mt-1 font-mono text-[11px] font-normal tracking-normal text-neutral-600 normal-case">
                  no VAT charged (§19 UStG)
                </span>
              ) : null}
            </p>
          )}
          <div className="pt-1 w-full sm:w-auto sm:self-start">
            <BookingCta fullWidth />
          </div>
        </header>

        <div className="flex flex-col gap-6 text-sm text-neutral-700 leading-relaxed">
          <div>
            <h3 className="font-mono text-[9px] tracking-[0.25em] uppercase text-neutral-500 mb-2">
              Who it is for
            </h3>
            <p>
              Agencies, studios, event companies and project-based teams that answer client
              inquiries by hand and lose time or leads between the first message and the sent
              proposal.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-[9px] tracking-[0.25em] uppercase text-neutral-500 mb-2">
              The problem
            </h3>
            <p>
              Inquiries arrive by email and forms. Someone reads them, checks fit, writes a
              proposal, and remembers to follow up. It is slow, it depends on one person, and
              leads go quiet.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-[9px] tracking-[0.25em] uppercase text-neutral-500 mb-2">
              What we build
            </h3>
            <ol className="list-decimal pl-5 space-y-1.5">
              {workflowSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-mono text-[9px] tracking-[0.25em] uppercase text-neutral-500 mb-2">
              What is included
            </h3>
            <ul className="list-disc pl-5 space-y-1.5">
              {includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[9px] tracking-[0.25em] uppercase text-neutral-500 mb-2">
              What is not included
            </h3>
            <ul className="list-disc pl-5 space-y-1.5">
              {excludes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[9px] tracking-[0.25em] uppercase text-neutral-500 mb-2">
              How it works
            </h3>
            <ol className="list-decimal pl-5 space-y-1.5">
              {howItWorks.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="mt-3 font-medium text-neutral-800">
              Fixed schedule, direct contact with me throughout.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto sm:self-start pb-2">
          <BookingCta fullWidth />
        </div>
      </div>
    </section>
  );
}
