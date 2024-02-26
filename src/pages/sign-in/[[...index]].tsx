import { useAuth, useSignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { type RefObject, useEffect, useMemo, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { TargetIcon, User2Icon } from "lucide-react";
import Link from "next/link";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { api } from "~/utils/api";
import { useToast } from "~/components/ui/use-toast";

export const schema = z.object({
  email: z
    .string({ required_error: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z.string({ required_error: "Senha obrigatória" }),
});

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const toast = useToast();
  const form = useForm({
    resolver: zodResolver(schema),
  });
  const constraintsRef = useRef(null);
  const getRandomPosts = api.post.getRandomPosts.useQuery({ take: 10 });

  const handleSubmit: SubmitHandler<z.infer<typeof schema>> = async ({
    email,
    password,
  }) => {
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      console.log(result);

      if (result.status === "complete") {
        console.log(result);
        await setActive({ session: result.createdSessionId });
        await router.push("/");
      } else {
        /*Investigate why the login hasn't completed */
        console.log(result);
      }
    } catch (err) {
      toast.toast({
        title: "Login inválido",
        description:
          "Não foi possível fazer login, verifique suas credenciais.",
      });
      console.error("error", err);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="z-50 flex w-1/3 flex-col gap-4 bg-white px-8 py-4 shadow-md">
        <span className="mt-8 self-start rounded-lg border p-2">
          <TargetIcon />
        </span>
        <span className="flex flex-col self-start">
          <p className="text-sm text-gray-500">Entre em</p>
          <p className="text-3xl font-medium">Seecrets</p>
        </span>
        <div className="w-full">
          <Button
            variant={"outline"}
            className="w-full"
            onClick={() =>
              signIn?.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
              })
            }
          >
            Entrar com o Google
          </Button>
        </div>
        <Form {...form}>
          <form
            className="flex w-full flex-col gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="fulano@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="batatinha123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full">Entrar</Button>
          </form>
        </Form>
        <Separator />

        <div className="flex items-center gap-2">
          <p className="text-gray-500">Sem conta?</p>
          <Link href="/sign-up" className="hover:underline">
            Cadastre-se Agora
          </Link>
        </div>
      </Card>
      <motion.div className="absolute h-screen w-full" ref={constraintsRef}>
        {getRandomPosts.data?.map((item) => (
          <RandomPost
            constraintsRef={constraintsRef}
            item={item}
            key={item.id}
          />
        ))}
      </motion.div>
    </div>
  );
}

const RandomPost = ({
  constraintsRef,
  item,
}: {
  constraintsRef: RefObject<Element>;
  item: { id: string; content: string };
}) => {
  const leftValue = useMemo(
    () => Math.floor(Math.random() * (window.innerWidth - 200)),
    [],
  );
  const topValue = useMemo(
    () => Math.floor(Math.random() * (window.innerHeight - 200)),
    [],
  );

  return (
    <motion.div
      animate={{
        opacity: [0, 1],
      }}
      drag
      dragConstraints={constraintsRef}
      style={{
        position: "absolute",
        top: topValue,
        left: leftValue,
      }}
      className="h-20 w-64"
    >
      <Card className="px-4 py-2">
        <span className="flex items-center gap-2">
          <User2Icon size={16} />
          <p className="text-sm text-zinc-700">Anônimo</p>
        </span>
        <p className="font-medium">{item.content}</p>
      </Card>
    </motion.div>
  );
};
