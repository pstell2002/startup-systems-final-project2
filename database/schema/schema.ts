import { pgTable, text, integer, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { users } from "./auth";

// Tables

export const movies = pgTable("movies", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  releaseYear: integer("release_year"),
  thumbnail: text("thumbnail"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const genres = pgTable("genres", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export const movieGenres = pgTable("movie_genres", {
  movieId: uuid("movie_id").notNull().references(() => movies.id, { onDelete: "cascade" }),
  genreId: uuid("genre_id").notNull().references(() => genres.id, { onDelete: "cascade" }),
});

export const ratings = pgTable("ratings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  movieId: uuid("movie_id").notNull().references(() => movies.id, { onDelete: "cascade" }),
  rating: real("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations

export const moviesRelations = relations(movies, ({ many }) => ({
  ratings: many(ratings),
  movieGenres: many(movieGenres),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  movieGenres: many(movieGenres),
}));

export const movieGenresRelations = relations(movieGenres, ({ one }) => ({
  movie: one(movies, {
    fields: [movieGenres.movieId],
    references: [movies.id],
  }),
  genre: one(genres, {
    fields: [movieGenres.genreId],
    references: [genres.id],
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  user: one(users, {
    fields: [ratings.userId],
    references: [users.id],
  }),
  movie: one(movies, {
    fields: [ratings.movieId],
    references: [movies.id],
  }),
}));

// Zod schemas

export const insertMovieSchema = createInsertSchema(movies, {
  title: (schema) => schema.nonempty("Title is required"),
  thumbnail: (schema) => schema.url("Must be a valid URL").optional(),
});
export type NewMovie = z.infer<typeof insertMovieSchema>;

export const selectMovieSchema = createSelectSchema(movies);
export type Movie = z.infer<typeof selectMovieSchema>;

export const insertGenreSchema = createInsertSchema(genres, {
  name: (schema) => schema.nonempty("Genre name is required"),
});
export type NewGenre = z.infer<typeof insertGenreSchema>;

export const selectGenreSchema = createSelectSchema(genres);
export type Genre = z.infer<typeof selectGenreSchema>;

export const insertRatingSchema = createInsertSchema(ratings);
export type NewRating = z.infer<typeof insertRatingSchema>;

export const selectRatingSchema = createSelectSchema(ratings);
export type Rating = z.infer<typeof selectRatingSchema>;

export const paramsIDSchema = z.object({
  id: z.string().uuid(),
});

// Export all models

export default {
  movies,
  genres,
  movieGenres,
  ratings,
};
