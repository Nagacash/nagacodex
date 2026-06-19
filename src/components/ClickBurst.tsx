import { useEffect, useRef } from 'react';
import { SectionTheme } from '../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

export default function ClickBurst() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fluid canvas sizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle updater loop
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        // Friction slowing down particles
        p.vx *= 0.94;
        p.vy *= 0.94;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        // Modern diamond/hexagonal particles or clean dots
        if (i % 2 === 0) {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        } else {
          // Sharp star/diamond
          ctx.moveTo(p.x, p.y - p.size);
          ctx.lineTo(p.x + p.size, p.y);
          ctx.lineTo(p.x, p.y + p.size);
          ctx.lineTo(p.x - p.size, p.y);
          ctx.closePath();
        }
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Global click listener to trigger burst
    const handleGlobalClick = (e: MouseEvent) => {
      // Find current section theme context
      const target = e.target as HTMLElement;
      let color = '#FFFFFF';

      if (target) {
        const sectionNode = target.closest('[data-section]');
        if (sectionNode) {
          const activeSec = sectionNode.getAttribute('data-section') as SectionTheme;
          if (activeSec === 'cyber') color = '#00FF88';
          else if (activeSec === 'film') color = '#FF6B35';
          else if (activeSec === 'culture') color = '#D4A843';
        }
      }

      const count = 10 + Math.floor(Math.random() * 5); // 10 to 14 particles
      const clientX = e.clientX;
      const clientY = e.clientY;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6; // Radiating speed range
        particlesRef.current.push({
          x: clientX,
          y: clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 3.5,
          color,
          alpha: 1.0,
          decay: 0.025 + Math.random() * 0.025, // fade timing ~0.5s - 0.8s
        });
      }
    };

    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('click', handleGlobalClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-45"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
