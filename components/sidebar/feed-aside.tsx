import { useRecommendedCommunitiesQuery } from "@/lib/queries/community-queries";
import { AsideContainer, AsideSection } from "../asides/aside-container";
import { AsideHeader } from "../asides/aside-header";
import { CommunityLink } from "../community-link";
import { usePopularPostsQuery } from "@/lib/queries/post-queries";
import { PostAsideItem } from "../asides/profile-aside";

function SuggestedCommunities() {
  const { data } = useRecommendedCommunitiesQuery();

  return (
    <AsideSection>
      <AsideHeader>Suggested Communities</AsideHeader>
      {typeof data !== "undefined" ? (
        data.map(({ image, name, slug }) => (
          <CommunityLink
            key={slug}
            href={`/${slug}`}
            image={<img src={image} className="w-10 h-10 rounded-lg" />}
            value={name}
          />
        ))
      ) : (
        <div />
      )}
    </AsideSection>
  );
}

function PopularPosts() {
  const { data } = usePopularPostsQuery();

  return (
    <AsideSection>
      <AsideHeader>Popular Posts</AsideHeader>
      {typeof data !== "undefined"
        ? data.map(({ post }) => <PostAsideItem key={post.id} {...post} />)
        : null}
    </AsideSection>
  );
}

export function FeedAside() {
  return (
    <AsideContainer>
      <SuggestedCommunities />
      <PopularPosts />
    </AsideContainer>
  );
}
