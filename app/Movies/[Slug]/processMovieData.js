// lib/processMovieData.js

/**
 * Normalize a raw movie object into the shape your template expects.
 * @param {object} item
 */
export function processMovieData(item) {
  return {
    id: item.id || "N/A",
    primaryTitle: item.primaryTitle || "Untitled",
    originalTitle: item.originalTitle || "Untitled",
    description: item.description || "No description available",
    primaryImage:
      typeof item.primaryImage === "string"
        ? item.primaryImage
        : (item.primaryImage && item.primaryImage.url) || "",
    trailer: (item.trailer && item.trailer.link) || "",
    contentRating: item.contentRating || "N/A",
    releaseDate: item.releaseDate || "N/A",
    runtimeMinutes: Math.floor(Number(item.runtime?.seconds || 0) / 60),
    averageRating: (item.ratings && item.ratings.averageRating) || 0,
    numVotes: (item.ratings && item.ratings.numVotes) || 0,
    metascore: item.metascore || 0,
    genres: item.genres || [],
    interests: item.interests || [],
    countriesOfOrigin: item.countriesOfOrigin || [],
    spokenLanguages: item.spokenLanguages || [],
    filmingLocations: item.filmingLocations || [],
    productionCompanies: item.productionCompanies || [],
    budget: (item.budget && item.budget.amount) || 0,
    grossWorldwide: (item.grossWorldwide && item.grossWorldwide.amount) || 0,
    directors: item.directors || [],
    writers: item.writers || [],
    cast: Array.isArray(item.cast)
      ? item.cast.map((actor) => ({
          fullName: actor.name?.nameText?.text || "Unknown",
          primaryImage: actor.primaryImage?.url || null,
          job: (actor.attributes && actor.attributes[0]) || "Actor",
          characters: Array.isArray(actor.characters) ? actor.characters : [],
        }))
      : [],
  };
}
