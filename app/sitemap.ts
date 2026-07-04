import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url:
        'https://yourdomain.com',

      lastModified:
        new Date(),

      priority: 1,
    },

    {
      url:
        'https://yourdomain.com/predictions',

      lastModified:
        new Date(),

      priority: 0.9,
    },

    {
      url:
        'https://yourdomain.com/live-scores',

      lastModified:
        new Date(),

      priority: 0.9,
    },

    {
      url:
        'https://yourdomain.com/fixtures',

      lastModified:
        new Date(),

      priority: 0.8,
    },

    {
      url:
        'https://yourdomain.com/articles',

      lastModified:
        new Date(),

      priority: 0.8,
    },

    {
      url:
        'https://yourdomain.com/standings',

      lastModified:
        new Date(),

      priority: 0.8,
    },

    {
      url:
        'https://yourdomain.com/pricing',

      lastModified:
        new Date(),

      priority: 0.7,
    },
  ];
}