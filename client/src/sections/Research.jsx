import { motion } from 'framer-motion';
import Reveal, { staggerContainer, staggerItem } from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Icon from '../components/Icon.jsx';
import Avatar from '../components/Avatar.jsx';
import { useSiteContent } from '../data/SiteContent.jsx';

export default function Research() {
  const { research, scientists } = useSiteContent();
  return (
    <section id="research" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-content">
        {research.enabled && <>
        <SectionHeading eyebrow={research.eyebrow} title={research.heading} lead={research.intro} />

        {/* Research pillars */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid gap-5 md:grid-cols-3"
        >
          {research.pillars.map((p, index) => (
            <motion.article
              key={index}
              variants={staggerItem}
              className="group glass p-7 transition-colors hover:border-teal-400/30"
            >
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-amber-500/10 text-teal-300 transition-transform group-hover:scale-105">
                <Icon name={p.icon} size={22} />
              </span>
              <h3 className="text-xl font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.text}</p>
            </motion.article>
          ))}
        </motion.div>

        <Reveal className="mt-10">
          <div className="glass border-teal-400/10 bg-teal-400/[0.03] p-7 sm:p-9">
            <p className="text-base leading-relaxed text-slate-300 sm:text-lg">{research.focus}</p>
          </div>
        </Reveal>

        </>}

        {scientists.enabled && <div id="scientists" className={research.enabled ? 'mt-20 scroll-mt-24' : 'scroll-mt-24'}>
          <Reveal>
            <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {scientists.heading}
            </h3>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-8 grid gap-6 md:grid-cols-3"
          >
            {scientists.items.map((s, i) => (
              <motion.article
                key={i}
                variants={staggerItem}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/30 hover:shadow-glow"
              >
                <div className="flex items-center gap-4">
                  <Avatar initials={s.initials} photo={s.photo} index={i} />
                  <div>
                    <h4 className="text-lg font-semibold leading-tight text-white">{s.name}</h4>
                    <p className="mt-0.5 font-mono text-xs uppercase tracking-wide text-amber-300">
                      {s.role}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm font-medium text-teal-200/90">{s.affiliation}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{s.bio}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>}
      </div>
    </section>
  );
}
