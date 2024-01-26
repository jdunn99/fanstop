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
import { Sidebar } from "@/components/sidebar";
import { useFeedQuery } from "@/lib/queries/useFeedQuery";

function HomePage() {
  const [active, setActive] = React.useState<string>("Technology");
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
              <span className="text-rose-500">FanStop.</span> Where Creativity
              Meets Community.
            </h1>
            <p className="max-w-[42rem] leading-normal opacity-80 sm:text-xl sm:leading-8">
              Discover a dynamic writing platform for creators to publish
              directly to their audience and earn through subscriptions.
            </p>
            <div className="flex items-center space-x-2">
              <Link href="/register">
                <Button>Connect with your fans</Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline">Explore Creators</Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="space-y-6  max-w-screen-xl mx-auto bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 px-16 rounded-lg">
          <div className="mx-auto flex flex-col items-center space-y-4 text-center">
            <h2 className="font-bold text-3xl sm:text-3xl md:text-4xl">
              Join a community built by independent creators.
            </h2>
            <p className="max-w-[85%] leading-normal opacity-80  sm:leading-7">
              A flourishing hub for creators, writers, artists, gamers, and
              visionaries, finding creative fulfillment and financial
              independence doing what they love.
            </p>
            <div className="flex items-center text-center max-w-[64rem]">
              <CreatorBar
                keys={tags || []}
                active={active}
                setActive={setActive}
              />
            </div>
          </div>
          <div className="mx-auto space-y-2 max-w-screen-md">
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
export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { data, isLoading } = useFeedQuery();

  if (typeof data === "undefined") return null;

  if (isLoading) return null;

  return props.data ? (
    props.hasCommunity ? (
      <div className="flex flex-col ">
        <header className="sticky top-0 z-40 bg-white border-b">
          <div className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4">
            <Navbar links={[]} />
            <div className="flex items-center gap-2">
              <AuthedNav />
            </div>
          </div>
        </header>
        <div className="flex relative w-full mx-auto">
          <aside className="ml-16 hidden md:block sticky pt-8 top-16 col-span-3 pr-2 h-[calc(100vh-65px)] border-r justify-center w-[350px]">
            <Sidebar />
          </aside>
          <main className="h-full grid max-w-screen-lg mx-auto items-start gap-8 px-8 w-full pt-8">
            <h1 className="text-4xl font-bold text-slate-800">Your Feed</h1>
            <DashboardItem>
              {data.map((item) => (
                <div className="flex ">
                  {/* Image */}
                  <div />
                  <div className="space-y-2">
                    <h1 className="text-xl font-bold text-slate-800">
                      {item.title}
                    </h1>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </DashboardItem>
          </main>
        </div>
      </div>
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
