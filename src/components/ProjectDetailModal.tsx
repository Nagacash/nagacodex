import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import sound from '../lib/sound';
import { ProjectItem } from '../types';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-modal flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-[#090909] border border-neutral-800 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 flex flex-col my-4"
        >
          <div className={`h-[2px] w-full ${project.id === 'p2' ? 'bg-film' : 'bg-culture'}`} />

          <div className="p-6 md:px-8 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">{project.category}</span>
              <h2 className="font-display font-extrabold text-xl md:text-2xl text-white tracking-wide uppercase">{project.title}</h2>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 border border-neutral-800 hover:border-neutral-600 bg-neutral-950 text-neutral-400 hover:text-white rounded-lg transition-ui active:scale-90 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[75vh]">
            <div className="flex flex-col gap-8 text-left">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden border border-neutral-800 group/img bg-black shadow-lg">
                  {project.id === 'p2' && project.videoSrc ? (
                    <video
                      className="w-full h-full object-cover block"
                      controls
                      playsInline
                      preload="metadata"
                      poster={project.thumbnail}
                    >
                      <source src={project.videoSrc} type="video/webm" />
                      {project.videoFallbackSrc && (
                        <source src={project.videoFallbackSrc} type="video/mp4" />
                      )}
                    </video>
                  ) : (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale opacity-40 group-hover/img:scale-103 group-hover/img:grayscale-0 transition-ui-slow block"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="font-mono text-[8px] text-neutral-500 bg-neutral-950/80 border border-neutral-800 px-2 py-0.5 rounded uppercase">
                      {project.id === 'p2' && project.videoSrc ? 'FILM_CLIP_PREVIEW' : 'IMAGE_SPEC_PREVIEW'}
                    </span>
                    <span className="font-mono text-[7px] text-neutral-500">REF_ID: N_C_9925</span>
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[8.5px] text-neutral-300 border border-neutral-800 bg-black/40 px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-display font-extrabold text-2xl text-white tracking-wide uppercase leading-none font-syne">
                    Project Abstract Spec Sheet
                  </h3>

                  <p className="font-sans text-xs md:text-sm text-neutral-300 font-light leading-relaxed">
                    {project.id === 'p2' && (
                      'Mandé Oyapock is a generative AI cinema piece — a narrative short built through text-to-video pipelines, custom sound design, and cinematic grading. The full clip plays in the preview panel above.'
                    )}
                    {project.id === 'p3' && (
                      'Heavy brutalist technical streetwear designed for metropolitan microclimates. Engineered with double-stitched 450 GSM organic terry cotton, water-repellent performance synthetics, and tactical modular storage pockets, exploring structural envelopes of physical textile interaction.'
                    )}
                    {project.id === 'p4' && (
                      'Hyper-Collision Chronicles is a modular narrative pipeline developed within real-time visual sandbox architectures. Integrating high-fidelity Unreal Engine 5 workflows with particle simulation matrices, generating fluidic collision mechanics for game visual streams with zero rendering pre-compiling.'
                    )}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-neutral-900 mt-2">
                    <div className="flex flex-col">
                      <span className="font-mono text-[7.5px] text-neutral-500 uppercase tracking-widest">Operator Rolle</span>
                      <span className="font-display font-black text-[10.5px] text-white mt-0.5 uppercase">Naga Lead</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[7.5px] text-neutral-500 uppercase tracking-widest">Released Epoch</span>
                      <span className="font-display font-black text-[10.5px] text-white mt-0.5 uppercase">2026 // Q2</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[7.5px] text-neutral-500 uppercase tracking-widest">System Pipeline</span>
                      <span className="font-display font-black text-[10.5px] text-[#D4A843] mt-0.5 uppercase">
                        {project.id === 'p2' ? 'GENERATIVE' : 'PRODUCTION'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[7.5px] text-neutral-500 uppercase tracking-widest">Verified Integrity</span>
                      <span className="font-display font-black text-[10.5px] text-cyber mt-0.5 uppercase">100% SECURE</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6 border-neutral-800 flex flex-col gap-4">
                <div className="flex justify-between items-center pb-2.5 border-b border-neutral-900">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">TECHNICAL DEPLOYMENT INFRASTRUCTURE SPEC</span>
                  <span className="font-mono text-[8px] text-neutral-500">BUILD_METRIC_REPORTS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[8px] text-[#D4A843] uppercase tracking-wider font-bold">1. INTENT OF EXECUTION</span>
                    <p className="font-sans text-[11px] text-neutral-400 font-light leading-relaxed">
                      To build cohesive bridges between high-performance systems and tactile everyday experiences, leveraging custom React rendering pipelines and specialized edge servers to minimize dynamic visual feedback loops.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[8px] text-[#D4A843] uppercase tracking-wider font-bold">2. PERFORMANCE BARRIER</span>
                    <p className="font-sans text-[11px] text-neutral-400 font-light leading-relaxed">
                      Strictly utilizing lightweight server-authoritative models, static compilation assets, and advanced WebGL shaders to allow interactive high-frame operations without stressing end-user local cycles.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[8px] text-[#D4A843] uppercase tracking-wider font-bold">3. SCALING METRICS</span>
                    <p className="font-sans text-[11px] text-neutral-400 font-light leading-relaxed">
                      Deploying automated container instances on green edge clusters in Europe, optimizing serverless routing layers so asset handshakes stay consistently below forty milliseconds globally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:px-8 border-t border-neutral-900 bg-neutral-950/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-[8.5px] text-neutral-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse" />
              <span>Naga Codex secure playground. No client logs stored.</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-5 py-2 text-xs font-mono border border-neutral-800 hover:border-white text-white hover:bg-white hover:text-black rounded-md transition-ui active:scale-95 cursor-pointer"
            >
              DISMISS_SPEC_VIEW
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
