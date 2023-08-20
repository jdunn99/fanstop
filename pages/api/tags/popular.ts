import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const QuerySchema = z.object({
    limit: z.coerce.number().int().nonnegative().optional(),
});

async function getTagsForCommunities({
    limit = 4,
}: z.infer<typeof QuerySchema>) {
    return await db.tags.findMany({
        orderBy: { communities: { _count: "desc" } },
        take: limit,
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { method, query } = req;
        if (method !== "GET") {
            return res.status(400).send({ message: "Invalid Method" });
        }

        const { limit } = QuerySchema.parse(query);

        return res.status(200).json(await getTagsForCommunities({ limit }));
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}
