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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Movie</h1>
      <SearchBar createRating={createRating} />
    </div>
  );
}
