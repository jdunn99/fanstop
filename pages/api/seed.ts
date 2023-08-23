import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

// cll9jls8s0000u41d6jg697c6

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await db.tags.createMany({
            data: [
                { name: "Technologoy" },
                { name: "Business" },
                { name: "Home & Garden" },
                { name: "Music" },
            ],
        });

        // const community = await db.community.create({
        //     data: {
        //         name: "Jack's Community",
        //         slug: "jdunn99",
        //         creator: {
        //             connect: {
        //                 id: "clll8qs050000u426v0c0wtcd",
        //             },
        //         },
        //     },
        // });

        // const post = await db.post.create({
        //     data: {
        //         title: "Test Post",
        //         author: {
        //             connect: {
        //                 id: "clll8qs050000u426v0c0wtcd",
        //             },
        //         },
        //         community: {
        //             connect: {
        //                 id: community.id,
        //             },
        //         },
        //     },
        // });

        // const subscription = await db.subscriber.create({
        //     data: {
        //         communityId: community.id,
        //         userId: "cllmekjgn0000u4fk15zv86on",
        //     },
        // });

        return res.status(200).json({ status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error });
    }
}
