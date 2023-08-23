import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from "next";
import { getServerSession } from "next-auth";
import { db } from "./db";

interface AuthArgs {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}
export async function isAuthed({ req, res }: AuthArgs) {
    const session = await getServerSession(req, res, authOptions);

    let hasCommunity = false;

    if (session) {
        const user = await db.user.findFirst({
            where: { id: { equals: session.user.id } },
            include: { community: true },
        });
        hasCommunity = !!user?.community;
    }

    return { data: session, hasCommunity };
}
