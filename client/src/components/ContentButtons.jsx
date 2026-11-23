import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SiteLink from './SiteLink.jsx';

export default function ContentButtons({ buttons, arrow, className = '', onClick }) {
  const visible = buttons.filter(({ label, href }) => label && href);
  if (!visible.length) return null;
  const Arrow = arrow === 'diagonal' ? ArrowUpRight : ArrowRight;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {visible.map(({ label, href, style, newTab }, index) => (
        <SiteLink key={index} href={href} newTab={newTab} onClick={onClick}
          className={style === 'Outline' ? 'btn-ghost' : 'btn-primary group'}>
          {label}
          {arrow && style !== 'Outline' && <Arrow size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />}
        </SiteLink>
      ))}
    </div>
  );
}

