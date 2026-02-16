import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  fullTitle?: string;
  description?: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
  noindex?: boolean;
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  fullTitle,
  description,
  name = 'TinySlash',
  type = 'website',
  image = '/logo.png', // Default image as relative path
  url,
  noindex = false,
  twitterCard = 'summary_large_image',
  structuredData,
}) => {
  const siteTitle = fullTitle ? fullTitle : (title ? `${title} | ${name}` : name);
  const metaDescription = description || "TinySlash - The most powerful URL shortener and QR code generator for your business.";

  // Safe URL handling for SSR - strip query params for canonical
  const currentUrl = url || (typeof window !== 'undefined'
    ? window.location.origin + window.location.pathname
    : 'https://tinyslash.com'); // SSR fallback: pages must pass explicit url prop for correct canonical during server rendering.

  // Ensure absolute image URL
  const absoluteImage = image.startsWith('http')
    ? image
    : `https://tinyslash.com${image.startsWith('/') ? image : `/${image}`}`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name='description' content={metaDescription} />
      {noindex && <meta name="robots" content="noindex" />}
      <link rel="canonical" href={currentUrl} />
      <meta name="theme-color" content="#2563EB" />

      {/* Facebook tags */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="TinySlash" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:alt" content={image === '/logo.png' ? 'TinySlash Logo' : siteTitle} />
      {image === '/logo.png' && (
        <>
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}
      <meta property="og:url" content={currentUrl} />

      {/* Twitter tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@tinyslash" />
      <meta name="twitter:creator" content="@tinyslash" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
