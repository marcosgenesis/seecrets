import { UserButton, UserProfile, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EyeIcon,
  Loader,
  Loader2Icon,
  LoaderIcon,
  MessageCircle,
  RefreshCcw,
  ThumbsDown,
  ThumbsUp,
  ViewIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MyPosts from "~/components/MyPosts";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
  const [postAction, setPostAction] = useState("default");
  const createPost = api.post.create.useMutation();
  const likePost = api.post.like.useMutation();
  const removeLikePost = api.post.removeLike.useMutation();
  const deslikePost = api.post.deslike.useMutation();
  const removeDeslikePost = api.post.removeDeslike.useMutation();

  const getRandomPost = api.post.getRandomPost.useQuery(
    { userId: user?.id },
    { refetchOnMount: false, refetchOnWindowFocus: false },
  );
  const getPosts = api.post.getAllFromUser.useQuery({ userId: user?.id ?? "" });

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
        <div className="flex h-1/2 flex-col items-center justify-around">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-2xl font-medium text-gray-800">
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
          <Button variant={"outline"}>
            <MessageCircle size={16} />
          </Button>
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
        <div className="my-4 flex w-3/4 items-start justify-between gap-4">
          <Card className="w-1/2">
            <CardContent className="flex flex-col gap-2 py-4">
              <div className="flex items-center justify-center gap-2">
                <UserButton />
                {/* <Avatar>
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>{user?.firstName[0] ?? "U"}</AvatarFallback>
                </Avatar> */}
                <p>Bem vindo novamente, {user?.firstName}!</p>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título da postagem" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descrição da postagem"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="uniqueView"
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <Toggle
                          onPressedChange={field.onChange}
                          pressed={field.value}
                          variant={"outline"}
                          {...field}
                        >
                          <ViewIcon />
                        </Toggle>
                        <p>Visualização única</p>
                      </div>
                    )}
                  />
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={createPost.isLoading}
                  >
                    {createPost.isLoading ? "Carregando..." : "Criar postagem"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <MyPosts />
        </div>
      </div>
    </div>
  );
}
