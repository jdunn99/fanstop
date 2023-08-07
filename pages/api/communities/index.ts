import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const methods = ["GET", "POST"];

const CommunityByTagSchema = z.object({
    id: z.string().cuid(),
    creator: z.object({
        id: z.string().cuid(),
        name: z.string(),
    }),
    name: z.string(),
    description: z.string(),
    createdAt: z.date(),
});
export type CommunityByTag = z.infer<typeof CommunityByTagSchema>;

const CreateCommunitySchema = z.object({
    name: z.string(),
    creatorId: z.string().cuid(),
});
export type CreateCommunityInput = z.infer<typeof CreateCommunitySchema>;

async function getCommunitiesByTag(tagName: string, limit: number) {
    return await db.community.findMany({
        where: {
            tags: {
                some: {
                    name: {
                        equals: tagName,
                    },
                },
            },
        },
    });
}

/**
 * Fetches a list of all communities from the database.
 * @returns
 */
async function getAllCommunities() {
    return await db.community.findMany();
}

/**
 * Create a community object.
 * @param name - The name of the community being created
 * @param creatorId - The id of the user creating the community
 */
async function createCommunity({ name, creatorId }: CreateCommunityInput) {
    return await db.community.create({
        data: {
            name,
            totalViews: 0,
            creator: {
                connect: {
                    id: creatorId,
                },
            },
        },
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { query, method, body } = req;
        if (!methods.includes(method!)) {
            return res.status(400).send({ message: "Invalid Method" });
        }

        if (method === "POST") {
            const { name, creatorId } = CreateCommunitySchema.parse(body);
            return res
                .status(200)
                .json(await createCommunity({ name, creatorId }));
        } else {
            return res.status(200).json(await getAllCommunities());
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}
