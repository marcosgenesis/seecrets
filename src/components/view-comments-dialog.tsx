import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { api } from "~/utils/api";

export const ViewCommentsDialog: React.FC<{ postId: string }> = ({
  postId,
}) => {
  const [showComments, setShowComments] = useState(false);
  const { data: item } = api.post.getPostById.useQuery(
    { postId: postId },
    { enabled: showComments },
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={item?._count.comments === 0}>
        <Button
          variant={"ghost"}
          disabled={item?._count.comments === 0}
          onClick={() => setShowComments(true)}
        >
          Ver comentários
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Comentários</AlertDialogTitle>
          <AlertDialogDescription>
            Confira os comentários do post
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex w-full items-center justify-center">
          <Carousel
            opts={{
              align: "center",
            }}
            className="w-3/4 max-w-md"
          >
            <CarouselContent>
              {item?.comments.map((item) => (
                <CarouselItem key={item.id}>
                  <Card className="px-4 py-2">
                    <p className="text-sm">Comentário</p>
                    <p className="font-medium">{item.content}</p>
                    <span>
                      <p className="text-sm text-gray-400">
                        Comentado em{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </span>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowComments(false)}>
            Fechar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
