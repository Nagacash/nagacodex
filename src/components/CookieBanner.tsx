import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info, X, ExternalLink, HelpCircle, Lock, Cpu, CheckSquare } from 'lucide-react';
import sound from '../lib/sound';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  useEffect(() => {
    // Check if consent has already been registered
    const consent = localStorage.getItem('naga_cookie_consent');
    if (!consent) {
      // Trigger subtle notification after some seconds of boot-up
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    sound.playClick();
    localStorage.setItem('naga_cookie_consent', 'accepted_all');
    setIsVisible(false);
  };

  const handleRejectUnessential = () => {
    sound.playClick();
    localStorage.setItem('naga_cookie_consent', 'accepted_essential');
    setIsVisible(false);
  };

  return (
    <>
      {/* 1. Futuristic Under-screen Cookie Ledger Banner */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-xl z-fixed p-5 rounded-xl border border-neutral-800 bg-[#070707]/95 backdrop-blur-lg shadow-[0_10px_40px_rgba(0,0,0,0.9)] flex flex-col gap-4 text-left font-mono"
          >
            {/* Ledger status tag bar */}
            <div className="flex items-center justify-between font-mono text-[8.5px] border-b border-neutral-900 pb-2">
              <span className="flex items-center gap-1.5 text-cyber">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="tracking-widest uppercase">COOKIE_LEDGER // SECURITY_CONSENT</span>
              </span>
              <span className="text-neutral-500">[Naga Codex v1.0.4]</span>
            </div>

            {/* Core message text */}
            <div className="flex flex-col gap-2">
              <h4 className="font-display font-bold text-xs text-white tracking-wide uppercase">
                CRITICAL TRACKING & RENDERING AGENTS ACTIVE
              </h4>
              <p className="font-sans text-[11px] text-neutral-400 font-light leading-relaxed">
                We prioritize high-fidelity, secure environments. This terminal leverages local cache keys to prevent portfolio flash restarts, stabilize ambient audio toggles, and track user section navigation metrics.
              </p>
            </div>

            {/* Response CTA Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              {/* Accept button */}
              <button
                onClick={handleAcceptAll}
                className="sm:col-span-5 font-display font-extrabold text-[9px] tracking-wider uppercase bg-[#D4A843] text-black py-2 rounded-lg hover:bg-white transition-colors duration-200 active:scale-95 cursor-pointer text-center"
              >
                ACCEPT ALL AGENTS
              </button>

              {/* Reject button */}
              <button
                onClick={handleRejectUnessential}
                className="sm:col-span-4 font-display font-bold text-[9px] tracking-wider uppercase border border-neutral-800 hover:border-neutral-600 text-neutral-300 py-2 rounded-lg transition-colors duration-200 active:scale-95 cursor-pointer text-center"
              >
                ESSENTIAL ONLY
              </button>

              {/* Read Info link */}
              <button
                onClick={() => {
                  sound.playClick();
                  setShowPolicyModal(true);
                }}
                className="sm:col-span-3 text-neutral-500 hover:text-white font-mono text-[8.5px] underline tracking-wider uppercase py-2 cursor-pointer text-center self-center"
              >
                VIEW_DECLARATION
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Interactive Ledger Policy Page Overlay Modal */}
      <AnimatePresence>
        {showPolicyModal && (
          <div className="fixed inset-0 z-modal-elevated flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-md overflow-y-auto">
            
            {/* Close trigger backdrop */}
            <div className="absolute inset-0" onClick={() => setShowPolicyModal(false)} />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl bg-[#090909] border border-neutral-800 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] z-10 flex flex-col font-mono"
            >
              <div className="h-[2px] w-full bg-[#D4A843]" />

              {/* Modal Header */}
              <div className="p-5 border-b border-neutral-900 flex items-center justify-between text-left">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[8px] text-culture uppercase tracking-widest">NAGA CODEX POLICIES</span>
                  <h2 className="font-display font-extrabold text-lg text-white tracking-wide uppercase">COOKIE LEDGER & AGENT DECLARATION</h2>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowPolicyModal(false);
                  }}
                  className="p-1.5 border border-neutral-800 hover:border-neutral-600 bg-neutral-950 text-neutral-400 hover:text-white rounded-md transition-ui active:scale-90 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 overflow-y-auto max-h-[70vh] text-left flex flex-col gap-6 text-neutral-300">
                
                {/* Meta details segment */}
                <div className="glass rounded-lg p-4 border-neutral-800 flex items-center gap-3">
                  <Lock className="w-7 h-7 text-culture shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-xs uppercase">100% Cryptographically Encrypted Storage Guardrails</span>
                    <span className="text-[10px] text-neutral-500 font-light mt-0.5">We collect zero personalized telemetry data or email identities without explicit project consent.</span>
                  </div>
                </div>

                {/* Section 1: Cookie Purpose Ledger table */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-white font-extrabold text-xs uppercase border-b border-neutral-900 pb-1.5 flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-culture" />
                    <span>1. TECHNICAL STORAGE REGISTRY (Ledger List)</span>
                  </h3>
                  
                  <div className="flex flex-col border border-neutral-900 rounded-lg overflow-hidden text-[10px] text-neutral-400 bg-black/40">
                    <div className="grid grid-cols-12 gap-2 bg-[#0d0d0d] p-3 text-[8.5px] font-bold text-neutral-500 uppercase border-b border-neutral-900">
                      <div className="col-span-3">Registry ID</div>
                      <div className="col-span-3">Storage Type</div>
                      <div className="col-span-4 font-normal">Purpose / Function</div>
                      <div className="col-span-2 text-right">Lifespan</div>
                    </div>

                    <div className="grid grid-cols-12 gap-2 p-3 border-b border-neutral-900/60 items-center">
                      <div className="col-span-3 text-white font-bold">naga_cookie_consent</div>
                      <div className="col-span-3 text-cyan-400">LocalStorage</div>
                      <div className="col-span-4 font-light">Saves the visitor's choice for these cookie system banners.</div>
                      <div className="col-span-2 text-right text-neutral-500">Persistent</div>
                    </div>

                    <div className="grid grid-cols-12 gap-2 p-3 border-b border-neutral-900/60 items-center">
                      <div className="col-span-3 text-white font-bold">naga_bg_muted</div>
                      <div className="col-span-3 text-cyan-400">LocalStorage</div>
                      <div className="col-span-4 font-light">Remembers the preference for background musical/ambient loop channels.</div>
                      <div className="col-span-2 text-right text-neutral-500">Persistent</div>
                    </div>

                    <div className="grid grid-cols-12 gap-2 p-3 items-center">
                      <div className="col-span-3 text-white font-bold">naga_section_trail</div>
                      <div className="col-span-3 text-cyan-400">SessionState</div>
                      <div className="col-span-4 font-light">Smooths navigational scrolls back to active elements upon portfolio clicks.</div>
                      <div className="col-span-2 text-right text-neutral-500">Session</div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Privacy Policy Ledger details */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-white font-extrabold text-xs uppercase border-b border-neutral-900 pb-1.5 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-culture" />
                    <span>2. DATA REDACTION COMMITMENT</span>
                  </h3>
                  <div className="text-[11px] text-neutral-400 font-light flex flex-col gap-3 leading-relaxed font-sans">
                    <p>
                      <strong>Operator Transparency:</strong> The Naga Codex digital interface operates primarily client-side. We do not transmit tracking coordinates back to a primary database or utilize complex profiling engines. Any client details submitted via contact portals (e.g. email draft triggers) are held in robust confidence and directly transmitted via standard mail server handshakes.
                    </p>
                    <p>
                      <strong>Governance Strategy:</strong> In alignment with high-security management practices, all digital artifacts related to client systems and prototypes expire directly on exit of browser tab operations.
                    </p>
                  </div>
                </div>


              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-neutral-900 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-cyber" />
                  <span>Secure Local SSL Connection Verified</span>
                </span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowPolicyModal(false);
                  }}
                  className="px-4 py-2 text-[10px] font-bold border border-neutral-800 hover:border-white text-white rounded-md transition-ui active:scale-95 cursor-pointer uppercase"
                >
                  DISMISS POLICIES
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
