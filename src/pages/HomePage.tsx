import { useState, lazy, Suspense, useEffect } from 'react';
import Preloader from '../components/Preloader';
import CustomCursor from '../components/CustomCursor';
import ClickBurst from '../components/ClickBurst';
import ScrollTransitionManager from '../components/ScrollTransitionManager';
import TransitionSection from '../components/TransitionSection';
import FixedNavbar from '../components/FixedNavbar';
import LegalFooter from '../components/LegalFooter';
import Hero from '../components/Hero';
import OfferSection from '../components/OfferSection';
import CaseStudiesSection from '../components/CaseStudiesSection';
import sound from '../lib/sound';
import { heroIntro, philosophyAmbient, whoAmbient } from '../lib/films';
import { resolveKnownHash, scrollToHashOrSection } from '../lib/scrollNav';

const WhoSection = lazy(() => import('../components/WhoSection'));
const WorkGrid = lazy(() => import('../components/WorkGrid'));
const Philosophy = lazy(() => import('../components/Philosophy'));
const ShowcaseCarousel = lazy(() => import('../components/ShowcaseCarousel'));
const StudioEcosystem = lazy(() => import('../components/StudioEcosystem'));
const Woodland360Section = lazy(() => import('../components/Woodland360Section'));
const Contact = lazy(() => import('../components/Contact'));
const CookieBanner = lazy(() => import('../components/CookieBanner'));

const SectionFallback = () => (
  <div className="min-h-dvh w-full bg-bg-dark flex items-center justify-center">
    <span className="font-mono text-[10px] text-[#8B9BB4] uppercase tracking-widest animate-pulse">
      Loading…
    </span>
  </div>
);

function navigateHash() {
  const target = resolveKnownHash(window.location.hash);
  if (!target) return;
  // Defer until section anchors exist after preloader / layout
  requestAnimationFrame(() => {
    scrollToHashOrSection(target.id, target.index, 'smooth');
  });
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sound.armMobileAutoplay();
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    document.title = 'Naga Codex | Maurice Holda — AI, Film & Web Dev';
  }, []);

  useEffect(() => {
    if (loading) return;

    const onHashChange = () => navigateHash();
    window.addEventListener('hashchange', onHashChange);

    if (window.location.hash) {
      // Preloader just finished; allow layout to settle
      const t = window.setTimeout(navigateHash, 80);
      return () => {
        window.clearTimeout(t);
        window.removeEventListener('hashchange', onHashChange);
      };
    }

    return () => window.removeEventListener('hashchange', onHashChange);
  }, [loading]);

  const handlePreloaderComplete = () => {
    window.scrollTo(0, 0);
    setLoading(false);
  };

  return (
    <div className="relative min-h-dvh selection:bg-cyber/20 selection:text-cyber bg-bg-dark">
      <LegalFooter />
      <Preloader onComplete={handlePreloaderComplete} />

      {!loading && (
        <>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-fixed focus:bg-black focus:text-cyber focus:p-4 focus:border focus:border-cyber focus:font-mono focus:text-[10px] uppercase tracking-wider rounded-md"
          >
            Skip to main content
          </a>

          <CustomCursor />
          <ClickBurst />

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
                  id="offer"
                  transitionType="push-fade"
                  accentColor="#00FF88"
                  index={1}
                >
                  <OfferSection />
                </TransitionSection>

                <TransitionSection
                  id="case-studies"
                  transitionType="scale-blur"
                  accentColor="#BD00FF"
                  index={2}
                >
                  <CaseStudiesSection />
                </TransitionSection>

                <TransitionSection
                  id="who"
                  transitionType="horizontal-slide"
                  accentColor="#FF6B35"
                  index={3}
                  bgVideoWebm={whoAmbient.webm}
                  bgVideoMp4={whoAmbient.h264}
                >
                  <Suspense fallback={<SectionFallback />}>
                    <WhoSection />
                  </Suspense>
                </TransitionSection>

                <TransitionSection id="work" transitionType="scale-blur" accentColor="#BD00FF" index={4}>
                  <Suspense fallback={<SectionFallback />}>
                    <WorkGrid />
                  </Suspense>
                </TransitionSection>

                <TransitionSection
                  id="philosophy"
                  transitionType="split-reveal"
                  accentColor="#D4A843"
                  index={5}
                  bgVideoWebm={philosophyAmbient.webm}
                  bgVideoMp4={philosophyAmbient.h264}
                >
                  <Suspense fallback={<SectionFallback />}>
                    <Philosophy />
                  </Suspense>
                </TransitionSection>

                <TransitionSection id="showcase" transitionType="scale-blur" accentColor="#D4A843" index={6}>
                  <Suspense fallback={<SectionFallback />}>
                    <ShowcaseCarousel />
                  </Suspense>
                </TransitionSection>

                <TransitionSection id="ecosystem" transitionType="horizontal-slide" accentColor="#D4A843" index={7}>
                  <Suspense fallback={<SectionFallback />}>
                    <StudioEcosystem />
                  </Suspense>
                </TransitionSection>

                <TransitionSection id="woodland360" transitionType="horizontal-slide" accentColor="#D4A843" index={8}>
                  <Suspense fallback={<SectionFallback />}>
                    <Woodland360Section />
                  </Suspense>
                </TransitionSection>

                <TransitionSection id="contact" transitionType="push-fade" accentColor="#3B82F6" index={9}>
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
