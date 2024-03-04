import { createContext, useContext, useState } from "react";

type PostContextType = {
  postId: string;
  setPostId: (postId: string) => void;
};

export const PostContext = createContext<PostContextType>(
  {} as PostContextType,
);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const [postId, setPostId] = useState("");
  return (
    <PostContext.Provider value={{ postId, setPostId }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => useContext(PostContext);
