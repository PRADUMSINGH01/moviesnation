import React from "react";

const Brick = () => (
  <div dangerouslySetInnerHTML={{ __html: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Brick - Movieflix</title>
    <meta name="description" content="A couple whose apartment building is suddenly surrounded by a mysterious brick wall must work with their neighbors to find a way out." />
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #0d1117;
        color: #e6edf3;
        padding: 2rem;
        max-width: 800px;
        margin: auto;
      }
      img {
        width: 100%;
        border-radius: 8px;
        margin-bottom: 1rem;
      }
      .meta {
        font-size: 0.9rem;
        color: #8b949e;
        margin-bottom: 1rem;
      }
      h1 {
        color: #58a6ff;
      }
      .description {
        margin: 1.5rem 0;
      }
      .download-section {
        margin-top: 2rem;
        padding: 1rem;
        background: #161b22;
        border-radius: 8px;
      }
      .server {
        margin: 1rem 0;
        padding: 1rem;
        background: #21262d;
        border-radius: 6px;
      }
      .server a {
        display: inline-block;
        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        background: #238636;
        color: white;
        text-decoration: none;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <h1>Brick</h1>
    <img src="https://m.media-amazon.com/images/M/MV5BMGRjZTI5NmEtNWQzNi00ZDUxLWFmZmQtOGFiZmNkZGY1MDc5XkEyXkFqcGc@.jpg" alt="Brick" />
    <div class="meta">
      <p><strong>Genres:</strong> Drama, Mystery, Sci-Fi</p>
      <p><strong>Rating:</strong> N/A</p>
      <p><strong>Release Date:</strong> 2025-07-10</p>
      <p><strong>Runtime:</strong> Unknown</p>
      <p><strong>Content Rating:</strong> NR</p>
    </div>
    <div class="description">
      <p>A couple whose apartment building is suddenly surrounded by a mysterious brick wall must work with their neighbors to find a way out.</p>
    </div>

    <div class="download-section">
      <h2>Download Servers</h2>
      <div class="server">
        <h3>Server 1 - Cloud Drive</h3>
        <p>Resolution: 1080p | Size: 2GB</p>
        <a href="#">Download</a>
      </div>
      <div class="server">
        <h3>Server 2 - Fast Mirror</h3>
        <p>Resolution: 720p | Size: 1.2GB</p>
        <a href="#">Download</a>
      </div>
      <div class="server">
        <h3>Server 3 - Mobile</h3>
        <p>Resolution: 480p | Size: 700MB</p>
        <a href="#">Download</a>
      </div>
    </div>
  </body>
  </html>` }} />
);

export default Brick;
