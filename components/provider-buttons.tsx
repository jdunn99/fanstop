import { BuiltInProviderType } from "next-auth/providers/index";
import { ClientSafeProvider, signIn } from "next-auth/react";
import { LiteralUnion } from "react-hook-form";
import Button from "./ui/button";
import { useRouter } from "next/router";

export interface ProviderButtonProps {
  providers:
    | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
    | never[];
  label: string;
}

export function ProviderButtons({ providers, label }: ProviderButtonProps) {
  const { push } = useRouter();

  async function onClick(id: LiteralUnion<BuiltInProviderType, string>) {
    await signIn(id);
    push("/");
  }

  return Object.values(providers).map((provider) =>
    provider.name === "Credentials" ? null : (
      <Button
        variant="outline"
        key={provider.name}
        onClick={() => onClick(provider.id)}
      >
        {label} {provider.name}
      </Button>
    )
  );
}
