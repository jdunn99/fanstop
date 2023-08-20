import {
    Layout,
    DashboardItem,
    DashboardSearch,
    EmptyCard,
} from "@/components/dashboard";
import { Card, CardHeading, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { BsArrowRight, BsEyeFill, BsPlus } from "react-icons/bs";
import { useQuery } from "react-query";

function usePostsQuery() {
    return useQuery<any[]>("user/post", () =>
        fetch("/api/user/posts").then((result) => result.json())
    );
}

export default function Posts() {
    const { data } = usePostsQuery();

    if (!data) return null;

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {}
    function onClick() {}

    return (
        <Layout heading="Posts">
            <DashboardItem>
                <DashboardSearch
                    value="Post"
                    onChange={onChange}
                    onClick={onClick}
                />
                {data.length === 0 ? (
                    <EmptyCard heading="Posts">
                        <Link
                            href="#"
                            className="text-rose-500 hover:text-rose-800 inline-flex items-center gap-4 font-semibold transition-all"
                        >
                            New Post <BsArrowRight />
                        </Link>
                    </EmptyCard>
                ) : (
                    <div className="grid grid-cols-3">
                        {data.map(({ id, name, totalViews }) => (
                            <Link href={"#"} key={id}>
                                <Card className="cursor-pointer hover:bg-rose-100 hover:text-rose-600 hover:border-rose-400 transition-colors">
                                    <CardHeading>
                                        <div className=" font-bold flex items-center justify-between">
                                            <p>{name}</p>
                                            <BsArrowRight />
                                        </div>
                                    </CardHeading>
                                    <CardContent className="pl-4 pb-4">
                                        <div className="pt-4 flex items-center gap-4 text-sm font-semibold text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <BsEyeFill className="text-rose-500 text-lg" />
                                                <span>{totalViews}</span>
                                            </div>
                                            {/* <div className="flex items-center gap-2">
                                                            <MdPostAdd className="text-lg text-rose-500" />
                                                            <span>0</span>
                                                        </div> */}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </DashboardItem>
        </Layout>
    );
}
