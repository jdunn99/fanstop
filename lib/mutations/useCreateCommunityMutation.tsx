import { RegisterFormData } from "@/components/register-email-input";
import { useMutation } from "react-query";

export function useCreateCommunityMutation() {
    return useMutation({
        mutationFn: async ({ name }: { name: string }) => {
            await fetch("/api/communities", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ name }),
            });
        },
    });
}
