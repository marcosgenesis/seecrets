import { useUser } from "@clerk/nextjs";
// import { Header } from "~/components/header";
import { Loader2Icon, RefreshCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import CommentDialog from "~/components/comment-dialog";
import { Button } from "~/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { api } from "~/utils/api";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { usePost } from "~/contexts/usePost";

export default function Home() {
  const { user } = useUser();
  const { postId, setPostId } = usePost();
  const [postAction, setPostAction] = useState("default");
  const likePost = api.post.like.useMutation();
  const removeLikePost = api.post.removeLike.useMutation();
  const deslikePost = api.post.deslike.useMutation();
  const removeDeslikePost = api.post.removeDeslike.useMutation();

  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateX = useTransform(cardY, [-300, 300], [10, -10]); // Reversed values
  const rotateY = useTransform(cardX, [-300, 300], [-10, 10]); // Reversed values
  const cardRotateX = useTransform(cardY, [-300, 300], [25, -25]); // Adjusted rotation values
  const cardRotateY = useTransform(cardX, [-300, 300], [-25, 25]); // Adjusted rotation values

  const getRandomPost = api.post.getRandomPost.useQuery(
    { userId: user?.id ?? "" },
    {
      enabled: !!user?.id,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data) {
          setPostId(data.id);
        }
      },
    },
  );

  async function handlePostActions(value: string) {
    setPostAction(value);
    if (!user) return;
    if (!getRandomPost.data) return;
    if (!value) {
      await removeDeslikePost.mutateAsync({
        postId,
        senderId: user?.id,
      });
      await removeLikePost.mutateAsync({
        postId,
        senderId: user?.id,
      });
    }

    if (value === "like") {
      await likePost.mutateAsync({
        postId,
        senderId: user?.id,
      });
    }
    if (value === "deslike") {
      await deslikePost.mutateAsync({
        postId,
        senderId: user?.id,
      });
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const offsetX = event.clientX - window.innerWidth / 2;
    const offsetY = event.clientY - window.innerHeight / 2;

    cardX.set(offsetX);
    cardY.set(offsetY);
  };

  const handleMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };
  return (
    <div>
      <div className="flex h-dvh flex-col items-center gap-4">
        <Header />
        <motion.div
          className="min-w-1/4 flex max-w-screen-lg items-center justify-center"
          style={{
            perspective: 800,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="flex min-h-52 w-full items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              perspective: 800,
              rotateX,
              rotateY,
            }}
            transition={{ velocity: 0 }}
          >
            {getRandomPost.data && (
              <motion.div
                key="card"
                className="min-w-60 rounded-lg border-[1px] bg-white p-4 text-center shadow-md dark:border-zinc-800 dark:bg-zinc-950 "
                style={{
                  transformStyle: "preserve-3d",
                  perspective: 800,
                  transform: `rotateX(${cardRotateX.get()}deg) rotateY(${cardRotateY.get()}deg)`,
                }}
                transition={{ velocity: 0 }}
              >
                <p className="text-xl font-medium">
                  {getRandomPost.data?.title}
                </p>
                <p className="text-sm text-gray-600">{`${getRandomPost.data
                  ?.title} - ${getRandomPost.data?.createdAt.toLocaleDateString()}`}</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
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
      </div>
    </div>
  );
}
