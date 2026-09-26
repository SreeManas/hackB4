import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { env } from '@/config/env';
import { site } from '@/content/site';

interface Meta {
  /** Page title; the site name is appended automatically. */
  title?: string;
  description?: string;
  image?: string;
  /** Structured data (schema.org) injected as JSON-LD. */
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
}

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
};

const setCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
};

/** Per-route <title>, description, canonical, Open Graph / Twitter tags and JSON-LD. */
export function useDocumentMeta({
  title,
  description = site.description,
  image = site.ogImage,
  jsonLd,
  noindex,
}: Meta) {
  const { pathname } = useLocation();
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — ${site.tagline}`;
    const url = `${env.siteUrl}${pathname}`;
    const imageUrl = image.startsWith('http') ? image : `${env.siteUrl}${image}`;

    document.title = fullTitle;
    setCanonical(url);
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', imageUrl);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', imageUrl);

    if (!jsonLdString) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = jsonLdString;
    document.head.appendChild(script);
    return () => script.remove();
  }, [title, description, image, noindex, pathname, jsonLdString]);
}
