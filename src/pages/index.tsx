import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MyPosts from "~/components/MyPosts";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const form = useForm<z.infer<typeof newPostSchema>>({
    resolver: zodResolver(newPostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="flex justify-center gap-2 ">
      <div className="my-4">
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <div className="flex items-center justify-center gap-2">
              <Avatar>
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>{user?.firstName[0]}</AvatarFallback>
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
                <Button className="w-full" type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <MyPosts />
    </div>
  );
}
