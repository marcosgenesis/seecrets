import { UserButton } from "@clerk/nextjs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Textarea } from "./ui/textarea"
import { useForm } from "react-hook-form"
import { Input } from "./ui/input"
import { Switch } from "./ui/switch"
import { ModeToggle } from "./mode-toggle"
import Link from "next/link"
import { useRouter } from "next/router"

export const Header = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      uniqueView: false,
    },
  });

  return <div className="flex justify-between w-3/4 mt-4">
    <div className="flex gap-4 items-center justify-center">
      <UserButton />
      <Link href="/" className="data-[active=true]:font-medium data-[active=false]:text-gray-500" data-active={router.pathname === '/'}>Inicio</Link>
      <Link href="/my-posts" className="data-[active=true]:font-medium data-[active=false]:text-gray-500" data-active={router.pathname === '/my-posts'}>Minhas postagens</Link>
    </div>
    <div className="flex items-center justify-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger>
          <Button>Nova publicação</Button>
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
              /><FormField
                control={form.control}
                name="uniqueView"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-center gap-2">
                    <div>
                      <FormLabel>Visualização única</FormLabel>
                      <p className="text-sm">Apenas uma pessoa no mundo inteiro irá ver essa publicação</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value}
                        onCheckedChange={field.onChange} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => { }} type="submit" form="comment">Publicar Comentário</AlertDialogAction>
              </AlertDialogFooter>
            </Form>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <ModeToggle />
    </div>
  </div>
}
