import { Compass, Target } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { useSiteContent } from '../data/SiteContent.jsx';

export default function VisionMission() {
  const { visionMission } = useSiteContent();
  return (
    <section id="vision" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-grid-fade blur-3xl" />

      <div className="container-content relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="eyebrow mb-6">{visionMission.eyebrow}</span>
          {visionMission.quote.text && <blockquote className="font-display text-2xl font-medium leading-snug text-white sm:text-3xl md:text-4xl">
            “{visionMission.quote.text}”
          </blockquote>}
          {visionMission.quote.author && <cite className="mt-4 block font-mono text-sm not-italic uppercase tracking-[0.25em] text-amber-300">
            — {visionMission.quote.author}
          </cite>}
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
          {visionMission.cards.map((card, index) => {
            const Icon = card.icon === 'Compass' ? Compass : Target;
            const color = card.icon === 'Compass' ? 'bg-teal-400/10 text-teal-300' : 'bg-amber-400/10 text-amber-300';
            return (
              <Reveal key={index} delay={Math.min(index, 4) * 0.1}>
                <article className="glass h-full p-8">
                  <span className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-semibold text-white">{card.heading}</h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-300">{card.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
