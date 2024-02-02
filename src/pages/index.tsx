import { UserButton, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "~/components/Header";
import {
  Loader2Icon,
  RefreshCcw,
  ThumbsDown,
  ThumbsUp,
  ViewIcon,
} from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CommentDialog from "~/components/CommentDialog";
import MyPosts from "~/components/MyPosts";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Toggle } from "~/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { api } from "~/utils/api";

const newPostSchema = z.object({
  title: z.string().min(2, {
    message: "Título precisa conter pelo menos 2 caracteres.",
  }),
  content: z.string().min(2, {
    message: "Descrição precisa conter pelo menos 2 caracteres.",
  }),
  uniqueView: z.boolean().default(false),
});

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const [postAction, setPostAction] = useState("default");
  const createPost = api.post.create.useMutation();
  const likePost = api.post.like.useMutation();
  const removeLikePost = api.post.removeLike.useMutation();
  const deslikePost = api.post.deslike.useMutation();
  const removeDeslikePost = api.post.removeDeslike.useMutation();

  const getRandomPost = api.post.getRandomPost.useQuery(
    { userId: user?.id },
    {
      refetchOnMount: false, refetchOnWindowFocus: false, enabled: !!user?.id, onSuccess: (data) => {
        router.push({
          pathname: router.pathname,
          query: { ...router.query, postId: data?.id },
        }).then(() => { }).catch(console.error);
      }
    },
  );

  const getPosts = api.post.getAllFromUser.useQuery(
    { userId: user?.id ?? "" },
    { enabled: !!user?.id },
  );

  const form = useForm<z.infer<typeof newPostSchema>>({
    resolver: zodResolver(newPostSchema),
    defaultValues: {
      title: "",
      content: "",
      uniqueView: false,
    },
  });

  async function onSubmit(values: z.infer<typeof newPostSchema>) {
    if (!user) return;
    await createPost.mutateAsync({
      title: values.title,
      content: values.content,
      senderId: user?.id,
      uniqueView: values.uniqueView,
    });
    form.reset();
    await getPosts.refetch();
  }

  async function handlePostActions(value: string) {
    setPostAction(value);
    if (!user) return;
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
      <div className="flex h-dvh flex-col items-center justify-center">
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
        <MyPosts />
      </div>
    </div>
  );
}
