import * as site from './siteDefaults.js';
import { disclaimer, privacyPolicy } from './legalDefaults.js';

const text = (label, value = '') => ({ type: 'text', label, value });
const long = (label, value = '') => ({ type: 'long', label, value });
const field = (type, label, value = '') => ({ type, label, value });
const toggle = (label, value = true) => field('boolean', label, value);
const select = (label, options, value = options[0]) => ({ type: 'select', label, options, value });
const group = (label, fields, value) => ({ type: 'group', label, fields, value });
const list = (label, item, value = [], reorderOnly = false) => ({ type: 'list', label, item, value, reorderOnly });
const link = (label = 'Link') => group(label, {
  label: text('Label'),
  href: field('link', 'Destination'),
});
const button = (label = 'Button') => group(label, {
  ...link().fields,
  style: select('Style', ['Primary', 'Outline']),
  newTab: toggle('Open in a new tab', false),
});
const feature = (label) => group(label, {
  title: text('Title'), text: long('Description'),
  icon: select('Icon', ['Brain', 'Sparkles', 'LineChart', 'Users', 'Activity']),
});
const person = {
  name: text('Name'), role: text('Role'), bio: long('Biography'),
  initials: text('Initials'), photo: field('image', 'Photo'),
};
const legalPage = (label, value) => group(label, {
  title: text('Page title'), updated: text('Last updated'), intro: long('Introduction'),
  sections: list('Sections', group('Section', {
    heading: text('Heading'), body: list('Paragraphs', long('Paragraph')),
  })),
}, value);

export const imageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
export const imageLimit = 256 * 1024;
export const contentLimit = '4mb';
export const sectionNames = {
  hero: 'Hero', product: 'Latest Product', about: 'About Us', research: 'R&D and scientists',
  leadership: 'Meet our leadership', visionMission: 'Vision & Mission',
  joinCta: 'Sounds Interesting?', contact: 'Contact',
};

