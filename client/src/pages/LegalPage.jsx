import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSiteContent } from '../data/SiteContent.jsx';

export default function LegalPage({ page }) {
  const { legal, branding } = useSiteContent();
  const { title, updated, intro, sections } = legal[page];
  return (
    <article className="pt-28 pb-24">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-teal-300 transition-colors hover:text-teal-200">
          <ArrowLeft size={14} aria-hidden="true" /> {legal.backLabel}
        </Link>
        <h1 className="mt-8 text-4xl font-bold text-white sm:text-5xl">{title}</h1>
        {updated && <p className="mt-3 font-mono text-xs uppercase tracking-wider text-slate-500">{legal.updatedLabel}: {updated}</p>}
        {intro && <p className="mt-6 text-lg leading-relaxed text-slate-300">{intro}</p>}

        <div className="mt-10 space-y-10">
          {sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
              {section.body.map((p, i) => (
                <p key={i} className="mt-3 text-base leading-relaxed text-slate-400">{p}</p>
              ))}
            </section>
          ))}
        </div>

        {branding.email && <>
          <div className="rule mt-14" />
          <p className="mt-6 text-sm text-slate-500">
            {legal.contactLabel}{' '}
            <a href={`mailto:${branding.email}`} className="text-teal-300 hover:text-teal-200">{branding.email}</a>.
          </p>
        </>}
      </div>
    </article>
  );
}

