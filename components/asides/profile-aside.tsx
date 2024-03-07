import { usePostsForCommunity } from "@/lib/queries/post-queries";
import { PostBottom } from "../posts/post-bottom";
import { AsideContainer, AsideSection } from "../asides/aside-container";
import { AsideHeader } from "../asides/aside-header";
import { PostItem } from "@/lib/api/validators";
import Link from "next/link";

export function PostAsideItem(post: PostItem) {
  return (
    <li className="flex items-start gap-4 w-full" key={post.id}>
      <div className="space-y-1 w-full">
        <Link
          href={`/${post.author.community.slug}/${post.id}`}
          className="flex flex-col mb-2"
        >
          <h1 className=" font-semibold text-slate-800">{post.title}</h1>
          <p className="text-xs text-slate-600 font-medium">
            {new Date(post.createdAt).toDateString()}
          </p>
        </Link>
        <PostBottom {...post} />
      </div>
      {post.image !== null ? (
        <img className="w-20 h-16 object-cover rounded-lg " src={post.image} />
      ) : null}
    </li>
  );
}

export function ProfileAside() {
  const { data: posts } = usePostsForCommunity("jdunn");

  return (
    <AsideContainer>
      <AsideSection>
        <AsideHeader>Popular Posts</AsideHeader>
        {typeof posts !== "undefined"
          ? posts.pages.map(({ response }) =>
              response.map(({ post }) => <PostAsideItem {...post} />)
            )
          : null}
      </AsideSection>
    </AsideContainer>
  );
}
