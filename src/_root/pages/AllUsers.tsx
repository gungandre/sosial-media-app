import { useToast } from "@/components/ui/use-toast";
import { Loader, UserCard } from "@/components/shared";
import { useGetUsersInfinite } from "@/lib/react-query/queriesAndMutations";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Models } from "appwrite";

const AllUsers = () => {
  const { toast } = useToast();
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  const {
    data: creators,
    fetchNextPage,
    hasNextPage,
    isError: isErrorCreators,
    isLoading: isFetchingUser,
  } = useGetUsersInfinite();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });

    return;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isFetchingUser ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.pages?.map((page: Models.Document) => {
              return page?.documents?.map(
                (creator: Models.Document, index: number) => (
                  <li key={index} className="flex-1 min-w-[200px] w-full  ">
                    <UserCard user={creator} />
                  </li>
                )
              );
            })}
          </ul>
        )}
        {hasNextPage && (
          <div ref={ref} className="mt-10 flex justify-center  w-full">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
