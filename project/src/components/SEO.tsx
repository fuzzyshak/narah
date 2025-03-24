import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  type?: string;
  keywords?: string;
}

export function SEO({
  title = 'Narah - Fitness Booking Platform in Bahrain',
  description = 'Book fitness classes and gym sessions at Bahrain\'s premier facilities. Access top-rated gyms, hotel fitness centers, and wellness facilities with flexible scheduling.',
  canonicalUrl = 'https://narah.com',
  image = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80',
  type = 'website',
  keywords = 'Bahrain fitness centers, Bahrain fitness gyms, Bahrain hotel gyms, book a gym in Bahrain, fitness booking Bahrain, gym day pass Bahrain, hotel fitness centers Bahrain'
}: SEOProps) {
  const siteTitle = title.includes('Narah') ? title : `${title} | Narah`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Narah" />
      <meta name="geo.region" content="BH" />
      <meta name="geo.placename" content="Bahrain" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}