import { useUser } from "@clerk/nextjs";
import { Header } from "~/components/header";
import {
  Loader2Icon,
  RefreshCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import CommentDialog from "~/components/comment-dialog";
import { Button } from "~/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { api } from "~/utils/api";
import Layout from "~/components/layout";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const [postAction, setPostAction] = useState("default");
  const likePost = api.post.like.useMutation();
  const removeLikePost = api.post.removeLike.useMutation();
  const deslikePost = api.post.deslike.useMutation();
  const removeDeslikePost = api.post.removeDeslike.useMutation();

  const getRandomPost = api.post.getRandomPost.useQuery(
    { userId: user?.id ?? '' },
    {
      enabled: !!user?.id,
      refetchOnMount: false,
      refetchOnWindowFocus: false, onSuccess: (data) => {
        router.push({
          pathname: router.pathname,
          query: { ...router.query, postId: data?.id },
        }).then(console.debug).catch(console.error);
      }
    },
  );


  async function handlePostActions(value: string) {
    setPostAction(value);
    if (!user) return;
    if (!getRandomPost.data) return;
    if (!value) {
      await removeDeslikePost.mutateAsync({
        postId: getRandomPost.data.id,
        senderId: user?.id,
      });
      await removeLikePost.mutateAsync({
        postId: getRandomPost.data.id,
        senderId: user?.id,
      });
    }

    if (value === "like") {
      await removeDeslikePost.mutateAsync({
        postId: getRandomPost.data.id,
        senderId: user?.id,
      });
      await likePost.mutateAsync({
        postId: getRandomPost.data.id,
        senderId: user?.id,
      });
    }
    if (value === "deslike") {
      await removeLikePost.mutateAsync({
        postId: getRandomPost.data.id,
        senderId: user?.id,
      });
      await deslikePost.mutateAsync({
        postId: getRandomPost.data.id,
        senderId: user?.id,
      });
    }
  }

  return (
    <div>
      <div className="flex h-dvh flex-col items-center ">
        <Header />
        <div className="flex h-1/2 flex-col items-center justify-around">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-2xl font-medium">
              {getRandomPost.data?.title}
            </p>
            <p className="">{getRandomPost.data?.content}</p>
          </div>
        </div>
        <div className="flex w-3/4 justify-between">
          <Button
            variant={"outline"}
            onClick={async () => {
              await getRandomPost.refetch();
              setPostAction("default");
            }}
          >
            <RefreshCcw size={16} className="mr-2" /> Atualizar
          </Button>
          <CommentDialog />
          <div className="flex gap-2">
            <ToggleGroup
              type="single"
              onValueChange={handlePostActions}
              value={postAction}
            >
              <ToggleGroupItem
                value="like"
                variant={"outline"}
                disabled={likePost.isLoading}
              >
                {likePost.isLoading || removeLikePost.isLoading ? (
                  <Loader2Icon size={16} className="animate-spin" />
                ) : (
                  <ThumbsUp size={16} />
                )}
              </ToggleGroupItem>
              <ToggleGroupItem value="deslike" variant={"outline"}>
                {deslikePost.isLoading || removeDeslikePost.isLoading ? (
                  <Loader2Icon size={16} className="animate-spin" />
                ) : (
                  <ThumbsDown size={16} />
                )}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        {/* <MyPosts /> */}
      </div>
    </div>
  );
}
