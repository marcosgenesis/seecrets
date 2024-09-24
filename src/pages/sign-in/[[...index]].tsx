import { useSignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { type RefObject, useMemo, useRef } from "react";

import { TargetIcon, User2Icon } from "lucide-react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { api } from "~/utils/api";

export const schema = z.object({
  email: z
    .string({ required_error: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z.string({ required_error: "Senha obrigatória" }),
});

export default function SignInForm() {
  const { signIn } = useSignIn();
  const constraintsRef = useRef(null);
  const getRandomPosts = api.post.getRandomPosts.useQuery({ take: 10 });

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden">
      <Card className="z-50 flex w-full sm:mx-4 flex-col items-center gap-4 bg-white px-8 py-4 shadow-md lg:w-1/3 m-4">
        <span className="mt-8 self-start rounded-lg border p-2">
          <TargetIcon />
        </span>
        <span className="flex flex-col self-start">
          <p className="text-sm text-gray-500">Entre em</p>
          <p className="text-3xl font-medium">Seecrets</p>
        </span>
        <div className="w-full">
          <Button
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
    () => Math.floor(Math.random() * (window.innerWidth - 400)),
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
