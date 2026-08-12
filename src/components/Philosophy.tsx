import { motion } from 'motion/react';
import { Cpu } from 'lucide-react';

export default function Philosophy() {
  const line1 = 'WE BUILD SOVEREIGN SYSTEMS'.split(' ');
  const line2 = 'WE DIRECT ARTIFICIAL ENZYMES'.split(' ');
  const line3 = 'WE WEAR DECLARATIVE ARMORS'.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 140,
      },
    },
  };

  return (
    <section
      id="philosophy-section"
      data-section="film"
      className="relative w-full min-h-dvh flex flex-col justify-start pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% 42%, rgba(255,107,53,0.12), transparent 68%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,0,0,0.45), transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-12 md:gap-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-[9px] text-film tracking-[0.3em] uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>Operating philosophy</span>
          </div>
          <span className="h-px w-8 bg-film/50" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col gap-5 md:gap-8 items-center justify-center font-display uppercase w-full select-none"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xl sm:text-2xl md:text-4xl lg:text-[2.75rem] font-extrabold tracking-wide text-white leading-tight">
            {line1.map((word, idx) => (
              <motion.span key={`l1-${idx}`} variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            ))}
          </div>

          <div className="w-1 h-1 rounded-full bg-film/50" />

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xl sm:text-2xl md:text-4xl lg:text-[2.75rem] font-extrabold tracking-wide leading-tight text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-400">
            {line2.map((word, idx) => (
              <motion.span key={`l2-${idx}`} variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            ))}
          </div>

          <div className="w-1 h-1 rounded-full bg-film/50" />

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xl sm:text-2xl md:text-4xl lg:text-[2.75rem] font-extrabold tracking-wide text-white leading-tight">
            {line3.map((word, idx) => (
              <motion.span key={`l3-${idx}`} variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <p className="max-w-lg text-[10.5px] md:text-xs type-manifesto-tight text-neutral-400 leading-relaxed pt-8 border-t border-neutral-800/80">
          We do not work with templates. We integrate defensive audits with dense atmospheric cinema and heavy raw
          stitch apparel. In St. Pauli, we harden the system cores.
        </p>
      </div>
    </section>
  );
}