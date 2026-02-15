/**
 * Client-side slug sanitization utility.
 *
 * Mirrors the backend SlugService.sanitizeSlug logic for instant feedback.
 * The server remains the ultimate authority — this is defense in depth.
 */
export const sanitizeSlug = (input: string): string => {
  if (!input) return '';

  // 1. Lowercase and trim
  let slug = input.toLowerCase().trim();

  // 2. Strip URL prefixes — take everything after the last path segment.
  //    Handles https://site.com/slug, site.com/slug, and bare slugs.
  if (slug.includes('://') || slug.includes('.com') || slug.includes('.io') || slug.includes('.org') || slug.includes('.dev')) {
    const parts = slug.split('/');
    slug = parts[parts.length - 1] || parts[parts.length - 2] || slug;
  }

  // 3. Strip query params and hash fragments
  slug = slug.split('?')[0].split('#')[0];

  // 4. Remove invalid characters (keep a-z, 0-9, hyphen)
  slug = slug.replace(/[^a-z0-9-]/g, '-');

  // 5. Remove consecutive hyphens
  slug = slug.replace(/-+/g, '-');

  // 6. Strip leading numbers and hyphens — slugs must start with a letter
  slug = slug.replace(/^[0-9-]+/, '');

  // 7. Remove trailing hyphens
  slug = slug.replace(/-+$/, '');

  // 8. Max length 60, ensure no trailing hyphen after truncation
  if (slug.length > 60) {
    slug = slug.substring(0, 60).replace(/-+$/, '');
  }

  return slug;
};
