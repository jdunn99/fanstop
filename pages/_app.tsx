import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';

const client = new QueryClient();

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <QueryClientProvider client={client}>
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </QueryClientProvider>
    );
}
