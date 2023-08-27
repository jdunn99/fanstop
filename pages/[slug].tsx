import {
    DashboardItem,
    DashboardItemHeading,
    Layout,
} from "@/components/layout";
import { db } from "@/lib/db";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { z } from "zod";
import { Community } from "./api/communities";
import { PostItem } from "./api/user/feed";
import { FeaturedPost, FeedPost } from "@/components/feed-post";
import { isRouteMatch } from "next/dist/server/future/route-matches/route-match";

function useCommunityByIDMutation(slug: string) {
    return useQuery<Community>([slug], () =>
        fetch(`/api/communities/${slug}`).then((res) => res.json())
    );
}

export default function Test({
    slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const { data: session } = useSession();
    const { data } = useCommunityByIDMutation(slug);
    const { data: postData } = useQuery<PostItem[]>("feed", () =>
        fetch("/api/user/feed").then((res) => res.json())
    );

    React.useEffect(() => {
        if (session && data) {
            if (session.user.id === data.creatorId) {
                router.push("/profile", undefined, { shallow: true });
            }
        }
    }, [session, data]);

    if (!data) return null;

    return (
        <p>
            {session?.user.id === data.creatorId ? (
                <p>Your own profile!</p>
            ) : (
                <Layout heading={data.name}>
                    <DashboardItem>
                        <DashboardItemHeading heading="Featured Post" />
                        {postData && <FeaturedPost {...postData[0]} />}
                    </DashboardItem>
                    <DashboardItem>
                        <DashboardItemHeading heading="Most Popular" />
                        <div className="grid grid-cols-4 gap-4 w-full overflow-hidden">
                            {postData &&
                                postData.map((item, index) => (
                                    <div
                                        className={`flex flex-col hover:bg-slate-50 p-4 hover:rounded-lg border-rose-200 ${
                                            index === postData.length - 1
                                                ? ""
                                                : "border-r"
                                        }`}
                                        key={item.id}
                                    >
                                        <div className="flex items-center">
                                            <div className="flex-1">
                                                <h1 className="text-sm font-bold text-rose-500">
                                                    {item.title}
                                                </h1>
                                                <p className="text-xs text-slate-500 font-medium">
                                                    {new Date(
                                                        item.createdAt
                                                    ).toDateString()}
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <p className="text-xs text-slate-500 font-medium">
                                                        {item.views} views
                                                    </p>
                                                    <p className="text-xs text-slate-500 font-medium">
                                                        0 likes
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex h-full">
                                                <img
                                                    src="https://images.pexels.com/photos/7232128/pexels-photo-7232128.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                                    className="w-16 h-16 rounded-lg overflow-hidden object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </DashboardItem>

                    <DashboardItem>
                        <DashboardItemHeading heading="Recent Posts" />
                        {postData &&
                            postData.map((item) => (
                                <FeedPost {...item} key={item.id} />
                            ))}
                    </DashboardItem>
                </Layout>
            )}
        </p>
    );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
    return {
        props: {
            slug: z.string().parse(query.slug),
        },
    };
}
