import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { Button } from "./ui/button";

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
        {posts.data.length === 0 && <p>Você ainda não postou nada.</p>}
        {posts.data.map((item) => (
          <div key={item.id}>
            <div className="flex flex-row items-center justify-between">
              <p>{item.title}</p>
              <Button size={"icon"}>V</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MyPosts;
