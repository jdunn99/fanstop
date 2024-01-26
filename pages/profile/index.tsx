import { FeaturedPost, FeedPost } from "@/components/feed-post";
import {
  Layout,
  DashboardItem,
  DashboardItemHeading,
} from "@/components/layout";
import { useQuery } from "react-query";
import { PostItem } from "../api/user/feed";
import { useCommunitiesForProfile } from "@/lib/queries/useCommunities";
import { useSession } from "next-auth/react";
import { Profile, getUserProfile } from "../api/user/profile";

export default function Test() {
  const { data, isLoading } = useQuery<Profile>(["profile"], () =>
    fetch("/api/user/profile").then((res) => res.json())
  );

  if (!data) {
    return null;
  }

  return (
    <Layout heading={data.community.name}>
      <DashboardItem>
        <DashboardItemHeading heading="Featured Post" />
        {data.posts && <FeaturedPost {...data.posts[0]} />}
      </DashboardItem>
      <DashboardItem>
        <div className="max-w-screen-md w-full mx-auto">
          <div className="py-2">
            <DashboardItemHeading heading="Recent Posts" />
          </div>

          {data.posts &&
            data.posts.map((item) => (
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
        </div>
      </DashboardItem>
    </Layout>
  );
}
