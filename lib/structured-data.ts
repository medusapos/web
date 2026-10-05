// schema.org JSON-LD for the home page and docs breadcrumbs.
// No runtime imports so tests/structured-data.test.mjs can load it with Node's type stripping.

export type StructuredDataSite = {
  name: string;
  url: string;
  description: string;
  githubUrl: string;
  githubOrgUrl: string;
};
export type Breadcrumb = { name: string; path: string };

// Both the app and the website are MIT-licensed.
const LICENSE_URL = 'https://opensource.org/licenses/MIT';

export function homeJsonLd(site: StructuredDataSite) {
  // Pricing is Paul's call, inventory item 13.
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: `${site.url}/icon.svg`,
        sameAs: [site.githubOrgUrl],
      },
      {
        '@type': 'SoftwareApplication',
        name: site.name,
        url: site.url,
        description: site.description,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web', // Browser app only, no native build yet.
        license: LICENSE_URL,
        sameAs: [site.githubUrl],
        publisher: { '@id': `${site.url}/#organization` },
      },
    ],
  };
}

export function breadcrumbJsonLd(site: StructuredDataSite, crumbs: Breadcrumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: new URL(crumb.path, site.url).href,
    })),
  };
}

export function serializeJsonLd(data: unknown): string {
  // Escaping < stops content from closing the script tag.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
