import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface FloatingClipsProps {
  theme: 'cyber' | 'film' | 'culture';
}

export default function FloatingClips({ theme }: FloatingClipsProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const md = window.matchMedia('(pointer: coarse)');
    setIsMobile(md.matches);

    if (md.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Map mouse coordinates to center-relative ratios (-0.5 to 0.5)
      const rx = (e.clientX / window.innerWidth) - 0.5;
      const ry = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x: rx, y: ry });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isMobile) return null;

  // Render decorative HUD elements corresponding to the active theme
  const getGlowColor = () => {
    if (theme === 'cyber') return 'rgba(0, 255, 136, 0.15)';
    if (theme === 'film') return 'rgba(255, 107, 53, 0.15)';
    return 'rgba(212, 168, 67, 0.15)';
  };

  const getBorderColor = () => {
    if (theme === 'cyber') return 'border-cyber/30';
    if (theme === 'film') return 'border-film/30';
    return 'border-culture/30';
  };

  const getTxtColor = () => {
    if (theme === 'cyber') return 'text-cyber';
    if (theme === 'film') return 'text-film';
    return 'text-culture';
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none w-full h-full">
      {/* 1. Deep Background Decorative Grid Drift (Sensitivity: 10px) */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`,
        }}
      >
        <div className={`absolute w-96 h-96 top-[15%] left-[5%] rounded-full blur-[140px] opacity-20`}
             style={{ backgroundColor: getGlowColor() }} />
        <div className={`absolute w-[500px] h-[500px] bottom-[10%] right-[3%] rounded-full blur-[160px] opacity-15`}
             style={{ backgroundColor: getGlowColor() }} />
      </div>

      {/* 2. Midground Floating HUD Badges (Sensitivity: 24px) */}
      <div
        className="absolute inset-0 z-10 transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * 28}px, ${mousePos.y * 28}px, 0)`,
        }}
      >
        {/* Floating coordinate node (Left) */}
        <div className={`absolute left-10 top-1/3 p-4 border ${getBorderColor()} rounded-lg bg-black/40 backdrop-blur-md font-mono hidden md:flex flex-col gap-1 text-[8px] opacity-50`}>
          <div className={`flex items-center gap-1.5 ${getTxtColor()} font-bold`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            <span>ORBIT_VECTOR_01</span>
          </div>
          <span className="text-neutral-500">SYS_LOCK: SECURE</span>
          <span className="text-neutral-400">FPS: 60.00 // LATENCY: 4MS</span>
        </div>

        {/* Floating wireframe hexagonal ring (Right) */}
        <div className="absolute right-12 top-1/4 hidden lg:flex flex-col items-end opacity-45">
          <svg className={`w-28 h-28 stroke-current fill-none ${getTxtColor()}`} viewBox="0 0 100 100">
            <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" strokeWidth="0.8" strokeDasharray="4, 4" />
            <polygon points="50,22 74,36 74,64 50,78 26,64 26,36" strokeWidth="1.2" />
            <circle cx="50" cy="50" r="4" className="fill-current" />
          </svg>
          <div className="text-[7px] font-mono mt-2 tracking-widest text-neutral-500">
            Naga_Matrix_Mesh.obj
          </div>
        </div>

        {/* Bottom vertical coordinate tracker */}
        <div className="absolute bottom-1/4 left-1/4 hidden xl:block opacity-30">
          <div className={`h-24 w-[1px] bg-gradient-to-b from-transparent via-current to-transparent ${getTxtColor()}`} />
          <div className="text-[7px] font-mono text-neutral-500 whitespace-nowrap mt-2 -translate-x-1/2">
            AZIMUTH: +144.59°
          </div>
        </div>
      </div>
    </div>
  );
}
