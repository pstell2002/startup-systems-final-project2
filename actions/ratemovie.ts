'use server';

import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { db } from "@/database/db";
import { ratings, movies } from "@/database/schema";

type ActionResponse = { error: string } | { success: true };

export async function createRating(formData: FormData): Promise<ActionResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const id = formData.get("id")?.toString().trim(); // 🆕 from RatingModal
  const title = formData.get("title")?.toString().trim();
  const releaseYear = parseInt(formData.get("releaseYear")?.toString() || "", 10);
  const description = formData.get("description")?.toString().trim();
  const ratingValue = parseFloat(formData.get("rating")?.toString() || "");
  const review = formData.get("review")?.toString().trim();

  if (!title || isNaN(ratingValue)) {
    return { error: "Missing movie title or rating" };
  }

  // Find or create movie
  let [movie] = await db
    .select()
    .from(movies)
    .where(eq(movies.title, title))
    .limit(1);

  if (!movie) {
    [movie] = await db
      .insert(movies)
      .values({
        title,
        releaseYear: isNaN(releaseYear) ? undefined : releaseYear,
        description: description || null,
      })
      .returning();
  }

  if (!movie) {
    return { error: "Could not find or create movie" };
  }

  if (id) {
    // 📝 Direct update using known rating ID
    await db
      .update(ratings)
      .set({
        rating: ratingValue,
        review: review || null,
      })
      .where(
        and(
          eq(ratings.id, id),
          eq(ratings.userId, session.user.id)
        )
      );
  } else {
    // 🔍 Check if rating already exists for this user/movie combo
    const [existingRating] = await db
      .select()
      .from(ratings)
      .where(
        and(
          eq(ratings.userId, session.user.id),
          eq(ratings.movieId, movie.id)
        )
      );

    if (existingRating) {
      await db
        .update(ratings)
        .set({
          rating: ratingValue,
          review: review || null,
        })
        .where(eq(ratings.id, existingRating.id));
    } else {
      // ➕ Create new rating
      await db.insert(ratings).values({
        userId: session.user.id,
        movieId: movie.id,
        rating: ratingValue,
        review: review || null,
      });
    }
  }
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteRating(formData: FormData): Promise<ActionResponse> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const ratingId = formData.get("id")?.toString();
  if (!ratingId) {
    return { error: "Missing rating ID" };
  }

  const deleted = await db
    .delete(ratings)
    .where(
      and(
        eq(ratings.id, ratingId),
        eq(ratings.userId, session.user.id)
      )
    );

  revalidatePath("/dashboard");

  return { success: true };
}



