import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Avatar from '../components/Avatar.jsx';
import { useSiteContent } from '../data/SiteContent.jsx';

export default function Leadership() {
  const { leadership } = useSiteContent();
  return (
    <section
      id="leadership"
      className="relative scroll-mt-24 border-y border-white/5 bg-ink-850/40 py-24 sm:py-32"
    >
      <div className="container-content">
        <SectionHeading
          eyebrow={leadership.eyebrow}
          title={leadership.heading}
          lead={leadership.lead}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid gap-6 sm:grid-cols-2"
        >
          {leadership.members.map((m, i) => (
            <motion.article
              key={i}
              variants={staggerItem}
              className="group flex gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:shadow-glow-amber sm:p-7"
            >
              <Avatar initials={m.initials} photo={m.photo} index={i} className="h-16 w-16 text-xl" />
              <div>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <h3 className="text-lg font-semibold leading-tight text-white">{m.name}</h3>
                  {m.credential && (
                    <span className="rounded-full border border-white/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-300">
                      {m.credential}
                    </span>
                  )}
                </div>
                <p className="mt-1 font-mono text-xs uppercase tracking-wide text-amber-300">
                  {m.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{m.bio}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
