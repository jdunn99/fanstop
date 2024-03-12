import { BuiltInProviderType } from "next-auth/providers/index";
import { ClientSafeProvider, signIn } from "next-auth/react";
import { LiteralUnion } from "react-hook-form";
import Button from "./ui/button";
import { useRouter } from "next/router";
import { BsGithub, BsGoogle } from "react-icons/bs";

export interface ProviderButtonProps {
  providers:
    | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
    | never[];
  label: string;
}

const Icons = {
  github: <BsGithub />,
  google: <BsGoogle />,
};

export function ProviderButtons({ providers, label }: ProviderButtonProps) {
  const { push } = useRouter();

  async function onClick(id: LiteralUnion<BuiltInProviderType, string>) {
    await signIn(id);
    push("/");
  }

  return Object.values(providers).map((provider) =>
    provider.name === "Credentials" ? null : (
      <Button
        className="gap-2"
        key={provider.name}
        onClick={() => onClick(provider.id)}
      >
        {Icons[provider.id as keyof typeof Icons]} {label} {provider.name}
      </Button>
    ),
  );
}
