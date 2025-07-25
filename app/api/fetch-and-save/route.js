// app/api/fetch-and-save/route.js

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const GET = async () => {
  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST;

  if (!apiKey || !apiHost) {
    return NextResponse.json(
      { success: false, message: "Missing RAPIDAPI_KEY or RAPIDAPI_HOST" },
      { status: 500 }
    );
  }

  try {
    const url = "https://imdb236.p.rapidapi.com/api/imdb/most-popular-movies";
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": apiHost,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: `Fetch failed: ${res.status}` },
        { status: res.status }
      );
    }

    const movies = await res.json();
    const dataDir = path.join(process.cwd(), "data");
    await fs.mkdir(dataDir, { recursive: true });

    await Promise.all(
      movies.map(async (m) => {
        const title = m.primaryTitle || m.originalTitle || "movie";
        const slug = slugify(title);
        const filename = `${slug}.html`;
        const filePath = path.join(dataDir, filename);

        // Modern HTML template with dynamic data
        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="robots" content="index, follow">
          <meta name="googlebot" content="index, follow">
          <title>${title} | Movie Details & Download | Movieflix</title>
          
          <meta name="description" content="${
            m.description ||
            "Discover details, cast information, and streaming options for " +
              title
          }">
          <meta name="keywords" content="${title}, ${
          m.genres ? m.genres.join(", ") : "movie"
        }, download, watch online, streaming">
          
          <!-- Open Graph / Social Media Meta Tags -->
          <meta property="og:title" content="${title} | Movie Details">
          <meta property="og:description" content="${
            m.description ||
            "Discover details and streaming options for " + title
          }">
          <meta property="og:image" content="${
            m.primaryImage ||
            "https://via.placeholder.com/800x450?text=Movie+Poster"
          }">
          <meta property="og:url" content="https://yourwebsite.com/movies/${slug}">
          <meta property="og:type" content="website">
          
          <!-- Twitter Card Meta Tags -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${title} | Movie Details">
          <meta name="twitter:description" content="${
            m.description ||
            "Discover details and streaming options for " + title
          }">
          <meta name="twitter:image" content="${
            m.primaryImage ||
            "https://via.placeholder.com/800x450?text=Movie+Poster"
          }">
          
          <!-- Canonical URL -->
          <link rel="canonical" href="https://yourwebsite.com/movies/${slug}">
          
          <!-- Fonts & Icons -->
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          
          <!-- Favicon -->
          <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎬</text></svg>">
          
          <style>
            :root {
              --primary: #2a2a72;
              --primary-light: #3a3a8a;
              --secondary: #4ecdc4;
              --accent: #ff6b6b;
              --dark: #0a192f;
              --darker: #071120;
              --light: #ccd6f6;
              --lighter: #e6f1ff;
              --card-bg: #112240;
              --shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.7);
              --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
              --border-radius: 12px;
              --server-download: rgba(78, 205, 196, 0.15);
              --server-watch: rgba(255, 107, 107, 0.15);
            }
        
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
        
            html {
              scroll-behavior: smooth;
              font-size: 100%;
            }
        
            body {
              background: linear-gradient(135deg, var(--darker) 0%, var(--dark) 100%);
              color: var(--light);
              font-family: 'Roboto', sans-serif;
              line-height: 1.6;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 1rem;
            }
        
            .container {
              width: 100%;
              max-width: 1200px;
              display: flex;
              flex-direction: column;
              gap: 2rem;
              padding: 1rem;
            }
        
            header, section, footer {
              width: 100%;
              opacity: 0;
              transform: translateY(20px);
              animation: fadeIn 0.8s forwards;
            }
        
            .header-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 1.5rem;
              margin-bottom: 1.5rem;
            }
        
            .breadcrumb {
              align-self: flex-start;
              font-size: 0.9rem;
              margin-bottom: 0.5rem;
              color: var(--lighter);
              opacity: 0.8;
            }
        
            .breadcrumb a {
              color: var(--secondary);
              text-decoration: none;
              transition: var(--transition);
            }
        
            .breadcrumb a:hover {
              text-decoration: underline;
            }
        
            .poster-section {
              position: relative;
              border-radius: var(--border-radius);
              overflow: hidden;
              box-shadow: var(--shadow);
              width: 100%;
              max-width: 800px;
            }
        
            .poster {
              width: 100%;
              height: auto;
              display: block;
              aspect-ratio: 16/9;
              object-fit: cover;
              object-position: center 20%;
            }
        
            .rating-badge {
              position: absolute;
              top: 1rem;
              right: 1rem;
              background: rgba(10, 25, 47, 0.8);
              backdrop-filter: blur(5px);
              color: var(--secondary);
              font-weight: bold;
              padding: 0.5rem 1rem;
              border-radius: 50px;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              border: 1px solid var(--secondary);
              font-size: 1rem;
              z-index: 10;
            }
        
            .rating-badge i {
              color: #ffd700;
            }
        
            .movie-title {
              font-family: 'Montserrat', sans-serif;
              font-size: clamp(2.2rem, 5vw, 3.2rem);
              font-weight: 700;
              color: var(--secondary);
              line-height: 1.2;
              text-align: center;
              margin-bottom: 0.5rem;
              text-shadow: 0 2px 10px rgba(0,0,0,0.3);
            }
        
            .movie-subtitle {
              font-size: 1.1rem;
              color: var(--lighter);
              text-align: center;
              font-weight: 300;
              margin-bottom: 1.5rem;
              opacity: 0.9;
            }
        
            .meta-info {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 1rem 1.5rem;
              padding-bottom: 1.5rem;
              border-bottom: 1px solid rgba(204, 214, 246, 0.1);
              width: 100%;
            }
        
            .meta-item {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              color: var(--light);
              font-size: 0.95rem;
              opacity: 0.8;
            }
        
            .meta-item i {
              color: var(--secondary);
            }
        
            .description {
              font-size: 1.1rem;
              line-height: 1.8;
              text-align: center;
              color: #a8b2d1;
              max-width: 800px;
              margin: 0 auto;
            }
        
            .section-title {
              font-family: 'Montserrat', sans-serif;
              font-size: clamp(1.6rem, 4vw, 2rem);
              font-weight: 700;
              color: var(--light);
              text-align: center;
              margin-bottom: 1.5rem;
              position: relative;
              padding-bottom: 0.5rem;
            }
        
            .section-title::after {
              content: "";
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 60px;
              height: 3px;
              background: var(--accent);
              border-radius: 3px;
            }
        
            .tags {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 0.8rem;
              margin: 1.5rem 0;
            }
        
            .tag {
              background: rgba(78, 205, 196, 0.1);
              color: var(--secondary);
              padding: 0.5rem 1.2rem;
              border-radius: 50px;
              font-weight: 500;
              font-size: 0.95rem;
              transition: var(--transition);
            }
        
            .tag:hover {
              background-color: var(--secondary);
              color: var(--dark);
            }
        
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 1.2rem;
              margin-bottom: 2rem;
            }
        
            .info-card {
              background: var(--dark);
              border-radius: var(--border-radius);
              padding: 1.5rem;
              text-align: center;
              border: 1px solid rgba(204, 214, 246, 0.1);
              transition: var(--transition);
            }
        
            .info-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
            }
        
            .info-card h3 {
              font-family: 'Montserrat', sans-serif;
              font-size: 1.2rem;
              color: var(--secondary);
              margin-bottom: 0.8rem;
            }
        
            .info-card ul {
              list-style: none;
              padding: 0;
            }
        
            .info-card li {
              padding: 0.3rem 0;
              font-size: 1rem;
              color: #a8b2d1;
            }
        
            .cast-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
              gap: 1.8rem;
            }
        
            .cast-card {
              text-align: center;
              transition: var(--transition);
            }
        
            .cast-card:hover {
              transform: translateY(-5px);
            }
        
            .cast-img {
              width: 100%;
              height: 200px;
              border-radius: var(--border-radius);
              object-fit: cover;
              margin-bottom: 0.8rem;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
              border: 2px solid rgba(78, 205, 196, 0.2);
            }
        
            .cast-name {
              font-weight: 600;
              font-size: 1.1rem;
              color: var(--light);
              margin-bottom: 0.2rem;
            }
        
            .cast-character {
              font-size: 0.9rem;
              color: #a8b2d1;
              opacity: 0.8;
              font-style: italic;
            }
        
            .video-container {
              position: relative;
              overflow: hidden;
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              padding-top: 56.25%; /* 16:9 Aspect Ratio */
              border-radius: var(--border-radius);
              box-shadow: var(--shadow);
              background-color: #000;
            }
        
            .video-container iframe {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border: 0;
            }
            
            /* Server sections */
            .server-section {
              display: flex;
              flex-direction: column;
              gap: 1.5rem;
              margin-top: 1rem;
            }
            
            .server-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 1.5rem;
            }
            
            .server-card {
              background: var(--card-bg);
              border-radius: var(--border-radius);
              padding: 1.5rem;
              text-align: center;
              transition: var(--transition);
              display: flex;
              flex-direction: column;
              align-items: center;
              box-shadow: var(--shadow);
            }
            
            .server-card.download {
              border-top: 4px solid var(--secondary);
              background: var(--server-download);
            }
            
            .server-card.watch {
              border-top: 4px solid var(--accent);
              background: var(--server-watch);
            }
            
            .server-card:hover {
              transform: translateY(-8px);
              box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
            }
            
            .server-icon {
              font-size: 2.5rem;
              margin-bottom: 1rem;
            }
            
            .server-card.download .server-icon {
              color: var(--secondary);
            }
            
            .server-card.watch .server-icon {
              color: var(--accent);
            }
            
            .server-name {
              font-weight: 700;
              font-size: 1.3rem;
              margin-bottom: 0.5rem;
              color: var(--light);
              font-family: 'Montserrat', sans-serif;
            }
            
            .server-quality {
              font-size: 0.95rem;
              color: #a8b2d1;
              margin-bottom: 1.2rem;
              padding: 0.3rem 1rem;
              background: rgba(0, 0, 0, 0.3);
              border-radius: 20px;
              display: inline-block;
            }
            
            .server-button {
              display: inline-block;
              width: 100%;
              max-width: 200px;
              padding: 0.8rem;
              border-radius: 8px;
              font-weight: 600;
              text-decoration: none;
              text-align: center;
              transition: var(--transition);
              margin-top: auto;
              font-size: 1.1rem;
            }
            
            .server-card.download .server-button {
              background: var(--secondary);
              color: var(--dark);
              box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
            }
            
            .server-card.watch .server-button {
              background: var(--accent);
              color: var(--dark);
              box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
            }
            
            .server-card.download .server-button:hover {
              background: rgba(78, 205, 196, 0.9);
              transform: translateY(-2px);
            }
            
            .server-card.watch .server-button:hover {
              background: rgba(255, 107, 107, 0.9);
              transform: translateY(-2px);
            }
            
            .server-button i {
              margin-right: 0.5rem;
            }
        
            .footer {
              text-align: center;
              padding: 3rem 0 2rem;
              color: #a8b2d1;
              font-size: 0.95rem;
              opacity: 0.7;
              border-top: 1px solid rgba(204, 214, 246, 0.1);
              margin-top: 2rem;
              width: 100%;
            }
        
            .footer-nav {
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
              gap: 1.5rem;
              margin-bottom: 1.5rem;
            }
        
            .footer-nav a {
              color: var(--light);
              text-decoration: none;
              transition: var(--transition);
            }
        
            .footer-nav a:hover {
              color: var(--secondary);
            }
        
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
        
            /* Staggered animation delays */
            header {
              animation-delay: 0.1s;
            }
            .details-section {
              animation-delay: 0.2s;
            }
            .download-section {
              animation-delay: 0.3s;
            }
            .watch-section {
              animation-delay: 0.35s;
            }
            footer {
              animation-delay: 0.4s;
            }
        
            /* Mobile Responsiveness */
            @media (max-width: 768px) {
              body {
                padding: 0.5rem;
              }
              
              .container {
                padding: 0.5rem;
                gap: 1.5rem;
              }
              
              .movie-title {
                font-size: 2rem;
              }
              
              .meta-info {
                gap: 0.8rem;
                font-size: 0.9rem;
              }
              
              .description {
                font-size: 1rem;
                padding: 0 0.5rem;
              }
              
              .cast-grid {
                grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
                gap: 1.2rem;
              }
              
              .cast-img {
                height: 170px;
              }
              
              .server-grid {
                grid-template-columns: 1fr;
                gap: 1.2rem;
              }
              
              .info-grid {
                grid-template-columns: 1fr;
              }
              
              .section-title {
                font-size: 1.5rem;
              }
              
              .server-button {
                padding: 0.7rem;
                font-size: 1rem;
              }
              
              .footer-nav {
                flex-direction: column;
                gap: 0.8rem;
              }
            }
        
            @media (max-width: 480px) {
              .cast-grid {
                grid-template-columns: repeat(2, 1fr);
              }
              
              .cast-img {
                height: 160px;
              }
              
              .rating-badge {
                font-size: 0.9rem;
                padding: 0.4rem 0.8rem;
              }
              
              .tag {
                padding: 0.4rem 1rem;
                font-size: 0.9rem;
              }
            }
          </style>
          
          <!-- JSON-LD Structured Data -->
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Movie",
            "name": "${title} Hindi Full Movie | 1080p | 720p | 480p",
            ${m.primaryImage ? `"image": "${m.primaryImage}",` : ""}
            ${
              m.directors?.length
                ? `"director": {
              "@type": "Person",
              "name": "${m.directors[0].fullName}"
            },`
                : ""
            }
            "dateCreated": "${m.releaseDate || "2025"}",
            ${
              m.runtime?.seconds
                ? `"duration": "PT${Math.floor(m.runtime.seconds / 60)}M",`
                : ""
            }
            ${
              m.genres?.length
                ? `"genre": ${JSON.stringify(m.genres.slice(0, 3))},`
                : ""
            }
            "description": "${m.description || "Movie details"}",
            ${
              m.ratings?.averageRating
                ? `"aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "${m.ratings.averageRating}",
              "bestRating": "10",
              "ratingCount": "${m.ratings.numVotes || "1000"}"
            },`
                : ""
            }
            ${
              m.cast?.length
                ? `"actor": [
              ${m.cast
                .slice(0, 3)
                .map(
                  (c) => `{
                "@type": "Person",
                "name": "${c.fullName}"
              }`
                )
                .join(",")}
            ],`
                : ""
            }
            ${
              m.productionCompanies?.length
                ? `"productionCompany": {
              "@type": "Organization",
              "name": "${m.productionCompanies[0].name}"
            }`
                : ""
            }
          }
          </script>
        </head>
        <body>
          <div class="container">
            <header>
              <div class="breadcrumb">
                <a href="/">Home</a> / <a href="/movies">Movies</a> / ${
                  m.genres?.length
                    ? `<a href="/genre/${m.genres[0].toLowerCase()}">${
                        m.genres[0]
                      }</a> / `
                    : ""
                }${title}
              </div>
              
              <div class="header-content">
                <h1 class="movie-title">${title}</h1>
                ${m.tagline ? `<p class="movie-subtitle">${m.tagline}</p>` : ""}
                
                <section class="poster-section">
                  ${
                    m.primaryImage
                      ? `<img src="${m.primaryImage}" alt="${title} movie poster" class="poster">`
                      : `<div style="background: #0c162d; height: 400px; border-radius: var(--border-radius); display: flex; align-items: center; justify-content: center; color: #a8b2d1; font-size: 1.2rem;">Poster Not Available</div>`
                  }
                  ${
                    m.ratings?.averageRating
                      ? `<div class="rating-badge">
                          <i class="fas fa-star"></i>
                          <span>${m.ratings.averageRating}/10</span>
                        </div>`
                      : ""
                  }
                </section>
              </div>
            </header>
        
            <main class="details-section">
              <div class="meta-info">
                ${
                  m.releaseDate
                    ? `
                <div class="meta-item">
                  <i class="fas fa-calendar-alt"></i><span>${new Date(
                    m.releaseDate
                  ).toLocaleDateString()}</span>
                </div>`
                    : ""
                }
                
                ${
                  m.runtime?.seconds
                    ? `
                <div class="meta-item">
                  <i class="fas fa-clock"></i><span>${Math.floor(
                    m.runtime.seconds / 60
                  )} min</span>
                </div>`
                    : ""
                }
                
                ${
                  m.contentRating
                    ? `
                <div class="meta-item">
                  <i class="fas fa-ticket-alt"></i><span>${m.contentRating}</span>
                </div>`
                    : ""
                }
                
                ${
                  m.spokenLanguages?.length
                    ? `
                <div class="meta-item">
                  <i class="fas fa-globe"></i><span>${m.spokenLanguages[0]}</span>
                </div>`
                    : ""
                }
              </div>
        
              ${
                m.description
                  ? `
              <p class="description">
                ${m.description}
              </p>`
                  : ""
              }
              
              ${
                m.genres?.length
                  ? `
              <div class="section-title">
                <h2>Genres</h2>
              </div>
              <div class="tags">
                ${m.genres.map((g) => `<span class="tag">${g}</span>`).join("")}
              </div>`
                  : ""
              }
              
              <section>
                <h2 class="section-title">Cast & Crew</h2>
                <div class="info-grid">
                  ${
                    m.directors?.length
                      ? `
                  <div class="info-card">
                    <h3><i class="fas fa-video"></i> Directors</h3>
                    <ul>
                      ${m.directors
                        .slice(0, 3)
                        .map(
                          (d) => `
                        <li>${d.fullName}</li>
                      `
                        )
                        .join("")}
                    </ul>
                  </div>`
                      : ""
                  }
                  
                  ${
                    m.writers?.length
                      ? `
                  <div class="info-card">
                    <h3><i class="fas fa-pen"></i> Writers</h3>
                    <ul>
                      ${m.writers
                        .slice(0, 3)
                        .map(
                          (w) => `
                        <li>${w.fullName}</li>
                      `
                        )
                        .join("")}
                    </ul>
                  </div>`
                      : ""
                  }
                  
                  ${
                    m.cast?.length
                      ? `
                  <div class="info-card">
                    <h3><i class="fas fa-building"></i> Production</h3>
                    <ul>
                      ${m.productionCompanies
                        .slice(0, 3)
                        .map(
                          (c) => `
                        <li>${c.name}</li>
                      `
                        )
                        .join("")}
                    </ul>
                  </div>`
                      : ""
                  }
                </div>
              </section>
        
              <section>
                <h2 class="section-title">Top Cast</h2>
                <div class="cast-grid">
                  ${
                    m.cast
                      ?.slice(0, 4)
                      .map(
                        (c) => `
                  <div class="cast-card">
                    <img
                      src="${
                        c.image ||
                        "https://via.placeholder.com/200x300?text=Actor"
                      }"
                      alt="${c.fullName}"
                      class="cast-img"
                    />
                    <div class="cast-name">${c.fullName}</div>
                    <div class="cast-character">${c.character || "Role"}</div>
                  </div>
                  `
                      )
                      .join("") || "<p>Cast information not available</p>"
                  }
                </div>
              </section>
        
              ${
                m.budget?.amount || m.grossWorldwide?.amount
                  ? `
              <section>
                <h2 class="section-title">Financials</h2>
                <div class="info-grid">
                  ${
                    m.budget?.amount
                      ? `
                  <div class="info-card">
                    <h3><i class="fas fa-wallet"></i> Budget</h3>
                    <ul>
                      <li>$${(m.budget.amount / 1000000).toFixed(1)}M</li>
                    </ul>
                  </div>`
                      : ""
                  }
                  
                  ${
                    m.grossWorldwide?.amount
                      ? `
                  <div class="info-card">
                    <h3><i class="fas fa-cash-register"></i> Worldwide Gross</h3>
                    <ul>
                      <li>$${(m.grossWorldwide.amount / 1000000).toFixed(
                        1
                      )}M</li>
                    </ul>
                  </div>`
                      : ""
                  }
                </div>
              </section>`
                  : ""
              }
              
              ${
                m.trailer?.link
                  ? `
              <section>
                <h2 class="section-title">Official Trailer</h2>
                <div class="video-container">
                  <iframe
                    src="https://www.youtube.com/embed/${
                      m.trailer.link.split("v=")[1]
                    }"
                    title="${title} Official Trailer"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                  >
                  </iframe>
                </div>
              </section>`
                  : ""
              }
              
              <!-- Download Servers Section -->
              <section class="download-section">
                <h2 class="section-title">Download Servers</h2>
                <div class="server-section">
                  <div class="server-grid">
                    <div class="server-card download">
                      <i class="fas fa-cloud-download-alt server-icon"></i>
                      <div class="server-name">Cloud Server</div>
                      <div class="server-quality">1080p • 1.8GB</div>
                      <a href="#" class="server-button">
                        <i class="fas fa-download"></i> Download HD
                      </a>
                    </div>
                    
                    <div class="server-card download">
                      <i class="fas fa-server server-icon"></i>
                      <div class="server-name">Fast Server</div>
                      <div class="server-quality">720p • 1.2GB</div>
                      <a href="#" class="server-button">
                        <i class="fas fa-download"></i> Fast Download
                      </a>
                    </div>
                    
                    <div class="server-card download">
                      <i class="fas fa-bolt server-icon"></i>
                      <div class="server-name">Turbo Server</div>
                      <div class="server-quality">4K • 4.5GB</div>
                      <a href="#" class="server-button">
                        <i class="fas fa-download"></i> Ultra HD
                      </a>
                    </div>
                    
                    <div class="server-card download">
                      <i class="fas fa-globe-americas server-icon"></i>
                      <div class="server-name">Global Server</div>
                      <div class="server-quality">1080p • 1.7GB</div>
                      <a href="#" class="server-button">
                        <i class="fas fa-download"></i> Worldwide
                      </a>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Watch Servers Section -->
              <section class="watch-section">
                <h2 class="section-title">Watch Online</h2>
                <div class="server-section">
                  <div class="server-grid">
                    <div class="server-card watch">
                      <i class="fas fa-play-circle server-icon"></i>
                      <div class="server-name">Stream Prime</div>
                      <div class="server-quality">HD • Low Latency</div>
                      <a href="#" class="server-button">
                        <i class="fas fa-play"></i> Watch Now
                      </a>
                    </div>
                    
                    <div class="server-card watch">
                      <i class="fas fa-video server-icon"></i>
                      <div class="server-name">CineStream</div>
                      <div class="server-quality">Full HD • No Ads</div>
                      <a href="#" class="server-button">
                        <i class="fas fa-play"></i> Watch Now
                      </a>
                    </div>
                    
                    <div class="server-card watch">
                      <i class="fas fa-film server-icon"></i>
                      <div class="server-name">MovieHub</div>
                      <div class="server-quality">720p • Fast Stream</div>
                      <a href="#" class="server-button">
                        <i class="fas fa-play"></i> Watch Now
                      </a>
                    </div>
                    
                    <div class="server-card watch">
                      <i class="fas fa-tv server-icon"></i>
                      <div class="server-name">FlixTV</div>
                      <div class="server-quality">1080p • Premium</div>
                      <a href="#" class="server-button">
                        <i class="fas fa-play"></i> Watch Now
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </main>
        
            <footer class="footer">
              <div class="footer-nav">
                <a href="#">Home</a>
                <a href="#">Movies</a>
                <a href="#">TV Shows</a>
                <a href="#">New Releases</a>
                <a href="#">FAQ</a>
                <a href="#">Contact</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
              <p>© ${new Date().getFullYear()} CineStream. All rights reserved.</p>
              <p>${title} is a trademark of its respective owners. This site is for educational purposes only.</p>
              <p>Data provided by IMDb.</p>
            </footer>
          </div>
          
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              // Animate elements on scroll
              const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                  }
                });
              }, { threshold: 0.1 });
              
              document.querySelectorAll('header, section, footer').forEach(el => {
                observer.observe(el);
              });
              
              // Service worker registration for PWA capabilities
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                  .then(reg => console.log('Service Worker registered', reg))
                  .catch(err => console.error('Service Worker registration failed', err));
              }
            });
          </script>
        </body>
        </html>`;

        await fs.writeFile(filePath, html, "utf-8");
      })
    );

    // Prune older files to keep only 5
    const files = await fs.readdir(dataDir);
    const htmlFiles = files.filter((f) => f.endsWith(".html"));
    const sorted = htmlFiles.sort((a, b) => {
      const tA = +a.split("-").pop().replace(".html", "");
      const tB = +b.split("-").pop().replace(".html", "");
      return tB - tA;
    });
    await Promise.all(sorted.map((f) => fs.unlink(path.join(dataDir, f))));

    return NextResponse.json(
      { success: true, generated: movies.length },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
};
