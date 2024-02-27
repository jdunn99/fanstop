import { BuiltInProviderType } from "next-auth/providers/index";
import { ClientSafeProvider, LiteralUnion, signIn } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Button from "./ui/button";
import { ProviderButtonProps, ProviderButtons } from "./provider-buttons";

interface RegisterButtonsProps extends ProviderButtonProps {
  onClick(): void;
}
export function RegisterButtons({ providers, onClick }: RegisterButtonsProps) {
  return (
    <div className="grid gap-6">
      <ProviderButtons providers={providers} label="Sign up with" />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs ">
          <span className="bg-white px-2 dark:bg-slate-900">Or</span>
        </div>
      </div>
      <Button onClick={onClick}>Sign up with email</Button>
    </div>
  );
}
