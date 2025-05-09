"use client";

import { useEffect, useRef, useState } from "react";
import RatingModal from "./RatingModal"; // ✅ adjust path as needed

const TMDB_API_KEY = "d79f6711e3e6cc755748098dd4e4e007";
const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie";


export default function SearchBar({
  createRating,
}: {
  createRating: (formData: FormData) => Promise<any>;
}) {
  const [ratedMap, setRatedMap] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [activeMovie, setActiveMovie] = useState<any | null>(null);


  const handleSearch = async () => {
    if (!query.trim()) return;
  
    try {
      const res = await fetch(
        `${TMDB_SEARCH_URL}?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}`
      );
      const data = await res.json();
      const movies = data.results || [];
      setResults(movies);
  
      const titles = movies.map((m: any) => m.title);
      const ratingRes = await fetch("/api/user-ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titles }),
      });
  
      if (ratingRes.ok) {
        const rated = await ratingRes.json(); // [{ movieTitle: "Inception" }]
        const map = Object.fromEntries(rated.map((r: any) => [r.movieTitle, true]));
        setRatedMap(map);
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="w-full max-w-xl min-w-[200px] mt-2">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="w-full bg-white text-sm text-slate-700 placeholder:text-slate-400 border border-slate-200 rounded-md px-4 py-2 pr-24 focus:outline-none focus:border-slate-400 shadow-sm"
        />
        <button
          onClick={handleSearch}
          type="button"
          className="absolute top-1 right-1 px-3 py-1.5 bg-slate-800 text-white text-sm rounded hover:bg-slate-700"
        >
          Search
        </button>
      </div>

      {results.length > 0 && (
        <ul className="mt-4 text-sm text-slate-700 space-y-6">
          {results.map((movie) => (
            <li key={movie.id} className="border-b pb-4 flex gap-4">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : "https://via.placeholder.com/200x300?text=No+Image"
                }
                alt={movie.title}
                className="w-24 h-auto rounded shadow-sm"
              />
              <div className="flex-1">
                <a
                  href={`/movies/${encodeURIComponent(movie.title)}`}
                  className="text-blue-700 hover:underline font-semibold"
                >
                  {movie.title}
                </a>{" "}
                ({movie.release_date?.slice(0, 4)})
                <p className="text-xs text-slate-500 mt-1">{movie.overview}</p>
                <button
                  onClick={() =>
                    setActiveMovie({
                      ...movie,
                      release_year: movie.release_date?.slice(0, 4),
                      thumbnail: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                        : "",
                    })
                  }
                  className="mt-2 inline-block bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                >
                  {ratedMap[movie.title] ? "Re-rate" : "Rate"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {activeMovie && (
        <RatingModal
          movie={activeMovie}
          onClose={() => setActiveMovie(null)}
          createRating={createRating}
        />
      )}
    </div>
  );
}
