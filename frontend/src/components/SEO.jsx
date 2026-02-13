import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'International Airline and Aviation College';
const SITE_URL = 'https://iaacasia.com';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

/**
 * Reusable SEO component for per-page meta tags.
 *
 * @param {object} props
 * @param {string} props.title - Page title (will be appended with site name)
 * @param {string} props.description - Meta description (max ~160 chars)
 * @param {string} [props.path] - URL path (e.g., '/about')
 * @param {string} [props.image] - OG image URL
 * @param {string} [props.type] - OG type (default: 'website')
 * @param {string} [props.keywords] - Additional keywords
 * @param {object} [props.structuredData] - JSON-LD structured data object
 */
export default function SEO({
  title,
  description,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  keywords = '',
  structuredData = null,
}) {
  const fullTitle = title
    ? `${title} | IAAC - ${SITE_NAME}`
    : `IAAC | ${SITE_NAME} - Aviation Training in Sri Lanka`;
  const url = `${SITE_URL}${path}`;
  const baseKeywords =
    'IAAC, International Airline and Aviation College, aviation training Sri Lanka, airline courses, aviation academy';
  const fullKeywords = keywords
    ? `${keywords}, ${baseKeywords}`
    : baseKeywords;

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={fullKeywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
