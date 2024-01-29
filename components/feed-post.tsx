import { PostItem } from "@/pages/api/user/feed";
import { Avatar } from "./ui/avatar";
import Link from "next/link";

export function FeaturedPost({
  author,
  title,
  createdAt,
  views,
  image,
}: PostItem) {
  return (
    <div className="gap-8 flex flex-col items-center">
      <div>
        <div className="grid grid-cols-1">
          <div className="bg-slate-50 cursor-pointer rounded-lg w-full">
            <div className="flex h-full">
              <div className="flex-grow flex-shrink basis-1/2 p-8 flex flex-col justify-center h-full gap-2">
                <h1 className="text-2xl font-bold text-rose-500">{title}</h1>
                <p className="text-slate-800 tex-sm font-medium">
                  {new Date(createdAt).toDateString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-xs text-slate-500 font-medium">
                    {views} views
                  </p>
                  <p className="text-xs text-slate-500 font-medium">0 likes</p>
                </div>
                <p className="text-slate-500 font-medium text-xs">
                  {author.name}
                </p>
              </div>
              {image ? (
                <div className="aspect-video overflow-hidden flex-grow flex-shrink basis-1/2">
                  <img
                    src={image}
                    alt="Image"
                    className="h-full object-cover w-full rounded-r-lg"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeedPost({ id, author, title, createdAt, views }: PostItem) {
  return (
    <div className="pb-8 transition-all border-b ">
      <div className="flex items-center justify-between mb-2 text-sm font-bold">
        <p className="text-rose-600 ">{author.community.name}</p>
        <p className="text-slate-500">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2 ">
        <div className="flex flex-col gap-2 flex-1">
          <Link
            className="text-lg font-semibold"
            href={`/${author.community.slug}/${id}`}
          >
            {title}
          </Link>
          {/* <p className="text-slate-500 text-sm ">
                        anchovies, capers, parsley; it's me
                    </p> */}
          <div className="flex items-center font-medium text-rose-600 gap-2 mt-2">
            <Avatar />
            <div className="">
              <p>{author.name}</p>
              <p className="text-slate-400 font-normal text-xs">
                @{author.community.slug}
              </p>
            </div>
          </div>
        </div>
        <div>Image</div>
      </div>
    </div>
  );
}
