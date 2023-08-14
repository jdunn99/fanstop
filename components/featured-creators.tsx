import { CommunityByTag } from "@/pages/api/communities";
import { MdMap } from "react-icons/md";
import { useQuery } from "react-query";

interface FeaturedCreatorProps {
    queryKey: string;
}

type FeaturedCreator = {
    id: string;
    name: string;
    description: string;
};

export function FeaturedCreatorItem() {}

export function FeaturedCreator({ queryKey }: FeaturedCreatorProps) {
    const { data, isLoading } = useQuery<CommunityByTag[]>(
        ["Featured-Creators", queryKey],
        () =>
            fetch(`/api/tags/${queryKey}/communities`).then((res) => res.json())
    );

    if (isLoading) return null;

    if (typeof data === "undefined") return null;

    if (data.length === 0) return <p>No items yet.</p>;

    return data.map(({ creator, id, name, description }) => (
        <div
            key={id}
            className="relative overflow-hidden rounded-lg border bg-white p-2"
        >
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <MdMap className="text-4xl" />
                        <div>
                            <h3 className="font-bold text-lg">{name}</h3>
                            <span className="text-rose-500 font-semibold text-sm">
                                {creator.name}
                            </span>
                        </div>
                    </div>
                    <p className="text-sm opacity-80">{description}</p>
                </div>
            </div>
        </div>
    ));
}
