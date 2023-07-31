import {
    Container,
    DashboardItem,
    DashboardItemHeading,
    Header,
} from '@/components/dashboard';
import { Sidebar } from '@/components/sidebar';
import Button from '@/components/ui/button';
import { Card, CardContent, CardHeading } from '@/components/ui/card';
import Link from 'next/link';
import {
    BsArrowRight,
    BsEye,
    BsEyeFill,
    BsThreeDotsVertical,
} from 'react-icons/bs';

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

export default function Dashboard() {
    return (
        <div className="flex min-h-screen flex-col ">
            <header className="sticky top-0 z-40 bg-background border-b">
                <div className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4"></div>
            </header>
            <div className="max-w-screen-xl grid flex-1 gap-12 mx-auto w-full md:grid-cols-[200px_1fr] ">
                <aside className="hidden w-[250px] flex-col md:flex border-r pr-2 pt-8">
                    <Sidebar />
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-hidden pt-8">
                    <Container>
                        <Header heading="Home" />
                        <DashboardItem>
                            <DashboardItemHeading heading="Overview" />
                            <div className="grid gap-8 grid-cols-3">
                                <OverviewCard
                                    value={0}
                                    heading="Subscribers"
                                    href="/"
                                />
                                <OverviewCard
                                    value={0}
                                    heading="Total Views"
                                    href="/"
                                />

                                <OverviewCard
                                    value={0}
                                    heading="Total Posts"
                                    href="/"
                                />
                            </div>
                        </DashboardItem>
                        <DashboardItem>
                            <DashboardItemHeading heading="Recent Posts">
                                <Link
                                    href="/dashboard/posts"
                                    className="flex items-center gap-2 text-sm text-slate-500 font-semibold hover:text-rose-500 transition-colors"
                                >
                                    View all
                                    <span>
                                        <BsArrowRight />
                                    </span>
                                </Link>
                            </DashboardItemHeading>
                            <Card>
                                <CardContent className="!pt-5">
                                    <RecentPostItem
                                        createdAt={new Date()}
                                        title="Test"
                                        id=""
                                    />
                                </CardContent>
                            </Card>
                        </DashboardItem>
                    </Container>
                </main>
            </div>
        </div>
    );
}
