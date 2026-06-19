import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import sound from '../lib/sound';

export default function SoundToggle() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Keep sync with manager state (safeguards session caching)
    setActive(sound.getEnabled());
  }, []);

  const handleToggle = () => {
    const nextState = sound.toggle();
    setActive(nextState);
    if (nextState) {
      sound.playBeep();
    } else {
      // Just mechanical click on mute
      sound.playClick();
    }
  };

  return (
    <button
      id="sound-toggle-btn"
      onClick={handleToggle}
      className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-800 bg-black/60 backdrop-blur-md text-[10px] tracking-[0.2em] font-mono text-neutral-400 hover:text-white hover:border-neutral-500 transition-ui pointer-events-auto cursor-pointer"
      aria-label="Toggle ambient atmospheric drone"
    >
      {/* Decorative pulse glow background */}
      {active && (
        <span className="absolute inset-0 rounded-full bg-cyber/10 blur-[6px] animate-pulse" />
      )}

      {/* Interactive Sound Wave Graphic */}
      <div className="flex items-center gap-[2px] h-3 w-4">
        {[2, 4, 1, 3].map((heightMulti, idx) => (
          <motion.span
            key={idx}
            className={`w-[1.5px] rounded-full ${
              active ? 'bg-cyber' : 'bg-neutral-600'
            }`}
            animate={
              active
                ? {
                    height: ['4px', `${heightMulti * 3}px`, '4px'],
                  }
                : { height: '3px' }
            }
            transition={{
              duration: 0.6 + idx * 0.15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <span className="uppercase select-none">
        {active ? 'AUDIO_ON' : 'AUDIO_OFF'}
      </span>

      {active ? (
        <Volume2 className="w-3.5 h-3.5 text-cyber ml-1 animate-pulse" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-neutral-500 ml-1" />
      )}
    </button>
  );
}
