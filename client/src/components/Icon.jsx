import { Brain, Sparkles, LineChart, Users, Activity, HelpCircle } from 'lucide-react';

const MAP = { Brain, Sparkles, LineChart, Users, Activity };

/** Render a lucide icon by name (from the content data), with a safe fallback. */
export default function Icon({ name, ...props }) {
  const Cmp = Object.hasOwn(MAP, name) ? MAP[name] : HelpCircle;
  return <Cmp aria-hidden="true" {...props} />;
}
