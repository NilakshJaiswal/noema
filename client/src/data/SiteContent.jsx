import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { defaultContent } from '../../../server/content/contentSchema.js';
import api from '../lib/api.js';
import { siteColors } from './siteColors.js';

const SiteContent = createContext(defaultContent);

export function useSiteContent() {
  return useContext(SiteContent);
}

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/api/content', { signal: controller.signal })
      .then(({ data }) => { if (data?.content?.metadata) setContent(data.content); })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return (
    <SiteContent.Provider value={content}>
      <div className="public-site min-h-screen" style={siteColors(content.layout)}>
        {children}
      </div>
    </SiteContent.Provider>
  );
}

export function SiteMetadata() {
  const { branding, legal, metadata } = useSiteContent();
  const { pathname } = useLocation();
  const page = {
    '/disclaimer': legal.disclaimer,
    '/privacy-policy': legal.privacyPolicy,
    '/policy': legal.privacyPolicy,
  }[pathname.toLowerCase().replace(/\/$/, '')];
  useEffect(() => {
    document.title = page ? `${page.title} — ${metadata.siteName}`
      : pathname === '/' ? metadata.title : `${metadata.notFoundTitle} — ${metadata.siteName}`;
    const values = {
      description: metadata.description,
      keywords: metadata.keywords,
      author: branding.legalName,
      'og:site_name': metadata.siteName,
      'og:title': page?.title || metadata.socialTitle,
      'og:description': page?.intro || metadata.socialDescription,
    };
    for (const [key, value] of Object.entries(values)) {
      document.querySelector(`meta[name="${key}"], meta[property="${key}"]`)?.setAttribute('content', value);
    }
    const favicon = document.querySelector('link[rel="icon"]');
    favicon?.setAttribute('href', branding.logo || '/favicon.svg');
    return () => favicon?.setAttribute('href', '/favicon.svg');
  }, [branding, metadata, page, pathname]);
  return null;
}

