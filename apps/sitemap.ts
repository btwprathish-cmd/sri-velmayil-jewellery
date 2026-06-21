import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://srivelmayiljewellery.store',
      lastModified: new Date(),
    },
    {
      url: 'https://srivelmayiljewellery.store/collections',
      lastModified: new Date(),
    },
    {
      url: 'https://srivelmayiljewellery.store/gold-rate-today-tirupur',
      lastModified: new Date(),
    },
    {
      url: 'https://srivelmayiljewellery.store/about',
      lastModified: new Date(),
    },
    {
      url: 'https://srivelmayiljewellery.store/contact',
      lastModified: new Date(),
    },
  ]
}
