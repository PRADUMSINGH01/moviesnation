/**
 * @typedef {Object} Movie
 * @property {string} id
 * @property {string} primaryTitle
 * @property {string} originalTitle
 * @property {string} description
 * @property {string|{url:string}} primaryImage
 * @property {string|null} [trailer]
 * @property {string|null} [contentRating]
 * @property {string|null} [releaseDate]
 * @property {number|null} [runtimeMinutes]
 * @property {number|null} [averageRating]
 * @property {number|null} [numVotes]
 * @property {number|null} [metascore]
 * @property {string[]} [genres]
 * @property {string[]} [interests]
 * @property {string[]} [countriesOfOrigin]
 * @property {string[]} [spokenLanguages]
 * @property {string[]} [filmingLocations]
 * @property {{name:string}[]} [productionCompanies]
 * @property {number|null} [budget]
 * @property {number|null} [grossWorldwide]
 * @property {{fullName:string}[]} [directors]
 * @property {{fullName:string}[]} [writers]
 * @property {{fullName:string, primaryImage?:string|null, job?:string, characters?:string[]}[]} [cast]
 */

/**
 * Normalize a raw API item into a full Movie object.
 * @param {Object} item
 * @returns {Movie}
 */
function processMovieData(item) {
  // normalize primaryImage into either a string or an object with url
  let primaryImage = "";
  if (typeof item.primaryImage === "string") {
    primaryImage = item.primaryImage;
  } else if (
    item.primaryImage &&
    typeof item.primaryImage === "object" &&
    typeof item.primaryImage.url === "string"
  ) {
    primaryImage = { url: item.primaryImage.url };
  }

  return {
    id: String(item.id ?? ""),
    primaryTitle: item.primaryTitle ?? "",
    originalTitle: item.originalTitle ?? "",
    description: item.description ?? "",
    primaryImage,
    // trailer might come as { link: "..." } or a raw string
    trailer:
      typeof item.trailer === "string"
        ? item.trailer
        : item.trailer && typeof item.trailer.link === "string"
        ? item.trailer.link
        : null,
    contentRating: item.contentRating ?? null,
    releaseDate: item.releaseDate ?? null,
    runtimeMinutes:
      typeof item.runtimeMinutes === "number" ? item.runtimeMinutes : null,
    averageRating:
      typeof item.averageRating === "number" ? item.averageRating : null,
    numVotes: typeof item.numVotes === "number" ? item.numVotes : null,
    metascore: typeof item.metascore === "number" ? item.metascore : null,
    genres: Array.isArray(item.genres) ? item.genres : [],
    interests: Array.isArray(item.interests) ? item.interests : [],
    countriesOfOrigin: Array.isArray(item.countriesOfOrigin)
      ? item.countriesOfOrigin
      : [],
    spokenLanguages: Array.isArray(item.spokenLanguages)
      ? item.spokenLanguages
      : [],
    filmingLocations: Array.isArray(item.filmingLocations)
      ? item.filmingLocations
      : [],
    productionCompanies: Array.isArray(item.productionCompanies)
      ? item.productionCompanies.map((c) => ({ name: c.name ?? "" }))
      : [],
    budget: typeof item.budget === "number" ? item.budget : null,
    grossWorldwide:
      typeof item.grossWorldwide === "number" ? item.grossWorldwide : null,
    directors: Array.isArray(item.directors)
      ? item.directors.map((d) => ({ fullName: d.fullName ?? "" }))
      : [],
    writers: Array.isArray(item.writers)
      ? item.writers.map((w) => ({ fullName: w.fullName ?? "" }))
      : [],
    cast: Array.isArray(item.cast)
      ? item.cast.map((m) => ({
          fullName: m.fullName ?? "",
          primaryImage:
            typeof m.primaryImage === "string"
              ? m.primaryImage
              : m.primaryImage && m.primaryImage.url
              ? m.primaryImage.url
              : null,
          job: m.job ?? null,
          characters: Array.isArray(m.characters) ? m.characters : [],
        }))
      : [],
  };
}

// Fetch the most popular movies from the RapidAPI IMDb endpoint
export async function getLatestMovies() {
  const url = "https://imdb236.p.rapidapi.com/api/imdb/most-popular-movies";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "1a23d5e762mshc6bdd66106811a0p1f4639jsn258336f3b440",
      "x-rapidapi-host": "imdb236.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`IMDb API returned ${response.status}`);
    }

    const result = await response.json();
    // result might be an array or an object with a `results` array
    const rawMovies = Array.isArray(result)
      ? result
      : Array.isArray(result.results)
      ? result.results
      : [];

    return rawMovies.map(processMovieData);
  } catch (err) {
    console.error("Failed to fetch latest movies:", err);
    return [];
  }
}
