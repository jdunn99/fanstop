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
            {typeof posts === "undefined" ? null : (
              <div className="grid items-end grid-cols-2 lg:grid-cols-3 gap-8">
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
