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
  // The MedusaPOS release the site describes (medusapos/app tag v0.2.0). The home page uses it;
  // tests/release-version.test.mjs keeps it equal to the changelog's newest entry and the docs.
  release: '0.2.0',
  // The GitHub organisation, used as the Organization's sameAs in structured data.
  githubOrgUrl: 'https://github.com/medusapos',
  docsRepo: { user: 'medusapos', repo: 'web', branch: 'main' },
  // The UI kit the app is built with, linked from the home footer.
  builtWith: { name: 'TallyUI', url: 'https://tallyui.com' },
  // The same app for another commerce platform, linked from the home footer.
  sibling: { name: 'VendurePOS', url: 'https://vendurepos.com', platform: 'Vendure' },
} as const;
