import { useId } from 'react';
import { useSiteContent } from '../data/SiteContent.jsx';
export default function Logo({ className = 'h-9 w-9' }) {
  const { branding } = useSiteContent();
  const gradient = useId();
  if (branding.logo) return <img src={branding.logo} alt="" className={`object-contain ${className}`} />;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2bbdd1" />
          <stop offset="1" stopColor="#ff9533" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="#0a1320" />
      <rect width="64" height="64" rx="15" fill="none" stroke="rgba(255,255,255,0.08)" />
      <g fill="none" stroke={`url(#${gradient})`} strokeWidth="2.2" strokeLinecap="round">
        <path d="M22 24 L33 31 L42 18 M33 31 L46 40 M33 31 L24 44 M22 24 L24 44 M42 18 L46 40" opacity="0.7" />
      </g>
      <circle cx="22" cy="24" r="4.4" fill="#2bbdd1" />
      <circle cx="42" cy="18" r="3.1" fill="#6ed7e5" />
      <circle cx="46" cy="40" r="3.9" fill="#ff9533" />
      <circle cx="24" cy="44" r="3.3" fill="#2bbdd1" />
      <circle cx="33" cy="31" r="2.6" fill="#ffffff" />
    </svg>
  );
}
