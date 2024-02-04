import { useUser } from "@clerk/nextjs";
import { EyeIcon, MessageCircleIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useState } from "react";
import { Header } from "~/components/Header";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { api } from "~/utils/api";

export default function MyPosts() {
  const { user } = useUser();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const getPostById = api.post.getPostById.useQuery({ postId: selectedPost }, { enabled: selectedPost !== null });

  const getPosts = api.post.getAllFromUser.useQuery(
    { userId: user?.id ?? "" },
    { enabled: !!user?.id },
  );

  return (
    <div>
      <div className="flex flex-col items-center justify-center w-full">
        <Header />
        <div className="flex flex-col gap-2 w-3/4 mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Criado em</TableHead>
                <TableHead className="w-[100px]">Título</TableHead>
                <TableHead>Visualizações</TableHead>
                <TableHead>Visualização única</TableHead>
                <TableHead>Comentários</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Dislikes</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getPosts.data?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="w-1/4">
                    <p className="align-baseline">{item.createdAt.toLocaleString()}</p>
                  </TableCell>
                  <TableCell className="w-3/4">
                    <span>
                      <p>{item.title}</p>
                      <p className="text-sm text-gray-500">{item.content}</p>
                    </span>
                  </TableCell>
                  <TableCell >
                    <div className="flex items-center gap-2">
                      <EyeIcon size={16} />
                      <p className="align-baseline">{item.views}</p>
                    </div>
                  </TableCell>
                  <TableCell className="w-1/4">
                    <Badge variant="outline">{item.uniqueView ? 'SIM' : 'NÃO'}</Badge>
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
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger disabled={item._count.comments === 0}>
                        <Button variant={'outline'} disabled={item._count.comments === 0} onClick={() => setSelectedPost(item.id)}>
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
                        <div className="w-full flex items-center justify-center">
                          <Carousel
                            opts={{
                              align: "center",
                            }}
                            className="w-3/4 max-w-md"
                          >
                            <CarouselContent>
                              {getPostById.data?.comments.map((item) => (
                                <CarouselItem key={item.id}>
                                  <Card className="px-4 py-2">
                                    <p className="text-sm">Comentário</p>
                                    <p className="font-medium">{item.content}</p>
                                    <span>
                                      <p className="text-sm text-gray-400">Comentado em {new Date(item.createdAt).toLocaleDateString()}</p>
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
                          <AlertDialogCancel>Fechar</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div >
    </div >
  )
}
