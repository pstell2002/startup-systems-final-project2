import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to CineRate 🎬</h1>
        <p className="text-gray-600 text-lg">
          Discover movies, leave your ratings, and read your reviews all in one place.
          Your personalized movie log powered by the TMDB API.
        </p>
      </div>
    </main>
  );
}
