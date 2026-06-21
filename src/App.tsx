import { useState, lazy, Suspense } from 'react';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import ClickBurst from './components/ClickBurst';
import ScrollTransitionManager from './components/ScrollTransitionManager';
import TransitionSection from './components/TransitionSection';
import FixedNavbar from './components/FixedNavbar';
import { heroIntro, philosophyAmbient, whoAmbient } from './lib/films';

const Hero = lazy(() => import('./components/Hero'));
const WhoSection = lazy(() => import('./components/WhoSection'));
const WorkGrid = lazy(() => import('./components/WorkGrid'));
const Philosophy = lazy(() => import('./components/Philosophy'));
const ShowcaseCarousel = lazy(() => import('./components/ShowcaseCarousel'));
const Woodland360Section = lazy(() => import('./components/Woodland360Section'));
const Contact = lazy(() => import('./components/Contact'));
const CookieBanner = lazy(() => import('./components/CookieBanner'));

const SectionFallback = () => <div className="min-h-dvh w-full bg-bg-dark" />;

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

          {/* Fixed navbar - visible across all sections */}
          <FixedNavbar />

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
                    <Suspense fallback={<SectionFallback />}>
                      <Hero />
                    </Suspense>
                  </TransitionSection>

                {/* 02. WHO */}
                <TransitionSection
                  id="who"
                  transitionType="horizontal-slide"
                  accentColor="#FF6B35"
                  index={1}
                  bgVideoWebm={whoAmbient.webm}
                  bgVideoMp4={whoAmbient.h264}
                >
                  <Suspense fallback={<SectionFallback />}>
                    <WhoSection />
                  </Suspense>
                </TransitionSection>

                {/* 03. WORK */}
                <TransitionSection id="work" transitionType="scale-blur" accentColor="#BD00FF" index={2}>
                  <Suspense fallback={<SectionFallback />}>
                    <WorkGrid />
                  </Suspense>
                </TransitionSection>

                {/* 04. PHILOSOPHY */}
                <TransitionSection
                  id="philosophy"
                  transitionType="split-reveal"
                  accentColor="#D4A843"
                  index={3}
                  bgVideoWebm={philosophyAmbient.webm}
                  bgVideoMp4={philosophyAmbient.h264}
                >
                  <Suspense fallback={<SectionFallback />}>
                    <Philosophy />
                  </Suspense>
                </TransitionSection>

                {/* 05. WOODLAND360 PODCAST */}
                <TransitionSection id="woodland360" transitionType="horizontal-slide" accentColor="#D4A843" index={4}>
                  <Suspense fallback={<SectionFallback />}>
                    <Woodland360Section />
                  </Suspense>
                </TransitionSection>

                {/* 06. SHOWCASE CAROUSEL */}
                <TransitionSection id="showcase" transitionType="scale-blur" accentColor="#D4A843" index={5}>
                  <Suspense fallback={<SectionFallback />}>
                    <ShowcaseCarousel />
                  </Suspense>
                </TransitionSection>

                {/* 07. CONTACT */}
                <TransitionSection id="contact" transitionType="push-fade" accentColor="#3B82F6" index={6}>
                  <Suspense fallback={<SectionFallback />}>
                    <Contact />
                  </Suspense>
                </TransitionSection>

              </ScrollTransitionManager>
            </main>

            <Suspense fallback={null}>
              <CookieBanner />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
