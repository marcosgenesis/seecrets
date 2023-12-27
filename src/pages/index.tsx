import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/utils/api";

export default function Home() {
  const { user } = useUser();
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

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
            <Input placeholder="Título" />
            <Textarea placeholder="Escreva aqui uma mensagem" />
          </CardContent>
          <CardFooter>
            <Button className="w-full"> Postar</Button>
          </CardFooter>
        </Card>
      </div>
      <Card className="my-4 flex flex-col gap-2 w-1/4">
        <CardHeader>
          <CardTitle>Minhas postagens</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {[...Array(10)].map((_, i) => (
            <div>
              <div className="flex flex-row items-center justify-between">
                <p>Post #{i + 1}</p>
                <Button size={"icon"}>V</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
