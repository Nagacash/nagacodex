import { useState } from 'react';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import ClickBurst from './components/ClickBurst';
import Hero from './components/Hero';
import WhoSection from './components/WhoSection';
import WorkGrid from './components/WorkGrid';
import Philosophy from './components/Philosophy';
import ShowcaseCarousel from './components/ShowcaseCarousel';
import Woodland360Section from './components/Woodland360Section';
import Contact from './components/Contact';
import CookieBanner from './components/CookieBanner';
import ScrollTransitionManager from './components/ScrollTransitionManager';
import TransitionSection from './components/TransitionSection';
import { heroIntro } from './lib/films';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative min-h-dvh selection:bg-cyber/20 selection:text-cyber bg-bg-dark">
      {/* 1. Full-screen SVGs interactive boot manager */}
      <Preloader onComplete={() => setLoading(false)} />

      {!loading && (
        <div className="page-enter">
          {/* Skip to main content link for outstanding keyboard accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-fixed focus:bg-black focus:text-cyber focus:p-4 focus:border focus:border-cyber focus:font-mono focus:text-[10px] uppercase tracking-wider rounded-md"
          >
            Skip to main content
          </a>

          {/* 2. Global micro-interactions layers */}
          <CustomCursor />
          <ClickBurst />

          {/* Background Noise/Texture */}
          <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-chrome"></div>

          {/* 3. Main structured layout streams */}
          <div id="main-content" className="relative flex flex-col w-full">
            <main className="relative flex flex-col w-full">
              <ScrollTransitionManager>
                
                {/* 01. HERO */}
                <TransitionSection
                  id="hero"
                  transitionType="push-fade"
                  accentColor="#00FF88"
                  index={0}
                  bgVideoWebm={heroIntro.webm}
                  bgVideoMp4={heroIntro.h264}
                >
                  <Hero />
                </TransitionSection>

                {/* 02. WHO */}
                <TransitionSection id="who" transitionType="horizontal-slide" accentColor="#FF6B35" index={1}>
                  <WhoSection />
                </TransitionSection>

                {/* 03. WORK */}
                <TransitionSection id="work" transitionType="scale-blur" accentColor="#BD00FF" index={2}>
                  <WorkGrid />
                </TransitionSection>

                {/* 04. PHILOSOPHY */}
                <TransitionSection id="philosophy" transitionType="split-reveal" accentColor="#D4A843" index={3}>
                  <Philosophy />
                </TransitionSection>

                {/* 05. WOODLAND360 PODCAST */}
                <TransitionSection id="woodland360" transitionType="horizontal-slide" accentColor="#D4A843" index={4}>
                  <Woodland360Section />
                </TransitionSection>

                {/* 06. SHOWCASE CAROUSEL */}
                <TransitionSection id="showcase" transitionType="scale-blur" accentColor="#D4A843" index={5}>
                  <ShowcaseCarousel />
                </TransitionSection>

                {/* 07. CONTACT */}
                <TransitionSection id="contact" transitionType="push-fade" accentColor="#3B82F6" index={6}>
                  <Contact />
                </TransitionSection>

              </ScrollTransitionManager>
            </main>

            <CookieBanner />
          </div>
        </div>
      )}
    </div>
  );
}
