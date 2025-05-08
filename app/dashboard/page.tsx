import { db } from "@/database/db";
import { ratings, movies } from "@/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  console.log("session is", session);
  if (!session?.user){
    console.log("redirecting to auth sign in");
    redirect("/auth/sign-in?reason=signin");}

  const userRatings = await db
    .select({
      id: ratings.id,
      title: movies.title,
      releaseYear: movies.releaseYear,
      description: movies.description,
      rating: ratings.rating,
      review: ratings.review,
      createdAt: ratings.createdAt,
    })
    .from(ratings)
    .innerJoin(movies, eq(ratings.movieId, movies.id))
    .where(eq(ratings.userId, session.user.id));

  return <DashboardClient ratings={userRatings} />;
}
