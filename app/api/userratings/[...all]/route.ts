// app/api/user-ratings/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/database/db";
import { ratings, movies } from "@/database/schema";
import { eq, and, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { titles } = await req.json();

  if (!Array.isArray(titles) || titles.length === 0) {
    return NextResponse.json([]);
  }

  const results = await db
    .select({ movieTitle: movies.title })
    .from(ratings)
    .innerJoin(movies, eq(ratings.movieId, movies.id))
    .where(
      and(
        eq(ratings.userId, session.user.id),
        inArray(movies.title, titles)
      )
    );

  return NextResponse.json(results);
}
