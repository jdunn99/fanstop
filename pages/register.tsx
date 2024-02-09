import { InferGetServerSidePropsType } from "next";
import React from "react";
import { getProviders } from "next-auth/react";
import Link from "next/link";
import { RegisterButtons } from "@/components/register-buttons";
import { RegisterEmailInput } from "@/components/register-email-input";

export default function Register({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [step, setStep] = React.useState<number>(1);

  return (
    <div className="px-8 flex h-screen w-screen flex-col items-center justify-center mx-auto">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[385px]">
        <div className="flex flex-col space-y-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign up for FanStop
          </h1>

          {step === 1 ? (
            <RegisterButtons
              label="Sign up with"
              providers={providers}
              onClick={() => setStep(2)}
            />
          ) : (
            <RegisterEmailInput />
          )}
          <p className="text-sm opacity-80">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-2">
              Sign in.
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
