import { useState } from 'react';
import { Mail, Send, Loader2, CheckCircle2, AlertCircle, Facebook, Instagram, Linkedin } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { useSiteContent } from '../data/SiteContent.jsx';
import { submitContact } from '../lib/api.js';

const initial = { name: '', email: '', mobile: '', message: '', company: '' };

export default function Contact() {
  const { contact, branding } = useSiteContent();
  const copy = contact.form;
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverMsg, setServerMsg] = useState('');

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = copy.nameError;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = copy.emailError;
    if (form.mobile && !/^[0-9+\-\s()]{6,20}$/.test(form.mobile.trim()))
      e.mobile = copy.mobileError;
    if (!form.message.trim()) e.message = copy.messageError;
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) {
      // Focus the first invalid field for accessibility.
      const first = document.querySelector(`[name="${Object.keys(v)[0]}"]`);
      first?.focus();
      return;
    }

    setStatus('loading');
    setServerMsg('');
    try {
      await submitContact({ ...form, kind: 'contact' });
      setStatus('success');
      setServerMsg(copy.success);
      setForm(initial);
    } catch (err) {
      setStatus('error');
      const data = err?.response?.data;
      if (data?.errors?.length) {
        const mapped = {};
        data.errors.forEach(({ field }) => { mapped[field] = copy[field + 'Error'] || copy.failure; });
        setErrors(mapped);
      }
      setServerMsg(copy.failure);
    }
  };

  const fieldClass = (name) =>
    `w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 transition-colors focus:bg-white/[0.05] focus:outline-none ${
      errors[name] ? 'border-red-500/60' : 'border-white/10 focus:border-teal-400/50'
    }`;

  const socials = [
    { Icon: Facebook, href: branding.socials.facebook, label: 'Facebook' },
    { Icon: Instagram, href: branding.socials.instagram, label: 'Instagram' },
    { Icon: Linkedin, href: branding.socials.linkedin, label: 'LinkedIn' },
  ];

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-content">
        <div className={`grid gap-12 lg:gap-16 ${contact.showForm ? 'lg:grid-cols-2' : ''}`}>
          {/* Left: invitation */}
          <div>
            <Reveal>
              <span className="eyebrow mb-5">{contact.eyebrow}</span>
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl md:text-[2.75rem]">
                {contact.heading}
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-400">{contact.text}</p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 space-y-4">
              {contact.email && <a
                href={`mailto:${contact.email}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-teal-400/30"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
                  <Mail size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-slate-500">{contact.emailLabel}</p>
                  <p className="text-base font-medium text-white group-hover:text-teal-200">
                    {contact.email}
                  </p>
                </div>
              </a>}

              <div className="flex items-center gap-3 pt-2">
                {socials.filter(({ href }) => href).map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-slate-300 transition-all hover:-translate-y-0.5 hover:border-teal-400/40 hover:text-teal-300"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: form */}
          {contact.showForm && <Reveal delay={0.1}>
            <form onSubmit={onSubmit} noValidate className="glass p-7 shadow-card sm:p-9">
              {/* Honeypot (hidden from real users) */}
              <div className="hidden" aria-hidden="true">
                <label>
                  Company
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={update}
                  />
                </label>
              </div>

              <div className="grid gap-5">
                <Field label={copy.name} name="name" value={form.name} onChange={update} error={errors.name} placeholder={copy.namePlaceholder} fieldClass={fieldClass} required />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={copy.email} name="email" type="email" value={form.email} onChange={update} error={errors.email} placeholder={copy.emailPlaceholder} fieldClass={fieldClass} required />
                  <Field label={copy.mobile} name="mobile" type="tel" value={form.mobile} onChange={update} error={errors.mobile} placeholder={copy.mobilePlaceholder} fieldClass={fieldClass} />
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-300">
                    {copy.message} <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={update}
                    placeholder={copy.messagePlaceholder}
                    className={fieldClass('message')}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'err-message' : undefined}
                  />
                  {errors.message && (
                    <p id="err-message" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                      <AlertCircle size={13} /> {errors.message}
                    </p>
                  )}
                </div>

                {/* Status message (polite live region) */}
                <div aria-live="polite">
                  {status === 'success' && (
                    <p className="flex items-center gap-2 rounded-xl border border-teal-400/30 bg-teal-400/10 px-4 py-3 text-sm text-teal-200">
                      <CheckCircle2 size={16} /> {serverMsg}
                    </p>
                  )}
                  {status === 'error' && (
                    <p className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      <AlertCircle size={16} /> {serverMsg}
                    </p>
                  )}
                </div>

                <button type="submit" disabled={status === 'loading'} className="btn-primary w-full disabled:opacity-70">
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> {copy.sendingLabel}
                    </>
                  ) : (
                    <>
                      {copy.submitLabel} <Send size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </Reveal>}
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = 'text', value, onChange, error, placeholder, fieldClass, required }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label} {required && <span className="text-amber-400">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={fieldClass(name)}
        aria-invalid={!!error}
        aria-describedby={error ? `err-${name}` : undefined}
        autoComplete={name === 'email' ? 'email' : name === 'name' ? 'name' : name === 'mobile' ? 'tel' : 'off'}
      />
      {error && (
        <p id={`err-${name}`} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}
