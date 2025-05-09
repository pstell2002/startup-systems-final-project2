import SearchBar from "@/components/searchbar";
import { createRating} from "@/actions/ratemovie";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Search() {
  const session = await auth.api.getSession({ headers: await headers() });
    console.log("session is", session);
    if (!session?.user){
      console.log("redirecting to auth sign in");
      redirect("/auth/sign-in?reason=signin")};
      
      return (
        <main className="min-h-screen flex items-center justify-center px-6 bg-white">
          <div className="max-w-2xl w-full text-center space-y-8">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Search for a Movie
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Look up any film and start adding your own ratings and reviews.
            </p>
            <div className="w-full flex justify-center">
              <div className="w-full max-w-xl">
                <SearchBar createRating={createRating} />
              </div>
            </div>
          </div>
        </main>
      );
    
}
