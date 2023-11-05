import {
  useDeleteSavePost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useState, useEffect } from "react";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavedPost } = useDeleteSavePost();

  const { data: currentUser } = useGetCurrentUser();

  const handleLikePost = (e: React.MouseEvent) => {
    // mencegah event bubling
    e.stopPropagation();

    let newLikes = [...likes];

    // mengecek apakah user sudah like atau belum
    const hasLiked = newLikes.includes(userId);

    if (hasLiked) {
      // jika user sudah like, maka di unlike
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      // jika tidak like, maka like user di tambahkan
      newLikes.push(userId);
    }
    likePost({ postId: post.$id, likesArray: newLikes });
    setLikes(newLikes);
  };

  const handleSavePost = (e: React.MouseEvent) => {
    // mencegah event bubling
    e.stopPropagation();

    const savedPostRecord = currentUser?.save.find(
      (record: Models.Document) => record.$id === post.$id
    );

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      savePost({ postId: post.$id, userId });
      setIsSaved(true);
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleLikePost}
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="like"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleSavePost}
        />
      </div>
    </div>
  );
};

export default PostStats;
