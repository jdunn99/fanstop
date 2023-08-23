import { CreateCommunityArgs } from "@/pages/api/communities";
import { useMutation } from "react-query";

export function useCreateCommunityMutation() {
    return useMutation("community", {
        mutationFn: async ({ name, slug, tags }: CreateCommunityArgs) => {
            await fetch("/api/communities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, slug, tags }),
            });
        },
    });
}
