"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RatingModal from "@/components/RatingModal";
import { createRating, deleteRating } from "@/actions/ratemovie";

export default function DashboardClient({ ratings }: { ratings: any[] }) {
  const [ratingsList, setRatingsList] = useState(ratings);
  const [activeRating, setActiveRating] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Rated Movies</h1>

      {ratingsList.length === 0 ? (
        <p className="text-gray-600">You haven’t rated any movies yet.</p>
      ) : (
        <ul className="space-y-6">
          <AnimatePresence>
            {ratingsList.map((entry) => (
              <motion.li
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, margin: 0, padding: 0 }}
                transition={{ duration: 0.25 }}
                className="border-b pb-4"
              >
              <div className="flex gap-4">
               {entry.thumbnail ? (
                <img
                  src={entry.thumbnail}
                  alt={`${entry.title} poster`}
                  className="w-[100px] h-[150px] rounded shadow-sm object-contain"
                />) : (
                <div className="w-[100px] h-[150px] bg-gray-300 rounded flex items-center justify-center text-gray-500 text-xs">
                </div>)}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{entry.title}</h2>
                  <p className="text-sm text-gray-500 mb-1">
                    {entry.releaseYear || "Unknown Year"}
                  </p>
                  <p className="text-gray-700 mb-2">{entry.description}</p>
                  <p className="text-yellow-600 font-medium">★ {entry.rating} / 7</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Rated on {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                  {entry.review && (
                    <p className="text-sm text-gray-800 mt-2 italic">“{entry.review}”</p>
                  )}

                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => setActiveRating(entry)}
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                  >
                    Edit
                  </button>

                  {confirmDeleteId === entry.id ? (
                    <form
                      action={async (formData) => {
                        startTransition(async () => {
                          await deleteRating(formData);
                          setRatingsList((prev) => prev.filter((r) => r.id !== entry.id));
                          setConfirmDeleteId(null);
                        });
                      }}
                    >
                      <input type="hidden" name="id" value={entry.id} />
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="submit"
                          className="text-sm text-red-600 underline hover:text-red-800"
                        >
                          Confirm Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-sm text-gray-500 underline"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(entry.id)}
                      className="text-sm text-red-600 underline hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {activeRating && (
        <RatingModal
          movie={{
            title: activeRating.title,
            release_date: activeRating.releaseYear,
            overview: activeRating.description,
            poster_path: activeRating.thumbnail || null,
          }}
          existingRating={{
            rating: activeRating.rating,
            review: activeRating.review,
            ratingId: activeRating.id,
          }}
          createRating={createRating}
          onClose={() => setActiveRating(null)}
        />
      )}
    </div>
  );
}
