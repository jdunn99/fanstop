import { db } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { z } from "zod";

const methods = ["GET", "PUT", "DELETE"];

const QuerySchema = z.object({
    communityId: z.string().cuid(),
});

const BodySchema = z.object({
    name: z.string(),
});

type CommunityArgs = { communityId: string; name?: string; userId: string };

async function getCommunityByID(communityId: string) {
    return await db.community.findFirst({
        where: {
            id: {
                equals: communityId,
            },
        },
    });
}

async function updateCommunity({ communityId, name, userId }: CommunityArgs) {
    const result = await db.community.update({
        where: {
            id: communityId,
            creatorId: {
                equals: userId,
            },
        },
        data: {
            name,
        },
    });

    if (result === null) throw new Error();

    return result;
}

async function deleteCommunity({ communityId, userId }: CommunityArgs) {
    const community = await db.community.findFirst({
        where: { id: { equals: communityId }, creatorId: { equals: userId } },
    });

    if (community === null) throw new Error();

    await db.community.delete({ where: { id: communityId } });

    return { success: true };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { method, body, query } = req;
        const { communityId } = QuerySchema.parse(query);

        if (!methods.includes(method!)) {
            return res.status(400).send({ message: "Invalid Method" });
        }

        if (method === "GET") {
            return res.status(200).json(await getCommunityByID(communityId));
        } else {
            const session = await getSession({ req });
            if (session === null)
                res.status(403).send({ message: "Not authorized" });

            const userId = session!.user.id;

            if (method === "PUT") {
                const { name } = BodySchema.parse(body);
                return res
                    .status(200)
                    .json(await updateCommunity({ communityId, userId, name }));
            } else {
                return res
                    .status(200)
                    .json(await deleteCommunity({ communityId, userId }));
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}
