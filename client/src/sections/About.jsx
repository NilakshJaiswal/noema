import { Quote } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { useSiteContent } from '../data/SiteContent.jsx';

export default function About() {
  const { about } = useSiteContent();
  return (
    <section id="about" className="relative scroll-mt-24 border-y border-white/5 bg-ink-850/40 py-24 sm:py-32">
      <div className="container-content">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="eyebrow mb-5">{about.eyebrow}</span>
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl md:text-[2.75rem]">
                {about.heading}
              </h2>
            </Reveal>

            {about.pullQuote && <Reveal delay={0.1} className="mt-8">
              <figure className="glass relative p-7">
                <Quote className="absolute -top-3 left-6 h-8 w-8 rounded-lg bg-ink-850 p-1 text-amber-400" />
                <blockquote className="font-display text-xl font-medium leading-snug text-white sm:text-2xl">
                  “{about.pullQuote}”
                </blockquote>
              </figure>
            </Reveal>}
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-6">
              {about.body.map((p, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p className="text-lg leading-relaxed text-slate-300">{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.15} className="mt-10">
              <dl className="grid gap-4 sm:grid-cols-3">
                {about.highlights.map((h, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                  >
                    <dt className="font-mono text-xs uppercase tracking-wider text-teal-300">{h.k}</dt>
                    <dd className="mt-2 font-display text-lg font-semibold text-white">{h.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
