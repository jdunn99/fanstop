import ToastProvider from "@/components/ui/toast";
import { CloudinaryProvider } from "@/lib/cloudinary-context";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";

const client = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  return (
    <QueryClientProvider client={client}>
      <SessionProvider session={session}>
        <ToastProvider>
          <CloudinaryProvider>
            <Component {...pageProps} key={router.asPath} />
          </CloudinaryProvider>
        </ToastProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
