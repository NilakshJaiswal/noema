import Reveal from './Reveal.jsx';

/**
 * Consistent section header: eyebrow + title + optional lead paragraph.
 */
export default function SectionHeading({ eyebrow, title, lead, align = 'left', className = '' }) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';
  return (
    <Reveal className={`flex max-w-3xl flex-col ${alignment} ${className}`}>
      {eyebrow && <span className="eyebrow mb-5">{eyebrow}</span>}
      <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl">{title}</h2>
      {lead && <p className="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">{lead}</p>}
    </Reveal>
  );
}
