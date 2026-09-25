import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'));

function PageFallback({ label }: { label: string }) {
  return (
    <div className="min-h-dvh w-full bg-bg-dark flex items-center justify-center">
      <span className="font-mono text-[10px] text-[#8B9BB4] uppercase tracking-widest animate-pulse">
        Loading {label}…
      </span>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/skills"
          element={
            <Suspense fallback={<PageFallback label="skills" />}>
              <SkillsPage />
            </Suspense>
          }
        />
        <Route
          path="/certificates"
          element={
            <Suspense fallback={<PageFallback label="certificates" />}>
              <CertificatesPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
