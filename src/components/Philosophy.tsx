import { motion } from 'motion/react';
import { Eye, ShieldAlert, Cpu } from 'lucide-react';
import VideoBackground from './VideoBackground';

export default function Philosophy() {
  const line1 = "WE_BUILD_SOVEREIGN_SYSTEMS".split("_");
  const line2 = "WE_DIRECT_ARTIFICIAL_ENZYMES".split("_");
  const line3 = "WE_WEAR_DECLARATIVE_ARMORS".split("_");

  // Dynamic animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 18, rotate: 4 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: 'spring',
        damping: 14,
        stiffness: 120,
      },
    },
  };

  return (
    <section
      id="philosophy-section"
      data-section="film"
      className="relative w-full min-h-dvh flex flex-col justify-center py-24 px-6 md:px-12 bg-transparent border-t border-neutral-900 overflow-hidden"
    >

      {/* Decorative center coordinate target lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <div className="w-full h-[1px] bg-neutral-700" />
        <div className="h-full w-[1px] bg-neutral-700 absolute" />
        <div className="w-48 h-48 rounded-full border border-neutral-600 absolute animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center gap-16 text-center">
        
        {/* Fine Header badge */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 font-mono text-[9px] text-[#FF6B35] tracking-[0.3em] uppercase mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>NAGA_OPERATING_PHILOSOPHY</span>
          </div>
          <span className="h-[1px] w-6 bg-film" />
        </div>

        {/* Dense centered sequential manifesto lines */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.35 }}
          className="flex flex-col gap-6 md:gap-10 items-center justify-center font-display uppercase w-full select-none"
        >
          {/* Row 1 */}
          <div className="flex flex-wrap items-center justify-center text-2xl md:text-5xl lg:text-5xl font-extrabold tracking-wider text-white">
            {line1.map((w, idx) => (
              <motion.span key={`l1-${idx}`} variants={wordVariants} className="inline-block mr-3 leading-none">
                {w}
              </motion.span>
            ))}
          </div>

          <div className="w-1.5 h-1.5 rounded-full bg-film/40" />

          {/* Row 2 */}
          <div className="flex flex-wrap items-center justify-center text-2xl md:text-5xl lg:text-5xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-400">
            {line2.map((w, idx) => (
              <motion.span key={`l2-${idx}`} variants={wordVariants} className="inline-block mr-3 leading-none">
                {w}
              </motion.span>
            ))}
          </div>

          <div className="w-1.5 h-1.5 rounded-full bg-film/40" />

          {/* Row 3 */}
          <div className="flex flex-wrap items-center justify-center text-2xl md:text-5xl lg:text-5xl font-extrabold tracking-wider text-white">
            {line3.map((w, idx) => (
              <motion.span key={`l3-${idx}`} variants={wordVariants} className="inline-block mr-3 leading-none">
                {w}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Description subtext */}
        <p className="max-w-xl text-[10.5px] md:text-xs font-mono text-neutral-500 uppercase tracking-widest leading-relaxed pt-8 border-t border-neutral-900">
          WE DO NOT WORK WITH TEMPLATES. WE INTEGRATE DEFENSIVE AUDITS WITH DENSE ATMOSPHERIC CINEMA AND HEAVY RAW STITCH APPAREL. IN ST. PAULI, WE HARDEN THE SYSTEM CORES.
        </p>
      </div>

      {/* Decorative bottom metadata */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-mono text-neutral-600 tracking-widest uppercase">
        N_C_SYS_LOGS_ACTIVE // ALPHA_100
      </div>
    </section>
  );
}
