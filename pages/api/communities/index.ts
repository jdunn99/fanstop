import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]";

const methods = ["GET", "POST"];

const CommunitySchema = z.object({
    id: z.string().cuid(),
    name: z.string(),
    creatorId: z.string().cuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type Community = z.infer<typeof CommunitySchema>;

const CreateCommunitySchema = z.object({
    name: z.string(),
    slug: z.string(),
    tags: z.array(z.string().cuid()),
});
export type CreateCommunityArgs = z.infer<typeof CreateCommunitySchema>;
export type CreateCommunityInput = CreateCommunityArgs & {
    creatorId: string;
};

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
async function createCommunity({
    name,
    slug,
    tags,
    creatorId,
}: CreateCommunityInput) {
    return await db.community.create({
        data: {
            name,
            slug,
            tags: {
                connect: tags.map((tag) => ({ id: tag })),
            },
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
        const { method, body } = req;
        if (!methods.includes(method!)) {
            return res.status(400).send({ message: "Invalid Method" });
        }

        if (method === "POST") {
            const session = await getServerSession(req, res, authOptions);

            if (session === null)
                return res.status(403).send({ message: "Not authorized" });

            const { name, slug, tags } = CreateCommunitySchema.parse(body);
            return res.status(200).json(
                await createCommunity({
                    name,
                    slug,
                    tags,
                    creatorId: session.user.id,
                })
            );
        } else {
            return res.status(200).json(await getAllCommunities());
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}
