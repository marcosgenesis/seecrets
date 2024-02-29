import React from "react";
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
import { api } from "~/utils/api";
import { useToast } from "./ui/use-toast";

export const DeletePostDialog: React.FC<{ postId: string }> = ({ postId }) => {
  const { toast } = useToast();
  const deletePostMutation = api.post.deletePost.useMutation();
  const utils = api.useUtils();

  async function handleDeletePost() {
    await deletePostMutation.mutateAsync(
      { postId },
      {
        onSuccess: () => {
          toast({
            title: "Publicação apagada",
            description: "Sua publicação foi apagada com sucesso",
          });
        },
        onError: (error) => {
          toast({
            title: "Erro ao apagar publicação",
            description: error.message,
          });
        },
      },
    );
    await utils.invalidate();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant={"destructive"}>Apagar publicação</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apagar publicação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja apagar esta publicação?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            onClick={() => handleDeletePost()}
            disabled={deletePostMutation.isLoading}
          >{`${
            deletePostMutation.isLoading ? "Carregando.." : "Sim, apagar!"
          }`}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
