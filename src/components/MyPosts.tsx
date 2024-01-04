import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import {
  Focus,
  ListIcon,
} from "lucide-react";

const MyPosts: React.FC = () => {
  const { user } = useUser();
  const [showList, setShowList] = useState(false);

  const posts = api.post.getAllFromUser.useQuery({ userId: user?.id });
  if (posts.isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <Card className="flex w-1/2 flex-col gap-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Minhas postagens
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => setShowList(!showList)}
          >
            {showList ? (
              <ListIcon className="text-black" size={16} />
            ) : (
              <Focus size={16} />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-fit flex-col gap-2">
        {posts.data.length === 0 && <p>Você ainda não postou nada.</p>}
        {showList ? (
          posts.data.map((item) => (
            <div key={item.id}>
              <div className="flex flex-row items-center justify-between">
                <p>{item.title}</p>
                <Button size={"icon"}>V</Button>
              </div>
            </div>
          ))
        ) : (
          <div className="mx-8">
            <Carousel
              opts={{
                align: "center",
              }}
              className="w-full max-w-xs"
            >
              <CarouselContent>
                {posts.data.map((item) => (
                  <CarouselItem key={item.id} className="basics-1/3">
                    <div className="flex flex-col items-center justify-center rounded-md bg-gray-50 p-4">
                      <p className="text-xl font-medium">{item.title}</p>
                      <p>{item.content}</p>
                      <Button>{item.comments?.length + " Comentários"}</Button>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyPosts;
