import { MetadataRoute } from 'next';
import { SEO } from '@/config/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SEO.url,
      lastModified: new Date(),
      priority: 1,
    },

    {
      url: `${SEO.url}/dashboard/predictions`,
      lastModified: new Date(),
      priority: 0.9,
    },

    {
      url: `${SEO.url}/livescore`,
      lastModified: new Date(),
      priority: 0.9,
    },

    {
      url: `${SEO.url}/community`,
      lastModified: new Date(),
      priority: 0.8,
    },

    {
      url: `${SEO.url}/articles`,
      lastModified: new Date(),
      priority: 0.8,
    },

    {
      url: `${SEO.url}/about`,
      lastModified: new Date(),
      priority: 0.8,
    },

    {
      url: `${SEO.url}/pricing`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${SEO.url}/dashboard/referrals`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${SEO.url}/dashboard/subscriptions`,
      lastModified: new Date(),
      priority: 0.7,
    },
  ];
}