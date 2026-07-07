// Site-wide constants used across layouts, metadata, and generated routes.

/** Product/site name shown in the top nav and OG images. */
export const appName = 'Canvasm Docs';

/** Canonical production origin (no trailing slash). Used for metadata/sitemap. */
export const siteUrl = 'https://docs.canvasm.app';

/** The live Metrimap app the docs point users into. */
export const appUrl = 'https://use.canvasm.app';

export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// Public GitHub repo backing these docs (edit links, feedback, view-source).
export const gitConfig = {
  user: 'nadeemramli',
  repo: 'metrimap-docs',
  branch: 'main',
};
