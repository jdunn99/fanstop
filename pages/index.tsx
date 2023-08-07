import { CreatorBar } from "@/components/creator-bar";
import { FeaturedCreator } from "@/components/featured-creators";
import { Navbar } from "@/components/nav";
import Button from "@/components/ui/button";
import { db } from "@/lib/db";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { MdMap } from "react-icons/md";

const tagNames = ["Technology", "Business", "Arts", "Health & Wellness"];

export default function Home({
    user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [active, setActive] = React.useState<string>(tagNames[0]);

    const { data } = useSession();

    return (
        <div className="flex min-h-screen flex-col">
            {JSON.stringify(data)}
            <header className="container mx-auto z-40 w-full">
                <div className="flex h-20 items-center justify-between py-6 max-w-screen-xl mx-auto ">
                    <Navbar />
                    <div className="flex items-center gap-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">
                                Login
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm">Sign Up</Button>
                        </Link>
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
                                keys={tagNames}
                                active={active}
                                setActive={setActive}
                            />
                        </div>
                    </div>
                    <div className="mx-auto grid justify-center gap-4 sm:grid-cols-1 md:max-w-[64rem] md:grid-cols-2">
                        <FeaturedCreator queryKey={active} />
                        {/* {temp.map((item) => (
                            <div
                                key={item.author}
                                className="relative overflow-hidden rounded-lg border bg-white p-2"
                            >
                                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <MdMap className="text-4xl" />
                                            <div>
                                                <h3 className="font-bold text-lg">
                                                    {item.name}
                                                </h3>
                                                <span className="text-rose-500 font-semibold text-sm">
                                                    {item.author}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm opacity-80">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))} */}
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

export async function getServerSideProps() {
    const user = await db.user.findMany({
        select: {
            id: true,
            name: true,
        },
    });

    const tags = await db.tag.findMany();
    const creatorId = "clkhqdifi0000u4ez0m5dlbiv"; // Example author ID

    const tagNames = ["Technology", "Test"];

    const result = await db.community.findMany({
        where: {
            tags: {
                some: {
                    name: { in: tagNames },
                },
            },
        },
        select: {
            id: true,
            description: true,
            name: true,
            creator: {
                select: {
                    name: true,
                },
            },
        },
    });

    return {
        props: {
            user: result,
        },
    };
}
