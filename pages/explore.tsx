import { CommunityCard } from "@/components/community-card";
import { FeaturedCreator } from "@/components/featured-creators";
import { Layout } from "@/components/layout";
import { useCommunitiesQuery } from "@/lib/queries/useCommunities";

export default function ExplorePage() {
  const { data: communities, isLoading } = useCommunitiesQuery();
  // const { data: tags } = null;

  return (
    <Layout heading="Explore">
      {isLoading || !communities ? (
        <p>...</p>
      ) : (
        <div>
          {communities.map((community) => (
            <CommunityCard {...community} key={community.id} />
          ))}
        </div>
      )}
    </Layout>
  );
}
