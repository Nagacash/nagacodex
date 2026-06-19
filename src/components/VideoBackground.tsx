import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SectionTheme } from '../types';

interface VideoBackgroundProps {
  webmSrc?: string;
  mp4Src?: string;
  posterSrc?: string;
  blendMode?: string;
  parallaxIntensity?: number;
  playbackMode?: 'loop' | 'scroll-reactive';
  themeFallback?: SectionTheme;
}

export default function VideoBackground({
  webmSrc,
  mp4Src,
  posterSrc,
  blendMode = 'normal',
  parallaxIntensity = 0.3,
  playbackMode = 'loop',
  themeFallback = 'none',
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [useCanvas, setUseCanvas] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  // 1. Accessibility listener
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', onMotionChange);
    return () => motionQuery.removeEventListener('change', onMotionChange);
  }, []);

  // 2. Parallax calculations
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      // Drifts proportionate to alignment
      setOffsetY(scrolled * -parallaxIntensity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallaxIntensity, prefersReducedMotion]);

  // 3. Scroll reactive velocity mapping (Gsap-like speed ramp using smooth animation decay)
  useEffect(() => {
    if (playbackMode !== 'scroll-reactive' || !videoRef.current || prefersReducedMotion) return;

    let lastScroll = window.scrollY;
    let targetSpeed = 1.0;
    let currentSpeed = 1.0;
    let frameId: number;

    const checkVelocity = () => {
      const currentScroll = window.scrollY;
      const delta = Math.abs(currentScroll - lastScroll);
      lastScroll = currentScroll;

      // Rate mapping bounds: normal 1.0x to scroll-fast 1.8x
      targetSpeed = 1.0 + Math.min(delta / 30, 0.8);

      // Smooth interpolation (dampening)
      currentSpeed += (targetSpeed - currentSpeed) * 0.15;

      if (videoRef.current) {
        try {
          videoRef.current.playbackRate = Number(currentSpeed.toFixed(2));
        } catch (e) {
          // Guard against mobile/browser limitation errors on video playback speed altering
        }
      }

      frameId = requestAnimationFrame(checkVelocity);
    };

    frameId = requestAnimationFrame(checkVelocity);
    return () => cancelAnimationFrame(frameId);
  }, [playbackMode, prefersReducedMotion]);

  // 4. Lazy loading / Pause off-screen (Performance enhancement)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!prefersReducedMotion) {
              video.play().catch(() => {});
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // 5. High-end synthetic canvas artwork fallback if video does not exist/fails to play
  useEffect(() => {
    // Attempt standard loading of video first
    const video = videoRef.current;
    if (video) {
      const handleError = () => {
        setUseCanvas(true);
      };
      video.addEventListener('error', handleError);
      return () => video.removeEventListener('error', handleError);
    } else {
      setUseCanvas(true);
    }
  }, [webmSrc, mp4Src]);

  // Canvas Shader Loop
  useEffect(() => {
    if (!useCanvas || !canvasRef.current || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initial setup based on section theme fallback
    interface Entity {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      speed: number;
      char?: string;
    }

    const entities: Entity[] = [];

    if (themeFallback === 'cyber') {
      // Binary matrix rain style
      const columns = Math.floor(window.innerWidth / 20);
      for (let i = 0; i < columns; i++) {
        entities.push({
          x: i * 20,
          y: Math.random() * -1000,
          vx: 0,
          vy: 2 + Math.random() * 4,
          size: 10 + Math.random() * 6,
          alpha: 0.2 + Math.random() * 0.6,
          speed: 1,
        });
      }
    } else if (themeFallback === 'film') {
      // Drifting mist cells
      for (let i = 0; i < 40; i++) {
        entities.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: 0.2 + Math.random() * 0.3,
          vy: -0.1 - Math.random() * 0.2,
          size: 80 + Math.random() * 120,
          alpha: 0.05 + Math.random() * 0.1,
          speed: 1,
        });
      }
    } else if (themeFallback === 'culture') {
      // Golden shimmering particles
      for (let i = 0; i < 80; i++) {
        entities.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.3 - Math.random() * 0.5,
          size: 1 + Math.random() * 3,
          alpha: 0.1 + Math.random() * 0.7,
          speed: 1,
        });
      }
    } else if (themeFallback === 'dev') {
      // Violet code syntax symbols drifting
      const symbols = ['</>', '{ }', 'cosmic', 'npm', 'dev', 'api', 'const', 'import', '[]', '=>', 'git', 'web'];
      for (let i = 0; i < 35; i++) {
        entities.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.2 - Math.random() * 0.4,
          size: 11 + Math.random() * 6,
          alpha: 0.15 + Math.random() * 0.45,
          speed: 1,
          char: symbols[Math.floor(Math.random() * symbols.length)],
        });
      }
    } else {
      // Hero stellar backgroundfallback
      for (let i = 0; i < 60; i++) {
        entities.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: 0,
          vy: 0,
          size: 0.5 + Math.random() * 2,
          alpha: 0.1 + Math.random() * 0.6,
          speed: 0.02 + Math.random() * 0.05,
        });
      }
    }

    const draw = () => {
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (themeFallback === 'cyber') {
        ctx.fillStyle = '#00FF88';
        ctx.font = '20px monospace';
        entities.forEach((rain) => {
          ctx.globalAlpha = rain.alpha;
          // draw binary code stream
          const character = Math.random() > 0.5 ? '1' : '0';
          ctx.fillText(character, rain.x, rain.y);

          // subtle stream tail glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00FF88';

          rain.y += rain.vy;
          if (rain.y > canvas.height) {
            rain.y = Math.random() * -200;
            rain.vy = 2 + Math.random() * 4;
          }
        });
      } else if (themeFallback === 'film') {
        entities.forEach((cell) => {
          ctx.save();
          ctx.globalAlpha = cell.alpha;
          const gradient = ctx.createRadialGradient(cell.x, cell.y, 0, cell.x, cell.y, cell.size);
          gradient.addColorStop(0, 'rgba(255, 107, 53, 0.2)');
          gradient.addColorStop(0.5, 'rgba(255, 107, 53, 0.05)');
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(cell.x, cell.y, cell.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          cell.x += cell.vx;
          cell.y += cell.vy;

          if (cell.x - cell.size > canvas.width) cell.x = -cell.size;
          if (cell.y + cell.size < 0) cell.y = canvas.height + cell.size;
        });
      } else if (themeFallback === 'culture') {
        entities.forEach((gold) => {
          ctx.save();
          ctx.globalAlpha = gold.alpha;
          ctx.fillStyle = '#D4A843';
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#D4A843';
          ctx.beginPath();
          ctx.arc(gold.x, gold.y, gold.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // sparkle alpha oscillation
          gold.alpha += (Math.random() - 0.5) * 0.05;
          if (gold.alpha < 0.1) gold.alpha = 0.1;
          if (gold.alpha > 0.8) gold.alpha = 0.8;

          gold.x += gold.vx;
          gold.y += gold.vy;

          if (gold.y < 0) {
            gold.y = canvas.height;
            gold.x = Math.random() * canvas.width;
          }
        });
      } else if (themeFallback === 'dev') {
        entities.forEach((node) => {
          ctx.save();
          ctx.globalAlpha = node.alpha;
          ctx.fillStyle = '#BD00FF';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#BD00FF';
          ctx.font = `${node.size}px monospace`;
          ctx.fillText(node.char || '</>', node.x, node.y);
          ctx.restore();

          node.x += node.vx;
          node.y += node.vy;

          if (node.y < -30) {
            node.y = canvas.height + 20;
            node.x = Math.random() * canvas.width;
          }
          if (node.x < -30 || node.x > canvas.width + 30) {
            node.vx = -node.vx;
          }
        });
      } else {
        // Starfield slow glow
        entities.forEach((star) => {
          ctx.save();
          ctx.globalAlpha = star.alpha;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // pulse glow
          star.alpha += star.speed;
          if (star.alpha > 0.95 || star.alpha < 0.05) {
            star.speed = -star.speed;
          }
        });
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [useCanvas, themeFallback, prefersReducedMotion]);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 overflow-hidden select-none pointer-events-none w-full h-full"
      style={{
        mixBlendMode: blendMode as any,
        transform: 'translateZ(0)', // Force GPU layer
      }}
    >
      <motion.div
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{
          y: prefersReducedMotion ? 0 : offsetY,
        }}
      >
        {/* Poster / Reduced motion backdrop */}
        {prefersReducedMotion && posterSrc ? (
          <img
            src={posterSrc}
            className="w-full h-full object-cover opacity-30"
            alt="Static cover"
            referrerPolicy="no-referrer"
          />
        ) : useCanvas ? (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-25"
          />
        ) : (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            autoPlay
            className="w-full h-full object-cover opacity-20 transition-opacity duration-700"
            poster={posterSrc}
          >
            {webmSrc && <source src={webmSrc} type="video/webm" />}
            {mp4Src && <source src={mp4Src} type="video/mp4" />}
          </video>
        )}

        {/* Ambient Overlay Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A] opacity-90" />
      </motion.div>
    </div>
  );
}
