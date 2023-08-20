import {
    Container,
    DashboardItem,
    DashboardItemHeading,
    Header,
    Layout,
} from "@/components/dashboard";
import { Sidebar } from "@/components/sidebar";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeading } from "@/components/ui/card";
import Link from "next/link";
import Input from "@/components/ui/input";
import {
    BsArrowRight,
    BsEye,
    BsEyeFill,
    BsThreeDotsVertical,
} from "react-icons/bs";
import { MdAdd, MdPlusOne, MdPostAdd } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";

interface OverviewCardProps {
    href: string;
    heading: string;
    value: string | number;
}
function OverviewCard({ href, value, heading }: OverviewCardProps) {
    return (
        <Link href={href}>
            <Card className="cursor-pointer hover:bg-rose-100 hover:text-rose-600 hover:border-rose-400 transition-colors">
                <CardHeading>
                    <div className="text-sm font-semibold opacity-80 flex items-center justify-between">
                        <p>{heading}</p>
                        <BsArrowRight />
                    </div>
                </CardHeading>
                <CardContent>
                    <h1 className="text-4xl font-bold">{value}</h1>
                </CardContent>
            </Card>
        </Link>
    );
}

interface RecentPostItemProps {
    title: string;
    createdAt: Date;
    id: string;
}
function RecentPostItem({ title, createdAt }: RecentPostItemProps) {
    return (
        <div className="flex items-center justify-between w-full cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors">
            <div>
                <h1 className="text-lg font-semibold">{title}</h1>
                <p className="opacity-80 text-sm">{createdAt.toString()}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary">
                    <BsThreeDotsVertical />
                </Button>
            </div>
        </div>
    );
}

export function useCommunitiesQuery() {
    return useQuery("user/communities", () =>
        fetch("/api/user/communities").then((result) => result.json())
    );
}

export default function Profile() {
    return <Layout heading="Home"></Layout>;
}
