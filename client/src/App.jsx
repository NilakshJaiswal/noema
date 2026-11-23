import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import LegalPage from './pages/LegalPage.jsx';
import { SiteContentProvider, SiteMetadata, useSiteContent } from './data/SiteContent.jsx';

const Admin = lazy(() => import('./pages/Admin.jsx'));

function ScrollToHash() {
  const { key, hash } = useLocation();
  const content = useSiteContent();
  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [key, hash, content]);
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [key, hash]);
  return null;
}

function NotFound() {
  const { metadata } = useSiteContent();
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-teal-300">404</p>
      <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">{metadata.notFoundTitle}</h1>
      <p className="mt-4 max-w-md text-slate-400">{metadata.notFoundText}</p>
      <Link to="/" className="btn-primary mt-8">{metadata.notFoundButton}</Link>
    </section>
  );
}

function PublicSite() {
  const { layout } = useSiteContent();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-ink-950">
        {layout.skipLink}
      </a>
      <SiteMetadata />
      <ScrollToHash />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/disclaimer" element={<LegalPage page="disclaimer" />} />
          <Route path="/privacy-policy" element={<LegalPage page="privacyPolicy" />} />
          <Route path="/policy" element={<LegalPage page="privacyPolicy" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Suspense fallback={<p className="p-8" role="status">Opening admin…</p>}><Admin /></Suspense>} />
      <Route path="*" element={<SiteContentProvider><PublicSite /></SiteContentProvider>} />
    </Routes>
  );
}

