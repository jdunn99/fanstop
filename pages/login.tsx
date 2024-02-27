import { InferGetServerSidePropsType } from "next";
import React from "react";
import { getProviders, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { ProviderButtons } from "@/components/provider-buttons";
import { LoginInput } from "@/components/login-input";
import { useRouter } from "next/router";
import { Logo } from "@/components/ui/logo";

export default function Login({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data } = useSession();

  React.useEffect(() => {
    if (data) {
      router.push("/");
    }
  }, [data]);

  return (
    <div className="px-8 flex h-screen w-screen flex-col items-center justify-center mx-auto dark:bg-slate-900 dark:text-slate-200">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[385px]">
        <div className="flex flex-col space-y-4 text-center">
          <div className="grid place-items-center">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to FanStop
          </h1>

          <ProviderButtons providers={providers} label="Sign in with" />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs ">
              <span className="bg-white dark:bg-slate-900 px-2">
                Or sign in with email
              </span>
            </div>
          </div>
          <LoginInput />
          <p className="text-sm opacity-80">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="underline underline-offset-2 text-rose-500"
            >
              Sign up.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
