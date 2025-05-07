import SearchBar from "@/components/searchbar";
import { createRating} from "@/actions/ratemovie";

export default function Search() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <SearchBar createRating={createRating} />
    </div>
  );
}
