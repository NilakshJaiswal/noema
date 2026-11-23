import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import NeuralField from '../components/NeuralField.jsx';
import { useSiteContent } from '../data/SiteContent.jsx';
import ContentButtons from '../components/ContentButtons.jsx';
import SiteLink from '../components/SiteLink.jsx';
import HeroGearArtwork from './HeroGearArtwork.jsx';

export default function Hero() {
  const reduce = useReducedMotion();
  const { hero } = useSiteContent();
  const heroArtwork =
    !hero.image || hero.image === '/cognitive-gears.png'
      ? '/cognitive-gears-profile.png'
      : hero.image;
  const useAnimatedArtwork = heroArtwork === '/cognitive-gears-profile.png';

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };
  const item = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      };

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      {/* Animated neural network */}
      <div className="pointer-events-none absolute inset-0 opacity-55">
        <NeuralField />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/72 to-ink-900/5" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,31,51,0.15),transparent_65%,rgba(11,31,51,0.45))]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 bottom-3 top-2 z-[3] rounded-2xl border border-teal-400/30 sm:inset-x-5 sm:bottom-5 sm:rounded-3xl"
      />

      <div className="container-content relative z-10">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-[88%] sm:max-w-[75%] lg:max-w-[54%]">
          <motion.span variants={item} className="eyebrow mb-7">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse-slow" />
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            variants={item}
            className="font-display text-[clamp(2.75rem,9vw,6.5rem)] font-bold leading-[0.95] tracking-tight text-white"
          >
            {hero.title}{' '}
            <span className="gradient-text">{hero.titleAccent}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl"
          >
            {hero.subtitle}
          </motion.p>

          {hero.buttons.length > 0 && <motion.div variants={item} className="mt-10">
            <ContentButtons buttons={hero.buttons} arrow="right" className="flex-col items-stretch sm:flex-row sm:items-center" />
          </motion.div>}

          {/* Stats */}
          <motion.dl
            variants={item}
            className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-8"
          >
            {hero.stats.map((s, index) => (
              <div key={index}>
                <dt className="font-display text-3xl font-bold text-white sm:text-4xl">{s.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-slate-400 sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>

      {/* Hero artwork */}
      {heroArtwork && <motion.div
        initial={reduce ? {} : { opacity: 0, x: 30 }}
        animate={reduce ? {} : { opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className={`pointer-events-none absolute z-[2] h-[48%] overflow-hidden opacity-35 md:-bottom-2 md:right-[-3%] md:h-[96%] md:w-[52%] md:opacity-90 ${
          useAnimatedArtwork ? 'bottom-2 -right-[4%] w-[78%]' : '-bottom-6 -right-[24%] w-full'
        }`}
        aria-hidden="true"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 12%, black 34%, black 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 12%, black 34%, black 100%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/70 via-transparent to-transparent" />
        {useAnimatedArtwork ? (
          <HeroGearArtwork />
        ) : (
          <img
            src={heroArtwork}
            alt=""
            className="h-full w-full object-contain object-bottom mix-blend-screen"
          />
        )}
      </motion.div>}

      {/* Scroll hint */}
      {hero.showScrollLink && <SiteLink
        href={hero.scrollHref}
        aria-label={hero.scrollAriaLabel}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-400 transition-colors hover:text-teal-300 md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">{hero.scrollLabel}</span>
        <ArrowDown size={16} className="animate-float" />
      </SiteLink>}
    </section>
  );
}
