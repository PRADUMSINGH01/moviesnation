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

    const now = Date.now();
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
  <title>${title} | Movie Details</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --primary: #2a2a72;
      --primary-light: #3a3a8a;
      --secondary: #ff6b6b;
      --accent: #4ecdc4;
      --dark: #1a1a2e;
      --light: #f8f9fa;
      --gray: #6c757d;
      --card-bg: #ffffff;
      --shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
      --transition: all 0.3s ease;
    }

    body {
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e7f1 100%);
      color: #333;
      font-family: 'Open Sans', sans-serif;
      line-height: 1.6;
      padding: 2rem;
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .movie-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    @media (min-width: 992px) {
      .movie-container {
        flex-direction: row;
      }
    }

    .poster-section {
      flex: 0 0 100%;
      position: relative;
    }

    @media (min-width: 992px) {
      .poster-section {
        flex: 0 0 35%;
      }
    }

    .poster {
      width: 100%;
      border-radius: 16px;
      box-shadow: var(--shadow);
      transition: var(--transition);
    }

    .rating-badge {
      position: absolute;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, var(--secondary), #ff8e8e);
      color: white;
      font-weight: bold;
      padding: 0.6rem 1.2rem;
      border-radius: 50px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 8px 15px rgba(255, 107, 107, 0.3);
      font-size: 1.1rem;
      z-index: 10;
    }

    .details-section {
      flex: 1;
      background: var(--card-bg);
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: var(--shadow);
      position: relative;
      overflow: hidden;
    }

    .details-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 5px;
      height: 100%;
      background: linear-gradient(to bottom, var(--accent), var(--primary-light));
    }

    .movie-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 2.8rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--primary);
      line-height: 1.2;
    }

    .meta-info {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--gray);
      font-size: 0.95rem;
    }

    .meta-item i {
      color: var(--accent);
    }

    .description {
      margin-bottom: 1.8rem;
      color: var(--dark);
      font-size: 1.05rem;
      line-height: 1.8;
    }

    .section-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.4rem;
      font-weight: 600;
      color: var(--primary-light);
      margin: 2rem 0 1.2rem;
      padding-bottom: 0.7rem;
      border-bottom: 2px solid rgba(42, 42, 114, 0.1);
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }

    .section-title i {
      color: var(--secondary);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
      margin: 1.2rem 0;
    }

    .tag {
      background: rgba(78, 205, 196, 0.15);
      color: var(--primary);
      padding: 0.6rem 1.4rem;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: var(--transition);
    }

    .tag:hover {
      background: var(--accent);
      color: white;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.8rem;
      margin: 1.8rem 0;
    }

    .info-card {
      background: rgba(245, 247, 250, 0.6);
      border-radius: 12px;
      padding: 1.5rem;
      transition: var(--transition);
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .info-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      background: white;
    }

    .info-card h3 {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.1rem;
      color: var(--primary);
      margin-bottom: 0.8rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .info-card h3 i {
      color: var(--secondary);
    }

    .info-card ul {
      list-style: none;
      padding-left: 0;
    }

    .info-card li {
      padding: 0.5rem 0;
      border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .info-card li:last-child {
      border-bottom: none;
    }

    .info-card li i {
      color: var(--accent);
      font-size: 0.9rem;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin: 1.8rem 0;
    }

    .stat-card {
      background: linear-gradient(135deg, var(--primary-light), var(--primary));
      color: white;
      border-radius: 12px;
      padding: 1.8rem 1.5rem;
      text-align: center;
      transition: var(--transition);
      box-shadow: 0 10px 20px rgba(42, 42, 114, 0.2);
    }

    .stat-card:hover {
      transform: translateY(-7px);
      box-shadow: 0 15px 30px rgba(42, 42, 114, 0.3);
    }

    .stat-card i {
      font-size: 2.2rem;
      margin-bottom: 1rem;
      color: rgba(255, 255, 255, 0.9);
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0.5rem 0;
      font-family: 'Montserrat', sans-serif;
    }

    .stat-label {
      font-size: 0.95rem;
      opacity: 0.9;
    }

    .trailer-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      background: linear-gradient(135deg, var(--secondary), #ff5252);
      color: white;
      padding: 1rem 2.2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      transition: var(--transition);
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      margin-top: 1rem;
      box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
    }

    .trailer-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 25px rgba(255, 107, 107, 0.4);
    }

    .footer {
      text-align: center;
      padding: 2rem;
      color: var(--gray);
      font-size: 0.95rem;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      margin-top: 2rem;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    .rating-badge {
      animation: pulse 2s infinite;
    }

    @media (max-width: 768px) {
      body {
        padding: 1.5rem;
      }
      
      .movie-title {
        font-size: 2.2rem;
      }
      
      .details-section {
        padding: 1.8rem;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="movie-container">
      <div class="poster-section">
        ${
          m.primaryImage
            ? `<img src="${m.primaryImage}" alt="${title} Poster" class="poster">`
            : `<div style="background: #e2e8f0; height: 500px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--gray);">No Image Available</div>`
        }
        ${
          m.ratings?.averageRating
            ? `<div class="rating-badge">
                <i class="fas fa-star"></i>
                <span>${m.ratings.averageRating}/10</span>
              </div>`
            : ""
        }
      </div>
      
      <div class="details-section">
        <h1 class="movie-title">${title}</h1>
        
        <div class="meta-info">
          ${m.releaseDate ? `
          <div class="meta-item">
            <i class="fas fa-calendar-alt"></i>
            <span>Release: ${new Date(m.releaseDate).toLocaleDateString()}</span>
          </div>` : ""}
          
          ${m.runtime?.seconds ? `
          <div class="meta-item">
            <i class="fas fa-clock"></i>
            <span>${Math.floor(m.runtime.seconds / 60)} min</span>
          </div>` : ""}
          
          ${m.contentRating ? `
          <div class="meta-item">
            <i class="fas fa-ticket-alt"></i>
            <span>${m.contentRating}</span>
          </div>` : ""}
          
          ${m.spokenLanguages?.length ? `
          <div class="meta-item">
            <i class="fas fa-globe"></i>
            <span>${m.spokenLanguages[0]}</span>
          </div>` : ""}
        </div>
        
        ${m.description ? `
        <p class="description">
          ${m.description}
        </p>` : ""}
        
        ${m.genres?.length ? `
        <div class="section-title">
          <i class="fas fa-tags"></i>
          <h2>Genres</h2>
        </div>
        <div class="tags">
          ${m.genres.map(g => `<span class="tag">${g}</span>`).join("")}
        </div>` : ""}
        
        <div class="section-title">
          <i class="fas fa-users"></i>
          <h2>Cast & Crew</h2>
        </div>
        <div class="info-grid">
          ${m.directors?.length ? `
          <div class="info-card">
            <h3><i class="fas fa-video"></i> Directors</h3>
            <ul>
              ${m.directors.slice(0, 3).map(d => `
                <li><i class="fas fa-user"></i> ${d.fullName}</li>
              `).join("")}
            </ul>
          </div>` : ""}
          
          ${m.writers?.length ? `
          <div class="info-card">
            <h3><i class="fas fa-pen"></i> Writers</h3>
            <ul>
              ${m.writers.slice(0, 3).map(w => `
                <li><i class="fas fa-user"></i> ${w.fullName}</li>
              `).join("")}
            </ul>
          </div>` : ""}
          
          ${m.cast?.length ? `
          <div class="info-card">
            <h3><i class="fas fa-star"></i> Main Cast</h3>
            <ul>
              ${m.cast.slice(0, 5).map(c => `
                <li><i class="fas fa-user"></i> ${c.fullName}</li>
              `).join("")}
            </ul>
          </div>` : ""}
        </div>
        
        ${(m.budget?.amount || m.grossWorldwide?.amount) ? `
        <div class="section-title">
          <i class="fas fa-chart-line"></i>
          <h2>Financials</h2>
        </div>
        <div class="stats">
          ${m.budget?.amount ? `
          <div class="stat-card">
            <i class="fas fa-money-bill-wave"></i>
            <div class="stat-value">$${(m.budget.amount / 1000000).toFixed(1)}M</div>
            <div class="stat-label">Production Budget</div>
          </div>` : ""}
          
          ${m.grossWorldwide?.amount ? `
          <div class="stat-card">
            <i class="fas fa-globe-americas"></i>
            <div class="stat-value">$${(m.grossWorldwide.amount / 1000000).toFixed(1)}M</div>
            <div class="stat-label">Worldwide Gross</div>
          </div>` : ""}
        </div>` : ""}
        
        <div class="section-title">
          <i class="fas fa-info-circle"></i>
          <h2>Additional Information</h2>
        </div>
        <div class="info-grid">
          ${m.productionCompanies?.length ? `
          <div class="info-card">
            <h3><i class="fas fa-building"></i> Production</h3>
            <ul>
              ${m.productionCompanies.slice(0, 3).map(c => `
                <li><i class="fas fa-chevron-right"></i> ${c.name}</li>
              `).join("")}
            </ul>
          </div>` : ""}
          
          ${m.filmingLocations?.length ? `
          <div class="info-card">
            <h3><i class="fas fa-map-marker-alt"></i> Locations</h3>
            <ul>
              ${m.filmingLocations.slice(0, 3).map(l => `
                <li><i class="fas fa-chevron-right"></i> ${l}</li>
              `).join("")}
            </ul>
          </div>` : ""}
          
          ${m.countriesOfOrigin?.length ? `
          <div class="info-card">
            <h3><i class="fas fa-flag"></i> Countries</h3>
            <ul>
              ${m.countriesOfOrigin.slice(0, 3).map(c => `
                <li><i class="fas fa-chevron-right"></i> ${c}</li>
              `).join("")}
            </ul>
          </div>` : ""}
        </div>
        
        ${m.trailer?.link ? `
        <a href="${m.trailer.link}" class="trailer-btn" target="_blank">
          <i class="fas fa-play-circle"></i>
          Watch Official Trailer
        </a>` : ""}
      </div>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const cards = document.querySelectorAll('.info-card, .stat-card');
      
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          card.style.transition = "all 0.5s ease";
          
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 300);
        }, 150 * index);
      });
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
    const excess = sorted.slice(5);
    await Promise.all(excess.map((f) => fs.unlink(path.join(dataDir, f))));

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