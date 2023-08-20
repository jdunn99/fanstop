import { BaseTag } from "@/pages/api/tags";
import { useQuery } from "react-query";

export function usePopularTags(limit = 4) {
    return useQuery<BaseTag[]>("tags", () =>
        fetch(`/api/tags/popular?limit=${limit}`).then((result) =>
            result.json()
        )
    );
}
