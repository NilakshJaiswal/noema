import { Coffee } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { useSiteContent } from '../data/SiteContent.jsx';
import ContentButtons from '../components/ContentButtons.jsx';

export default function JoinCTA() {
  const { joinCta } = useSiteContent();
  return (
    <section id="join-us" className="relative scroll-mt-24 py-10">
      <div className="container-content">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-teal-600/20 via-ink-800 to-amber-600/15 p-9 sm:p-14">
            <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-xl">
                <span className="eyebrow mb-4">{joinCta.eyebrow}</span>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  {joinCta.heading}
                </h2>
                <p className="mt-3 flex items-center gap-2 text-lg text-slate-300">
                  <Coffee size={20} className="text-amber-300" aria-hidden="true" />
                  {joinCta.text}
                </p>
              </div>
              <ContentButtons buttons={joinCta.buttons} arrow="right" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
