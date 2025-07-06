// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Script from "next/script";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movies Nation - Download Latest Movies in HD",
  description:
    "Download the latest Hollywood, Bollywood, Netflix, Prime, and Hulu movies in HD quality. Free movie downloads for all platforms.",
  keywords: [
    "movie downloader",
    "hollywood movies",
    "bollywood movies",
    "netflix movies",
    "prime video",
    "hulu movies",
    "free movie downloads",
    "hd movies",
  ],
  authors: [{ name: "Movies Nation", url: "https://moviesnation.com" }],
  openGraph: {
    title: "Movies Nation - Premium Movie Downloads",
    description: "Download the latest movies from all platforms in HD quality",
    url: "https://moviesnation.com",
    siteName: "Movies Nation",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Movies Nation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Movies Nation",
    description: "Your ultimate destination for movie downloads",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        {/* Next.js will inject other metadata here */}
        <Script
          type="text/javascript"
          src="//pl27094339.profitableratecpm.com/4f/8f/f9/4f8ff905a41c2232099bded39b8a2f0d.js"
        ></Script>
      </head>
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
