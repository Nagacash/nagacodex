import { ExternalLink, Sparkles } from 'lucide-react';
import sound from '../lib/sound';
import nagaAdsImg from '../assets/images/showcase/naga-ads.jpg';
import nagafilmsImg from '../assets/images/showcase/nagafilms.jpg';
import nagaApparelImg from '../assets/images/showcase/naga-apparel.jpg';
import chosenFewImg from '../assets/images/showcase/chosen-few-records.jpg';

interface StudioProduct {
  id: string;
  title: string;
  description: string;
  url: string;
  accent: string;
  image: string;
  imageAlt: string;
}

const products: StudioProduct[] = [
  {
    id: 'sonic-ads',
    title: 'Sonic Micro-Ads',
    description:
      '5–10 second musical ads for small brands: custom jingle, animation, and sonic logo. From €290 — packages for YouTube, Meta, and TikTok.',
    url: 'https://www.naga-ads.shop/',
    accent: '#D4A843',
    image: nagaAdsImg,
    imageAlt: 'Sonic Micro-Ads campaign still',
  },
  {
    id: 'films',
    title: 'Naga Films Studio',
    description: 'Self-hostable AI video tools: image gen, video synthesis, cinema workflows, lip-sync.',
    url: 'https://www.naga-films.com/',
    accent: '#FF6B35',
    image: nagafilmsImg,
    imageAlt: 'Naga Films Studio production still',
  },
  {
    id: 'apparel',
    title: 'Naga Apparel',
    description: 'Technical streetwear from Hamburg. 450 GSM cotton, limited runs, sold direct.',
    url: 'https://nagaclub.de',
    accent: '#D4A843',
    image: nagaApparelImg,
    imageAlt: 'Naga Apparel technical streetwear',
  },
  {
    id: 'records',
    title: 'Chosen Few Records',
    description: 'Hamburg label for hip-hop and electronic. Production, A&R, artist development.',
    url: 'https://www.chosenfewrecords.com/',
    accent: '#FF6B35',
    image: chosenFewImg,
    imageAlt: 'Chosen Few Records artwork',
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
        <div className="flex flex-col gap-3 max-w-xl">
          <div className="flex items-center gap-2 text-culture font-mono text-[9px] tracking-[0.3em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-culture" />
            <span>Beyond Code</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-neutral-900 uppercase leading-none">
            Studio <span className="text-neutral-500">Ecosystem</span>
          </h2>
          <p className="max-w-md type-manifesto text-sm text-neutral-800 leading-relaxed">
            Hamburg ventures: sonic micro-ads, film studio, streetwear, and music label.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {products.map((product) => (
            <a
              key={product.id}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="group flex flex-col gap-4 cursor-pointer h-full"
            >
              <div className="relative aspect-[16/10] overflow-hidden border border-neutral-200 bg-neutral-100">
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent pointer-events-none"
                  aria-hidden
                />
                <span
                  className="absolute bottom-3 left-3 w-2 h-2 rounded-full ring-2 ring-white/80"
                  style={{ backgroundColor: product.accent }}
                  aria-hidden
                />
              </div>

              <div className="flex flex-col gap-2 px-0.5">
                <h3 className="font-display font-semibold text-lg tracking-tight text-neutral-900">
                  {product.title}
                </h3>
                <p className="type-manifesto text-sm text-neutral-700 leading-relaxed flex-1">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 pt-1 text-sm type-manifesto font-semibold text-neutral-800 group-hover:text-neutral-950 transition-colors">
                  <span>Visit</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
