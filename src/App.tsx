import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

const SkillsPage = lazy(() => import('./pages/SkillsPage'));

function SkillsFallback() {
  return (
    <div className="min-h-dvh w-full bg-bg-dark flex items-center justify-center">
      <span className="font-mono text-[10px] text-[#8B9BB4] uppercase tracking-widest animate-pulse">
        Loading skills…
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
            <Suspense fallback={<SkillsFallback />}>
              <SkillsPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
