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
  const [selected, setSelected] = useState("Themes");
  const [ratedMap, setRatedMap] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [activeMovie, setActiveMovie] = useState<any | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
  
    try {
      // 1. Fetch from TMDB
      const res = await fetch(
        `${TMDB_SEARCH_URL}?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}`
      );
      const data = await res.json();
      const movies = data.results || [];
      setResults(movies);
  
      // 2. Extract titles
      const titles = movies.map((m: any) => m.title);
  
      // 3. Query your API for rated movies
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
    <div className="w-full max-w-xl min-w-[200px]">
      <div className="relative mt-2" ref={dropdownRef}>
        <div className="absolute top-1 left-1 flex items-center">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="rounded border border-transparent py-1 px-1.5 text-center flex items-center text-sm transition-all text-slate-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4 ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          <div className="h-6 border-l border-slate-200 ml-1" />
          {open && (
            <div className="min-w-[150px] overflow-hidden absolute left-0 w-full mt-10 bg-white border border-slate-200 rounded-md shadow-lg z-10">
              <ul>
                
              </ul>
            </div>
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-28 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm"
          placeholder="Search movies..."
        />

        <button
          onClick={handleSearch}
          className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 text-white text-sm hover:bg-slate-700"
          type="button"
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
                  onClick={() => setActiveMovie(movie)}
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
