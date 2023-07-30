import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

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

async function getCommunitiesByTag(tagName: string, limit: number) {
    return (await db.community.findMany({
        where: {
            tags: {
                some: {
                    name: { equals: tagName },
                },
            },
        },
        select: {
            id: true,
            createdAt: true,
            creator: {
                select: {
                    id: true,
                    name: true,
                },
            },

            name: true,
            description: true,
        },
    })) as CommunityByTag[];
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const result = await db.community.findMany();

    const { query } = req;
    if (query) {
        if (query['tagName']) {
            res.status(200).json(
                await getCommunitiesByTag(query['tagName'] as string, 4)
            );
        }
    }
}
