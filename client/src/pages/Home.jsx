import Hero from '../sections/Hero.jsx';
import Product from '../sections/Product.jsx';
import About from '../sections/About.jsx';
import Research from '../sections/Research.jsx';
import Leadership from '../sections/Leadership.jsx';
import VisionMission from '../sections/VisionMission.jsx';
import JoinCTA from '../sections/JoinCTA.jsx';
import Contact from '../sections/Contact.jsx';
import { useSiteContent } from '../data/SiteContent.jsx';

const sections = { hero: Hero, product: Product, about: About, research: Research, leadership: Leadership, visionMission: VisionMission, joinCta: JoinCTA, contact: Contact };

export default function Home() {
  const content = useSiteContent();
  return (
    <>
      {!content.hero.enabled && <div id="top" className="h-[72px]" />}
      {content.layout.sections.map((name) => {
        const Section = sections[name];
        return (content[name].enabled || (name === 'research' && content.scientists.enabled)) && <Section key={name} />;
      })}
    </>
  );
}

