import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  createPost,
  createUserAccount,
  deletePost,
  deleteSavedPost,
  getCurrentUser,
  getInfinitePosts,
  getPostById,
  getRecentPosts,
  getUserById,
  getUserPosts,
  getUsers,
  getUsersInfinite,
  likePost,
  savePost,
  searchPosts,
  signInAccount,
  signOutAccount,
  updatePost,
  updateUser,
} from "../appwrite/api";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { QUERY_KEYS } from "./queryKeys";

// useMutation dugunakan untuk interaksi data dengan api
export const useCreateUserAccountMutation = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useCreatePost = () => {
  // useQueryClient digunakan untuk manajemen manajemen query, cache, dan operasi terkait data dari api
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      // fungsi method invalidateQueries ini untuk agar web kita selalu menampilkan data paling terbaru dari api, contoh saat kita menambahan data ke api, pasti data terbaru tersebut tidak langsung di perbaharui di sis front end keciali web di refresh atau mungkin menggunakan useEffect
      // inilah fungsinya invalidateQueries agar data bisa langsung diperbaharui
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

// export const useGetPosts = () => {
//   return useInfiniteQuery({
//     queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
//     queryFn: getInfinitePosts as any[],
//     getNextPageParam: (lastPage: any) => {
//       // If there's no data, there are no more pages.
//       if (lastPage && lastPage.documents.length === 0) {
//         console.log("tidak ada data", lastPage);
//         return null;
//       }

//       // Use the $id of the last document as the cursor.
//       // jadi konsepnya ketika fetchNextPage() dipanggil, maka akan mengambil data $id array terakhir, lalu mengirimkannya ke function getInfinitePosts, di function getInfinitePosts menerima parameter pageParam
//       // variable lastId di bawah contoh pengambilan datanya
//       const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
//       return lastId;
//     },
//   });
// };

export const useGetRecentPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts as number,
    getNextPageParam: (lastPage: any) => {
      // If there's no data, there are no more pages.
      if (!lastPage) {
        return null;
      }
      if (lastPage.documents.length === 0) {
        return null;
      }
      // Use the $id of the last document as the cursor.
      // jadi konsepnya ketika fetchNextPage() dipanggil, maka akan mengambil data $id array terakhir, lalu mengirimkannya ke function getInfinitePosts, di function getInfinitePosts menerima parameter pageParam
      // variable lastId di bawah contoh pengambilan datanya
      const lastId = lastPage?.documents[lastPage.documents?.length - 1].$id;
      return lastId;
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
    },
  });
};

export const useDeleteSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
    },
  });
};

export const useGetCurrentUser = () => {
  // mengambil data dari user yang sedang login saat ini
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

// queryKey: Ini adalah properti yang digunakan untuk menentukan query key (kunci query) untuk query cache. Query key adalah cara React Query mengidentifikasi query tertentu dalam cache. Dalam hal ini, query key terdiri dari sebuah array yang berisi dua elemen: 'GET_POST_BY_ID' (kunci query) dan postId (ID posting yang diberikan). Ini digunakan untuk mengidentifikasi query ini di cache.

// queryFn: Properti ini adalah fungsi yang digunakan untuk menjalankan query aktual. Fungsi ini dipanggil ketika query perlu dijalankan. Dalam hal ini, fungsi getPostById digunakan untuk mengambil data posting berdasarkan postId yang diberikan.

// enabled: Properti ini mengontrol apakah query akan dijalankan atau tidak. Dalam kasus ini, nilai enabled diatur dengan menggunakan !!postId. Ini mengubah postId menjadi nilai boolean, dan query hanya akan dijalankan jika postId adalah truthy. Dengan kata lain, query hanya akan dijalankan jika postId memiliki nilai yang valid (bukan null atau undefined). Jika postId adalah falsy, maka query tidak akan dijalankan.

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as number,
    getNextPageParam: (lastPage: any) => {
      console.log({ lastPage });
      // If there's no data, there are no more pages.
      if (!lastPage) {
        return null;
      }
      if (lastPage.documents.length === 0) {
        return null;
      }
      if (lastPage && lastPage?.documents?.length === 0) {
        console.log("tidak ada data", lastPage);
        return null;
      } else {
        const lastId = lastPage?.documents[lastPage?.documents?.length - 1].$id;
        return lastId;
      }

      // Use the $id of the last document as the cursor.
      // jadi konsepnya ketika fetchNextPage() dipanggil, maka akan mengambil data $id array terakhir, lalu mengirimkannya ke function getInfinitePosts, di function getInfinitePosts menerima parameter pageParam
      // variable lastId di bawah contoh pengambilan datanya
    },
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

export const useGetUsersInfinite = () => {
  return useInfiniteQuery({
    queryKey: ["userInfiniteQuery"],
    queryFn: getUsersInfinite as number,
    getNextPageParam: (lastPage: any) => {
      console.log({ lastPage });
      // If there's no data, there are no more pages.
      if (!lastPage) {
        return null;
      }
      if (lastPage.documents.length === 0) {
        return null;
      }
      if (lastPage && lastPage?.documents?.length === 0) {
        console.log("tidak ada data", lastPage);
        return null;
      } else {
        const lastId = lastPage?.documents[lastPage?.documents?.length - 1].$id;
        return lastId;
      }

      // Use the $id of the last document as the cursor.
      // jadi konsepnya ketika fetchNextPage() dipanggil, maka akan mengambil data $id array terakhir, lalu mengirimkannya ke function getInfinitePosts, di function getInfinitePosts menerima parameter pageParam
      // variable lastId di bawah contoh pengambilan datanya
    },
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    // fungsi method enabled ini digunakan query dijalankan jika userId bernilai true atau ada datanya, jika tidak maka tidak dijalankan
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

export const useGetUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
};
