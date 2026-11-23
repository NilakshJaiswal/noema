import { Link } from 'react-router-dom';
import { useSiteContent } from '../data/SiteContent.jsx';

export default function SiteLink({ href, newTab, listItem, children, ...props }) {
  const content = useSiteContent();
  if (!href || !children) return null;
  const destination = href.startsWith('#') ? `/${href}` : href;
  const section = destination.startsWith('/#') ? destination.slice(2) : '';
  const visibleSections = {
    product: content.product.enabled && content.product.items.length > 0,
    about: content.about.enabled,
    research: content.research.enabled || content.scientists.enabled,
    scientists: content.scientists.enabled,
    leadership: content.leadership.enabled,
    vision: content.visionMission.enabled,
    'join-us': content.joinCta.enabled,
    contact: content.contact.enabled,
  };
  if (Object.hasOwn(visibleSections, section) && !visibleSections[section]) return null;
  const link = newTab || !destination.startsWith('/')
    ? <a href={destination} target={newTab ? '_blank' : undefined} rel={newTab ? 'noreferrer' : undefined} {...props}>{children}</a>
    : <Link to={destination} {...props}>{children}</Link>;
  return listItem ? <li>{link}</li> : link;
}

