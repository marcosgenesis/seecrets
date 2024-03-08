import { MessageCircle } from "lucide-react";
import React from "react";
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
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { usePost } from "~/contexts/usePost";

const commentSchema = z.object({
  comment: z
    .string()
    .min(2, { message: "Comentário precisa conter pelo menos 2 caracteres." }),
});

interface QueryParams {
  postId: string;
}

const CommentDialog: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { postId } = usePost();
  const commentPost = api.post.commentPost.useMutation();
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  });
  async function handleComment() {
    const data: z.infer<typeof commentSchema> = form.getValues();
    if (!user || !postId) {
      return;
    }
    await commentPost.mutateAsync(
      {
        comment: data.comment,
        userId: user.id,
        postId,
      },
      {
        onSuccess: () => {
          form.reset();
          toast({
            title: "Comentário publicado",
            description: "Seu comentário foi publicado com sucesso.",
          });
        },
      },
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <MessageCircle size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent asChild>
        <div>
          <AlertDialogHeader>
            <AlertDialogTitle>Comente este post</AlertDialogTitle>
            <AlertDialogDescription>
              Comente sobre o que achou deste post. Críticas, sugestões e etc.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Form {...form}>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Escreva aqui..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleComment()}
                type="submit"
                form="comment"
              >
                {commentPost.isLoading ? "carregando" : "Publicar Comentário"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CommentDialog;
