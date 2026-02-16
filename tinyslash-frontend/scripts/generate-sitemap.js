const fs = require('fs');
const path = require('path');

const blogPostsPath = path.join(__dirname, '../src/data/BlogPosts.ts');
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

try {
  const blogPostsContent = fs.readFileSync(blogPostsPath, 'utf8');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

  // Regex to extract slug and date
  // Matches: slug: 'slug-name', ... date: 'Month DD, YYYY',
  const regex = /slug:\s*'([^']+)',[\s\S]*?date:\s*'([^']+)'/g;
  let match;
  const posts = [];

  while ((match = regex.exec(blogPostsContent)) !== null) {
    posts.push({ slug: match[1], date: match[2] });
  }

  const formatDate = (dateStr) => {
    try {
      // Append UTC to ensure valid date at 00:00:00 UTC, preventing timezone shift
      const date = new Date(`${dateStr} UTC`);
      if (isNaN(date.getTime())) {
        // Fallback if appending UTC fails (though standard JS Date handles it usually)
        return new Date(dateStr).toISOString().split('T')[0];
      }
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.warn(`Could not parse date: ${dateStr}, using today`);
      return new Date().toISOString().split('T')[0];
    }
  };

  const blogXmlLines = posts.map(post => `  <url>
    <loc>https://tinyslash.com/blog/${post.slug}</loc>
    <lastmod>${formatDate(post.date)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

  const blogSectionStart = '<!-- Blog Section -->';
  const blogSectionEnd = '</urlset>';

  const [beforeBlog] = sitemapContent.split(blogSectionStart);

  if (!beforeBlog) {
    console.error('Could not find Blog Section marker in sitemap.xml');
    process.exit(1);
  }

  // Blog index date (today)
  const today = new Date().toISOString().split('T')[0];

  const newSitemap = `${beforeBlog}${blogSectionStart}
  <url>
    <loc>https://tinyslash.com/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${blogXmlLines}
${blogSectionEnd}`;

  fs.writeFileSync(sitemapPath, newSitemap);
  console.log('Sitemap successfully updated with ' + posts.length + ' blog posts.');

} catch (error) {
  console.error('Error constructing sitemap:', error);
  process.exit(1);
}
