import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Input from "./ui/input";
import Button from "./ui/button";
import { useRegisterMutation } from "@/lib/mutations/useRegisterMutation";

export default null;

const schema = z.object({
    email: z.string().email(),
    name: z.string().nonempty(),
    password: z.string().min(6).describe("Password"),
});
export type RegisterFormData = z.infer<typeof schema>;

export function RegisterEmailInput() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({ resolver: zodResolver(schema) });
    const { mutate } = useRegisterMutation();

    function onSubmit(data: RegisterFormData) {
        mutate(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-1 text-left">
                <label className="text-left text-sm font-bold">Name</label>
                <Input
                    {...register("name")}
                    placeholder="Name"
                    className={errors.name ? "border-red-500" : ""}
                />
                <p className="text-sm text-red-500">{errors.name?.message}</p>
            </div>

            <div className="grid gap-1 text-left">
                <label className="text-left text-sm font-bold">Email</label>
                <Input
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                    className={errors.email ? "border-red-500" : ""}
                />
                <p className="text-sm text-red-500">{errors.email?.message}</p>
            </div>
            <div className="grid gap-1 text-left">
                <label className="text-left text-sm font-bold">Password</label>
                <Input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                    className={errors.name ? "border-red-500" : ""}
                />
                <p className="text-sm text-red-500">
                    {errors.password?.message}
                </p>
            </div>

            <Button onClick={handleSubmit(onSubmit)}>Create account</Button>
        </form>
    );
}
