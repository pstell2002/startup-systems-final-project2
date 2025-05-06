"use client";

import { useEffect, useRef, useState } from "react";

const TMDB_API_KEY = "d79f6711e3e6cc755748098dd4e4e007";
const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie";

export default function SearchBar({
  createRating,
  deleteRating,
}: {
  createRating: (formData: FormData) => Promise<any>;
  deleteRating: (formData: FormData) => Promise<void>;
}) {
  const [selected, setSelected] = useState("Themes");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [ratingInputs, setRatingInputs] = useState<{ [id: number]: string }>({});
  const [reviewInputs, setReviewInputs] = useState<{ [id: number]: string }>({});

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
      const res = await fetch(
        `${TMDB_SEARCH_URL}?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}`
      );
      const data = await res.json();
      setResults(data.results || []);
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
            <span className="text-ellipsis overflow-hidden">{selected}</span>
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
                {["Themes", "Plugins", "Snippets"].map((item) => (
                  <li
                    key={item}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer"
                    onClick={() => {
                      setSelected(item);
                      setOpen(false);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          placeholder="Search movies..."
        />

        <button
          onClick={handleSearch}
          className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 mr-1.5"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
          Search
        </button>
      </div>

      {/* Display results */}
      {results.length > 0 && (
        <ul className="mt-4 text-sm text-slate-700 space-y-6">
          {results.map((movie) => (
            <li key={movie.id} className="border-b pb-4">
              <strong>{movie.title}</strong> ({movie.release_date?.slice(0, 4)})
              <p className="text-xs text-slate-500 mb-2">{movie.overview}</p>

              <form action={createRating} className="space-y-2">
                <input type="hidden" name="title" value={movie.title} />
                <input
                  type="hidden"
                  name="releaseYear"
                  value={movie.release_date?.slice(0, 4)}
                />
                <input type="hidden" name="description" value={movie.overview} />

                <div className="flex gap-2 items-center">
                  <label className="text-sm">Rating (0–5):</label>
                  <input
                    type="number"
                    name="rating"
                    step="0.5"
                    min="0"
                    max="5"
                    value={ratingInputs[movie.id] || ""}
                    onChange={(e) =>
                      setRatingInputs((prev) => ({
                        ...prev,
                        [movie.id]: e.target.value,
                      }))
                    }
                    className="w-16 border rounded px-1 py-0.5 text-sm"
                    required
                  />
                </div>

                <textarea
                  name="review"
                  placeholder="Write a review (optional)..."
                  value={reviewInputs[movie.id] || ""}
                  onChange={(e) =>
                    setReviewInputs((prev) => ({
                      ...prev,
                      [movie.id]: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                />

                <button
                  type="submit"
                  className="mt-1 bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                >
                  Submit Rating
                </button>
              </form>

              {/* You would ideally show this only if the rating exists */}
              <form action={deleteRating} className="mt-1">
                <input type="hidden" name="id" value={movie.id} />
                <button
                  type="submit"
                  className="text-red-600 text-xs underline hover:text-red-800"
                >
                  Delete Rating
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