export const contentSchema = {
  branding: group('Branding', {
    name: text('Company name', site.company.name),
    shortName: text('Name displayed next to logo', site.company.shortName),
    legalName: text('Legal name', site.company.legalName),
    logo: field('image', 'Logo'),
    email: field('email', 'Company email', site.company.email),
    socials: group('Social links', {
      facebook: field('link', 'Facebook', site.company.socials.facebook),
      instagram: field('link', 'Instagram', site.company.socials.instagram),
      linkedin: field('link', 'LinkedIn', site.company.socials.linkedin),
    }),
  }),
  layout: group('Layout & colors', {
    sections: list('Homepage section order', select('Section', Object.keys(sectionNames)), Object.keys(sectionNames), true),
    background: field('color', 'Background', '#0b1f33'),
    primary: field('color', 'Primary accent', '#2bbdd1'),
    accent: field('color', 'Button accent', '#ff7f0e'),
    skipLink: text('Skip link', 'Skip to content'),
  }),
  navigation: group('Navigation & buttons', {
    links: list('Menu links', link('Menu link'), site.nav),
    buttons: list('Header buttons', button(), [{ label: 'Try Cogmentor', href: site.company.product.url, newTab: true }]),
    primaryLabel: text('Main menu label', 'Primary'),
    mobileLabel: text('Mobile menu label', 'Mobile'),
    openLabel: text('Open menu label', 'Open menu'),
    closeLabel: text('Close menu label', 'Close menu'),
  }),
  hero: group('Hero', {
    enabled: toggle('Show this section'),
    eyebrow: text('Eyebrow', site.hero.eyebrow),
    title: text('Title', site.hero.titleLines[0]),
    titleAccent: text('Highlighted title', site.hero.titleLines[1]),
    subtitle: long('Subtitle', site.hero.subtitle),
    image: field('image', 'Hero artwork', '/cognitive-gears-profile.png'),
    buttons: list('Hero buttons', button(), [site.hero.primaryCta, { ...site.hero.secondaryCta, style: 'Outline' }]),
    stats: list('Statistics', group('Statistic', { value: text('Value'), label: text('Label') }), site.hero.stats),
    showScrollLink: toggle('Show scroll link'),
    scrollLabel: text('Scroll link text', site.company.tagline),
    scrollAriaLabel: text('Scroll link accessible label', 'Scroll to content'),
    scrollHref: field('link', 'Scroll link destination', '#product'),
  }),
  product: group('Latest Product', {
    enabled: toggle('Show this section'),
    items: list('Products', group('Product', {
      eyebrow: text('Eyebrow', 'Latest Product'), name: text('Product name'),
      badge: text('Badge', 'AI · Cognitive'), headline: text('Headline'),
      description: long('Description'), mockLabel: text('Feature panel label'),
      buttons: list('Product buttons', button()),
      features: list('Features', feature('Feature')),
    }), [{
      ...site.product,
      mockLabel: 'cogmentor · session',
      buttons: [{ ...site.product.cta, newTab: true }],
    }]),
  }),
  about: group('About Us', {
    enabled: toggle('Show this section'),
    eyebrow: text('Eyebrow'), heading: text('Heading'),
    pullQuote: long('Quote'),
    body: list('Paragraphs', long('Paragraph')),
    highlights: list('Highlights', group('Highlight', { k: text('Label'), v: text('Value') })),
  }, site.about),
  research: group('R&D', {
    enabled: toggle('Show this section'),
    eyebrow: text('Eyebrow'), heading: text('Heading'), intro: long('Introduction'),
    focus: long('Research focus'), pillars: list('Research pillars', feature('Pillar')),
  }, site.research),
  scientists: group('The scientists behind the science', {
    enabled: toggle('Show this section'),
    heading: text('Heading', 'The scientists behind the science'),
    items: list('Scientists', group('Scientist', { ...person, affiliation: long('Affiliation') }), site.research.scientists),
  }),
  leadership: group('Meet our leadership', {
    enabled: toggle('Show this section'),
    eyebrow: text('Eyebrow'), heading: text('Heading'),
    lead: long('Introduction', 'Educationists, industry veterans and research enthusiasts — together building for children.'),
    members: list('Leadership members', group('Member', { ...person, credential: text('Credential') })),
  }, site.leadership),
  visionMission: group('Vision & Mission', {
    enabled: toggle('Show this section'),
    eyebrow: text('Eyebrow', site.visionMission.eyebrow),
    quote: group('Quote', { text: long('Quote text'), author: text('Author') }, site.visionMission.quote),
    cards: list('Vision and mission cards', group('Card', {
      heading: text('Heading'), body: long('Description'),
      icon: select('Icon', ['Compass', 'Target']),
    }), [
      { heading: 'Our Vision', body: site.visionMission.vision, icon: 'Compass' },
      { heading: 'Our Mission', body: site.visionMission.mission, icon: 'Target' },
    ]),
  }),
  joinCta: group('Sounds Interesting?', {
    enabled: toggle('Show this section'),
    eyebrow: text('Eyebrow'), heading: text('Heading'), text: long('Description'),
    buttons: list('Call-to-action buttons', button(), [site.joinCta.cta]),
  }, site.joinCta),
  contact: group('Contact', {
    enabled: toggle('Show this section'), eyebrow: text('Eyebrow'), heading: text('Heading'),
    text: long('Introduction'), email: field('email', 'Contact email'),
    emailLabel: text('Email link label', 'Email us'),
    showForm: toggle('Show the contact form'),
    form: group('Contact form copy', {
      name: text('Name label', 'Name'), namePlaceholder: text('Name placeholder', 'Your full name'),
      email: text('Email label', 'Email'), emailPlaceholder: text('Email placeholder', 'you@example.com'),
      mobile: text('Mobile label', 'Mobile'), mobilePlaceholder: text('Mobile placeholder', 'Optional'),
      message: text('Message label', 'Message'), messagePlaceholder: text('Message placeholder', 'Tell us a little about what you have in mind…'),
      submitLabel: text('Submit button', 'Send Now'), sendingLabel: text('Sending label', 'Sending…'),
      success: long('Success message', 'Thank you for reaching out — we’ll get back to you shortly.'),
      failure: long('Error message', 'We could not send your message right now. Please try again or email us directly.'),
      nameError: text('Missing name message', 'Please enter your name.'),
      emailError: text('Invalid email message', 'Please enter a valid email.'),
      mobileError: text('Invalid mobile message', 'Please enter a valid phone number.'),
      messageError: text('Missing message error', 'Please add a short message.'),
    }),
  }, site.contact),
  footer: group('Footer', {
    blurb: long('Description'), quickHeading: text('Links heading', 'Quick Links'),
    policyHeading: text('Policy heading', 'Our Policy'), contactHeading: text('Contact heading', 'Contact'),
    newsHeading: text('News heading', 'Latest News'),
    copyright: text('Copyright text', '© {year} {company}. All rights reserved.'),
    closing: text('Closing text', 'Decoding what’s on your mind.'),
    quickLinks: list('Quick links', link()), policyLinks: list('Policy links', link(), site.footer.policyLinks.map(({ label, to }) => ({ label, href: to }))),
    news: list('News links', link()),
  }, { ...site.footer, policyLinks: undefined }),
  legal: group('Legal pages', {
    disclaimer: legalPage('Disclaimer', disclaimer),
    privacyPolicy: legalPage('Privacy Policy', privacyPolicy),
    backLabel: text('Back to homepage', 'Back to home'),
    updatedLabel: text('Last updated label', 'Last updated'),
    contactLabel: text('Contact prompt', 'Questions? Email us at'),
  }),
  metadata: group('Page titles & search', {
    title: text('Homepage title', "Noema Technology — Decoding What's on Your Mind"),
    description: long('Page description', "Noema Science & Technology is a research-driven cognitive science and education-technology organisation. We build Cogmentor — India's first scientifically proven AI-based cognitive assessment and training platform for children."),
    keywords: long('Search keywords', 'cognitive science, neuroscience, education technology, Cogmentor, cognitive training, Noema, brain and mind sciences, children education, neuroplasticity'),
    socialTitle: text('Social sharing title', "Noema Technology — Decoding What's on Your Mind"),
    socialDescription: long('Social sharing description', 'Research & data-driven cognitive science products that help every child realise their hidden potential.'),
    siteName: text('Site name', 'Noema Technology'),
    notFoundTitle: text('404 page title', 'Page not found'),
    notFoundText: long('404 description', 'The page you’re looking for doesn’t exist or has moved.'),
    notFoundButton: text('404 back button', 'Back to home'),
  }),
};

export const schema = group('Website', contentSchema);

function buildValue(node, value = node.value, blank = false) {
  if (node.type === 'group') {
    return Object.fromEntries(Object.entries(node.fields).map(([key, child]) => [
      key, buildValue(child, blank ? undefined : value?.[key], blank),
    ]));
  }
  if (node.type === 'list') return blank ? [] : value.map((item) => buildValue(node.item, item));
  if (blank && node.type === 'boolean') return false;
  if (blank && ['text', 'long', 'email', 'image', 'link'].includes(node.type)) return '';
  return value;
}

export const defaultContent = buildValue(schema);
export const createItem = (node) => buildValue(node, undefined, true);

export function mergeContent(published) {
  return buildValue(schema, published);
}

