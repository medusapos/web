// This is the only file to change when reusing the site for another product.
export const siteConfig = {
  name: 'MedusaPOS',
  tagline: 'Point of sale for Medusa',
  url: 'https://medusapos.com',
  description:
    'Open-source point of sale for Medusa v2. Runs in the browser, keeps selling offline, and syncs with your Medusa backend.',
  appUrl: 'https://app.medusapos.com',
  demoUrl: 'https://demo.medusapos.com/demo',
  githubUrl: 'https://github.com/medusapos/app',
  docsRepo: { user: 'medusapos', repo: 'web', branch: 'main' },
} as const;
