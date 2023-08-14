import { RegisterFormData } from "@/components/register-email-input";
import { signIn } from "next-auth/react";
import { useMutation } from "react-query";

export function useRegisterMutation() {
    return useMutation({
        mutationFn: async ({ email, name, password }: RegisterFormData) => {
            await fetch("/api/register", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ email, name, password }),
            });
            await signIn("credentials", { email, password, callbackUrl: "/" });
        },
    });
}
