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
      thumbnail: movies.thumbnail,
      description: movies.description,
      rating: ratings.rating,
      review: ratings.review,
      createdAt: ratings.createdAt,
    })
    .from(ratings)
    .innerJoin(movies, eq(ratings.movieId, movies.id))
    .where(eq(ratings.userId, session.user.id));

    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-white">
        <div className="max-w-4xl w-full text-center space-y-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Your Dashboard
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            View and manage your rated movies. Update your reviews anytime.
          </p>
          <div className="mt-6">
            <DashboardClient ratings={userRatings} />
          </div>
        </div>
      </main>
    );
}
