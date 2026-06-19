import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mic2, Radio, ExternalLink, Play, Headphones, MapPin } from 'lucide-react';
import sound from '../lib/sound';
import { woodland360, woodland360EmbedUrl } from '../lib/podcast';

interface Woodland360SectionProps {
  isActive?: boolean;
}

export default function Woodland360Section({ isActive = false }: Woodland360SectionProps) {
  const [playerReady, setPlayerReady] = useState(false);
  const hasVideo = Boolean(woodland360.youtubeVideoId);

  const openChannel = () => {
    sound.pauseForContent();
    sound.playClick();
    window.open(woodland360.youtubeChannelUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="woodland360-section"
      data-section="culture"
      className="relative w-full min-h-dvh py-12 px-6 md:px-12 flex flex-col justify-between overflow-x-hidden select-text"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-amber-950/50 via-[#1a1408]/30 to-[#070707] opacity-95" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,168,67,0.12),transparent_55%)]" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none opacity-40" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between md:justify-start md:gap-8 border-b border-white/5 pb-6 shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-culture font-mono text-[9px] tracking-[0.3em] uppercase mb-1.5">
            <Radio className="w-3.5 h-3.5 text-culture animate-pulse" />
            <span>CULTURE // URBAN_AUDIO_TRANSMISSION</span>
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white uppercase leading-none">
            WOODLAND<span className="text-culture">360</span>
          </h2>
          <p className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest mt-2">
            {woodland360.tagline}
          </p>
        </div>
        <div className="mt-3 md:mt-0 md:self-end flex items-center gap-2 text-[8px] font-mono text-neutral-500 uppercase tracking-widest">
          <MapPin className="w-3 h-3 text-culture" />
          <span>Hamburg // ON_AIR</span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start my-auto py-6">
        <div className="lg:col-span-5 flex flex-col gap-5 text-left order-2 lg:order-1">
          <p className="font-sans text-xs md:text-sm text-neutral-300 leading-relaxed font-light">
            {woodland360.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {['Street Culture', 'Creative Tech', 'City Politics', 'Night Frequency'].map((tag) => (
              <span
                key={tag}
                className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 border border-neutral-800 bg-black/40 px-2.5 py-2 rounded-lg text-center"
              >
                #{tag.replace(/\s+/g, '_')}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-neutral-900 pt-4">
            <div className="flex items-center gap-2 font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
              <Headphones className="w-3.5 h-3.5 text-culture" />
              <span>Format: long-form urban podcast</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
              <Mic2 className="w-3.5 h-3.5 text-culture" />
              <span>Hosted by Maurice Holda // Naga Codex</span>
            </div>
          </div>

          <button
            type="button"
            onClick={openChannel}
            className="inline-flex items-center gap-2 self-start px-5 py-2.5 text-[9px] font-mono font-bold tracking-widest text-black rounded bg-culture hover:bg-white transition-ui active:scale-95 cursor-pointer uppercase"
          >
            <span>OPEN_YOUTUBE_CHANNEL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2 w-full">
          <div className="relative w-full rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950/80 glass shadow-[0_40px_90px_rgba(0,0,0,0.75)]">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-900 bg-black/60 font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-culture">
                <Play className="w-3 h-3" />
                Featured_Episode
              </span>
              <span>WOODLAND360 // YT_FEED</span>
            </div>

            <div className="relative aspect-video bg-black">
              {!hasVideo && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <Radio className="w-10 h-10 text-culture/60" />
                  <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest max-w-xs">
                    Set your YouTube video ID in <code className="text-culture">src/lib/podcast.ts</code>
                  </p>
                  <button
                    type="button"
                    onClick={openChannel}
                    className="font-mono text-[8px] text-culture border border-culture/30 px-3 py-1.5 rounded hover:bg-culture/10 transition-ui uppercase tracking-wider cursor-pointer"
                  >
                    Browse channel ↗
                  </button>
                </div>
              )}

              {hasVideo && !isActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-950">
                  <Play className="w-8 h-8 text-culture/50" />
                  <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
                    Scroll to load player
                  </span>
                </div>
              )}

              {hasVideo && isActive && (
                <motion.iframe
                  initial={{ opacity: 0 }}
                  animate={{ opacity: playerReady ? 1 : 0.4 }}
                  transition={{ duration: 0.4 }}
                  title={`${woodland360.name} featured episode`}
                  src={woodland360EmbedUrl(woodland360.youtubeVideoId)}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={() => setPlayerReady(true)}
                />
              )}

              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
            </div>

            <div className="px-4 py-3 flex justify-between items-center font-mono text-[7px] text-neutral-600 uppercase tracking-wider border-t border-neutral-900">
              <span>Signal: stereo // 48kHz</span>
              <span className="text-culture">LIVE_ARCHIVE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex justify-between items-center text-[7.5px] font-mono text-neutral-500 pt-6 border-t border-white/5 shrink-0">
        <span>PODCAST_MODULE // CULTURE_PILLAR</span>
        <span>WOODLAND360_TRANSMISSION</span>
        <span>HAMBURG_URBAN_FREQ</span>
      </div>
    </section>
  );
}
