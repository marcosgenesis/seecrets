import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { useRouter } from "next/router";
import { NewPostButton } from "./new-post";
import { Card } from "./ui/card";

export const Header = () => {
  const router = useRouter();

  return (
    <Card className="mt-4 flex w-full justify-between px-4 py-2 lg:w-3/4 flex-col lg:flex-row gap-8">
      <div className="flex items-center justify-center gap-4">
        <UserButton />
        <Link
          href="/"
          className="data-[active=true]:font-medium data-[active=false]:text-gray-500"
          data-active={router.pathname === "/"}
        >
          Inicio
        </Link>
        <Link
          href="/my-posts"
          className="data-[active=true]:font-medium data-[active=false]:text-gray-500"
          data-active={router.pathname === "/my-posts"}
        >
          Minhas postagens
        </Link>
      </div>
      <div className="flex items-center justify-center gap-2">
        <NewPostButton />
        <ModeToggle />
      </div>
    </Card>
  );
};
