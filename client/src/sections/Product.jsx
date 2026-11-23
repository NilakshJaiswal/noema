import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Reveal, { staggerContainer, staggerItem } from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import { useSiteContent } from '../data/SiteContent.jsx';
import ContentButtons from '../components/ContentButtons.jsx';

export default function Product() {
  const { product } = useSiteContent();
  if (!product.items.length) return null;
  return (
    <section id="product" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-content space-y-24">
        {product.items.map((item, index) => <ProductDetails key={index} product={item} />)}
      </div>
    </section>
  );
}

function ProductDetails({ product }) {
  return (
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left: copy */}
          <div>
            <Reveal>
              <span className="eyebrow mb-5">{product.eyebrow}</span>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mb-4 flex items-center gap-3">
                <span className="font-display text-4xl font-bold text-white sm:text-5xl">
                  {product.name}
                </span>
                <span className="rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-teal-300">
                  {product.badge}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-2xl font-semibold leading-snug text-white sm:text-3xl">
                {product.headline}
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">
                {product.description}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <ContentButtons buttons={product.buttons} arrow="diagonal" className="mt-8" />
            </Reveal>
          </div>

          {/* Right: feature stack / device mock */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-grid-fade blur-2xl" />

            <div className="glass relative overflow-hidden p-6 shadow-card sm:p-8">
              {/* Faux product header */}
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-400/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                </div>
                <span className="font-mono text-xs text-slate-500">{product.mockLabel}</span>
              </div>

              <div className="space-y-4">
                {product.features.map((f, index) => (
                  <motion.div
                    key={index}
                    variants={staggerItem}
                    className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-teal-400/30 hover:bg-white/[0.04]"
                  >
                    <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-amber-500/10 text-teal-300">
                      <Icon name={f.icon} size={20} />
                    </span>
                    <div>
                      <h3 className="flex items-center gap-2 text-base font-semibold text-white">
                        {f.title}
                        <CheckCircle2 size={14} className="text-teal-400" />
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">{f.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
  );
}
