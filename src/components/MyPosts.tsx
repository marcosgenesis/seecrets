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
  EyeIcon,
  Focus,
  ListIcon,
  MessageCircleIcon,
  ThumbsDownIcon,
  ThumbsUp,
  ThumbsUpIcon,
  ViewIcon,
} from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

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
            {!showList ? (
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
          <Table>
            <TableBody>
              {posts.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="w-full">{item.title}</TableCell>
                  <TableCell >
                    <div className="flex items-center gap-2">
                      <EyeIcon size={16} />
                      <p className="align-baseline">{item.views}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MessageCircleIcon size={16} />
                      {item._count.comments}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ThumbsUpIcon size={16} />
                      {item._count.likes}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ThumbsDownIcon size={16} className="mr-2" />
                      {item._count.deslikes}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="mx-8">
            <Carousel
              opts={{
                align: "center",
              }}
              className="w-full max-w-md"
            >
              <CarouselContent>
                {posts.data.map((item) => (
                  <CarouselItem key={item.id}>
                    <div className="flex h-full flex-col items-center justify-evenly rounded-md bg-gray-50 p-4">
                      <p className="text-xl font-medium">{item.title}</p>
                      <p className="overflow-hidden text-ellipsis text-sm">
                        {item.content}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <ViewIcon size={16} />
                        <p>{item.views}</p>

                        <ThumbsUp size={16} />
                        <p>{item._count.likes}</p>

                        <ThumbsDownIcon size={16} />
                        <p>{item._count.deslikes}</p>
                      </div>
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
