import { useUser } from "@clerk/nextjs";
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
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/utils/api";

export default function Home() {
  const { user } = useUser();

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
      <MyPosts />
    </div>
  );
}
