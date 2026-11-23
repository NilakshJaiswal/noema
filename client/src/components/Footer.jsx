import { Facebook, Instagram, Linkedin, Mail } from 'lucide-react';
import Logo from './Logo.jsx';
import { useSiteContent } from '../data/SiteContent.jsx';
import SiteLink from './SiteLink.jsx';

export default function Footer() {
  const { branding, footer } = useSiteContent();
  const year = new Date().getFullYear();

  const socials = [
    { Icon: Facebook, href: branding.socials.facebook, label: 'Facebook' },
    { Icon: Instagram, href: branding.socials.instagram, label: 'Instagram' },
    { Icon: Linkedin, href: branding.socials.linkedin, label: 'LinkedIn' },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-ink-950">
      <div className="container-content py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <Logo className="h-10 w-10" />
              <span className="font-display text-xl font-bold text-white">{branding.shortName}</span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400">{footer.blurb}</p>
            <div className="mt-6 flex items-center gap-3">
              {socials.filter(({ href }) => href).map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-slate-300 transition-all hover:-translate-y-0.5 hover:border-teal-400/40 hover:text-teal-300"
                >
                  <Icon size={17} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">{footer.quickHeading}</h3>
            <ul className="mt-5 space-y-3">
              {footer.quickLinks.map((link, index) => (
                <SiteLink key={index} href={link.href} listItem className="text-sm text-slate-300 transition-colors hover:text-teal-300">
                  {link.label}
                </SiteLink>
              ))}
            </ul>
          </div>

          {/* Policy + news */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">{footer.policyHeading}</h3>
            <ul className="mt-5 space-y-3">
              {footer.policyLinks.map((link, index) => (
                <SiteLink key={index} href={link.href} listItem className="text-sm text-slate-300 transition-colors hover:text-teal-300">
                  {link.label}
                </SiteLink>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">{footer.contactHeading}</h3>
            {branding.email && <a
              href={`mailto:${branding.email}`}
              className="mt-5 inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-teal-300"
            >
              <Mail size={15} aria-hidden="true" />
              {branding.email}
            </a>}
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-slate-500">{footer.newsHeading}</p>
            {footer.news.map((link, index) => (
              <SiteLink key={index} href={link.href} newTab className="mt-3 block text-sm text-slate-300 transition-colors hover:text-amber-300">
                {link.label}
              </SiteLink>
            ))}
          </div>
        </div>

        <div className="rule mt-14" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <p>{footer.copyright.replaceAll('{year}', String(year)).replaceAll('{company}', () => branding.legalName)}</p>
          <p className="font-mono">{footer.closing}</p>
        </div>
      </div>
    </footer>
  );
}
