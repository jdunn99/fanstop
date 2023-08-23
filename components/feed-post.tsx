import { PostItem } from "@/pages/api/user/feed";
import { Avatar } from "./ui/avatar";
import Link from "next/link";

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
