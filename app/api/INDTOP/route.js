import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// --- Configuration ---
// Note: In Next.js, the 'data' directory should be at the root of your project.
const DATA_DIR = path.join(process.cwd(), "data");
const MOVIES_FILE = path.join(DATA_DIR, "INDTOPM.json");
// ADDED: A new file to store the timestamp of the last fetch.
const LAST_FETCH_FILE = path.join(DATA_DIR, "lastINDTOPM-fetch.json");

// --- RapidAPI Settings ---
// These must be set in your .env.local file at the project root.
// Example:
// RAPIDAPI_HOST="imdb236.p.rapidapi.com"
// RAPIDAPI_KEY="your_actual_api_key"
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
// CORRECTED: Updated the API path to a valid endpoint for popular movie charts.
const RAPIDAPI_PATH ="https://imdb236.p.rapidapi.com/api/imdb/india/top-rated-indian-movies";

// --- Helper Functions ---

/**
 * Writes data to a file atomically to prevent data corruption during writes.
 * @param {string} targetPath - The final destination path.
 * @param {any} data - The JSON data to write.
 */
async function writeAtomic(targetPath, data) {
  // Ensure the directory exists before writing.
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  const tmpPath = `${targetPath}.tmp`;
  // Write to a temporary file first.
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), "utf8");
  // Rename the temporary file to the final destination, which is an atomic operation.
  await fs.rename(tmpPath, targetPath);
}

/**
 * Tries to find the main array of items in a generic API response.
 * @param {object} obj - The JSON response object from the API.
 * @returns {Array<any>}
 */
function pickArrayFromResponse(obj) {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  const commonKeys = [
    "items",
    "results",
    "movies",
    "data",
    "list",
    "resultsList",
  ];
  for (const key of commonKeys) {
    if (Array.isArray(obj[key])) return obj[key];
  }
  // Fallback: find the first value in the object that is an array.
  for (const val of Object.values(obj)) {
    if (Array.isArray(val)) return val;
  }
  return [];
}

/**
 * Fetches the movie list from the configured RapidAPI endpoint.
 * @returns {Promise<Array<any>>}
 */
async function fetchFromRapidAPI() {
  if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
    throw new Error(
      "RAPIDAPI_KEY and RAPIDAPI_HOST must be set in environment variables"
    );
  }

  const response = await fetch(RAPIDAPI_PATH, {
    method: "GET",
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => "Could not read error response.");
    throw new Error(
      `RapidAPI fetch failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const json = await response.json();
  return pickArrayFromResponse(json);
}

// --- API Handler for GET Requests ---

/**
 * Main GET handler for the Next.js API route.
 * Fetches data from the remote API and saves it to movies.json.
 * Also saves the fetch timestamp to last-fetch.json.
 */
export async function GET() {
  try {
    // 1. Fetch data from the remote API.
    const moviesArray = await fetchFromRapidAPI();
    if (!Array.isArray(moviesArray) || moviesArray.length === 0) {
      throw new Error("RapidAPI returned no movies array or an empty array.");
    }

    // 2. Write the new data to the local movies.json file.
    await writeAtomic(MOVIES_FILE, moviesArray);

    // 3. ADDED: Write the current timestamp to the last-fetch.json file.
    const timestamp = { lastUpdated: new Date().toISOString() };
    await writeAtomic(LAST_FETCH_FILE, timestamp);

    // 4. Return a success response with the fetched data.
    const responsePayload = {
      source: "remote-api",
      message: `Successfully saved ${moviesArray.length} movies to movies.json and updated last-fetch.json.`,
      movies: moviesArray,
    };
    return NextResponse.json(responsePayload);
  } catch (err) {
    // 5. If anything fails, return a 500 error.
    console.error("Failed to generate movie data:", err);
    const errorPayload = {
      error: "Could not generate and store movie data.",
      details: err.message,
    };
    return NextResponse.json(errorPayload, { status: 500 });
  }
}
