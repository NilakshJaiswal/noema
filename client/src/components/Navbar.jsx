import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useSiteContent } from '../data/SiteContent.jsx';
import SiteLink from './SiteLink.jsx';
import ContentButtons from './ContentButtons.jsx';
import Logo from './Logo.jsx';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { navigation, branding } = useSiteContent();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/10 bg-ink-900/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="container-content flex min-h-[72px] items-center justify-between gap-3 py-2">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex shrink-0 items-center gap-2.5"
          aria-label={branding.name}
        >
          <Logo className="h-9 w-9" />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            {branding.shortName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-wrap items-center gap-1 lg:flex" aria-label={navigation.primaryLabel}>
          {navigation.links.map((item, index) => (
            <SiteLink key={index} href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white">
              {item.label}
            </SiteLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ContentButtons buttons={navigation.buttons} />
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white lg:hidden"
          aria-label={open ? navigation.closeLabel : navigation.openLabel}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Scroll progress bar */}
      <motion.div
        className="h-[2px] origin-left bg-gradient-to-r from-teal-400 to-amber-400"
        style={{ scaleX: progress }}
      />

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/10 bg-ink-900/95 backdrop-blur-xl lg:hidden"
        >
          <nav className="container-content flex flex-col gap-1 py-5" aria-label={navigation.mobileLabel}>
            {navigation.links.map((item, index) => (
              <SiteLink key={index} href={item.href} onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-left text-base font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white">
                {item.label}
              </SiteLink>
            ))}
            <ContentButtons buttons={navigation.buttons} onClick={() => setOpen(false)} className="mt-3 *:grow" />
          </nav>
        </motion.div>
      )}
    </header>
  );
}
