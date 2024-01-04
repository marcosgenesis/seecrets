import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EyeIcon,
  MessageCircle,
  RefreshCcw,
  ThumbsDown,
  ThumbsUp,
  ViewIcon,
} from "lucide-react";
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
});

export default function Home() {
  const { user } = useUser();
  const createPost = api.post.create.useMutation();
  const getPosts = api.post.getAllFromUser.useQuery({ userId: user?.id ?? "" });
  const form = useForm<z.infer<typeof newPostSchema>>({
    resolver: zodResolver(newPostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof newPostSchema>) {
    if (!user) return;
    await createPost.mutateAsync({
      title: values.title,
      content: values.content,
      senderId: user?.id,
    });
    form.reset();
    await getPosts.refetch();
  }

  return (
    <div>
      <div className="flex h-dvh flex-col items-center justify-center">
        <div className="flex h-1/2 flex-col items-center justify-evenly">
          <p>
            Esta é uma mensagem aleatória de um usuário qualquer, pode ser de
            qualquer pessoa do mundo
          </p>
          <div className="flex w-1/2 justify-between">
            <Button variant={"outline"}>
              <RefreshCcw size={16} className="mr-2" /> Atualizar
            </Button>
            <div className="flex gap-2">
              <ToggleGroup type="single">
                <ToggleGroupItem value="like" variant={"outline"}>
                  <ThumbsUp size={16} />
                </ToggleGroupItem>
                <ToggleGroupItem value="deslike" variant={"outline"}>
                  <ThumbsDown size={16} />
                </ToggleGroupItem>
              </ToggleGroup>
              <Button variant={"outline"}>
                <MessageCircle size={16} />
              </Button>
            </div>
          </div>
        </div>
        <div className="my-4 flex items-start gap-4">
          <Card>
            <CardContent className="flex flex-col gap-2 py-4">
              <div className="flex items-center justify-center gap-2">
                <Avatar>
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>{user?.firstName[0] ?? "U"}</AvatarFallback>
                </Avatar>
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
                    name="content"
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <Toggle {...field} variant={"outline"}>
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
