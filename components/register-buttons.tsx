import { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider, LiteralUnion, signIn } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import Button from './ui/button';

interface RegisterButtonsProps {
    providers:
        | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
        | never[];

    onClick(): void;
}
export function RegisterButtons({ providers, onClick }: RegisterButtonsProps) {
    return (
        <div className="grid gap-6">
            {Object.values(providers).map((provider) =>
                provider.name === 'Credentials' ? null : (
                    <Button
                        variant="outline"
                        key={provider.name}
                        onClick={() => signIn(provider.id)}
                    >
                        Sign up with {provider.name}
                    </Button>
                )
            )}
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 opacity-80">OR</span>
            </div>
            <Button onClick={onClick}>Sign up with email</Button>
        </div>
    );
}
