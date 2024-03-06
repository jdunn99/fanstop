import { usePostsForCommunity } from "@/lib/queries/post-queries";
import { PostBottom } from "../posts/post-bottom";

export function ProfileAside() {
  const { data: posts } = usePostsForCommunity("jdunn");

  if (!posts) {
    return null;
  }

  return (
    <aside className="w-96 flex-shrink-0 xl:block hidden px-6 pt-12">
      <nav className="fixed h-full space-y-6 w-80 ">
        <ul className="space-y-4 w-full border-b pb-8">
          <li className="font-semibold  text-slate-800 text-xs uppercase">
            Popular Posts
          </li>
          {typeof posts !== "undefined"
            ? posts.pages.map(({ response }) =>
                response.map(({ post }) => (
                  // <FeedPost key={post.id} post={post} />
                  <li className="flex items-start gap-4 w-full" key={post.id}>
                    <div className="space-y-1 w-full">
                      <h1 className=" font-semibold text-slate-800">
                        {post.title}
                      </h1>
                      <p className="text-xs text-slate-600 font-medium">
                        {new Date(post.createdAt).toDateString()}
                      </p>
                      <PostBottom {...post} />
                    </div>
                    <img
                      className="w-20 h-16 object-cover rounded-lg "
                      src={post.image!}
                    />
                  </li>
                ))
              )
            : null}
        </ul>
        <ul className="space-y-4 w-full border-b pb-8">
          <li className="font-semibold  text-slate-800 text-xs uppercase">
            Recommended Communities
          </li>
          {typeof posts !== "undefined"
            ? posts.pages.map(({ response }) =>
                response.map(({ post }) => (
                  // <FeedPost key={post.id} post={post} />
                  <li className="flex items-start gap-4 w-full" key={post.id}>
                    <div className="space-y-1 w-full">
                      <h1 className=" font-semibold text-slate-800">
                        {post.title}
                      </h1>
                      <p className="text-xs text-slate-600 font-medium">
                        {new Date(post.createdAt).toDateString()}
                      </p>
                      <PostBottom {...post} />
                    </div>
                    <img
                      className="w-20 h-16 object-cover rounded-lg "
                      src={post.image!}
                    />
                  </li>
                ))
              )
            : null}
        </ul>
      </nav>
    </aside>
  );
}
