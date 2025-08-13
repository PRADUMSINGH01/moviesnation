import fs from "fs";
import path from "path";
import slugify from "slugify";

const DATA_DIR = path.join(process.cwd(), "data");
const SITEMAP_FILE = path.join(DATA_DIR, "sitemap.xml");
const META_FILE = path.join(DATA_DIR, "sitemap_meta.json");
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });

    // Load base URL from env
    const baseUrl = "http://moviesflix.rent";

    // Check if sitemap exists and is fresh
    if (fs.existsSync(META_FILE) && fs.existsSync(SITEMAP_FILE)) {
      const meta = JSON.parse(fs.readFileSync(META_FILE, "utf8"));
      const lastUpdated = new Date(meta.lastUpdated).getTime();
      const now = Date.now();

      if (now - lastUpdated < ONE_DAY_MS) {
        const cachedSitemap = fs.readFileSync(SITEMAP_FILE, "utf8");
        return new Response(cachedSitemap, {
          status: 200,
          headers: { "Content-Type": "application/xml" },
        });
      }
    }

    // Fetch movie data
    const movies = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, "Latest.json"), "utf8")
    );

    // Build sitemap XML
    const urls = movies
      .map((movie) => {
        const slug = slugify(`${movie.primaryTitle} latest movie`, {
          lower: true,
          strict: true,
        });
        return `
          <url>
            <loc>${baseUrl}/movies/${slug}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <priority>0.8</priority>
          </url>
        `;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    // Save sitemap & meta
    fs.writeFileSync(SITEMAP_FILE, xml, "utf8");
    fs.writeFileSync(
      META_FILE,
      JSON.stringify({ lastUpdated: new Date().toISOString() }, null, 2),
      "utf8"
    );

    // 🚀 Auto-submit sitemap to Google
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(
      `${baseUrl}/api/sitemap`
    )}`;
    try {
      await fetch(googlePingUrl);
      console.log("Sitemap submitted to Google:", googlePingUrl);
    } catch (err) {
      console.error("Failed to ping Google:", err);
    }

    return new Response(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Failed to generate sitemap", { status: 500 });
  }
}
