import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResultsProps = {
  isSearchFecthing: boolean;
  searchedPosts: Models.Document[];
};

const SearchResults = ({
  isSearchFecthing,
  searchedPosts,
}: SearchResultsProps) => {
  if (isSearchFecthing) return <Loader />;

  if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  }
  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  );
};

export default SearchResults;
