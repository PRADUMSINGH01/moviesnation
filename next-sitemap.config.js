// next-sitemap.config.js

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.moviesflix.rent", // 🔁 Replace with your real domain
  generateRobotsTxt: true, // ✅ Auto-generate robots.txt
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  generateIndexSitemap: true,
};
