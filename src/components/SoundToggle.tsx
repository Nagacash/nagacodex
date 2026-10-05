import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import sound from '../lib/sound';

export default function SoundToggle() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(sound.getEnabled());
    return sound.onChange(setActive);
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
      className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-[#0F1929] text-[10px] tracking-[0.2em] font-mono text-[#E8EDF5] hover:text-white hover:border-white/30 transition-ui pointer-events-auto cursor-pointer shadow-xs overflow-hidden"
      aria-label="Toggle ambient atmospheric drone"
    >
      {/* Decorative pulse glow background — behind label */}
      {active && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-cyber/15 animate-pulse pointer-events-none"
        />
      )}

      {/* Interactive Sound Wave Graphic */}
      <div className="relative z-10 flex items-center gap-[2px] h-3 w-4">
        {[2, 4, 1, 3].map((heightMulti, idx) => (
          <motion.span
            key={idx}
            className={`w-[1.5px] rounded-full ${
              active ? 'bg-cyber' : 'bg-[#8B9BB4]'
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

      <span className="relative z-10 uppercase select-none text-[#E8EDF5]">
        {active ? 'AUDIO_ON' : 'AUDIO_OFF'}
      </span>

      {active ? (
        <Volume2 className="relative z-10 w-3.5 h-3.5 text-cyber ml-1" />
      ) : (
        <VolumeX className="relative z-10 w-3.5 h-3.5 text-[#8B9BB4] ml-1" />
      )}
    </button>
  );
}
