import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MyPosts from "~/components/MyPosts";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
} from "~/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
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
  const getPosts = api.post.getAllFromUser.useQuery({ userId: user?.id ?? '' });
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
    <div className="flex justify-center gap-2 ">
      <div className="my-4">
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <div className="flex items-center justify-center gap-2">
              <Avatar>
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>{user?.firstName[0] ?? 'U'}</AvatarFallback>
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
                        <Input placeholder="shadcn" {...field} />
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
                        <Textarea placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit" disabled={createPost.isLoading}>{createPost.isLoading ? 'Carregando...' : 'Criar postagem'}</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <MyPosts />
    </div>
  );
}
