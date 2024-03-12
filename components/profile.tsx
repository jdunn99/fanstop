import React from "react";
import { CommunityResponse } from "@/lib/api/validators";
import { useCommunitySocialsQuery } from "@/lib/queries/useCommunitySocialsQuery";
import { usePostsForCommunity } from "@/lib/queries/post-queries";
import { Container } from "./layout/container";
import { ProfileHeader } from "./profile/profile-header";
import { Sidebar } from "./sidebar/sidebar";
import { ProfileAside } from "./asides/profile-aside";
import { ProfileFilters, ProfileSelectFilter } from "./profile/profile-filters";
import { ProfilePosts } from "./profile/profile-posts";
import { Empty } from "./empty";
import { CreatePostButton } from "./create-post-button";

interface ProfileComponentProps {
  slug: string;
  data?: CommunityResponse;
}

export function ProfileComponent({ data, slug }: ProfileComponentProps) {
  const { data: posts } = usePostsForCommunity(slug);
  const { data: socials } = useCommunitySocialsQuery(slug);

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [group, setGroup] = React.useState<string>("All");

  if (!data || !posts) return null;

  return (
    <Container>
      <Sidebar />
      <div className="relative mx-auto overflow-auto flex w-full">
        <div className="relative min-h-screen pt-12 w-full max-w-screen-lg mx-auto px-4 break-words">
          <div className="pb-24">
            <ProfileHeader {...data} socials={socials} />

            <ProfileFilters setSearchQuery={setSearchQuery} query={searchQuery}>
              <ProfileSelectFilter
                setGroup={setGroup}
                slug={slug}
                group={group}
              />
            </ProfileFilters>
            {data.community._count.posts === 0 ? (
              <div className="flex flex-col items-center gap-4 min-h-[250px] justify-center">
                <p className="text-slate-800 font-medium text-lg ">
                  {data.isOwn ? "You have " : `${data.community.name} has `} not
                  made any posts yet.
                </p>
                {data.isOwn ? (
                  <p className="text-slate-600 max-w-md leading-loose text-center text-sm">
                    You can create your first post by clicking the button below.
                  </p>
                ) : null}

                {data.isOwn ? <CreatePostButton /> : null}
              </div>
            ) : (
              <div className="grid items-end grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {typeof posts !== "undefined"
                  ? posts.pages.map(({ response }) =>
                      response.map(({ post }) => {
                        if (
                          !post.title
                            .toLocaleLowerCase()
                            .includes(searchQuery.toLocaleLowerCase())
                        ) {
                          return null;
                        }

                        if (group !== "All") {
                          if (!post.group || post.group.name !== group) {
                            return null;
                          }
                        }

                        return (
                          <ProfilePosts
                            post={post}
                            setGroup={setGroup}
                            key={post.id}
                          />
                        );
                      })
                    )
                  : null}
              </div>
            )}
          </div>
        </div>
        <ProfileAside />
      </div>
    </Container>
  );
}
