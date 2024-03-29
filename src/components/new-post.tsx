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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useToast } from "./ui/use-toast";

const newPostSchema = z.object({
  title: z.string().min(2, {
    message: "Título precisa conter pelo menos 2 caracteres.",
  }),
  content: z.string().min(2, {
    message: "Descrição precisa conter pelo menos 2 caracteres.",
  }),
  uniqueView: z.boolean().default(false),
});

export const NewPostButton: React.FC = () => {
  const { user } = useUser();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();
  const newPost = api.post.create.useMutation();

  const form = useForm<z.infer<typeof newPostSchema>>({
    resolver: zodResolver(newPostSchema),
    defaultValues: {
      title: "",
      content: "",
      uniqueView: false,
    },
  });

  async function handleNewPost(data: z.infer<typeof newPostSchema>) {
    if (!user) return;
    await newPost.mutateAsync(
      {
        content: data.content,
        title: data.title,
        uniqueView: data.uniqueView,
        senderId: user.id,
      },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
          toast.toast({
            title: "Publicação criada",
            description: "Sua publicação foi criada com sucesso.",
          });
        },
        onError: (error) => {
          toast.toast({
            title: "Erro ao criar publicação",
            description: error.message,
          });
        },
      },
    );
    await utils.invalidate();
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>Nova publicação</Button>
      </AlertDialogTrigger>
      <AlertDialogContent asChild>
        <div>
          <AlertDialogHeader>
            <AlertDialogTitle>Nova Publicação</AlertDialogTitle>
            <AlertDialogDescription>
              Crie uma nova publicação para compartilhar com o mundo.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNewPost)} id="newPost">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Escreva aqui..." {...field} />
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
                      <Textarea placeholder="Escreva aqui..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="uniqueView"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-center gap-2">
                    <div>
                      <FormLabel>Visualização única</FormLabel>
                      <p className="text-sm">
                        Apenas uma pessoa no mundo inteiro irá ver essa
                        publicação
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        {...field}
                        value={field.value ? "checked" : "unchecked"}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button type="submit" form="newPost">
              Publicar
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
