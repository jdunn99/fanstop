import { mainNav } from "@/config/config";
import { usePopularTags } from "@/lib/queries/usePopularTags";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { CreatorBar } from "./creator-bar";
import { FeaturedCreator } from "./featured-creators";
import { Navbar, AuthedNav } from "./nav";
import Button from "./ui/button";

export function HomePage() {
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
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </React.Fragment>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-screen-xl mx-auto prose space-y-8 mt-32">
        <section className="mx-auto space-y-2">
          <div>
            <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-rose-500">FanStop.</span> Where Creativity
              Meets Community.
            </h1>
            <p className="opacity-80 sm:text-xl sm:leading-8 max-w-[48rem]">
              Discover a dynamic writing platform for creators to publish
              directly to their audience and earn through subscriptions.
            </p>
            <div className="flex items-center space-x-2 my-16">
              <Link href="/register">
                <Button>Connect with your fans</Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline">Explore Creators</Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="">
          <div className="mx-auto flex flex-col items-center space-y-4 text-center">
            <h2 className="font-bold text-3xl sm:text-3xl md:text-4xl">
              Join a community built by independent creators.
            </h2>
            <p className="max-w-[85%] leading-normal opacity-80  sm:leading-7">
              A flourishing hub for creators, writers, artists, gamers, and
              visionaries, finding creative fulfillment and financial
              independence doing what they love.
            </p>
          </div>
          <div className="mx-auto pt-8 text-center md:max-w-[58rem]">
            <Link href="/explore">
              <Button>See who is on FanStop</Button>
            </Link>
          </div>
        </section>
        <section className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"></div>
        </section>
      </main>
    </div>
  );
}
