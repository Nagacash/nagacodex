import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import sound from '../lib/sound';

interface StudioProduct {
  id: string;
  title: string;
  description: string;
  url: string;
  accent: string;
  icon: React.ReactNode;
}

const products: StudioProduct[] = [
  {
    id: 'films',
    title: 'Naga Films Studio',
    description: 'Self-hostable AI video production suite — image generation, video synthesis, cinema workflows, and lip-sync.',
    url: 'https://nagafilms-studio.vercel.app/',
    accent: '#FF6B35',
    icon: '🎬',
  },
  {
    id: 'apparel',
    title: 'Naga Apparel',
    description: 'Technical streetwear from Hamburg — 450 GSM brutalist construction, cryptographic prints, direct-to-fan.',
    url: 'https://nagaclub.de',
    accent: '#D4A843',
    icon: '👕',
  },
  {
    id: 'records',
    title: 'Chosen Few Records',
    description: 'Hamburg underground music label — hip-hop and electronic production, A&R, artist development.',
    url: 'https://chosenfewrecrecords.vercel.app/',
    accent: '#FF6B35',
    icon: '🎵',
  },
];

export default function StudioEcosystem() {
  return (
    <section
      id="studio-ecosystem-section"
      data-section="culture"
      className="relative w-full min-h-dvh py-16 sm:py-20 px-4 sm:px-6 md:px-12 section-canvas border-t border-neutral-200/80"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <div className="flex flex-col gap-3 max-w-xl">
          <div className="flex items-center gap-2 text-culture font-mono text-[9px] tracking-[0.3em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A843]" />
            <span>Beyond Code</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-neutral-900 uppercase leading-none">
            Studio <span className="text-neutral-500">Ecosystem</span>
          </h2>
          <p className="max-w-md type-manifesto text-sm text-neutral-800 leading-relaxed">
            Three independent ventures rooted in Hamburg — each built from scratch, each with its own discipline.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <a
              key={product.id}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="group flex flex-col gap-4 p-6 rounded-xl border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-md transition-ui cursor-pointer h-full"
            >
              {/* Icon */}
              <div className="text-4xl">{product.icon}</div>

              {/* Title */}
              <h3 className="font-display font-semibold text-lg tracking-tight text-neutral-900">
                {product.title}
              </h3>

              {/* Description */}
              <p className="type-manifesto text-sm text-neutral-700 leading-relaxed flex-1">
                {product.description}
              </p>

              {/* CTA */}
              <div className="flex items-center gap-2 pt-2 text-sm type-manifesto font-semibold group-hover:text-neutral-900 transition-colors">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: product.accent }}
                />
                <span>Visit</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
