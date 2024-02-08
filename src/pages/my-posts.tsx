import { useUser } from "@clerk/nextjs";
import {
  EyeIcon,
  MessageCircleIcon,
  MoreVerticalIcon,
  Search,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { useState } from "react";
import { Header } from "~/components/header";
import { NewPostButton } from "~/components/new-post";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ViewCommentsDialog } from "~/components/view-comments-dialog";
import { api } from "~/utils/api";

export default function MyPosts() {
  const [page, setPage] = useState(1);
  const { user } = useUser();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const getPostById = api.post.getPostById.useQuery(
    { postId: selectedPost ?? "" },
    { enabled: selectedPost !== null },
  );

  const getPosts = api.post.getAllFromUser.useInfiniteQuery(
    { userId: user?.id ?? "", limit: 10 },
    {
      enabled: !!user?.id,
      getNextPageParam: (lastPage, allPages) => {
        console.log(allPages);
        return allPages[page - 1]?.nextCursor;
      },
    },
  );

  if (getPostById.isLoading && getPosts.data?.pages[0]?.items.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <span className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 ">
          <Search size={48} />
        </span>
        <p className="text-2xl font-medium">Alô.. alguém ai?</p>
        <p className="mb-8 w-4/5 text-center">
          Você ainda não possui nenhuma publicação criada, para criar a primeira
          basta clicar no botão abaixo
        </p>
        <NewPostButton />
      </div>
    );
  }

  return (
    <div>
      <div className="flex w-full flex-col items-center justify-center">
        <Header />
        <div className="mt-8 flex w-3/4 flex-col gap-2">
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
              {getPosts.data?.pages[page - 1]?.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="w-1/4">
                    <p className="align-baseline">
                      {item.createdAt.toLocaleString()}
                    </p>
                  </TableCell>
                  <TableCell className="w-3/4">
                    <span>
                      <p>{item.title}</p>
                      <p className="text-sm text-gray-500">{item.content}</p>
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EyeIcon size={16} />
                      <p className="align-baseline">{item.views}</p>
                    </div>
                  </TableCell>
                  <TableCell className="w-1/4">
                    <Badge variant="outline">
                      {item.uniqueView ? "SIM" : "NÃO"}
                    </Badge>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVerticalIcon size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <ViewCommentsDialog postId={item.id} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  data-disabled={page === 1}
                  className="data-[disabled=true]:cursor-not-allowed"
                  onClick={async () => {
                    if (page > 1) {
                      setPage((old) => old - 1);
                      await getPosts.fetchPreviousPage();
                    }
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>{page}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  data-disabled={!getPosts.hasNextPage}
                  className="data-[disabled=true]:cursor-not-allowed"
                  onClick={async () => {
                    if (getPosts.hasNextPage) {
                      setPage((old) => old + 1);
                      await getPosts.fetchNextPage();
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
