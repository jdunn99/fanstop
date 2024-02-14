import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { ProfileNav } from "./nav";
import Button from "./ui/button";
import { usePopularCommunities } from "@/lib/queries/useCommunities";
import Image from "next/image";
import { ProfileImage } from "./ui/profile-image";
import { ProfileFooter } from "./footer";

export function HomePage() {
  const { data } = useSession();
  const { data: communities } = usePopularCommunities();

  return (
    <div className="flex min-h-screen flex-col" id="root">
      <ProfileNav>
        <Link
          href="/explore"
          className="items-center pl-4 text-lg font-medium hidden lg:flex transition-colors opacity-80 hover:opacity-100 hover:text-rose-500 sm:text-sm"
        >
          Explore
        </Link>
        <div className=" items-center pl-4 text-lg font-medium hidden lg:flex transition-colors opacity-60 sm:text-sm">
          Features
        </div>
      </ProfileNav>
      <main className="flex-1 max-w-[84rem] mx-auto space-y-32 px-4 md:px-8 pb-16">
        <section className="space-y-16 py-32">
          <div className="relative space-y-16">
            <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl">
              <span className="text-rose-500">FanStop.</span> Where Creativity
              Meets Community.
            </h1>
            <p className="opacity-80 sm:text-xl sm:leading-8 max-w-[48rem]">
              Discover a dynamic writing platform for creators to publish
              directly to their audience and earn through subscriptions.
            </p>
            <div className="flex items-center space-x-2 my-16">
              <Link href="/register">
                <Button className="!font-bold">Connect with your fans</Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" className="!font-bold">
                  Explore Creators
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-8 w-full">
          <div className="mx-auto flex flex-col items-center space-y-8 text-center">
            <h2 className="font-bold text-3xl sm:text-3xl md:text-4xl">
              Join a community built by independent creators.
            </h2>
            <p className="opacity-80 sm:leading-8 max-w-[48rem]">
              A flourishing hub for creators, writers, artists, gamers, and
              visionaries, finding creative fulfillment and financial
              independence doing what they love.
            </p>
          </div>

          {typeof communities !== "undefined" ? (
            <div className="space-y-16 mx-auto max-w-screen-lg p-16 ">
              <p className="uppercase text-center font-bold text-rose-400 text-sm">
                Featured Communities
              </p>
              {communities.map(({ community }) => (
                <Link
                  key={community.id}
                  className="flex sm:flex-row flex-col w-full sm:items-start text-center items-center justify-center sm:text-left sm:justify-normal hover:underline"
                  href={community.slug}
                >
                  <div className="flex flex-col sm:flex-row gap-2 flex-1 items-center sm:items-start">
                    <div className="lg:mr-4">
                      <ProfileImage src={community.image!} />
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-slate-600">
                        {community.name}
                      </h2>
                      <p className="text-rose-500 font-semibold text-sm">
                        @{community.slug}
                      </p>
                    </div>
                  </div>
                  <div className="flex-[1.5] space-y-1 sm:pl-8">
                    <p className="text-slate-800">{community.description}</p>
                    <div className="flex items-center gap-2 font-semibold text-slate-600 text-sm sm:flex-row flex-col ">
                      <p>{community._count.subscribers} subscribers</p>
                      <p>{community._count.posts} posts</p>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="mx-auto pt-8 text-center md:max-w-[58rem]">
                <Link href="/explore">
                  <Button>See who is on FanStop</Button>
                </Link>
              </div>
            </div>
          ) : null}
        </section>
        <section className="space-y-32 w-full">
          <h2 className="font-bold text-3xl sm:text-3xl md:text-4xl text-center text-slate-800">
            Empowering creators, igniting passions
          </h2>
          <div className="flex items-center flex-col gap-16 sm:flex-row justify-center sm:justify-normal w-full">
            <div className="flex-1  rounded-lg  ">
              <Image
                src={
                  "https://res.cloudinary.com/dw7064r1g/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1707326624/create-form_cewaxw.jpg?_s=public-apps"
                }
                alt="img"
                width={1178}
                height={720}
              />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-rose-500 font-medium">Create Your Community</p>
              <h2 className="font-bold text-2xl sm:text-2xl md:text-3xl text-slate-800 max-w-[400px] !mb-8">
                Build your community to your liking
              </h2>
              <p className="text-slate-500 max-w-[600px] leading-loose !mb-8">
                Build your own community platform and showcase your content to
                the world. Connect with like-minded individuals and foster
                meaningful interactions in a space that reflects your unique
                style and interests.
              </p>
            </div>
          </div>
          <div className="flex items-center flex-col gap-16 sm:flex-row justify-center sm:justify-normal w-full">
            <div className="flex-1  rounded-lg  ">
              <Image
                src={
                  "https://res.cloudinary.com/dw7064r1g/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1707326624/create-form_cewaxw.jpg?_s=public-apps"
                }
                alt="img"
                width={1178}
                height={720}
              />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-rose-500 font-medium">Write Your Content</p>
              <h2 className="font-bold text-2xl sm:text-2xl md:text-3xl text-slate-800 max-w-[400px] !mb-8">
                Use FanStop's custom built editor to create your posts
              </h2>
              <p className="text-slate-500 max-w-[600px] leading-loose !mb-8">
                Craft your posts effortlessly with FanStop's tailor-made editor.
                Enjoy the ease and flexibility of our custom-built tools to
                bring your content to life. Whether you're sharing stories or
                photos, our editor makes it a breeze to create and share your
                passion with your community.
              </p>
            </div>
          </div>

          <div className="flex items-center flex-col sm:flex-row justify-center sm:justify-normal w-full gap-16">
            <div className="flex-1  rounded-lg  ">
              <Image
                src={
                  "https://res.cloudinary.com/dw7064r1g/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1707326624/create-form_cewaxw.jpg?_s=public-apps"
                }
                alt="img"
                width={1178}
                height={720}
              />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-rose-500 font-medium">Publish and Share</p>
              <h2 className="font-bold text-2xl sm:text-2xl md:text-3xl text-slate-800 max-w-[400px] !mb-8">
                Publish your posts and share them to your subscribers
              </h2>
              <p className="text-slate-500 max-w-[600px] leading-loose !mb-8">
                Hit the publish button and instantly share your latest creations
                with your subscribers on FanStop. Keep your community engaged
                and excited by delivering fresh content directly to their feeds.
                With just a click, your posts are out there, ready to inspire
                and connect with your audience.
              </p>
            </div>
          </div>
        </section>
      </main>
      <ProfileFooter />
    </div>
  );
}
