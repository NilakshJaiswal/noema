/**
 * Initials avatar with a deterministic gradient.
 * Used in place of hotlinking the reference site's photos.
 */
const GRADIENTS = [
  'from-teal-500/30 to-teal-700/20 text-teal-200',
  'from-amber-500/30 to-amber-700/20 text-amber-200',
  'from-teal-400/25 to-amber-500/15 text-teal-100',
  'from-amber-400/25 to-teal-600/20 text-amber-100',
];

export default function Avatar({ initials, photo, index = 0, className = 'h-14 w-14 text-lg' }) {
  if (photo) return <img src={photo} alt="" loading="lazy" className={`shrink-0 rounded-2xl object-cover ${className}`} />;
  const g = GRADIENTS[index % GRADIENTS.length];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br font-display font-bold ${g} ${className}`}
    >
      {initials}
    </span>
  );
}
