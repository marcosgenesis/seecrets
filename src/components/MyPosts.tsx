import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

const MyPosts: React.FC = () => {
  const { user } = useUser();
  const posts = api.post.getAllFromUser.useQuery({ userId: user?.id });
  if (posts.isLoading) {
    return <p>Carregando...</p>;
  }
  return (
    <Card className="my-4 flex w-1/4 flex-col gap-2">
      <CardHeader>
        <CardTitle>Minhas postagens</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {posts.data.map((_, i) => (
          <div>
            <div className="flex flex-row items-center justify-between">
              <p>Post #{i + 1}</p>
              <Button size={"icon"}>V</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MyPosts;