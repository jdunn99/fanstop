import { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider, signIn } from 'next-auth/react';
import { LiteralUnion } from 'react-hook-form';
import Button from './ui/button';

export interface ProviderButtonProps {
    providers:
        | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
        | never[];
    label: string;
}

export function ProviderButtons({ providers, label }: ProviderButtonProps) {
    return Object.values(providers).map((provider) =>
        provider.name === 'Credentials' ? null : (
            <Button
                variant="outline"
                key={provider.name}
                onClick={() => signIn(provider.id)}
            >
                {label} {provider.name}
            </Button>
        )
    );
}
