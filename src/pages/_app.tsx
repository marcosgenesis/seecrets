import { type AppType } from "next/app";

import { api } from "~/utils/api";

import { ClerkProvider } from "@clerk/nextjs";
import { Inter as FontSans } from "next/font/google";
import { cn } from "~/components/lib/utils";
import "~/styles/globals.css";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <main className={cn("font-sans",fontSans.variable)}>
        <Component {...pageProps} />
        </main>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
