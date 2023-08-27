import { CreatorBar } from "@/components/creator-bar";
import { FeaturedCreator } from "@/components/featured-creators";
import { AuthedNav, Navbar } from "@/components/nav";
import Button from "@/components/ui/button";
import { mainNav } from "@/config/config";
import { usePopularTags } from "@/lib/queries/usePopularTags";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import {
    Container,
    DashboardItem,
    DashboardItemHeading,
    EmptyCard,
    Header,
    Layout,
} from "@/components/layout";
import { Avatar } from "@/components/ui/avatar";
import { FeedPost } from "@/components/feed-post";
import { useMutation, useQuery } from "react-query";
import { PostItem } from "./api/user/feed";
import { isAuthed } from "@/lib/authSSR";
import { CreateInput } from "@/components/create-input";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MdClose } from "react-icons/md";
import { CreateCommunityArgs } from "./api/communities";
import { CreateCommunity } from "@/components/create-community";

const tagNames = ["Technology", "Business", "Arts", "Health & Wellness"];

function HomePage() {
    const [active, setActive] = React.useState<string>(tagNames[0]);
    const { data: tags } = usePopularTags();

    const { data } = useSession();

    return (
        <div className="flex min-h-screen flex-col">
            <header className="container mx-auto z-40 w-full">
                <div className="flex h-20 items-center justify-between py-6 max-w-screen-xl mx-auto ">
                    <Navbar links={mainNav} />
                    <div className="flex items-center gap-2">
                        {data?.user ? (
                            <AuthedNav />
                        ) : (
                            <React.Fragment>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Sign Up</Button>
                                </Link>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </header>
            <main className="flex-1 ">
                <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-48 flex items-center flex-col">
                    <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                        <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                            <span className="text-rose-500">FanStop.</span>{" "}
                            Where Creativity Meets Community.
                        </h1>
                        <p className="max-w-[42rem] leading-normal opacity-80 sm:text-xl sm:leading-8">
                            Discover a dynamic writing platform for creators to
                            publish directly to their audience and earn through
                            subscriptions.
                        </p>
                        <div className="flex items-center space-x-2">
                            <Button>Connect with your fans</Button>
                            <Button variant="outline">Explore Creators</Button>
                        </div>
                    </div>
                </section>
                <section className="space-y-6  max-w-screen-xl mx-auto bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 px-16 rounded-lg">
                    <div className="mx-auto flex flex-col items-center space-y-4 text-center">
                        <h2 className="font-bold text-3xl sm:text-3xl md:text-4xl">
                            Join a community built by independent creators.
                        </h2>
                        <p className="max-w-[85%] leading-normal opacity-80  sm:leading-7">
                            A flourishing hub for creators, writers, artists,
                            gamers, and visionaries, finding creative
                            fulfillment and financial independence doing what
                            they love.
                        </p>
                        <div className="flex items-center text-center max-w-[64rem]">
                            <CreatorBar
                                keys={tags || []}
                                active={active}
                                setActive={setActive}
                            />
                        </div>
                    </div>
                    <div className="mx-auto grid justify-center gap-4 sm:grid-cols-1 md:max-w-[64rem] md:grid-cols-2">
                        <FeaturedCreator queryKey={active} />
                    </div>
                    <div className="mx-auto pt-8 text-center md:max-w-[58rem]">
                        <Button>See who else is on FanStop</Button>
                    </div>
                </section>
                <section className="container py-8 md:py-12 lg:py-24">
                    <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"></div>
                </section>
            </main>
        </div>
    );
}
const schema = z.object({
    name: z.string(),
    slug: z.string(),
});
type FormData = z.infer<typeof schema>;
export default function Home(
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
    const { data } = useQuery<PostItem[]>("feed", () =>
        fetch("/api/user/feed").then((res) => res.json())
    );

    if (typeof data === "undefined") return null;

    return props.data ? (
        props.hasCommunity ? (
            <Layout heading="Home">
                <DashboardItem>
                    <DashboardItemHeading heading="Feed" />
                    {/* <EmptyCard heading="Feed">
                        <h3 className="font-semibold text-sm">
                            Your feed is empty.
                        </h3>
                        <p className="text-sm text-slate-500 pt-2 pb-8">
                            You can find communities on the{" "}
                            <Link
                                href="#"
                                className="text-rose-500 underline font-bold"
                            >
                                Explore
                            </Link>{" "}
                            page.
                        </p>
                    </EmptyCard> */}
                    {data.map((item) => (
                        <FeedPost {...item} key={item.id} />
                    ))}
                </DashboardItem>
            </Layout>
        ) : (
            <CreateCommunity />
        )
    ) : (
        <HomePage />
    );
}

export async function getServerSideProps({
    req,
    res,
}: GetServerSidePropsContext) {
    return {
        props: await isAuthed({ req, res }),
    };
}
