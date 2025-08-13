// app/api/updateData/route.js
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const MOVIES_FILE = path.join(DATA_DIR, "Latest.json");
const META_FILE = path.join(DATA_DIR, "LatestUpdated.json");
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    // Check if update happened in the last 24 hours
    if (fs.existsSync(META_FILE)) {
      const meta = JSON.parse(fs.readFileSync(META_FILE, "utf8"));
      const lastUpdated = new Date(meta.lastUpdated).getTime();
      const now = Date.now();

      if (now - lastUpdated < ONE_DAY_MS) {
        return new Response(
          JSON.stringify({
            message: "Data already updated within last 24 hours",
            lastUpdated: meta.lastUpdated,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Calculate 6-month date range
    const today = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(today.getMonth() + 6);

    // Fetch fresh data with date range
    const url = `https://imdb236.p.rapidapi.com/api/imdb/most-popular-movies`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "1a23d5e762mshc6bdd66106811a0p1f4639jsn258336f3b440",
        "x-rapidapi-host": "imdb236.p.rapidapi.com",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const movies = await response.json();
    console.log(`Fetched ${movies.length} movies from API`);

    // Ensure data directory exists
    fs.mkdirSync(DATA_DIR, { recursive: true });

    // Save movies data
    fs.writeFileSync(MOVIES_FILE, JSON.stringify(movies, null, 2), "utf8");

    // Save timestamp
    const timestamp = new Date().toISOString();
    fs.writeFileSync(
      META_FILE,
      JSON.stringify({ lastUpdated: timestamp }, null, 2),
      "utf8"
    );

    return new Response(
      JSON.stringify({
        message: "Movie data updated successfully",
        count: Array.isArray(movies) ? movies.length : 0,
        lastUpdated: timestamp,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching movie data:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update movie data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
