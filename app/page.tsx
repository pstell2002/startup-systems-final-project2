import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Welcome to <span className="text-blue-600">CineRate 🎬, by Stella Park</span>
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Discover movies, leave your ratings, and read your reviews—all in one place.
          Your personalized movie log powered by the TMDB API.
        </p>
        <div>
          <Link href="/dashboard">
            <Button className="text-lg px-6 py-3 rounded-2xl shadow-md">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}