import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

async function getCommunitiesByTag(tagName: string, limit: number) {
    return await db.community.findMany({
        where: {
            tags: {
                some: {
                    name: { equals: tagName },
                },
            },
        },
    });
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

    res.status(200).json(query);
}
