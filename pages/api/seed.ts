import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

// cll9jls8s0000u41d6jg697c6

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const a = await db.tags.create({
            data: {
                name: "Technology",
                description: "Posts related to technology",
                communities: {
                    create: {
                        name: "Technology Community",
                        totalViews: 0,
                        creator: {
                            connect: { id: "cll9p60kv000au41dunc6eidt" }, // Replace with actual user ID
                        },
                    },
                },
            },
        });

        const b = await db.tags.create({
            data: {
                name: "Music",
                description: "Posts related to music",
                communities: {
                    create: {
                        name: "Music Community",
                        totalViews: 0,
                        creator: {
                            connect: { id: "cll9p60kv000au41dunc6eidt" }, // Replace with actual user ID
                        },
                    },
                },
            },
        });

        const c = await db.tags.create({
            data: {
                name: "Travel",
                description: "Posts related to travel",
                communities: {
                    create: {
                        name: "Travel Community",
                        totalViews: 0,
                        creator: {
                            connect: { id: "cll9p60kv000au41dunc6eidt" }, // Replace with actual user ID
                        },
                    },
                },
            },
        });

        const d = await db.tags.create({
            data: {
                name: "Food",
                description: "Posts related to food",
                communities: {
                    create: {
                        name: "Food Community",
                        totalViews: 0,
                        creator: {
                            connect: { id: "cll9p60kv000au41dunc6eidt" }, // Replace with actual user ID
                        },
                    },
                },
            },
        });

        return res.status(200).json({ status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error });
    }
}
