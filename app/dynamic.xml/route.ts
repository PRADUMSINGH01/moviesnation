// app/dynamic.xml/route.ts
import { NextResponse } from "next/server";
import { getLatestMovies } from "@/lib/getlatest";

export const dynamic = "force-dynamic";
export interface Page {
  primaryTitle: string;
}

export async function GET() {
  const pages = await getLatestMovies();

  const urls = pages
    .map((p: Page) => {
      // encode the full URL so that spaces, colons, ampersands, etc. become %20, %3A, &amp;
      const safeUrl = encodeURI(`https://moviesflix.rent/${p.primaryTitle}`);
      return `
  <url>
    <loc>${safeUrl}</loc>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
