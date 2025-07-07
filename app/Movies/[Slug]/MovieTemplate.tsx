"use client";

import { useState } from "react";
import Image from "next/image";
import Script from "next/script";
import styles from "./MoviePage.module.css";

function formatCurrency(amount: number | null | undefined): string {
  if (!amount) return "N/A";
  return `$${amount.toLocaleString()}`;
}

function extractYoutubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|watch\?v=)([\w-]{11})/);
  return match ? match[1] : null;
}

export type Movie = {
  id: string;
  primaryTitle: string;
  originalTitle: string;
  description: string;
  primaryImage?: string | null;
  trailer?: string | null;
  contentRating?: string | null;
  releaseDate?: string | null;
  runtimeMinutes?: number | null;
  averageRating?: number | null;
  numVotes?: number | null;
  metascore?: number | null;
  genres?: string[];
  interests?: string[];
  countriesOfOrigin?: string[];
  spokenLanguages?: string[];
  filmingLocations?: string[];
  productionCompanies?: { name: string }[];
  budget?: number | null;
  grossWorldwide?: number | null;
  directors?: { fullName: string }[];
  writers?: { fullName: string }[];
  cast?: {
    fullName: string;
    primaryImage?: string | null;
    job?: string;
    characters?: string[];
  }[];
};

export default function MovieTemplate({ movie }: { movie: Movie }) {
  const [tab, setTab] = useState<
    "Overview" | "Details" | "Production" | "Cast"
  >("Overview");

  const trailerId = extractYoutubeId(movie.trailer);

  const totalMinutes = movie.runtimeMinutes || 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const runtime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.primaryTitle,
    image: movie.primaryImage || "/default-movie.jpg",
    datePublished: movie.releaseDate,
    director:
      movie.directors?.map((d) => ({ "@type": "Person", name: d.fullName })) ||
      [],
    genre: movie.genres || [],
    aggregateRating:
      movie.numVotes && movie.numVotes > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: movie.averageRating,
            bestRating: 10,
            ratingCount: movie.numVotes,
          }
        : undefined,
  };

  return (
    <>
      <Script
        id="movie-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className={styles.header}>
        <Image
          src={movie.primaryImage || "/default-movie.jpg"}
          alt={movie.primaryTitle}
          fill
          className={styles.headerImage}
          unoptimized
        />
        <div className={styles.headerOverlay} />
        <div className={styles.headerContent}>
          <h1 className={styles.movieTitle}>{movie.primaryTitle}</h1>
          <p className={styles.releaseYear}>{movie.releaseDate?.slice(0, 4)}</p>
          {trailerId && (
            <a
              href={`https://www.youtube.com/watch?v=${trailerId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.trailerButton}
            >
              ▶ Watch Trailer
            </a>
          )}
        </div>
      </header>

      <main className={styles.mainContent}>
        <nav className={styles.tabNav}>
          {(["Overview", "Details", "Production", "Cast"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`${styles.tabButton} ${
                tab === t ? styles.activeTab : ""
              }`}
            >
              {t}
            </button>
          ))}
        </nav>

        <section className={styles.tabContent}>
          {tab === "Overview" && (
            <div>
              <h2 className={styles.sectionTitle}>Storyline</h2>
              <p className={styles.storyline}>{movie.description}</p>
            </div>
          )}

          {tab === "Details" && (
            <ul className={styles.detailsList}>
              <li>
                <strong>Release Date:</strong> {movie.releaseDate || "N/A"}
              </li>
              <li>
                <strong>Duration:</strong> {runtime}
              </li>
              <li>
                <strong>Rating:</strong> {movie.contentRating || "N/A"}
              </li>
              <li>
                <strong>Genres:</strong> {movie.genres?.join(", ") || "N/A"}
              </li>
              <li>
                <strong>Languages:</strong>{" "}
                {movie.spokenLanguages?.join(", ") || "N/A"}
              </li>
              <li>
                <strong>Countries:</strong>{" "}
                {movie.countriesOfOrigin?.join(", ") || "N/A"}
              </li>
              <hr className={styles.divider} />
              <li>
                <strong>Score:</strong>{" "}
                {movie.numVotes && movie.numVotes > 0
                  ? `${
                      movie.averageRating
                    }/10 (${movie.numVotes.toLocaleString()} votes)`
                  : "N/A"}
              </li>
              <li>
                <strong>Metascore:</strong> {movie.metascore || "N/A"}
              </li>
              <hr className={styles.divider} />
              <li>
                <strong>Budget:</strong> {formatCurrency(movie.budget)}
              </li>
              <li>
                <strong>Worldwide Gross:</strong>{" "}
                {formatCurrency(movie.grossWorldwide)}
              </li>
            </ul>
          )}

          {tab === "Production" && (
            <div>
              <h3 className={styles.subSectionTitle}>Directors</h3>
              <p>
                {movie.directors?.map((d) => d.fullName).join(", ") || "N/A"}
              </p>
              <h3 className={styles.subSectionTitle}>Writers</h3>
              <p>{movie.writers?.map((w) => w.fullName).join(", ") || "N/A"}</p>
              <h3 className={styles.subSectionTitle}>Production Companies</h3>
              <p>
                {movie.productionCompanies?.map((pc) => pc.name).join(", ") ||
                  "N/A"}
              </p>
              <h3 className={styles.subSectionTitle}>Filming Locations</h3>
              <p>{movie.filmingLocations?.join(", ") || "N/A"}</p>
            </div>
          )}

          {tab === "Cast" && (
            <div className={styles.castGrid}>
              {movie.cast?.map((actor, idx) => (
                <div key={idx} className={styles.actorCard}>
                  {actor.primaryImage ? (
                    <Image
                      src={actor.primaryImage}
                      alt={actor.fullName}
                      width={96}
                      height={96}
                      className={styles.actorImage}
                    />
                  ) : (
                    <div className={styles.actorImagePlaceholder} />
                  )}
                  <p className={styles.actorName}>{actor.fullName}</p>
                  <p className={styles.characterName}>
                    {actor.characters?.join(", ") || actor.job}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.externalLinks}>
          <h2 className={styles.sectionTitle}>More Info</h2>
          <div className={styles.linksGrid}>
            <a
              href={`https://www.imdb.com/title/${movie.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.linkButton} ${styles.imdb}`}
            >
              IMDb
            </a>
            <a
              href={`https://www.themoviedb.org/search?query=${encodeURIComponent(
                movie.primaryTitle
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.linkButton} ${styles.tmdb}`}
            >
              TMDB
            </a>
            <a
              href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(
                movie.primaryTitle
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.linkButton} ${styles.justwatch}`}
            >
              Where to Watch
            </a>
            <a
              href={`https://www.rottentomatoes.com/search?search=${encodeURIComponent(
                movie.primaryTitle
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.linkButton} ${styles.rottenTomatoes}`}
            >
              Rotten Tomatoes
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
