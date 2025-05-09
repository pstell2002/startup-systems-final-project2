import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type RatingModalProps = {
  movie: any;
  onClose: () => void;
  createRating: (formData: FormData) => Promise<any>;
  existingRating?: {
    rating: number;
    review: string;
    ratingId: string;
  };
};

export default function RatingModal({ movie, onClose, createRating, existingRating }: RatingModalProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    if (existingRating?.rating) {
      setSelectedRating(existingRating.rating);
    }
  }, [existingRating]);

  const handleStarClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - left;
    const isHalf = clickX < width / 2;
    const newRating = isHalf ? index + 0.5 : index + 1;
    setSelectedRating(newRating);
  };

  const handleStarHover = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const hoverX = event.clientX - left;
    const isHalf = hoverX < width / 2;
    const rating = isHalf ? index + 0.5 : index + 1;
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Blurred background */}
        <motion.div
          className="absolute inset-0 backdrop-blur-sm bg-black/10"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal content */}
        <motion.div
          className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50 text-black"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>

          <h2 className="text-lg font-semibold mb-4">
            {existingRating ? "Edit Rating" : "Rate"}: {movie.title}
          </h2>

          <form
            action={createRating}
            className="space-y-4"
            onSubmit={() => onClose()}
          >
            <input type="hidden" name="title" value={movie.title} />
            <input type="hidden" name="releaseYear" value={movie.release_year ? movie.release_year.slice(0, 4) : ""} />
            <input type="hidden" name="description" value={movie.overview} />
            <input type="hidden" name="rating" value={selectedRating ?? ""} />
            <input type="hidden" name="id" value={existingRating?.ratingId ?? ""} />
            <input type="hidden" name="thumbnail" value={ movie.poster_path? `https://image.tmdb.org/t/p/w200${movie.poster_path}`: ""}/>

            <div>
              <label className="text-sm block mb-1">Rating (0.5–7):</label>
              <div className="flex gap-2">
                {[...Array(7)].map((_, index) => {
                  const ratingToShow = hoverRating ?? selectedRating ?? 0;
                  const full = index + 1 <= ratingToShow;
                  const half = ratingToShow === index + 0.5;
                  return (
                    <div
                      key={index}
                      className="relative w-8 h-8 cursor-pointer"
                      onClick={(e) => handleStarClick(e, index)}
                      onMouseMove={(e) => handleStarHover(e, index)}
                      onMouseLeave={handleStarLeave}
                    >
                      {/* Empty star */}
                      <span className="absolute left-0 top-0 w-full h-full text-2xl text-gray-300 select-none">
                        ★
                      </span>

                      {/* Filled/half star */}
                      <span
                        className="absolute left-0 top-0 h-full text-2xl text-yellow-400 overflow-hidden select-none transition-all duration-200"
                        style={{
                          width:
                            ratingToShow >= index + 1
                              ? "100%"
                              : ratingToShow === index + 0.5
                              ? "50%"
                              : "0%",
                        }}
                      >
                        ★
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm block mb-1">Review:</label>
              <textarea
                name="review"
                defaultValue={existingRating?.review || ""}
                placeholder="Write a review (optional)..."
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-gray-500 underline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedRating === null}
                className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Submit Rating
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
