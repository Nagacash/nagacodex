import { useState, lazy, Suspense, useEffect } from 'react';
import Preloader from './components/Preloader';
import ScrollTransitionManager from './components/ScrollTransitionManager';
import TransitionSection from './components/TransitionSection';
import FixedNavbar from './components/FixedNavbar';
import Hero from './components/Hero';
import sound from './lib/sound';
import { heroIntro } from './lib/films/hero';

const CustomCursor = lazy(() => import('./components/CustomCursor'));
const ClickBurst = lazy(() => import('./components/ClickBurst'));

const WhoSection = lazy(() => import('./components/WhoSection'));
const WorkGrid = lazy(() => import('./components/WorkGrid'));
const Philosophy = lazy(() => import('./components/Philosophy'));
const ShowcaseCarousel = lazy(() => import('./components/ShowcaseCarousel'));
const Woodland360Section = lazy(() => import('./components/Woodland360Section'));
const Contact = lazy(() => import('./components/Contact'));
const CookieBanner = lazy(() => import('./components/CookieBanner'));

const SectionFallback = () => (
  <div className="min-h-dvh w-full bg-bg-dark flex items-center justify-center">
    <span className="font-mono text-[10px] text-[#8B9BB4] uppercase tracking-widest animate-pulse">
      Loading…
    </span>
  </div>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showChromeFx, setShowChromeFx] = useState(false);

  useEffect(() => {
    sound.armMobileAutoplay();
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const handlePreloaderComplete = () => {
    window.scrollTo(0, 0);
    setLoading(false);
    requestAnimationFrame(() => {
      if (window.matchMedia('(pointer: coarse)').matches) return;
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => setShowChromeFx(true), { timeout: 1200 });
      } else {
        setTimeout(() => setShowChromeFx(true), 400);
      }
    });
  };

  return (
    <div className="relative min-h-dvh selection:bg-cyber/20 selection:text-cyber bg-bg-dark">
      <Preloader onComplete={handlePreloaderComplete} />

      {!loading && (
        <>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-fixed focus:bg-black focus:text-cyber focus:p-4 focus:border focus:border-cyber focus:font-mono focus:text-[10px] uppercase tracking-wider rounded-md"
          >
            Skip to main content
          </a>

          {showChromeFx && (
            <Suspense fallback={null}>
              <CustomCursor />
              <ClickBurst />
            </Suspense>
          )}

          <div className="fixed inset-0 pointer-events-none z-20 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(0,255,136,0.05),transparent_60%)]" />

          <FixedNavbar />

          <div id="main-content" className="page-enter relative flex flex-col w-full">
            <main className="relative flex flex-col w-full">
              <ScrollTransitionManager>
                <TransitionSection
                  id="hero"
                  transitionType="push-fade"
                  accentColor="#00FF88"
                  index={0}
                  bgVideoMp4={heroIntro.h264}
                >
                  <Hero />
                </TransitionSection>

                <TransitionSection
                  id="who"
                  transitionType="horizontal-slide"
                  accentColor="#FF6B35"
                  index={1}
                >
                  <Suspense fallback={<SectionFallback />}>
                    <WhoSection />
                  </Suspense>
                </TransitionSection>

                <TransitionSection id="work" transitionType="scale-blur" accentColor="#BD00FF" index={2}>
                  <Suspense fallback={<SectionFallback />}>
                    <WorkGrid />
                  </Suspense>
                </TransitionSection>

                <TransitionSection
                  id="philosophy"
                  transitionType="split-reveal"
                  accentColor="#D4A843"
                  index={3}
                >
                  <Suspense fallback={<SectionFallback />}>
                    <Philosophy />
                  </Suspense>
                </TransitionSection>

                <TransitionSection id="showcase" transitionType="scale-blur" accentColor="#D4A843" index={4}>
                  <Suspense fallback={<SectionFallback />}>
                    <ShowcaseCarousel />
                  </Suspense>
                </TransitionSection>

                <TransitionSection id="woodland360" transitionType="horizontal-slide" accentColor="#D4A843" index={5}>
                  <Suspense fallback={<SectionFallback />}>
                    <Woodland360Section />
                  </Suspense>
                </TransitionSection>

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
        </>
      )}
    </div>
  );
}
